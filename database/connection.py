import sqlite3
import os

class Database:
    def __init__(self, db_path="organ_donation.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Check if tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='donors'")
        tables_exist = cursor.fetchone() is not None
        
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
        
        # Insert sample data if tables are newly created
        if not tables_exist:
            self._insert_sample_data(cursor)
        
        conn.commit()
        conn.close()
    
    def _insert_sample_data(self, cursor):
        # Insert donors
        donors = [
            ("John Smith", "O+", "Kidney", "555-0101", "Available"),
            ("Sarah Johnson", "A+", "Liver", "555-0102", "Available"),
            ("Mike Davis", "B+", "Heart", "555-0103", "Available"),
            ("Lisa Wilson", "AB+", "Kidney", "555-0104", "Available"),
            ("Tom Brown", "O-", "Liver", "555-0105", "Available")
        ]
        cursor.executemany("INSERT INTO donors (name, blood_group, organ_type, contact, status) VALUES (?, ?, ?, ?, ?)", donors)
        
        # Insert patients
        patients = [
            ("Emily Chen", "O+", "Kidney", 8, "555-0201", "Waiting"),
            ("David Miller", "A+", "Liver", 9, "555-0202", "Waiting"),
            ("Anna Garcia", "B+", "Heart", 10, "555-0203", "Waiting"),
            ("Robert Taylor", "AB+", "Kidney", 7, "555-0204", "Waiting"),
            ("Maria Rodriguez", "O-", "Liver", 6, "555-0205", "Waiting")
        ]
        cursor.executemany("INSERT INTO patients (name, blood_group, organ_needed, urgency_level, contact, status) VALUES (?, ?, ?, ?, ?, ?)", patients)
        
        # Insert hospitals
        hospitals = [
            ("City General Hospital", "Downtown", 50, "Active"),
            ("St. Mary's Medical Center", "Westside", 30, "Active"),
            ("University Hospital", "Campus", 40, "Active"),
            ("Regional Medical Center", "Northside", 25, "Full"),
            ("Community Hospital", "Southside", 20, "Maintenance")
        ]
        cursor.executemany("INSERT INTO hospitals (name, location, capacity, operating_status) VALUES (?, ?, ?, ?)", hospitals)
        
        # Insert matches
        matches = [
            (1, 1, 1, "Surgery"),
            (2, 2, 2, "Procurement"),
            (3, 3, 3, "Initiated"),
            (4, 4, 1, "Surgery"),
            (5, 5, 2, "Completed")
        ]
        cursor.executemany("INSERT INTO matches (donor_id, patient_id, hospital_id, stage) VALUES (?, ?, ?, ?)", matches)
        
        # Insert records
        records = [
            (1, "2024-01-15", "Successful", "Kidney transplant completed successfully", "Patient recovering well"),
            (4, "2024-01-20", "Successful", "Kidney transplant completed", "Follow-up scheduled"),
            (5, "2024-01-10", "Successful", "Liver transplant successful", "Patient discharged")
        ]
        cursor.executemany("INSERT INTO records (match_id, surgery_date, success_status, notes, follow_up_notes) VALUES (?, ?, ?, ?, ?)", records)

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