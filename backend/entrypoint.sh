#!/bin/sh
set -e

echo "Waiting for DB to be ready..."
echo "POSTGRES_HOST=$POSTGRES_HOST"
echo "POSTGRES_PORT=$POSTGRES_PORT"

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1
done

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
username = "${DJANGO_SUPERUSER_USERNAME}"
email = ""
password = "${DJANGO_SUPERUSER_PASSWORD}"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
END

echo "Collecting static files..."
python manage.py collectstatic --noinput

exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
