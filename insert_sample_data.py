#!/usr/bin/env python3
from database.connection import Database

def insert_sample_data():
    db = Database()
    
    # Insert donors
    donors = [
        ("John Smith", "O+", "Kidney", "555-0101", "Available"),
        ("Sarah Johnson", "A+", "Liver", "555-0102", "Available"),
        ("Mike Davis", "B+", "Heart", "555-0103", "Available"),
        ("Lisa Wilson", "AB+", "Kidney", "555-0104", "Available"),
        ("Tom Brown", "O-", "Liver", "555-0105", "Available")
    ]
    
    for donor in donors:
        db.execute_insert(
            "INSERT INTO donors (name, blood_group, organ_type, contact, status) VALUES (?, ?, ?, ?, ?)",
            donor
        )
    
    # Insert patients
    patients = [
        ("Emily Chen", "O+", "Kidney", 8, "555-0201", "Waiting"),
        ("David Miller", "A+", "Liver", 9, "555-0202", "Waiting"),
        ("Anna Garcia", "B+", "Heart", 10, "555-0203", "Waiting"),
        ("Robert Taylor", "AB+", "Kidney", 7, "555-0204", "Waiting"),
        ("Maria Rodriguez", "O-", "Liver", 6, "555-0205", "Waiting")
    ]
    
    for patient in patients:
        db.execute_insert(
            "INSERT INTO patients (name, blood_group, organ_needed, urgency_level, contact, status) VALUES (?, ?, ?, ?, ?, ?)",
            patient
        )
    
    # Insert hospitals
    hospitals = [
        ("City General Hospital", "Downtown", 50, "Active"),
        ("St. Mary's Medical Center", "Westside", 30, "Active"),
        ("University Hospital", "Campus", 40, "Active"),
        ("Regional Medical Center", "Northside", 25, "Full"),
        ("Community Hospital", "Southside", 20, "Maintenance")
    ]
    
    for hospital in hospitals:
        db.execute_insert(
            "INSERT INTO hospitals (name, location, capacity, operating_status) VALUES (?, ?, ?, ?)",
            hospital
        )
    
    # Insert matches
    matches = [
        (1, 1, 1, "Surgery"),
        (2, 2, 2, "Procurement"),
        (3, 3, 3, "Initiated"),
        (4, 4, 1, "Surgery"),
        (5, 5, 2, "Completed")
    ]
    
    for match in matches:
        db.execute_insert(
            "INSERT INTO matches (donor_id, patient_id, hospital_id, stage) VALUES (?, ?, ?, ?)",
            match
        )
    
    # Insert records
    records = [
        (1, "2024-01-15", "Success", "Kidney transplant completed successfully", "Patient recovering well"),
        (4, "2024-01-20", "Success", "Kidney transplant completed", "Follow-up scheduled"),
        (5, "2024-01-10", "Success", "Liver transplant successful", "Patient discharged")
    ]
    
    for record in records:
        db.execute_insert(
            "INSERT INTO records (match_id, surgery_date, success_status, notes, follow_up_notes) VALUES (?, ?, ?, ?, ?)",
            record
        )
    
    print("Sample data inserted successfully!")

if __name__ == "__main__":
    insert_sample_data()