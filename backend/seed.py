import os
import django
import datetime

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fablab.settings.development")
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from facilities.models import EquipmentCategory, Equipment
from projects.models import ProjectCategory, Project
from events.models import Event
from trainings.models import TrainingCourse, Lesson, Quiz
from resources.models import ResourceCategory, Resource

User = get_user_model()

print("Starting BRAC University FabLab database seeding...")

# 1. Ensure Admin and Demo User exist
admin_user, _ = User.objects.get_or_create(
    email="admin@fablab.bracu.ac.bd",
    defaults={
        "username": "admin",
        "first_name": "FabLab",
        "last_name": "Admin",
        "role": "admin",
        "is_staff": True,
        "is_superuser": True,
    }
)
admin_user.set_password("admin123!")
admin_user.save()

faculty_user, _ = User.objects.get_or_create(
    email="faculty@bracu.ac.bd",
    defaults={
        "username": "dr_tanvir",
        "first_name": "Dr. Tanvir",
        "last_name": "Hasan",
        "role": "faculty",
        "department": "CSE",
    }
)
faculty_user.set_password("faculty123!")
faculty_user.save()

student_user, _ = User.objects.get_or_create(
    email="student@g.bracu.ac.bd",
    defaults={
        "username": "nusrat_jahan",
        "first_name": "Nusrat",
        "last_name": "Jahan",
        "role": "student",
        "department": "EEE",
    }
)
student_user.set_password("student123!")
student_user.save()

# 2. Seed Equipment Categories & Equipment
Equipment.objects.all().delete()
EquipmentCategory.objects.all().delete()

cat_3d = EquipmentCategory.objects.create(
    name="3D Printing",
    slug="3d-printing",
    description="Industrial FDM and SLA additive manufacturing printers for precision rapid prototyping.",
    order=1,
)
cat_laser = EquipmentCategory.objects.create(
    name="Laser Cutting",
    slug="laser-cutting",
    description="High-precision CO2 and fiber laser systems for cutting and engraving acrylic, wood, and sheet metals.",
    order=2,
)
cat_cnc = EquipmentCategory.objects.create(
    name="CNC Machining",
    slug="cnc-machining",
    description="Multi-axis automated routers and mills for subtractive fabrication.",
    order=3,
)
cat_electronics = EquipmentCategory.objects.create(
    name="Electronics & IoT",
    slug="electronics-iot",
    description="Advanced soldering workstations, oscilloscopes, and logic analyzers for circuit development.",
    order=4,
)
cat_pcb = EquipmentCategory.objects.create(
    name="PCB Fabrication",
    slug="pcb-fabrication",
    description="Dedicated PCB milling and chemical etching equipment for multilayer boards.",
    order=5,
)

