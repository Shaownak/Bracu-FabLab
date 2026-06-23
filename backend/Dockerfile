FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create media, logs, and staticfiles directories so Django logging doesn't crash
RUN mkdir -p media logs staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput --settings=fablab.settings.production 2>/dev/null || true

EXPOSE 8000

CMD ["gunicorn", "fablab.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
