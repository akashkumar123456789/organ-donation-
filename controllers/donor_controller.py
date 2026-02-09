from database.connection import Database

class DonorController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = "SELECT * FROM donors"
        results = self.db.execute_query(query)
        donors = []
        for row in results:
            donors.append({
                'id': row[0],
                'name': row[1],
                'blood_group': row[2],
                'organ_type': row[3],
                'contact': row[4],
                'status': row[5]
            })
        return {'donors': donors}

    def create(self, data):
        query = "INSERT INTO donors (name, blood_group, organ_type, contact) VALUES (?, ?, ?, ?)"
        params = (data['name'], data['blood_group'], data['organ_type'], data.get('contact', ''))
        donor_id = self.db.execute_insert(query, params)
        return {'success': True, 'id': donor_id}

    def update(self, donor_id, data):
        # Get current donor data
        query = "SELECT * FROM donors WHERE id=?"
        result = self.db.execute_query(query, (donor_id,))
        if not result:
            return {'success': False, 'error': 'Donor not found'}
        
        current = result[0]
        # Update only provided fields
        name = data.get('name', current[1])
        blood_group = data.get('blood_group', current[2])
        organ_type = data.get('organ_type', current[3])
        contact = data.get('contact', current[4])
        status = data.get('status', current[5])
        
        query = "UPDATE donors SET name=?, blood_group=?, organ_type=?, contact=?, status=? WHERE id=?"
        params = (name, blood_group, organ_type, contact, status, donor_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, donor_id):
        query = "DELETE FROM donors WHERE id=?"
        self.db.execute_query(query, (donor_id,))
        return {'success': True}