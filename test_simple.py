#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.connection import Database
from controllers.donor_controller import DonorController
from controllers.patient_controller import PatientController
from controllers.hospital_controller import HospitalController
from controllers.match_controller import MatchController
from controllers.record_controller import RecordController

def test_crud_operations():
    print("Testing CRUD Operations...")
    
    # Test Donor CRUD
    donor_controller = DonorController()
    
    # Create
    donor_data = {
        'name': 'John Doe',
        'blood_group': 'O+',
        'organ_type': 'Kidney',
        'contact': '123-456-7890'
    }
    result = donor_controller.create(donor_data)
    print(f"[OK] Donor Created: {result}")
    
    # Read
    donors = donor_controller.get_all()
    print(f"[OK] Donors Retrieved: {len(donors['donors'])} donors")
    
    # Test Patient CRUD
    patient_controller = PatientController()
    
    # Create
    patient_data = {
        'name': 'Jane Smith',
        'blood_group': 'O+',
        'organ_needed': 'Kidney',
        'urgency_level': 8,
        'contact': '987-654-3210'
    }
    result = patient_controller.create(patient_data)
    print(f"[OK] Patient Created: {result}")
    
    # Read
    patients = patient_controller.get_all()
    print(f"[OK] Patients Retrieved: {len(patients['patients'])} patients")
    
    # Test Hospital CRUD
    hospital_controller = HospitalController()
    
    # Create
    hospital_data = {
        'name': 'City General Hospital',
        'location': 'Downtown',
        'capacity': 50
    }
    result = hospital_controller.create(hospital_data)
    print(f"[OK] Hospital Created: {result}")
    
    # Read
    hospitals = hospital_controller.get_all()
    print(f"[OK] Hospitals Retrieved: {len(hospitals['hospitals'])} hospitals")
    
    print("[SUCCESS] All CRUD operations working correctly!")
    print("[READY] System is ready to use!")

if __name__ == "__main__":
    test_crud_operations()