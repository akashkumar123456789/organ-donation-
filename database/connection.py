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