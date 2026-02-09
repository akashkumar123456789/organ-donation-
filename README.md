# 🏥 Organ Donation Management System

A modern, full-stack web application for managing organ donation operations with complete CRUD functionality, real-time matching, and comprehensive medical record tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Features

### 5-Page Architecture with Full CRUD Operations:

1. **Donor Profiles Page** - Manage organ donors
   - Create: Add new donors with blood group and organ type
   - Read: View all available donors
   - Update: Edit donor information and availability status
   - Delete: Remove donors who opt out

2. **Patient Waitlist Page** - Manage patients waiting for organs
   - Create: Register new patients with urgency levels
   - Read: Browse patients by organ type needed
   - Update: Modify urgency scores as health changes
   - Delete: Remove patients who receive transplants elsewhere

3. **Hospital Inventory Page** - Manage medical facilities
   - Create: Add new hospital branches and storage units
   - Read: View all registered hospitals and their teams
   - Update: Change operating status (Active/Full/Maintenance)
   - Delete: Remove non-participating facilities

4. **Organ Match Tracker** - Link donors to patients in real-time
   - Create: Initiate matches between donors and patients
   - Read: View timeline of active matches and stages
   - Update: Progress matches through stages (Procurement → Surgery)
   - Delete: Cancel matches due to medical mismatches

5. **Medical Records Log** - Post-donation documentation
   - Create: File surgery success reports
   - Read: Browse completed transplant history
   - Update: Add follow-up notes 6 months later
   - Delete: Remove draft reports started by mistake

## Technology Stack

- **Backend**: Python 3.8+ with HTTP server
- **Database**: SQLite3 with relational schema
- **Frontend**: HTML5, CSS3 (with animations), JavaScript ES6+
- **Architecture**: RESTful API with MVC pattern
- **Features**: Real-time updates, CSV export, responsive design

## 🚀 Quick Start

1. **Prerequisites**
   - Python 3.8 or higher
   - Modern web browser

2. **Installation**
   ```bash
   # Clone or download the project
   cd organ-donation-
   
   # Run the server
   python app.py
   ```

3. **Access the Application**
   - Open your browser and go to: `http://localhost:8000`
   - The database will be automatically created on first run

## Project Structure

```
organ-donation-/
├── app.py                 # Main HTTP server
├── router.py              # API routing
├── controllers/           # Business logic
│   ├── donor_controller.py
│   ├── patient_controller.py
│   ├── hospital_controller.py
│   ├── match_controller.py
│   └── record_controller.py
├── database/
│   └── connection.py      # SQLite database setup
├── frontend/
│   ├── pages/
│   │   ├── index.html     # Main application page
│   │   └── 404.html       # Error page
│   └── assets/
│       ├── css/
│       │   └── style.css  # Dark theme with animations
│       └── js/
│           ├── app.js     # Main application
│           ├── services/
│           │   └── api.js # API service layer
│           └── controllers/ # Frontend page controllers
└── README.md
```

## API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create new donor
- `PUT /api/donors/{id}` - Update donor
- `DELETE /api/donors/{id}` - Delete donor

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create new hospital
- `PUT /api/hospitals/{id}` - Update hospital
- `DELETE /api/hospitals/{id}` - Delete hospital

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match
- `PUT /api/matches/{id}` - Update match stage
- `DELETE /api/matches/{id}` - Cancel match

### Records
- `GET /api/records` - Get all medical records
- `POST /api/records` - Create new record
- `PUT /api/records/{id}` - Update record
- `DELETE /api/records/{id}` - Delete record

## Usage Flow

1. **User Opens Browser** → **Frontend Loads** → **Backend Server Starts**
2. **Navigation Menu Clicked** → **Page Controllers Handle Actions** → **API Routes Process Requests**
3. **Data Display** → **Business Logic** → **Database Operations**

## Features

- **Dark Theme UI** with smooth animations
- **Responsive Design** for all screen sizes
- **Real-time Data Updates** via AJAX
- **Modal Forms** for create/edit operations
- **Status Badges** for visual data representation
- **Urgency Level Indicators** for patient prioritization
- **Match Stage Tracking** for operation progress
- **Follow-up Notes** for long-term patient care

## Database Schema

The system uses 5 main tables:
- `donors` - Donor information and availability
- `patients` - Patient waitlist with urgency levels
- `hospitals` - Medical facility inventory
- `matches` - Active organ matching operations
- `records` - Completed surgery documentation

## Contributing

This is a complete, self-contained organ donation management system. All CRUD operations are implemented across the 5-page architecture as specified.