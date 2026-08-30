# 🦷 Orthodontic Surgeon & Dental Clinic Platform

<p align="center">
  <strong>A modern, full-stack dental practice web application & clinic management system.</strong><br>
  Equipped with real-time patient appointment booking, Twilio SMS confirmations, slot availability validation, and a secured doctor/admin portal.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Twilio-SMS-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Patient Experience](#-patient-experience)
  - [Doctor & Admin Management Portal](#-doctor--admin-management-portal)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
  - [Deploy to Vercel](#deploying-to-vercel-recommended)
  - [Standalone / VPS Deployment](#standalone--vps-deployment)
- [Design System & Guidelines](#-design-system--guidelines)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Overview

The **Orthodontic Surgeon & Dental Clinic Platform** is designed for orthodontic specialists, dental surgeons, and multi-specialty dental clinics. It combines a patient-centric, high-trust digital storefront with an intelligent administrative dashboard to manage consultations, appointments, and patient inquiries seamlessly.

Built following strict medical design guidelines—prioritizing clarity, accessibility, generous whitespace, and calm typography (Manrope & DM Sans)—it delivers an experience that builds immediate patient trust.

---

## ✨ Key Features

### 🩺 Patient Experience
- **Interactive Hero & Social Proof**: High-impact headlines, direct booking CTA, and live trust metrics (500+ happy smiles).
- **Bento Grid Services Showcase**: Detailed breakdown of treatments:
  - Orthodontics & Clear Aligners (Invisalign)
  - Dental Implants & Oral Surgery
  - Teeth Whitening & Cosmetic Dentistry
  - Pediatric Dental Care & Preventative Maintenance
- **Before & After Gallery**: High-resolution clinical transformation comparisons.
- **Smart Appointment Booking**:
  - Real-time slot availability check (`MAX_PATIENTS_PER_DAY` enforcement).
  - Automated closure rules (e.g., automated Sunday blocking).
  - Instant client-side feedback and rich notifications via `Sonner`.
- **Automated Patient SMS Confirmations**: Instant SMS dispatch via Twilio with appointment dates, times, and clinic details upon booking.
- **Clinic Tech & Team Showcase**: Doctor bios, clinical accreditations, and state-of-the-art dental technology overview.

### 📊 Doctor & Admin Management Portal
- **Passcode-Protected Access**: Secure login screen (`/admin`) guarding patient data.
- **Unified Multi-Tab Dashboard (`/dashboard`)**:
  - **Table View**: Search, filter by dental service, review contact messages, and delete records.
  - **Calendar View**: Visual overview of scheduled appointments by date.
  - **Doctor Scheduler**: Real-time daily workload counter, appointment capacity utilization, and patient triage.
- **Export & Management**:
  - One-click CSV Export of appointment records for clinic reporting.
  - Live system connectivity status monitor.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) | Modern reactive component hierarchy |
| **Bundler & Tooling** | [Vite 7](https://vitejs.dev/) | Lightning-fast HMR and optimized production build |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Medical-clean utility-first styling |
| **Icons & Alerts** | [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/) | Clean iconography and rich toast notifications |
| **Routing** | [React Router v7](https://reactrouter.com/) | Client-side routing with deep link navigation |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance asynchronous Python API framework |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Motor](https://motor.readthedocs.io/) | Asynchronous, document-oriented NoSQL database |
| **SMS Gateway** | [Twilio](https://www.twilio.com/) | Automated patient notification service |
| **Serverless Engine** | [Vercel Serverless Functions](https://vercel.com/docs/functions) | Python runtime handler in `api/index.py` |

---

## 🏗 System Architecture

```mermaid
graph TD
    subgraph "Client Layer"
        User[Patient / Website Visitor] -->|Browse & Book| ReactApp["React 19 Frontend (Vite)"]
        Doctor[Doctor / Clinic Staff] -->|Passcode Auth & Manage| ReactApp
    end

    subgraph "Routing & Gateway Layer"
        ReactApp -->|HTTP / JSON Requests| ApiClient["Axios API Client (/api)"]
        ApiClient -->|Local Dev (Port 8000) / Vercel Serverless| FastApiBackend["FastAPI Backend (server.py / api/index.py)"]
    end

    subgraph "Data & External Integrations"
        FastApiBackend -->|Async CRUD Queries (Motor)| MongoDB[("MongoDB Atlas Database")]
        FastApiBackend -->|Send Confirmation SMS| Twilio["Twilio REST API"]
        Twilio -->|SMS Notification| PatientPhone["Patient Mobile Device"]
    end
```

---

## 📂 Directory Structure

```text
Orthodentic Sergeon/
├── api/
│   └── index.py                    # Vercel serverless function entrypoint
├── app/
│   ├── backend/
│   │   ├── server.py               # Main FastAPI server (routes, models, Twilio, DB)
│   │   ├── requirements.txt        # Python backend dependencies
│   │   ├── vercel.json             # Backend rewrite rules for Vercel
│   │   └── .env                    # Backend environment config (local)
│   └── frontend/
│       ├── src/
│       │   ├── components/custom/  # UI Sections (Hero, Services, Contact, Navbar, etc.)
│       │   ├── pages/              # Route pages (HomePage, AdminView, DoctorScheduler)
│       │   ├── utils/              # Axios API client & date helper utilities
│       │   ├── Admin.jsx           # Passcode login screen
│       │   ├── Dashboard.jsx       # Doctor appointment management portal
│       │   ├── App.jsx             # React Router routing configuration
│       │   └── index.css           # Global typography & Tailwind base styles
│       ├── public/                 # Static assets & icons
│       ├── package.json            # Frontend dependencies & scripts
│       ├── tailwind.config.js      # Tailwind theme configuration
│       ├── vite.config.js          # Vite config
│       └── vercel.json             # SPA routing rewrite configuration
├── design_guidelines.json          # Brand identity & medical design system tokens
├── requirements.txt                # Root Python dependencies
└── README.md                       # Project documentation
```

---

## 📡 API Reference

Base URL (Local): `http://127.0.0.1:8000`  
Base URL (Production): `/api`

### 1. Health & Status
- **`GET /api/`** — Server heartbeat & available endpoint index.
- **`GET /api/status`** — Retrieves health check history logs.
- **`POST /api/status`** — Submits a client heartbeat ping.

### 2. Appointment Availability
- **`GET /api/appointments/check-availability?date=YYYY-MM-DD`**
  - **Query Parameters**: `date` (format `YYYY-MM-DD`)
  - **Response**:
    ```json
    {
      "available": true,
      "message": "Date is available! (8 slots left)"
    }
    ```

### 3. Book Appointment
- **`POST /api/appointments`**
  - **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "phone": "9876543210",
      "email": "jane@example.com",
      "service": "Clear Aligners / Invisalign",
      "preferred_date": "2026-09-15",
      "preferred_time": "10:00 AM",
      "message": "Interested in teeth alignment consultation."
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Appointment booked successfully",
      "sms_sent": true,
      "id": "c62bda2d-c198-4d56-bfe0-fec9b9dc4cfb"
    }
    ```

### 4. Admin Management
- **`GET /api/appointments?password=doctor123`** — Fetches all booked appointments (Requires admin password).
- **`GET /api/appointments/date/{selected_date}`** — Filters appointments for a specific calendar day.
- **`DELETE /api/appointments/{appointment_id}`** — Deletes an appointment record by UUID.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- **Python**: v3.10 or higher
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI
- *(Optional)* **Twilio Account**: For SMS dispatch functionality

---

### 1. Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd app/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file inside `app/backend/`:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   DB_NAME=dentists
   ADMIN_PASSWORD=doctor123
   PORT=8000

   # Optional: Twilio Configuration for SMS
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_SMS_NUMBER=+1XXXXXXXXXX
   ```

5. **Start the FastAPI backend**:
   ```bash
   python server.py
   ```
   *The backend will start at `http://127.0.0.1:8000` (Interactive Swagger Docs at `http://127.0.0.1:8000/docs`).*

---

### 2. Frontend Setup

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd app/frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file inside `app/frontend/`:
   ```env
   # Local development points to FastAPI server:
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Run the Vite development server**:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

---

## 🔐 Environment Variables

### Backend (`app/backend/.env` or Vercel Environment Variables)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGO_URL` | **Yes** | — | MongoDB connection string (e.g. Atlas cluster or local URI) |
| `DB_NAME` | No | `dentists` | Database name to store appointment collections |
| `ADMIN_PASSWORD` | No | `doctor123` | Passcode for doctor portal authentication |
| `PORT` | No | `8000` | Local backend port |
| `TWILIO_ACCOUNT_SID` | No | — | Twilio Account SID for automated SMS confirmation |
| `TWILIO_AUTH_TOKEN` | No | — | Twilio Auth Token |
| `TWILIO_SMS_NUMBER` | No | — | Twilio Phone Number (with country code, e.g. `+1234567890`) |

### Frontend (`app/frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | `""` (Relative) | Backend base URL for local development (`http://127.0.0.1:8000`) |

---

## 🚢 Deployment Guide

### Deploying to Vercel (Recommended)

This repository is pre-configured for seamless unified deployment on Vercel:

1. **Push your repository** to GitHub, GitLab, or Bitbucket.
2. **Import the project in [Vercel](https://vercel.com/)**.
3. **Configure the Project**:
   - **Root Directory**: `./` (or `app/frontend` if deploying frontend separately).
   - Set build command: `cd app/frontend && npm install && npm run build` (if deploying mono-repo).
4. **Add Environment Variables in Vercel Dashboard**:
   - `MONGO_URL`
   - `DB_NAME`
   - `ADMIN_PASSWORD`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_SMS_NUMBER`
5. **Click Deploy**. Vercel will automatically configure serverless functions (`api/index.py`) and host the client SPA.

---

### Standalone / VPS Deployment

1. **Build the frontend production bundle**:
   ```bash
   cd app/frontend
   npm run build
   ```
2. **Serve the static assets** via Nginx or Caddy.
3. **Run the FastAPI backend with Gunicorn / Uvicorn workers**:
   ```bash
   cd app/backend
   uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
   ```

---

## 🎨 Design System & Guidelines

The project adopts a customized **Medical Clean** design system defined in `design_guidelines.json`:

- **Primary Tone**: Calm, Professional, Trustworthy, Modern, Approachable.
- **Palette**:
  - `Primary (Slate 900)`: `#0F172A`
  - `Accent / Action (Teal 600)`: `#0D9488`
  - `Surface (Slate 50)`: `#F8FAFC`
  - `Border (Slate 200)`: `#E2E8F0`
- **Typography**:
  - Headings: `Manrope` (Tracking tight, weights 600/700/800)
  - Body: `DM Sans` (Clean, legible, weights 400/500)

---

## 📄 License & Acknowledgments

- Built with modern open-source web technologies.
- Dental and clinical imagery courtesy of [Unsplash](https://unsplash.com/).
- Designed for modern orthodontic clinics and dental surgery specialists.

<p align="center">
  Made with ❤️ for high-trust clinical dental care.
</p>
