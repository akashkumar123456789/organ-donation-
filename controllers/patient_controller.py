from database.connection import Database

class PatientController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = "SELECT * FROM patients"
        results = self.db.execute_query(query)
        patients = []
        for row in results:
            patients.append({
                'id': row[0],
                'name': row[1],
                'blood_group': row[2],
                'organ_needed': row[3],
                'urgency_level': row[4],
                'contact': row[5],
                'status': row[6]
            })
        return {'patients': patients}

    def create(self, data):
        query = "INSERT INTO patients (name, blood_group, organ_needed, urgency_level, contact) VALUES (?, ?, ?, ?, ?)"
        params = (data['name'], data['blood_group'], data['organ_needed'], 
                 data.get('urgency_level', 5), data.get('contact', ''))
        patient_id = self.db.execute_insert(query, params)
        return {'success': True, 'id': patient_id}

    def update(self, patient_id, data):
        # Get current patient data
        query = "SELECT * FROM patients WHERE id=?"
        result = self.db.execute_query(query, (patient_id,))
        if not result:
            return {'success': False, 'error': 'Patient not found'}
        
        current = result[0]
        # Update only provided fields
        name = data.get('name', current[1])
        blood_group = data.get('blood_group', current[2])
        organ_needed = data.get('organ_needed', current[3])
        urgency_level = data.get('urgency_level', current[4])
        contact = data.get('contact', current[5])
        status = data.get('status', current[6])
        
        query = "UPDATE patients SET name=?, blood_group=?, organ_needed=?, urgency_level=?, contact=?, status=? WHERE id=?"
        params = (name, blood_group, organ_needed, urgency_level, contact, status, patient_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, patient_id):
        query = "DELETE FROM patients WHERE id=?"
        self.db.execute_query(query, (patient_id,))
        return {'success': True}