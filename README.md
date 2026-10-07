# CampusPilot

CampusPilot is a student productivity and academic assistance platform designed to bring essential academic activities into one application.

The current demo/MVP focuses on authentication and user management, task and assignment management, notes, reminders, dashboard functionality, and basic AI-powered academic assistance.

The project follows a separated frontend, backend, and database architecture so each part can be developed and maintained independently.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Current Demo Features](#current-demo-features)
- [Phase 2 Features](#phase-2-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Team Members and Responsibilities](#team-members-and-responsibilities)
- [Database Structure](#database-structure)
- [Authentication](#authentication)
- [API Structure](#api-structure)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
- [Docker](#docker)
- [Git and GitHub Workflow](#git-and-github-workflow)
- [Security Rules](#security-rules)
- [Project Status](#project-status)

---

# Project Overview

Students often manage assignments, notes, reminders, and academic information using multiple applications.

CampusPilot aims to provide a centralized platform where students can:

- Manage academic tasks
- Track deadlines and completion
- Create and manage notes
- Create and view reminders
- Maintain basic student information
- Access basic AI-powered academic assistance
- Access their own user-specific data securely

The project is being developed in phases. The current implementation is focused on a practical demo/MVP before expanding into more advanced academic-management features.

---

# Current Demo Features

## 1. Authentication and User Management

The current demo supports:

- Register
- Login
- Logout
- JWT authentication
- Basic student profile
- Protected routes
- User-specific data

### User Fields

```text
id
name
email
department
semester
enrollment_id
hashed_password
is_active
```

---

## 2. Dashboard

The dashboard provides a central location for the student's productivity information and quick access to the application's main features.

---

## 3. Task and Assignment Management

The current demo supports:

- Create task
- View tasks
- Edit task
- Delete task
- Mark task as completed
- Priority
- Due date
- Description
- Task status
- Basic filtering

### Task Fields

```text
id
user_id
title
description
priority
due_date
status
```

---

## 4. Notes

The current demo supports:

- Create note
- View notes
- Edit note
- Delete note
- Note title
- Note content
- Optional subject/category

### Note Fields

```text
id
user_id
topic / category
title
content
```

---

## 5. Reminders

The current demo supports:

- Create reminder
- Reminder title
- Date and time
- View upcoming reminders
- Delete reminder

### Reminder Fields

```text
id
user_id
title
description
reminder_time
is_completed
```

---

## 6. AI Academic Assistant

The current project includes basic AI-powered academic assistance.

More advanced AI agents, AI tool calling, and other advanced AI capabilities are planned for Phase 2.

---

# Phase 2 Features

The following features are planned for Phase 2:

- Subject management
- Syllabus tracking
- Examination management
- Advanced planner
- Advanced AI agents
- AI tool calling
- Complex notification system
- Advanced analytics
- More sophisticated personalization

These features are intentionally outside the current demo/MVP scope.

---

# System Architecture

```text
                         CampusPilot
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
          Frontend         Backend         Database
           React           FastAPI          MongoDB
                              |
                              v
                         AI Services
```

### Data Flow

```text
React Frontend
      |
      | HTTP / JSON
      v
FastAPI Backend
      |
      | Motor
      v
MongoDB
```

The frontend does not connect directly to MongoDB. All database access is handled by the backend.

---

# Technology Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend application |
| Vite | Frontend development/build tooling |
| FastAPI | Backend REST API |
| Pydantic | Data validation and models |
| Pydantic Settings | Environment-based configuration |
| Motor | Asynchronous MongoDB driver |
| MongoDB | NoSQL database |
| MongoDB Atlas | Cloud database hosting |
| JWT | Authentication |
| bcrypt | Password hashing |
| Google Gemini | AI academic assistance |
| Axios | Frontend API communication |
| GitHub | Version control and collaboration |
| Docker | Application containerization |
| Render | Backend deployment |
| Vercel | Frontend deployment |

---

# Project Structure

```text
CampusPilot/
|
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── database/
│   │   │   └── connection.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── note.py
│   │   │   └── reminder.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   │   ├── notes.py
│   │   │   ├── reminders.py
│   │   │   └── chat.py
│   │   │
│   │   ├── schemas/
│   │   └── services/
│   │
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

# Team Members and Responsibilities

CampusPilot is developed collaboratively with separate responsibilities.

| Member | Branch | Primary Responsibility |
|--------|--------|------------------------|
| **Arpan** | `arpan-dev` | Database, models, deployment, repository management |
| **Ankita** | `ankita-dev` | AI integration, chat, AI-related schemas |
| **Soumyadip** | `soumyadip-dev` | Backend, authentication, API/application integration |
| **Frontend Developer** | `frontend-dev` | React frontend and frontend integration |

---

## Arpan — Database and Deployment

Arpan is responsible for the database and project infrastructure.

### Responsibilities

- MongoDB connection
- Database configuration
- Database models
- User model
- Task model
- Note model
- Reminder model
- Environment configuration
- Docker configuration
- Deployment configuration
- Repository configuration
- `.gitignore`
- `.env.example`
- Project structure management

### Main Files

```text
backend/app/config.py

backend/app/database/
└── connection.py

backend/app/models/
├── user.py
├── task.py
├── note.py
└── reminder.py
```

---

## Ankita — AI Integration

Ankita is responsible for AI-related functionality.

### Responsibilities

- AI academic assistant
- AI chat functionality
- AI integration
- AI-related services
- AI-related schemas
- Integration of AI features with the backend

---

## Soumyadip — Backend and Authentication

Soumyadip is responsible for backend application logic and authentication.

### Responsibilities

- FastAPI backend
- REST API development
- Authentication
- JWT authorization
- Backend integration
- Application entry point
- API routers
- Backend services
- Integration with database models and schemas

### Main Area

```text
backend/app/
├── main.py
├── routers/
├── schemas/
└── services/
```

---

## Frontend Developer

The frontend developer is responsible for the React application and frontend integration.

### Responsibilities

- React application
- Pages
- Components
- Routing
- Authentication UI
- Dashboard UI
- Tasks UI
- Notes UI
- Reminders UI
- AI assistant UI
- API integration

### Main Area

```text
frontend/src/
├── components/
├── context/
├── pages/
├── routes/
└── services/
```

---

# Database Structure

CampusPilot uses MongoDB as the primary database.

The current Phase 1 database uses four main collections:

```text
campuspilot
|
├── users
├── tasks
├── notes
└── reminders
```

## Users Collection

```text
users
|
├── _id
├── name
├── email
├── department
├── semester
├── enrollment_id
├── hashed_password
└── is_active
```

## Tasks Collection

```text
tasks
|
├── _id
├── user_id
├── title
├── description
├── priority
├── due_date
└── status
```

## Notes Collection

```text
notes
|
├── _id
├── user_id
├── topic / category
├── title
└── content
```

## Reminders Collection

```text
reminders
|
├── _id
├── user_id
├── title
├── description
├── reminder_time
└── is_completed
```

Each user's tasks, notes, and reminders are associated through `user_id`.

---

# Authentication

CampusPilot uses JWT-based authentication.

## Authentication Flow

```text
User
 |
 +---- Register
 |        |
 |        v
 |     FastAPI
 |        |
 |        +---- Validate input
 |        +---- Hash password
 |        +---- Store user
 |
 +---- Login
          |
          v
       FastAPI
          |
          +---- Find user by email
          +---- Verify password
          +---- Create JWT
          |
          v
       Frontend
          |
          v
   Protected API Request
          |
          | Authorization: Bearer <JWT>
          v
       FastAPI
          |
          +---- Validate token
          +---- Identify current user
          |
          v
       MongoDB
```

Passwords must never be stored as plain text. The database stores the `hashed_password` value.

---

# API Structure

The backend provides the following main API areas.

## Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Tasks

```text
POST   /tasks
GET    /tasks
GET    /tasks/{task_id}
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}
```

## Notes

```text
POST   /notes
GET    /notes
GET    /notes/{note_id}
PUT    /notes/{note_id}
DELETE /notes/{note_id}
```

## Reminders

```text
POST   /reminders
GET    /reminders
GET    /reminders/{reminder_id}
PUT    /reminders/{reminder_id}
DELETE /reminders/{reminder_id}
```

---

# Environment Configuration

Environment files are used for local configuration and secrets.

## Backend `.env`

Create:

```text
backend/.env
```

Example:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=campuspilot

APP_NAME=CampusPilot
DEBUG=True

JWT_SECRET=your_secret_key_here

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash
```

Do not commit the real `.env` file.

## `.env.example`

Commit a template containing variable names but no real secrets:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=campuspilot

APP_NAME=CampusPilot
DEBUG=True

JWT_SECRET=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.8-flash
```

## Frontend Environment

The frontend uses:

```env
VITE_API_URL=http://localhost:8000
```

Keep real local environment files outside Git tracking.

---

# Local Development Setup

## Prerequisites

Install:

- Python 3.11 or compatible version
- Node.js
- npm
- MongoDB
- Git

---

## Clone Repository

```bash
git clone <repository-url>
cd CampusPilot
```

---

# Backend Setup

Go to the backend:

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

and add the required environment variables.

---

# Start Backend

From the project root:

```bash
uvicorn backend.app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Docker

Docker is used for containerized application setup.

## Backend Dockerfile

Located at:

```text
backend/Dockerfile
```

The Dockerfile:

- Uses a Python base image
- Installs backend dependencies
- Copies backend code
- Exposes port 8000
- Starts the FastAPI application

## Docker Compose

Located at:

```text
docker-compose.yml
```

The Compose file is kept at the project root so that it can coordinate multiple services as the project grows.

The current deployment plan uses MongoDB/MongoDB Atlas rather than requiring a MongoDB container in the application itself.

---

# Git and GitHub Workflow

Each developer works on a separate branch.

```text
main
|
├── arpan-dev
├── ankita-dev
├── soumyadip-dev
└── frontend-dev
```

## Before Coding

Update local `main`:

```bash
git switch main
git pull origin main
```

Switch back to your development branch:

```bash
git switch <your-branch>
```

Merge the latest `main`:

```bash
git merge main
```

---

## Commit and Push

Check your changes:

```bash
git status
```

Stage changes:

```bash
git add <files>
```

Commit:

```bash
git commit -m "Describe the change"
```

Push:

```bash
git push origin <your-branch>
```

---

# Pull Request Workflow

Developers create Pull Requests from their own branch to `main`.

```text
Developer Branch
       |
       v
   git push
       |
       v
 Pull Request
       |
       v
   Code Review
       |
       v
      main
```

Pull Requests should include:

- A clear title
- A short description
- Testing information
- Any relevant implementation notes

The project uses Pull Requests for integrating changes into `main`.

---

# Security Rules

Never commit:

```text
.env
API keys
JWT secrets
Database passwords
Private keys
Credentials
```

Use `.env.example` for example configuration.

Never store plain-text passwords in MongoDB.

Protected endpoints must verify the authenticated user before accessing user-specific data.

---

# Development Ownership

```text
Arpan
|
+-- Database
+-- Models
+-- Deployment
+-- Repository configuration

Ankita
|
+-- AI integration
+-- Chat
+-- AI-related schemas

Soumyadip
|
+-- Backend
+-- Authentication
+-- API integration

Frontend Developer
|
+-- React frontend
+-- UI
+-- Frontend integration
```

When a change crosses responsibility boundaries, the relevant developers should coordinate before modifying the file.

---

# Project Status

## Phase 1 / Demo

```text
Authentication             ✅
User Management            ✅
Dashboard                  ✅
Task Management            ✅
Notes                      ✅
Reminders                  ✅
Basic AI Assistance        ✅
```

## Phase 2

```text
Subject Management         ⏳
Syllabus Tracking          ⏳
Examination Management     ⏳
Advanced Planner           ⏳
Advanced AI Agents         ⏳
AI Tool Calling             ⏳
Complex Notifications      ⏳
Advanced Analytics         ⏳
Advanced Personalization   ⏳
```

---

# Deployment

The planned deployment stack is:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
Source    → GitHub
```

The production configuration may evolve as deployment work progresses.

---

# Future Development

The long-term goal is to expand CampusPilot from the current productivity-focused MVP into a broader academic management platform.

Future expansion can include:

- Subject management
- Syllabus progress tracking
- Examination management
- Advanced academic planning
- Advanced AI agents
- AI tool calling
- Notifications
- Analytics
- Personalization

---

# Project Goal

CampusPilot aims to provide students with a centralized academic productivity platform where they can manage tasks, notes, reminders, profile information, and academic assistance from one place.

The project starts with a focused MVP and is designed to scale into a more complete academic management platform over subsequent phases.

---

# License

CampusPilot is currently developed as a collaborative academic project.
