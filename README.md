# BRAC University FabLab Management Platform

A complete, production-ready web application for managing the BRAC University Fabrication Laboratory. This platform serves as both a public-facing innovation gallery and an internal management system for equipment bookings, training, and events.

![FabLab Platform](https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200)

## 🚀 Features

- **Equipment Booking System:** Browse available machinery (3D Printers, CNC, Laser Cutters), check availability, and submit booking requests.
- **Training & Certifications:** Complete mandatory safety courses and earn verifiable digital certificates to unlock advanced equipment.
- **Project Showcase:** A public gallery of student and faculty research, prototypes, and IoT devices.
- **Event Management:** Register for upcoming hackathons, workshops, and guest lectures.
- **Resource Center:** Download manuals, safety guidelines, and software drivers.
- **Role-Based Dashboards:** Separate experiences and capabilities for Students, Faculty, and Lab Admins.

## 🛠️ Technology Stack

**Frontend**
- Next.js 15 (App Router)
- React & TypeScript
- Tailwind CSS & ShadCN UI
- Framer Motion (Animations)
- Zustand (State Management)
- Axios (API Client)

**Backend**
- Django 5+
- Django REST Framework (DRF)
- PostgreSQL (Production) / SQLite (Development)
- Simple JWT (Authentication)

**DevOps & Infrastructure**
- Docker & Docker Compose
- Nginx Reverse Proxy
- Gunicorn

## 📦 Local Development Setup

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js 18+ (if running frontend outside Docker).
- Python 3.10+ (if running backend outside Docker).

### Quick Start (Using Docker Compose)

The easiest way to run the entire stack locally is using Docker.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bracu/fablab-platform.git
   cd fablab-platform
   ```

2. **Start the containers:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend UI:** `http://localhost:3000`
   - **Backend API:** `http://localhost:8000/api/`
   - **Django Admin:** `http://localhost:8000/admin/`

4. **Create a superuser (for admin access):**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

---

## 🏗️ Project Structure

```text
├── backend/                  # Django REST API
│   ├── accounts/             # User profiles & authentication
│   ├── analytics/            # System logs & dashboard metrics
│   ├── bookings/             # Equipment reservations
│   ├── certifications/       # Digital certificates
│   ├── events/               # Workshops & hackathons
│   ├── fablab/               # Core Django configuration
│   ├── facilities/           # Equipment & lab spaces
│   ├── notifications/        # User alerts
│   ├── projects/             # Innovation gallery
│   ├── resources/            # Downloadable files
│   └── trainings/            # Safety courses & modules
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # Reusable React components
│   │   ├── lib/              # Utilities & Axios API config
│   │   └── stores/           # Zustand global state (Auth)
├── docker-compose.yml        # Development orchestration
├── docker-compose.prod.yml   # Production orchestration
├── Dockerfile.backend        # Django container configuration
├── Dockerfile.frontend       # Next.js container configuration
└── nginx/                    # Reverse proxy routing
```

## 🔐 Authentication Flow
The platform uses stateless JSON Web Tokens (JWT).
1. The Next.js frontend sends credentials to `/api/accounts/login/`.
2. The backend responds with `access` and `refresh` tokens.
3. Zustand stores the tokens in memory and `localStorage`.
4. Axios interceptors automatically attach the `Authorization: Bearer <token>` header to protected requests. If a token expires, the interceptor automatically attempts to refresh it.

## 🚀 Production Deployment

To deploy to a production Ubuntu server:

1. Clone the repository on the server.
2. Update the `.env` variables (Database URL, Secret Key, Allowed Hosts).
3. Run the production compose file:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
4. Configure your domain's DNS to point to the server. Nginx will handle routing traffic between port 80/443 and the internal Docker containers.

## 📄 License
Internal proprietary software for BRAC University. All rights reserved.
