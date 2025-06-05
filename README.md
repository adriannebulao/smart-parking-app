# Smart Parking App

[![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## Overview

This Smart Parking web application was developed for a startup aiming to reduce parking congestion in Davao City by offering real-time visibility and digital reservation of available parking spaces. The platform enables users to search for and reserve parking spots, while administrators can manage parking locations, monitor reservations, and oversee system operations. The goal is to improve urban mobility through efficient parking space utilization and a seamless user experience.

### Tech Stack

- **React**: Used for building a fast, interactive, and component-based user interface
- **Vite**: Provides a fast development experience with hot module replacement and optimized builds
- **Tailwind CSS**: Enables rapid UI development with utility-first classes for responsive and modern styling
- **Django REST Framework**: Powers the backend API with secure, scalable, and maintainable endpoints
- **PostgreSQL**: Serves as the primary relational database, ensuring reliable data storage and queries
- **Docker**: Used to containerize the full application for consistent development, testing, and deployment

## How to Set Up

1. Clone the repository

```
git clone https://github.com/adriannebulao/smart-parking-app.git
cd smart-parking-app
```

2. Set up environment variables

On Windows:

```
xcopy .env.sample .env
```

Generate your own Django secret key:

```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

3. Run the app

```
docker compose up --build
```

The app should now be accessible at: http://localhost/

4. Stop the app

Press `CTRL + C` in the terminal running the Docker container

## API Documentation

- You can import the Postman collection from `api_documentations.json`;
- Or you can visit it online [here](https://www.postman.com/adriannebulao/smart-parking-app/documentation/ip8d4wu/smart-parking-app)

## Development and Deployment Notes

- Set up instructions for development can be found in the frontend [README](./frontend/README.md) and backend [README](./backend/README.md)
