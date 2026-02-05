from database.connection import Database

class MatchController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = """
        SELECT m.*, d.name as donor_name, p.name as patient_name, h.name as hospital_name
        FROM matches m
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
        """
        results = self.db.execute_query(query)
        matches = []
        for row in results:
            matches.append({
                'id': row[0],
                'donor_id': row[1],
                'patient_id': row[2],
                'hospital_id': row[3],
                'stage': row[4],
                'created_at': row[5],
                'donor_name': row[6],
                'patient_name': row[7],
                'hospital_name': row[8]
            })
        return {'matches': matches}

    def create(self, data):
        query = "INSERT INTO matches (donor_id, patient_id, hospital_id) VALUES (?, ?, ?)"
        params = (data['donor_id'], data['patient_id'], data['hospital_id'])
        match_id = self.db.execute_insert(query, params)
        return {'success': True, 'id': match_id}

    def update(self, match_id, data):
        query = "UPDATE matches SET stage=? WHERE id=?"
        params = (data.get('stage', 'Initiated'), match_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, match_id):
        query = "DELETE FROM matches WHERE id=?"
        self.db.execute_query(query, (match_id,))
        return {'success': True}