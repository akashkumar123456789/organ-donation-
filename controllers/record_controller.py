from database.connection import Database

class RecordController:
    def __init__(self):
        self.db = Database()

    def get_all(self):
        query = """
        SELECT 
            r.id, r.match_id, r.surgery_date, r.success_status, r.notes, r.follow_up_notes,
            m.stage, m.created_at,
            d.id as donor_id, d.name as donor_name, d.blood_group as donor_blood, 
            d.organ_type, d.contact as donor_contact, d.status as donor_status,
            p.id as patient_id, p.name as patient_name, p.blood_group as patient_blood, 
            p.organ_needed, p.urgency_level, p.contact as patient_contact, p.status as patient_status,
            h.id as hospital_id, h.name as hospital_name, h.location, 
            h.capacity, h.operating_status
        FROM records r
        LEFT JOIN matches m ON r.match_id = m.id
        LEFT JOIN donors d ON m.donor_id = d.id
        LEFT JOIN patients p ON m.patient_id = p.id
        LEFT JOIN hospitals h ON m.hospital_id = h.id
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
                'match_stage': row[6],
                'match_created': row[7],
                'donor': {
                    'id': row[8],
                    'name': row[9],
                    'blood_group': row[10],
                    'organ_type': row[11],
                    'contact': row[12],
                    'status': row[13]
                },
                'patient': {
                    'id': row[14],
                    'name': row[15],
                    'blood_group': row[16],
                    'organ_needed': row[17],
                    'urgency_level': row[18],
                    'contact': row[19],
                    'status': row[20]
                },
                'hospital': {
                    'id': row[21],
                    'name': row[22],
                    'location': row[23],
                    'capacity': row[24],
                    'operating_status': row[25]
                }
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