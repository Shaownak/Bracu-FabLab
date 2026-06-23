"""
WSGI config for BRAC University FabLab project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fablab.settings.development')
application = get_wsgi_application()

try:
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(is_superuser=True).exists():
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@fablab.bracu.ac.bd')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123!')
        User.objects.create_superuser(
            email=email,
            username='admin',
            first_name='System',
            last_name='Admin',
            password=password,
            role='admin'
        )
except Exception:
    pass
