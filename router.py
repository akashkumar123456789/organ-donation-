import json
from controllers.donor_controller import DonorController
from controllers.patient_controller import PatientController
from controllers.hospital_controller import HospitalController
from controllers.match_controller import MatchController
from controllers.record_controller import RecordController
from controllers.export_controller import ExportController

class Router:
    def __init__(self):
        self.donor_controller = DonorController()
        self.patient_controller = PatientController()
        self.hospital_controller = HospitalController()
        self.match_controller = MatchController()
        self.record_controller = RecordController()
        self.export_controller = ExportController()

    def route(self, method, path, body):
        try:
            data = json.loads(body) if body else {}
        except:
            data = {}

        # Donor routes
        if path.startswith('/api/donors'):
            if method == 'GET':
                return self.donor_controller.get_all()
            elif method == 'POST':
                return self.donor_controller.create(data)
            elif method == 'PUT':
                donor_id = path.split('/')[-1]
                return self.donor_controller.update(donor_id, data)
            elif method == 'DELETE':
                donor_id = path.split('/')[-1]
                return self.donor_controller.delete(donor_id)

        # Patient routes
        elif path.startswith('/api/patients'):
            if method == 'GET':
                return self.patient_controller.get_all()
            elif method == 'POST':
                return self.patient_controller.create(data)
            elif method == 'PUT':
                patient_id = path.split('/')[-1]
                return self.patient_controller.update(patient_id, data)
            elif method == 'DELETE':
                patient_id = path.split('/')[-1]
                return self.patient_controller.delete(patient_id)

        # Hospital routes
        elif path.startswith('/api/hospitals'):
            if method == 'GET':
                return self.hospital_controller.get_all()
            elif method == 'POST':
                return self.hospital_controller.create(data)
            elif method == 'PUT':
                hospital_id = path.split('/')[-1]
                return self.hospital_controller.update(hospital_id, data)
            elif method == 'DELETE':
                hospital_id = path.split('/')[-1]
                return self.hospital_controller.delete(hospital_id)

        # Match routes
        elif path.startswith('/api/matches'):
            if method == 'GET':
                return self.match_controller.get_all()
            elif method == 'POST':
                return self.match_controller.create(data)
            elif method == 'PUT':
                match_id = path.split('/')[-1]
                return self.match_controller.update(match_id, data)
            elif method == 'DELETE':
                match_id = path.split('/')[-1]
                return self.match_controller.delete(match_id)

        # Record routes
        elif path.startswith('/api/records'):
            if method == 'GET':
                return self.record_controller.get_all()
            elif method == 'POST':
                return self.record_controller.create(data)
            elif method == 'PUT':
                record_id = path.split('/')[-1]
                return self.record_controller.update(record_id, data)
            elif method == 'DELETE':
                record_id = path.split('/')[-1]
                return self.record_controller.delete(record_id)

        # Export routes
        elif path.startswith('/api/export'):
            if method == 'GET':
                parts = path.split('/')
                if len(parts) == 4:
                    # /api/export/donors
                    table_name = parts[3]
                    return self.export_controller.export_csv(table_name)
                elif len(parts) == 5:
                    # /api/export/donor/1
                    table_name = parts[3]
                    record_id = parts[4]
                    return self.export_controller.export_single(table_name, record_id)

        # Dashboard route
        elif path.startswith('/api/dashboard'):
            if method == 'GET':
                return self.export_controller.get_dashboard_data()

        return {"error": "Route not found"}