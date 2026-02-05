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
        query = "UPDATE patients SET name=?, blood_group=?, organ_needed=?, urgency_level=?, contact=?, status=? WHERE id=?"
        params = (data['name'], data['blood_group'], data['organ_needed'], 
                 data.get('urgency_level', 5), data.get('contact', ''), 
                 data.get('status', 'Waiting'), patient_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, patient_id):
        query = "DELETE FROM patients WHERE id=?"
        self.db.execute_query(query, (patient_id,))
        return {'success': True}