from database.connection import Database

class RecordController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = """
        SELECT r.*, m.donor_id, m.patient_id, d.name as donor_name, p.name as patient_name
        FROM records r
        LEFT JOIN matches m ON r.match_id = m.id
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        """
        results = self.db.execute_query(query)
        records = []
        for row in results:
            records.append({
                'id': row[0],
                'match_id': row[1],
                'surgery_date': row[2],
                'success_status': row[3],
                'notes': row[4],
                'follow_up_notes': row[5],
                'donor_id': row[6],
                'patient_id': row[7],
                'donor_name': row[8],
                'patient_name': row[9]
            })
        return {'records': records}

    def create(self, data):
        query = "INSERT INTO records (match_id, surgery_date, success_status, notes) VALUES (?, ?, ?, ?)"
        params = (data['match_id'], data['surgery_date'], data['success_status'], data.get('notes', ''))
        record_id = self.db.execute_insert(query, params)
        return {'success': True, 'id': record_id}

    def update(self, record_id, data):
        query = "UPDATE records SET surgery_date=?, success_status=?, notes=?, follow_up_notes=? WHERE id=?"
        params = (data.get('surgery_date'), data.get('success_status'), 
                 data.get('notes', ''), data.get('follow_up_notes', ''), record_id)
        self.db.execute_query(query, params)
        return {'success': True}

    def delete(self, record_id):
        query = "DELETE FROM records WHERE id=?"
        self.db.execute_query(query, (record_id,))
        return {'success': True}