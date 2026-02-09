from database.connection import Database
import csv
import io
import json
from datetime import datetime

class ExportController:
    def __init__(self):
        self.db = Database()

    def export_csv(self, table_name):
        if table_name == 'donors':
            return self._export_donors_csv()
        elif table_name == 'patients':
            return self._export_patients_csv()
        elif table_name == 'hospitals':
            return self._export_hospitals_csv()
        elif table_name == 'matches':
            return self._export_matches_csv()
        elif table_name == 'records':
            return self._export_records_csv()
        elif table_name == 'all':
            return self._export_all_csv()
        return {'error': 'Invalid table name'}
    
    def export_single(self, table_name, record_id):
        if table_name == 'donor':
            return self._export_single_donor(record_id)
        elif table_name == 'patient':
            return self._export_single_patient(record_id)
        elif table_name == 'hospital':
            return self._export_single_hospital(record_id)
        elif table_name == 'match':
            return self._export_single_match(record_id)
        elif table_name == 'record':
            return self._export_single_record(record_id)
        return {'error': 'Invalid table name'}
    
    def _export_single_donor(self, donor_id):
        query = "SELECT * FROM donors WHERE id=?"
        results = self.db.execute_query(query, (donor_id,))
        if not results:
            return {'error': 'Donor not found'}
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Blood Group', 'Organ Type', 'Contact', 'Status'])
        writer.writerow(results[0])
        
        return {'csv_data': output.getvalue(), 'filename': f'donor_{donor_id}_{datetime.now().strftime("%Y%m%d")}.csv'}
    
    def _export_single_patient(self, patient_id):
        query = "SELECT * FROM patients WHERE id=?"
        results = self.db.execute_query(query, (patient_id,))
        if not results:
            return {'error': 'Patient not found'}
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Blood Group', 'Organ Needed', 'Urgency Level', 'Contact', 'Status'])
        writer.writerow(results[0])
        
        return {'csv_data': output.getvalue(), 'filename': f'patient_{patient_id}_{datetime.now().strftime("%Y%m%d")}.csv'}
    
    def _export_single_hospital(self, hospital_id):
        query = "SELECT * FROM hospitals WHERE id=?"
        results = self.db.execute_query(query, (hospital_id,))
        if not results:
            return {'error': 'Hospital not found'}
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Location', 'Capacity', 'Operating Status'])
        writer.writerow(results[0])
        
        return {'csv_data': output.getvalue(), 'filename': f'hospital_{hospital_id}_{datetime.now().strftime("%Y%m%d")}.csv'}
    
    def _export_single_match(self, match_id):
        query = """
        SELECT m.id, d.name, p.name, h.name, m.stage, m.created_at
        FROM matches m
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
        WHERE m.id=?
        """
        results = self.db.execute_query(query, (match_id,))
        if not results:
            return {'error': 'Match not found'}
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Donor', 'Patient', 'Hospital', 'Stage', 'Created At'])
        writer.writerow(results[0])
        
        return {'csv_data': output.getvalue(), 'filename': f'match_{match_id}_{datetime.now().strftime("%Y%m%d")}.csv'}
    
    def _export_single_record(self, record_id):
        query = """
        SELECT r.id, d.name, p.name, r.surgery_date, r.success_status, r.notes, r.follow_up_notes
        FROM records r
        LEFT JOIN matches m ON r.match_id = m.id
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        WHERE r.id=?
        """
        results = self.db.execute_query(query, (record_id,))
        if not results:
            return {'error': 'Record not found'}
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Donor', 'Patient', 'Surgery Date', 'Success Status', 'Notes', 'Follow-up Notes'])
        writer.writerow(results[0])
        
        return {'csv_data': output.getvalue(), 'filename': f'record_{record_id}_{datetime.now().strftime("%Y%m%d")}.csv'}

    def _export_donors_csv(self):
        query = "SELECT * FROM donors"
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Blood Group', 'Organ Type', 'Contact', 'Status'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'donors_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def _export_patients_csv(self):
        query = "SELECT * FROM patients"
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Blood Group', 'Organ Needed', 'Urgency Level', 'Contact', 'Status'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'patients_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def _export_hospitals_csv(self):
        query = "SELECT * FROM hospitals"
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Name', 'Location', 'Capacity', 'Operating Status'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'hospitals_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def _export_matches_csv(self):
        query = """
        SELECT m.id, d.name as donor_name, p.name as patient_name, 
               h.name as hospital_name, m.stage, m.created_at
        FROM matches m
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
        """
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Donor', 'Patient', 'Hospital', 'Stage', 'Created At'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'matches_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def _export_records_csv(self):
        query = """
        SELECT r.id, d.name as donor_name, p.name as patient_name,
               r.surgery_date, r.success_status, r.notes, r.follow_up_notes
        FROM records r
        LEFT JOIN matches m ON r.match_id = m.id
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        """
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID', 'Donor', 'Patient', 'Surgery Date', 'Success Status', 'Notes', 'Follow-up Notes'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'records_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def _export_all_csv(self):
        # Combined report with all data
        query = """
        SELECT 
            d.name as donor_name, d.blood_group as donor_blood, d.organ_type,
            p.name as patient_name, p.blood_group as patient_blood, p.organ_needed, p.urgency_level,
            h.name as hospital_name, h.location,
            m.stage, m.created_at,
            r.surgery_date, r.success_status
        FROM matches m
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
        LEFT JOIN records r ON r.match_id = m.id
        """
        results = self.db.execute_query(query)
        
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Donor', 'Donor Blood', 'Organ Type', 'Patient', 'Patient Blood', 
                        'Organ Needed', 'Urgency', 'Hospital', 'Location', 'Stage', 
                        'Created', 'Surgery Date', 'Status'])
        
        for row in results:
            writer.writerow(row)
        
        return {'csv_data': output.getvalue(), 'filename': f'full_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'}

    def get_dashboard_data(self):
        # Join all tables for dashboard view
        query = """
        SELECT 
            d.id as donor_id, d.name as donor_name, d.blood_group as donor_blood, d.organ_type, d.status as donor_status,
            p.id as patient_id, p.name as patient_name, p.blood_group as patient_blood, p.organ_needed, p.urgency_level, p.status as patient_status,
            h.id as hospital_id, h.name as hospital_name, h.location, h.operating_status,
            m.id as match_id, m.stage, m.created_at,
            r.id as record_id, r.surgery_date, r.success_status, r.notes
        FROM matches m
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
        LEFT JOIN records r ON r.match_id = m.id
        ORDER BY m.created_at DESC
        """
        results = self.db.execute_query(query)
        
        dashboard_data = []
        for row in results:
            dashboard_data.append({
                'donor': {'id': row[0], 'name': row[1], 'blood_group': row[2], 'organ_type': row[3], 'status': row[4]},
                'patient': {'id': row[5], 'name': row[6], 'blood_group': row[7], 'organ_needed': row[8], 'urgency_level': row[9], 'status': row[10]},
                'hospital': {'id': row[11], 'name': row[12], 'location': row[13], 'operating_status': row[14]},
                'match': {'id': row[15], 'stage': row[16], 'created_at': row[17]},
                'record': {'id': row[18], 'surgery_date': row[19], 'success_status': row[20], 'notes': row[21]}
            })
        
        return {'dashboard': dashboard_data}