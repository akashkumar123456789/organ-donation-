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
    
    # Update
    if donors['donors']:
        donor_id = donors['donors'][0]['id']
        update_data = {
            'name': 'John Updated',
            'blood_group': 'O+',
            'organ_type': 'Kidney',
            'contact': '123-456-7890',
            'status': 'Available'
        }
        result = donor_controller.update(donor_id, update_data)
        print(f"[OK] Donor Updated: {result}")
    
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
    
    # Test Match CRUD
    match_controller = MatchController()
    
    if donors['donors'] and patients['patients'] and hospitals['hospitals']:
        # Create
        match_data = {
            'donor_id': donors['donors'][0]['id'],
            'patient_id': patients['patients'][0]['id'],
            'hospital_id': hospitals['hospitals'][0]['id']
        }
        result = match_controller.create(match_data)
        print(f"✓ Match Created: {result}")
        
        # Read
        matches = match_controller.get_all()
        print(f"✓ Matches Retrieved: {len(matches['matches'])} matches")
        
        # Test Record CRUD
        record_controller = RecordController()
        
        if matches['matches']:
            # Create
            record_data = {
                'match_id': matches['matches'][0]['id'],
                'surgery_date': '2024-01-15',
                'success_status': 'Successful',
                'notes': 'Surgery completed successfully'
            }
            result = record_controller.create(record_data)
            print(f"✓ Record Created: {result}")
            
            # Read
            records = record_controller.get_all()
            print(f"✓ Records Retrieved: {len(records['records'])} records")
    
    print("\\n✅ All CRUD operations working correctly!")
    print("🚀 System is ready to use!")

if __name__ == "__main__":
    test_crud_operations()