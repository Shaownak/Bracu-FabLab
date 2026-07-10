"""
WSGI config for BRAC University FabLab project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fablab.settings.development")
application = get_wsgi_application()

try:
    from django.core.management import call_command
    from django.contrib.auth import get_user_model

    # Ensure database migrations are applied on server startup
    call_command("migrate", interactive=False)

    User = get_user_model()
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@fablab.bracu.ac.bd")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123!")

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": "admin",
            "first_name": "System",
            "last_name": "Admin",
            "role": "admin",
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
        },
    )
    if created or not user.is_staff or not user.is_superuser:
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.role = "admin"
        user.set_password(password)
        user.save()
except Exception as e:
    print(f"WSGI Startup Warning: {e}")
