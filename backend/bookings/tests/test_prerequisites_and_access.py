"""
Unit tests for certification prerequisites, quota enforcement, QR verification check-in/out, and no-shows.
"""

from datetime import date, time, timedelta
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status
from facilities.models import EquipmentCategory, Equipment
from trainings.models import TrainingCourse
from certifications.models import Certificate
from bookings.models import Booking, BookingWaitlist
from notifications.models import Notification

User = get_user_model()


class PrerequisiteAndAccessTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create users
        self.student = User.objects.create_user(
            email="student@bracu.ac.bd",
            username="student1",
            password="password123",
            first_name="Student",
            last_name="One",
            role="student",
        )
        self.admin = User.objects.create_user(
            email="admin@bracu.ac.bd",
            username="admin1",
            password="password123",
            first_name="Admin",
            last_name="User",
            role="admin",
            is_superuser=True,
        )

        # Create category and training course
        self.category = EquipmentCategory.objects.create(
            name="Laser Cutters", slug="laser-cutters"
        )
        self.course = TrainingCourse.objects.create(
            title="Basic Laser Safety",
            slug="laser-safety",
            duration_hours=2,
            category="laser",
        )

        # Create equipment requiring training
        self.laser = Equipment.objects.create(
            name="Epilog Laser Cutter",
            slug="epilog-laser",
            category=self.category,
            description="Laser cutter machine",
            requires_training=True,
            required_certification=self.course,
        )

        # Create general equipment not requiring training
        self.soldering = Equipment.objects.create(
            name="Soldering Station",
            slug="soldering-station",
            category=self.category,
            description="Basic soldering iron",
            requires_training=False,
        )

    def test_booking_requires_certification(self):
        """Ensure booking equipment with requires_training=True fails if student has no certificate."""
        self.client.force_authenticate(user=self.student)
        url = reverse("booking_list_create")
        data = {
            "equipment": str(self.laser.id),
            "date": date.today() + timedelta(days=1),
            "start_time": "10:00:00",
            "end_time": "12:00:00",
            "purpose": "Academic project",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("must hold a valid safety certificate", str(response.data))

    def test_booking_with_valid_certification(self):
        """Ensure booking succeeds when student has the required certificate."""
        Certificate.objects.create(
            user=self.student,
            course=self.course,
        )
        self.client.force_authenticate(user=self.student)
        url = reverse("booking_list_create")
        data = {
            "equipment": str(self.laser.id),
            "date": date.today() + timedelta(days=1),
            "start_time": "10:00:00",
            "end_time": "12:00:00",
            "purpose": "Academic project",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_single_booking_duration_quota(self):
        """Ensure a single booking > 4 hours fails."""
        self.client.force_authenticate(user=self.student)
        url = reverse("booking_list_create")
        data = {
            "equipment": str(self.soldering.id),
            "date": date.today() + timedelta(days=2),
            "start_time": "09:00:00",
            "end_time": "14:30:00",  # 5.5 hours
            "purpose": "Long project",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cannot exceed 4 hours", str(response.data))

    def test_daily_booking_quota(self):
        """Ensure cumulative daily booking > 4 hours fails for non-admins."""
        # Create existing 3-hour approved booking
        Booking.objects.create(
            user=self.student,
            equipment=self.soldering,
            date=date.today() + timedelta(days=3),
            start_time=time(10, 0),
            end_time=time(13, 0),
            status=Booking.Status.APPROVED,
        )
        self.client.force_authenticate(user=self.student)
        url = reverse("booking_list_create")
        data = {
            "equipment": str(self.soldering.id),
            "date": date.today() + timedelta(days=3),
            "start_time": "14:00:00",
            "end_time": "16:00:00",  # +2 hours = 5 hours total
            "purpose": "Second slot",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Daily quota exceeded", str(response.data))

    def test_qr_verify_and_check_in_out(self):
        """Ensure admin can verify QR, check in student, and check out student."""
        booking = Booking.objects.create(
            user=self.student,
            equipment=self.soldering,
            date=date.today(),
            start_time=time(10, 0),
            end_time=time(12, 0),
            status=Booking.Status.APPROVED,
        )

        self.client.force_authenticate(user=self.admin)

        # 1. Verify QR
        verify_url = reverse("booking_verify_qr")
        response = self.client.post(
            verify_url,
            {"qr_data": f"FABLAB-BOOKING:{booking.id}|Soldering Station|2026-07-16|10:00-12:00"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["can_check_in"])
        self.assertFalse(response.data["can_check_out"])

        # 2. Check-In
        checkin_url = reverse("booking_check_in", kwargs={"pk": booking.id})
        response = self.client.post(checkin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertIsNotNone(booking.actual_start_time)

        # 3. Check-Out
        checkout_url = reverse("booking_check_out", kwargs={"pk": booking.id})
        response = self.client.post(checkout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertIsNotNone(booking.actual_end_time)
        self.assertEqual(booking.status, Booking.Status.COMPLETED)

    def test_check_no_shows_command_and_waitlist_notification(self):
        """Ensure check_no_shows marks missed approved bookings and notifies waitlist."""
        # Create an approved booking for today at an earlier hour
        now = timezone.localtime()
        early_start = (now - timedelta(hours=1)).time()
        early_end = (now - timedelta(minutes=10)).time()

        booking = Booking.objects.create(
            user=self.student,
            equipment=self.soldering,
            date=now.date(),
            start_time=early_start,
            end_time=early_end,
            status=Booking.Status.APPROVED,
        )

        # Create a waitlist user waiting for the slot
        waitlist_user = User.objects.create_user(
            email="waitlist@bracu.ac.bd",
            username="waitlist1",
            password="password123",
            first_name="Waitlist",
            last_name="User",
        )
        BookingWaitlist.objects.create(
            user=waitlist_user,
            equipment=self.soldering,
            date=now.date(),
            start_time=early_start,
            end_time=early_end,
        )

        # Run management command
        call_command("check_no_shows", grace_minutes=20)

        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.NO_SHOW)

        # Verify waitlist notification
        notifs = Notification.objects.filter(user=waitlist_user)
        self.assertTrue(notifs.exists())
        self.assertIn("Waitlist Slot Available!", notifs.first().title)
