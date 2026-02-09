#!/usr/bin/env python3
"""
Comprehensive Test Suite for Organ Donation Management System
Tests all CRUD operations across all 5 pages
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(name, status):
    color = Colors.GREEN if status else Colors.RED
    symbol = "✓" if status else "✗"
    print(f"{color}{symbol} {name}{Colors.END}")

def test_donors():
    print(f"\n{Colors.BLUE}=== Testing Donors CRUD ==={Colors.END}")
    
    # CREATE
    donor_data = {
        "name": "Test Donor",
        "blood_group": "O+",
        "organ_type": "Kidney",
        "contact": "555-9999",
        "status": "Available"
    }
    response = requests.post(f"{BASE_URL}/donors", json=donor_data)
    donor_id = response.json().get('id')
    print_test("Create Donor", response.status_code == 200 and donor_id)
    
    # READ
    response = requests.get(f"{BASE_URL}/donors")
    donors = response.json().get('donors', [])
    print_test("Read Donors", len(donors) > 0)
    
    # UPDATE
    update_data = {"status": "Matched"}
    response = requests.put(f"{BASE_URL}/donors/{donor_id}", json=update_data)
    print_test("Update Donor", response.json().get('success'))
    
    # DELETE
    response = requests.delete(f"{BASE_URL}/donors/{donor_id}")
    print_test("Delete Donor", response.json().get('success'))
    
    return True

def test_patients():
    print(f"\n{Colors.BLUE}=== Testing Patients CRUD ==={Colors.END}")
    
    # CREATE
    patient_data = {
        "name": "Test Patient",
        "blood_group": "A+",
        "organ_needed": "Liver",
        "urgency_level": 8,
        "contact": "555-8888",
        "status": "Waiting"
    }
    response = requests.post(f"{BASE_URL}/patients", json=patient_data)
    patient_id = response.json().get('id')
    print_test("Create Patient", response.status_code == 200 and patient_id)
    
    # READ
    response = requests.get(f"{BASE_URL}/patients")
    patients = response.json().get('patients', [])
    print_test("Read Patients", len(patients) > 0)
    
    # UPDATE
    update_data = {"urgency_level": 9}
    response = requests.put(f"{BASE_URL}/patients/{patient_id}", json=update_data)
    print_test("Update Patient", response.json().get('success'))
    
    # DELETE
    response = requests.delete(f"{BASE_URL}/patients/{patient_id}")
    print_test("Delete Patient", response.json().get('success'))
    
    return True

def test_hospitals():
    print(f"\n{Colors.BLUE}=== Testing Hospitals CRUD ==={Colors.END}")
    
    # CREATE
    hospital_data = {
        "name": "Test Hospital",
        "location": "Test City",
        "capacity": 30,
        "operating_status": "Active"
    }
    response = requests.post(f"{BASE_URL}/hospitals", json=hospital_data)
    hospital_id = response.json().get('id')
    print_test("Create Hospital", response.status_code == 200 and hospital_id)
    
    # READ
    response = requests.get(f"{BASE_URL}/hospitals")
    hospitals = response.json().get('hospitals', [])
    print_test("Read Hospitals", len(hospitals) > 0)
    
    # UPDATE
    update_data = {"operating_status": "Full"}
    response = requests.put(f"{BASE_URL}/hospitals/{hospital_id}", json=update_data)
    print_test("Update Hospital", response.json().get('success'))
    
    # DELETE
    response = requests.delete(f"{BASE_URL}/hospitals/{hospital_id}")
    print_test("Delete Hospital", response.json().get('success'))
    
    return True

def test_matches():
    print(f"\n{Colors.BLUE}=== Testing Matches CRUD ==={Colors.END}")
    
    # CREATE
    match_data = {
        "donor_id": 1,
        "patient_id": 1,
        "hospital_id": 1
    }
    response = requests.post(f"{BASE_URL}/matches", json=match_data)
    match_id = response.json().get('id')
    print_test("Create Match", response.status_code == 200 and match_id)
    
    # READ
    response = requests.get(f"{BASE_URL}/matches")
    matches = response.json().get('matches', [])
    print_test("Read Matches", len(matches) > 0)
    
    # UPDATE
    update_data = {"stage": "Surgery"}
    response = requests.put(f"{BASE_URL}/matches/{match_id}", json=update_data)
    print_test("Update Match Stage", response.json().get('success'))
    
    # DELETE
    response = requests.delete(f"{BASE_URL}/matches/{match_id}")
    print_test("Delete Match", response.json().get('success'))
    
    return True

def test_records():
    print(f"\n{Colors.BLUE}=== Testing Records CRUD ==={Colors.END}")
    
    # CREATE
    record_data = {
        "match_id": 1,
        "surgery_date": "2024-02-05",
        "success_status": "Successful",
        "notes": "Test surgery notes"
    }
    response = requests.post(f"{BASE_URL}/records", json=record_data)
    record_id = response.json().get('id')
    print_test("Create Record", response.status_code == 200 and record_id)
    
    # READ
    response = requests.get(f"{BASE_URL}/records")
    records = response.json().get('records', [])
    print_test("Read Records", len(records) > 0)
    
    # UPDATE
    update_data = {"follow_up_notes": "Patient recovering well"}
    response = requests.put(f"{BASE_URL}/records/{record_id}", json=update_data)
    print_test("Update Record", response.json().get('success'))
    
    # DELETE
    response = requests.delete(f"{BASE_URL}/records/{record_id}")
    print_test("Delete Record", response.json().get('success'))
    
    return True

def test_dashboard():
    print(f"\n{Colors.BLUE}=== Testing Dashboard ==={Colors.END}")
    
    response = requests.get(f"{BASE_URL}/dashboard")
    dashboard = response.json().get('dashboard', [])
    print_test("Load Dashboard", response.status_code == 200)
    
    return True

def main():
    print(f"\n{Colors.YELLOW}{'='*50}")
    print("Organ Donation System - Comprehensive Test Suite")
    print(f"{'='*50}{Colors.END}\n")
    
    try:
        test_donors()
        test_patients()
        test_hospitals()
        test_matches()
        test_records()
        test_dashboard()
        
        print(f"\n{Colors.GREEN}{'='*50}")
        print("All Tests Completed Successfully!")
        print(f"{'='*50}{Colors.END}\n")
        
    except requests.exceptions.ConnectionError:
        print(f"\n{Colors.RED}Error: Cannot connect to server at {BASE_URL}")
        print(f"Please ensure the server is running with: python app.py{Colors.END}\n")
    except Exception as e:
        print(f"\n{Colors.RED}Error: {str(e)}{Colors.END}\n")

if __name__ == "__main__":
    main()
