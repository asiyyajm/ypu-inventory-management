# Young Parents United Inventory Management System

This is a full-stack inventory management system built with Django and React.

The goal of this project is to help Young Parents United track inventory for:
- Adult Free Store
- Baby Free Store
- Food Bank

## Features

- Add inventory items
- View inventory table
- Edit and delete items
- Update quantity
- Record inventory changes
- View transaction history
- Manage categories and locations
- Search and filter inventory
- View low stock items
- Generate reports
- Download CSV reports

## Tech Stack

- Frontend: React + Vite
- Backend: Django + Django REST Framework
- Database: SQLite for local development

## How to Run the Project Locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd frontend
npm install
npm run dev