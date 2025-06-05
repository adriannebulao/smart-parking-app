## Smart Parking App Backend

### How to Use

1. Set up environment variables

On Windows:

```
xcopy .env.sample .env
```

Generate your own secret key:

```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

2. Start Docker (PostgreSQL and pgAdmin)

On Windows (Docker Desktop must be running):

```
docker compose up -d
```

3. Create and activate Python virtual environment

On Windows:

```
python -m venv .venv
.venv\Scripts\activate
```

4. Install requirements

```
pip install -r requirements.txt
```

5. Run database migrations

```
python manage.py migrate
```

6. Start the Django development server

```
python manage.py runserver
```

The server can be accessed at: http://127.0.0.1:8000/

7. Create a Django superuser (admin)

```
python manage.py createsuperuser
```

8. Access the API documentation and pgAdmin

   - Swagger API documentation: http://127.0.0.1:8000/api/docs/
   - pgAdmin: http://127.0.0.1:5050/

9. Stop the application
   1. Press `CTRL + C` in the terminal running the Django server
   2. Then stop the docker containers:
   ```
   docker compose down
   ```
