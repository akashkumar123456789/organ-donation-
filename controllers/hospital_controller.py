from database.connection import Database

class HospitalController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = "SELECT * FROM hospitals"
        results = self.db.execute_query(query)
        hospitals = []
        for row in results:
            hospitals.append({
                'id': row[0],
                'name': row[1],
                'location': row[2],
                'capacity': row[3],
                'operating_status': row[4]
            })
        return {'hospitals': hospitals}

    def create(self, data):
        query = "INSERT INTO hospitals (name, location, capacity) VALUES (?, ?, ?)"
        params = (data['name'], data['location'], data.get('capacity', 10))
        hospital_id = self.db.execute_insert(query, params)
        return {'success': True, 'id': hospital_id}

    def update(self, hospital_id, data):
        # Get current hospital data
        query = "SELECT * FROM hospitals WHERE id=?"
        result = self.db.execute_query(query, (hospital_id,))
        if not result:
            return {'success': False, 'error': 'Hospital not found'}
        
        current = result[0]
        # Update only provided fields
        name = data.get('name', current[1])
        location = data.get('location', current[2])
        capacity = data.get('capacity', current[3])
        operating_status = data.get('operating_status', current[4])
        
        query = "UPDATE hospitals SET name=?, location=?, capacity=?, operating_status=? WHERE id=?"
        params = (name, location, capacity, operating_status, hospital_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, hospital_id):
        query = "DELETE FROM hospitals WHERE id=?"
        self.db.execute_query(query, (hospital_id,))
        return {'success': True}