Equipment.objects.create(
    name="Prusa i3 MK3S+ 3D Printer",
    slug="prusa-i3-mk3s",
    category=cat_3d,
    description="Reliable FDM 3D printer featuring auto bed leveling, filament sensor, and magnetic spring steel print sheets.",
    specifications={
        "Build Volume": "250 x 210 x 210 mm",
        "Layer Height": "0.05 - 0.35 mm",
        "Supported Materials": "PLA, PETG, ABS, TPU, ASA",
        "Nozzle Size": "0.4 mm Brass"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=150.00,
    location="Zone A - Additive Bay",
    is_featured=True,
)

Equipment.objects.create(
    name="Formlabs Form 3B+ SLA Printer",
    slug="formlabs-form-3b",
    category=cat_3d,
    description="High-precision stereolithography 3D printer designed for biocompatible and ultra-fine mechanical components.",
    specifications={
        "Build Volume": "145 x 145 x 185 mm",
        "XY Resolution": "25 microns",
        "Laser Power": "250 mW",
        "Resin Types": "Standard, Tough, Flexible, Castable"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=350.00,
    location="Zone A - Additive Bay",
    is_featured=True,
)

Equipment.objects.create(
    name="Epilog Fusion Pro 48 Laser Cutter",
    slug="epilog-fusion-pro-48",
    category=cat_laser,
    description="Dual-source CO2 and Fiber laser cutter with IRISTM Camera positioning and high-speed motion control.",
    specifications={
        "Work Area": "1219 x 914 mm",
        "Laser Power": "80W CO2 / 50W Fiber",
        "Max Speed": "165 IPS",
        "Supported Materials": "Acrylic, Plywood, MDF, Leather, Anodized Aluminum"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=400.00,
    location="Zone B - Laser Lab",
    is_featured=True,
)

Equipment.objects.create(
    name="ShopBot PRSalpha 5-Axis CNC Router",
    slug="shopbot-prsalpha",
    category=cat_cnc,
    description="Full-size industrial CNC router capable of large-scale milling in timber, aluminum, foam, and composites.",
    specifications={
        "Work Area": "2440 x 1220 x 200 mm",
        "Spindle": "4 HP HSD Industrial Spindle",
        "Positioning Accuracy": "+/- 0.05 mm",
        "Feed Rate": "Up to 600 Inches/Min"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=600.00,
    location="Zone C - Heavy Machinery Bay",
    is_featured=True,
)

Equipment.objects.create(
    name="Roland Modela MDX-50 CNC Mill",
    slug="roland-modela-mdx-50",
    category=cat_cnc,
    description="Compact desktop milling machine featuring Automatic Tool Changer (ATC) for prototyping engineering parts.",
    specifications={
        "Work Area": "400 x 305 x 135 mm",
        "Spindle Speed": "4,500 to 15,000 RPM",
        "Tool Magazine": "5 Tools Automatic",
        "Materials": "ABS, POM, Nylon, Modeling Wax, Wood"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=250.00,
    location="Zone C - Precision Milling",
    is_featured=False,
)

Equipment.objects.create(
    name="Weller WX2020 Digital Soldering Station",
    slug="weller-wx2020",
    category=cat_electronics,
    description="Dual-channel smart soldering workstation with ESD protection and precision temperature profiling.",
    specifications={
        "Power Output": "200W (2 x 120W max)",
        "Temperature Range": "100°C - 550°C",
        "Features": "Motion Sensor Sleep Mode, ESD Safe"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=False,
    hourly_rate=50.00,
    location="Zone D - Electronics Bench 1",
    is_featured=False,
)

Equipment.objects.create(
    name="LPKF ProtoMat S64 PCB Milling Machine",
    slug="lpkf-protomat-s64",
    category=cat_pcb,
    description="Rapid PCB prototyping system for in-house manufacturing of double-sided and multilayer circuit boards.",
    specifications={
        "Spindle Speed": "60,000 RPM",
        "Min Trace Width": "100 microns",
        "Working Area": "229 x 305 mm",
        "Camera": "Fiducial Recognition & Optical Alignment"
    },
    status=Equipment.Status.AVAILABLE,
    requires_training=True,
    hourly_rate=300.00,
    location="Zone D - Clean Prototyping",
    is_featured=True,
)

# 3. Seed Training Courses, Lessons, and Quizzes
Lesson.objects.all().delete()
Quiz.objects.all().delete()
TrainingCourse.objects.all().delete()

course_safety = TrainingCourse.objects.create(
    title="BRACU FabLab Mandatory Safety Orientation",
    slug="mandatory-safety-orientation",
    description="Essential safety guidelines, emergency protocols, PPE regulations, and code of conduct for all FabLab users.",
    category=TrainingCourse.Category.SAFETY,
    duration_hours=2,
    is_required=True,
    order=1,
)

Lesson.objects.create(
    course=course_safety,
    title="General Lab Conduct & Personal Protective Equipment (PPE)",
    content="Always wear safety glasses when machinery is operating. Long hair must be tied back and loose clothing secured. Closed-toe leather or canvas footwear is mandatory inside fabrication zones.",
    video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order=1,
    duration_minutes=25,
)

Lesson.objects.create(
    course=course_safety,
    title="Emergency Shutdowns & Fire Extinguisher Protocols",
    content="Know the location of all red emergency stop (E-STOP) buttons located on the perimeter walls and on individual machines. CO2 and Dry Powder extinguishers are located at doors A and B.",
    video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order=2,
    duration_minutes=20,
)

Quiz.objects.create(
    course=course_safety,
    title="FabLab Safety Certification Assessment",
    passing_score=80,
    questions=[
        {
            "id": 1,
            "question": "What type of footwear is required when entering BRACU FabLab?",
            "options": ["Open-toe sandals", "Closed-toe shoes", "Slippers", "Barefoot"],
            "correct_answer": 1
        },
        {
            "id": 2,
            "question": "What should you do immediately if a machine exhibits abnormal vibration or sparks?",
            "options": ["Leave it running and go for lunch", "Press the Emergency Stop (E-Stop) and notify staff", "Unplug other devices", "Ignore it"],
            "correct_answer": 1
        }
    ]
)

course_laser = TrainingCourse.objects.create(
    title="Laser Cutting Safety & Operation Certification",
    slug="laser-cutting-certification",
    description="Comprehensive training on operating CO2 and Fiber laser cutters, material safety, exhaust ventilation, and vector focus setup.",
    category=TrainingCourse.Category.LASER,
    duration_hours=3,
    is_required=False,
    order=2,
)

Lesson.objects.create(
    course=course_laser,
    title="Material Compatibility & Toxic Gas Hazards",
    content="NEVER cut PVC, Polycarbonate, or Teflon under any circumstances as they release lethal toxic chlorine gas and ruin optics. Only cut approved materials like cast acrylic, birch plywood, and MDF.",
    order=1,
    duration_minutes=30,
)

course_3d = TrainingCourse.objects.create(
    title="3D Printing & Slicing Mastery",
    slug="3d-printing-mastery",
    description="Master FDM slicing in PrusaSlicer, overhang supports, bed leveling, and filament profiles.",
    category=TrainingCourse.Category.PRINTING_3D,
    duration_hours=2,
    is_required=False,
    order=3,
)

# 4. Seed Project Categories & Projects
Project.objects.all().delete()
ProjectCategory.objects.all().delete()

pcat_robotics = ProjectCategory.objects.create(
    name="Robotics & Automation",
    slug="robotics-automation",
    description="Autonomous mobile robots, robotic arms, and drone systems."
)
pcat_biomed = ProjectCategory.objects.create(
    name="Biomedical Engineering",
    slug="biomedical-engineering",
    description="Assistive medical devices, bionics, and biosensors."
)
pcat_iot = ProjectCategory.objects.create(
    name="IoT & Smart Systems",
    slug="iot-smart-systems",
    description="Connected environmental sensors, smart home, and agricultural monitoring systems."
)
pcat_sustain = ProjectCategory.objects.create(
    name="Sustainable Technology",
    slug="sustainable-technology",
    description="Renewable energy converters, water purification, and circular economy hardware."
)

p1 = Project.objects.create(
    title="Autonomous Urban Delivery Drone (AeroBRAC)",
    slug="autonomous-urban-delivery-drone",
    category=pcat_robotics,
    description="An autonomous quadcopter featuring LiDAR obstacle avoidance and carbon fiber frame fabricated using CNC milling and SLA 3D printing at BRACU FabLab.",
    supervisor=faculty_user,
    technologies=["ROS 2", "Pixhawk 6C", "LiDAR SLAM", "Carbon Fiber CNC", "SLA 3D Printing"],
    awards="1st Place - National Robotics Championship 2025",
    is_featured=True,
    status=Project.Status.PUBLISHED,
)
p1.team_members.add(student_user)

p2 = Project.objects.create(
    title="Bionic EMG-Controlled Prosthetic Hand",
    slug="bionic-emg-prosthetic-hand",
    category=pcat_biomed,
    description="An affordable 3D-printed transradial bionic hand that translates electromyographic (EMG) muscle signals into smooth grip articulations.",
    supervisor=faculty_user,
    technologies=["Custom EMG Sensor", "STM32", "PLA+ FDM Printing", "Flex Sensors"],
    awards="Best Innovation - BRACU Research Fair",
    is_featured=True,
    status=Project.Status.PUBLISHED,
)
p2.team_members.add(student_user)

p3 = Project.objects.create(
    title="Solar-Powered IoT Hydroponic Greenhouse Controller",
    slug="solar-iot-greenhouse",
    category=pcat_iot,
    description="Automated nutrient dosing and climate regulator with custom 4-layer PCB milled on LPKF ProtoMat.",
    supervisor=faculty_user,
    technologies=["ESP32", "Custom PCB", "MQTT", "Solar MPPT", "Laser Cut Acrylic Enclosure"],
    is_featured=True,
    status=Project.Status.PUBLISHED,
)
p3.team_members.add(student_user)

p4 = Project.objects.create(
    title="Portable Solar Atmospheric Water Generator",
    slug="solar-water-generator",
    category=pcat_sustain,
    description="Condensation-based water generator powered by thermoelectric Peltier modules for off-grid coastal communities.",
    supervisor=faculty_user,
    technologies=["Thermoelectric Peltier", "Custom Heatsink Machining", "Arduino Mega"],
    is_featured=False,
    status=Project.Status.PUBLISHED,
)
p4.team_members.add(student_user)

# 5. Seed Events
Event.objects.all().delete()

Event.objects.create(
    title="Advanced 5-Axis CNC & CAM Masterclass",
    slug="advanced-5-axis-cnc-masterclass",
    description="Intensive 1-day workshop covering Autodesk Fusion CAM toolpath strategies, adaptive clearing, and fixture design.",
    event_type="masterclass",
    date=(timezone.now() + datetime.timedelta(days=7)).date(),
    start_time=datetime.time(10, 0),
    end_time=datetime.time(16, 0),
    venue="FabLab CNC Machine Shop (Room UB02-401)",
    max_participants=15,
    status="upcoming",
)

Event.objects.create(
    title="BRACU FabLab Hardware Hackathon 2026",
    slug="bracu-fablab-hardware-hackathon-2026",
    description="36-hour hardware build competition focused on sustainable urban engineering solutions. Free equipment access.",
    event_type="hackathon",
    date=(timezone.now() + datetime.timedelta(days=21)).date(),
    start_time=datetime.time(9, 0),
    end_time=datetime.time(20, 0),
    venue="FabLab Main Arena & Innovation Hub",
    max_participants=60,
    status="upcoming",
)

Event.objects.create(
    title="PCB Prototyping Workshop: From Schematic to Milled Board",
    slug="pcb-prototyping-workshop",
    description="Learn KiCad PCB layout design and produce your own surface-mount board on our LPKF ProtoMat milling machine.",
    event_type="workshop",
    date=(timezone.now() - datetime.timedelta(days=10)).date(),
    start_time=datetime.time(14, 0),
    end_time=datetime.time(17, 0),
    venue="Electronics & IoT Bay",
    max_participants=20,
    status="completed",
)

# 6. Seed Resources
Resource.objects.all().delete()
ResourceCategory.objects.all().delete()

rcat_safety = ResourceCategory.objects.create(name="Safety Guidelines", slug="safety-guidelines", description="Safety rules and SOPs")
rcat_design = ResourceCategory.objects.create(name="Design Assets", slug="design-assets", description="Design templates and guidelines")
rcat_manuals = ResourceCategory.objects.create(name="Manuals", slug="manuals", description="Equipment manuals and reference sheets")
rcat_software = ResourceCategory.objects.create(name="Software", slug="software", description="Post-processors and software configs")

Resource.objects.create(
    title="BRACU FabLab Official Safety Rulebook & Emergency Protocols",
    category=rcat_safety,
    description="Comprehensive safety handbook detailing lab policies, equipment permissions, and emergency contacts.",
    resource_type=Resource.ResourceType.SAFETY,
    file="resources/files/sample.pdf",
    file_size=2400000,
    download_count=412,
)

Resource.objects.create(
    title="3D Printing Design Guidelines & Tolerance Sheet",
    category=rcat_design,
    description="Reference guide for designing snap-fits, threads, overhangs, and print tolerances for FDM and SLA.",
    resource_type=Resource.ResourceType.TUTORIAL,
    file="resources/files/sample.pdf",
    file_size=4100000,
    download_count=328,
)

Resource.objects.create(
    title="Laser Cutting Kerf & Power Speed Reference Chart",
    category=rcat_manuals,
    description="Tested speed, power, and frequency settings for cutting and engraving acrylic, plywood, MDF, and leather.",
    resource_type=Resource.ResourceType.MANUAL,
    file="resources/files/sample.pdf",
    file_size=1800000,
    download_count=560,
)

Resource.objects.create(
    title="ShopBot CNC Toolpath Starter Pack (Fusion 360 & VCarve Pro)",
    category=rcat_software,
    description="Post-processors and tool library definitions for BRACU FabLab CNC routers.",
    resource_type=Resource.ResourceType.SOP,
    file="resources/files/sample.zip",
    file_size=8500000,
    download_count=195,
)

print("Database successfully seeded with production-ready BRACU FabLab data!")
