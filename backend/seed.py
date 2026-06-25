import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fablab.settings.development")
django.setup()

from events.models import Event  # noqa: E402
from projects.models import Project  # noqa: E402
from trainings.models import TrainingCourse  # noqa: E402
from resources.models import Resource  # noqa: E402
from django.utils import timezone  # noqa: E402
import datetime  # noqa: E402

# Clean up existing
Event.objects.all().delete()
Project.objects.all().delete()
TrainingCourse.objects.all().delete()
Resource.objects.all().delete()

# Create Events
Event.objects.create(
    title="Introduction to 3D Printing",
    slug="intro-3d-printing",
    description="Learn the basics of FDM 3D printing, slicing software, and machine operation.",
    event_type="workshop",
    date=(timezone.now() + datetime.timedelta(days=5)).date(),
    start_time=(timezone.now() + datetime.timedelta(hours=1)).time(),
    end_time=(timezone.now() + datetime.timedelta(hours=3)).time(),
    venue="FabLab Main Area",
    max_participants=20,
    status="upcoming",
)

Event.objects.create(
    title="Advanced CNC Machining",
    slug="advanced-cnc",
    description="Masterclass on 5-axis CNC machining and toolpath generation.",
    event_type="masterclass",
    date=(timezone.now() + datetime.timedelta(days=12)).date(),
    start_time=(timezone.now() + datetime.timedelta(hours=2)).time(),
    end_time=(timezone.now() + datetime.timedelta(hours=6)).time(),
    venue="Machine Shop",
    max_participants=10,
    status="upcoming",
)

# Create Projects
Project.objects.create(
    title="Autonomous Delivery Drone",
    slug="auto-drone",
    description="A fully autonomous drone capable of navigating complex urban environments.",
    # category might not be a direct string field, we will check Project model. If it fails, I'll fix it. Let's assume standard fields.
)

# Create Courses
TrainingCourse.objects.create(
    title="FabLab Safety Orientation",
    slug="safety-orientation",
    description="Mandatory safety training for all new FabLab users.",
    category="safety",
    duration_hours=2,
    is_required=True,
)

TrainingCourse.objects.create(
    title="Laser Cutting Certification",
    slug="laser-certification",
    description="Learn to safely operate the CO2 laser cutters.",
    category="laser",
    duration_hours=4,
    is_required=False,
)

# Create Resources
Resource.objects.create(
    title="3D Printing Design Guidelines",
    description="Best practices for designing models for FDM and SLA printing.",
    # resource model...
)

print("Database seeded with dummy data!")
