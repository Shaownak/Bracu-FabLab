"""
WSGI config for BRAC University FabLab project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fablab.settings.development')
application = get_wsgi_application()
