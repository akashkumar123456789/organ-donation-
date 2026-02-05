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
        query = "UPDATE donors SET name=?, blood_group=?, organ_type=?, contact=?, status=? WHERE id=?"
        params = (data['name'], data['blood_group'], data['organ_type'], 
                 data.get('contact', ''), data.get('status', 'Available'), donor_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, donor_id):
        query = "DELETE FROM donors WHERE id=?"
        self.db.execute_query(query, (donor_id,))
        return {'success': True}