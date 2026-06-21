@echo off
echo Starting FabLab Development Servers...

echo Starting Backend (Django)...
start "FabLab Backend" cmd /k "cd backend && .\venv\Scripts\activate && python manage.py runserver"

echo Starting Frontend (Next.js)...
start "FabLab Frontend" cmd /k "cd frontend && npm run dev"

echo Development servers are starting in new windows!
