"""
ASGI config for BRAC University FabLab project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fablab.settings.development")
application = get_asgi_application()
