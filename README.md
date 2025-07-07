# ENTNT Dental Center Management Dashboard 

A responsive frontend application built using React and TypeScript for managing patients and dental treatment appointments. This project simulates a dental clinic's dashboard with role-based access (Admin & Patient) and stores all data in `localStorage`.

## Features

### User Authentication (Simulated)
- Login system with hardcoded users (Admin and Patient)
- Role-based access control using Context API
- Session persistence with `localStorage`

### Admin (Dentist) Access
- Add, edit, delete patients
- Manage appointments (incidents) per patient
- Upload and preview treatment files (invoices, x-rays)
- Dashboard with KPIs (next appointments, revenue, treatment stats)
- Calendar view for scheduled treatments

### Patient Access
- View personal details and medical history
- View upcoming and past appointments
- Access uploaded treatment files

### Data Handling
- All app data is persisted via `localStorage`
- File uploads are stored as base64 or blob URLs

### Tech Stack
- React + TypeScript + Vite
- React Router DOM for routing
- Context API for global state
- Tailwind CSS for UI
- localStorage for all data persistence

---

## Getting Started

### Run Locally

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd entnt-dental-dashboard
