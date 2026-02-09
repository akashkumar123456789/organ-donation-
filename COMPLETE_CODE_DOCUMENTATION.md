# Complete Code Documentation - Organ Donation Management System

## Table of Contents
1. [Backend Code](#backend-code)
2. [Frontend Code](#frontend-code)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Features Implemented](#features-implemented)

---

## Backend Code

### 1. Main Server (app.py)

```python
#!/usr/bin/env python3
import http.server
import socketserver
import json
import urllib.parse
from router import Router
from database.connection import Database

class OrganDonationServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.router = Router()
        self.db = Database()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.serve_static_file()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_PUT(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, format, *args):
        return

    def handle_api_request(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else ''
            
            response = self.router.route(self.command, self.path, body)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        except Exception as e:
            print(f"API Error: {e}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def serve_static_file(self):
        if self.path == '/':
            self.path = '/frontend/pages/index.html'
        elif not self.path.startswith('/frontend/'):
            self.path = '/frontend' + self.path
        
        try:
            super().do_GET()
        except Exception as e:
            print(f"Static file error: {e}")
            self.path = '/frontend/pages/404.html'
            try:
                super().do_GET()
            except:
                self.send_error(404)

if __name__ == "__main__":
    PORT = 8000
    
    try:
        with socketserver.TCPServer(("", PORT), OrganDonationServer) as httpd:
            httpd.allow_reuse_address = True
            print(f"✓ Server running at http://localhost:{PORT}")
            print("✓ Press Ctrl+C to stop")
            httpd.serve_forever()
    except OSError as e:
        print(f"✗ Port {PORT} is already in use")
        print("✗ Stop existing server or use different port")
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
```

### 2. Database Connection (database/connection.py)

```python
import sqlite3
import os

class Database:
    def __init__(self, db_path="organ_donation.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Donors table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS donors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                blood_group TEXT NOT NULL,
                organ_type TEXT NOT NULL,
                contact TEXT,
                status TEXT DEFAULT 'Available'
            )
        ''')
        
        # Patients table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                blood_group TEXT NOT NULL,
                organ_needed TEXT NOT NULL,
                urgency_level INTEGER DEFAULT 5,
                contact TEXT,
                status TEXT DEFAULT 'Waiting'
            )
        ''')
        
        # Hospitals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hospitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                capacity INTEGER DEFAULT 10,
                operating_status TEXT DEFAULT 'Active'
            )
        ''')
        
        # Matches table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                donor_id INTEGER,
                patient_id INTEGER,
                hospital_id INTEGER,
                stage TEXT DEFAULT 'Initiated',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (donor_id) REFERENCES donors (id),
                FOREIGN KEY (patient_id) REFERENCES patients (id),
                FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
            )
        ''')
        
        # Records table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                match_id INTEGER,
                surgery_date TEXT,
                success_status TEXT,
                notes TEXT,
                follow_up_notes TEXT,
                FOREIGN KEY (match_id) REFERENCES matches (id)
            )
        ''')
        
        conn.commit()
        conn.close()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def execute_query(self, query, params=None):
        conn = self.get_connection()
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        result = cursor.fetchall()
        conn.commit()
        conn.close()
        return result

    def execute_insert(self, query, params):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        last_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return last_id
```

---

## Database Schema

### Tables Structure

```sql
-- Donors Table
CREATE TABLE donors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    organ_type TEXT NOT NULL,
    contact TEXT,
    status TEXT DEFAULT 'Available'
);

-- Patients Table
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    organ_needed TEXT NOT NULL,
    urgency_level INTEGER DEFAULT 5,
    contact TEXT,
    status TEXT DEFAULT 'Waiting'
);

-- Hospitals Table
CREATE TABLE hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER DEFAULT 10,
    operating_status TEXT DEFAULT 'Active'
);

-- Matches Table
CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER,
    patient_id INTEGER,
    hospital_id INTEGER,
    stage TEXT DEFAULT 'Initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors (id),
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals (id)
);

-- Records Table
CREATE TABLE records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER,
    surgery_date TEXT,
    success_status TEXT,
    notes TEXT,
    follow_up_notes TEXT,
    FOREIGN KEY (match_id) REFERENCES matches (id)
);
```

### JOIN Query for Complete Profile

```sql
SELECT 
    r.id, r.match_id, r.surgery_date, r.success_status, r.notes, r.follow_up_notes,
    m.stage, m.created_at,
    d.id as donor_id, d.name as donor_name, d.blood_group as donor_blood, 
    d.organ_type, d.contact as donor_contact, d.status as donor_status,
    p.id as patient_id, p.name as patient_name, p.blood_group as patient_blood, 
    p.organ_needed, p.urgency_level, p.contact as patient_contact, p.status as patient_status,
    h.id as hospital_id, h.name as hospital_name, h.location, 
    h.capacity, h.operating_status
FROM records r
LEFT JOIN matches m ON r.match_id = m.id
LEFT JOIN donors d ON m.donor_id = d.id
LEFT JOIN patients p ON m.patient_id = p.id
LEFT JOIN hospitals h ON m.hospital_id = h.id;
```

---

## API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create new donor
- `PUT /api/donors/{id}` - Update donor (partial updates supported)
- `DELETE /api/donors/{id}` - Delete donor

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient (partial updates supported)
- `DELETE /api/patients/{id}` - Delete patient

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create new hospital
- `PUT /api/hospitals/{id}` - Update hospital (partial updates supported)
- `DELETE /api/hospitals/{id}` - Delete hospital

### Matches
- `GET /api/matches` - Get all matches with JOIN data
- `POST /api/matches` - Create new match
- `PUT /api/matches/{id}` - Update match stage
- `DELETE /api/matches/{id}` - Cancel match

### Records
- `GET /api/records` - Get all records with complete JOIN data
- `POST /api/records` - Create new record
- `PUT /api/records/{id}` - Update record
- `DELETE /api/records/{id}` - Delete record

### Export
- `GET /api/export/donors` - Export all donors as CSV
- `GET /api/export/patients` - Export all patients as CSV
- `GET /api/export/hospitals` - Export all hospitals as CSV
- `GET /api/export/matches` - Export all matches as CSV
- `GET /api/export/records` - Export all records as CSV
- `GET /api/export/all` - Export complete report as CSV
- `GET /api/export/donor/{id}` - Export single donor as CSV
- `GET /api/export/patient/{id}` - Export single patient as CSV
- `GET /api/export/hospital/{id}` - Export single hospital as CSV
- `GET /api/export/match/{id}` - Export single match as CSV
- `GET /api/export/record/{id}` - Export single record as CSV

### Dashboard
- `GET /api/dashboard` - Get dashboard data with all entities

---

## Features Implemented

### 1. Complete CRUD Operations
✅ Create, Read, Update, Delete for all 5 modules
✅ Partial update support (only update provided fields)
✅ Proper error handling

### 2. JOIN Operations
✅ Records page shows complete profile with JOIN queries
✅ Fetches donor, patient, hospital, match data in one query
✅ Beautiful modal view with color-coded sections

### 3. Individual Record Download
✅ Download button (📥) on each table row
✅ Export single record as CSV
✅ Includes all related data

### 4. Enhanced UI/UX
✅ Gradient backgrounds and animations
✅ Hover effects on all interactive elements
✅ Status badges with gradient colors
✅ Responsive design
✅ Loading spinner and notifications

### 5. Dashboard
✅ Live statistics cards
✅ Comprehensive data table
✅ CSV export for all tables
✅ Color-coded urgency levels

### 6. Sample Data
✅ 5 donors with different blood groups
✅ 5 patients with varying urgency levels
✅ 5 hospitals with different statuses
✅ 5 matches in various stages
✅ 3 medical records

---

## Running the Application

```bash
# Start server
python app.py

# Insert sample data
python insert_sample_data.py

# Run tests
python test_all_operations.py

# Access application
http://localhost:8000
```

---

## Technology Stack

- **Backend**: Python 3.8+ with HTTP server
- **Database**: SQLite3 with relational schema
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Architecture**: RESTful API with MVC pattern
- **Features**: Real-time updates, CSV export, responsive design

---

## Project Structure

```
organ-donation-/
├── app.py                          # Main HTTP server
├── router.py                       # API routing
├── insert_sample_data.py          # Data seeding
├── test_all_operations.py         # Test suite
├── controllers/                    # Business logic
│   ├── donor_controller.py
│   ├── patient_controller.py
│   ├── hospital_controller.py
│   ├── match_controller.py
│   ├── record_controller.py
│   └── export_controller.py
├── database/
│   └── connection.py              # SQLite setup
└── frontend/
    ├── pages/
    │   └── index.html             # Main app
    └── assets/
        ├── css/
        │   └── style.css          # Enhanced styles
        └── js/
            ├── app.js             # Main controller
            ├── enhanced-features.js
            ├── services/
            │   └── api.js
            └── controllers/
                ├── dashboardController.js
                ├── donorController.js
                ├── patientController.js
                ├── hospitalController.js
                ├── matchController.js
                └── recordController.js
```

---

**Built with ❤️ for saving lives through technology**
