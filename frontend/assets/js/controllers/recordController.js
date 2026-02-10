class RecordController {
    constructor() {
        this.records = [];
        this.matches = [];
    }

    async render() {
        await this.loadData();
        const content = `
            <div class="page-header">
                <h1>📋 Medical Records Log</h1>
                <button class="btn btn-primary" onclick="recordController.showCreateForm()">Add Surgery Report</button>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Record ID</th>
                            <th>Surgery Date</th>
                            <th>Success Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.records.map(record => `
                            <tr>
                                <td>#${record.id}</td>
                                <td>${record.surgery_date || 'Not Set'}</td>
                                <td><span class="status-badge status-${record.success_status ? record.success_status.toLowerCase() : 'pending'}">${record.success_status || 'Pending'}</span></td>
                                <td>
                                    <button class="btn btn-primary" onclick="recordController.showProfile(${record.id})" title="View Full Profile">👁️ View</button>
                                    <button class="btn btn-secondary" onclick="recordController.showEditForm(${record.id})">Edit</button>
                                    <button class="btn btn-danger" onclick="recordController.deleteRecord(${record.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }

    async loadData() {
        try {
            const [recordResponse, matchResponse] = await Promise.all([
                api.getRecords(),
                api.getMatches()
            ]);
            this.records = recordResponse.records || [];
            this.matches = matchResponse.matches || [];
        } catch (error) {
            console.error('Failed to load data:', error);
            this.records = [];
            this.matches = [];
        }
    }

    showCreateForm() {
        const completedMatches = this.matches.filter(m => m.stage === 'Completed');
        const form = `
            <h3>Add Surgery Success Report</h3>
            <form onsubmit="recordController.createRecord(event)">
                <div class="form-group">
                    <label>Match:</label>
                    <select name="match_id" required>
                        <option value="">Select Completed Match</option>
                        ${completedMatches.map(match => 
                            `<option value="${match.id}">${match.donor_name} → ${match.patient_name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Surgery Date:</label>
                    <input type="date" name="surgery_date" required>
                </div>
                <div class="form-group">
                    <label>Success Status:</label>
                    <select name="success_status" required>
                        <option value="Successful">Successful</option>
                        <option value="Partial Success">Partial Success</option>
                        <option value="Failed">Failed</option>
                        <option value="Complications">Complications</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Surgery Notes:</label>
                    <textarea name="notes" rows="4" placeholder="Enter surgery details and observations..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Add Record</button>
            </form>
        `;
        app.showModal(form);
    }

    showEditForm(id) {
        const record = this.records.find(r => r.id === id);
        const form = `
            <h3>Edit Medical Record</h3>
            <form onsubmit="recordController.updateRecord(event, ${id})">
                <div class="form-group">
                    <label>Surgery Date:</label>
                    <input type="date" name="surgery_date" value="${record.surgery_date || ''}" required>
                </div>
                <div class="form-group">
                    <label>Success Status:</label>
                    <select name="success_status" required>
                        <option value="Successful" ${record.success_status === 'Successful' ? 'selected' : ''}>Successful</option>
                        <option value="Partial Success" ${record.success_status === 'Partial Success' ? 'selected' : ''}>Partial Success</option>
                        <option value="Failed" ${record.success_status === 'Failed' ? 'selected' : ''}>Failed</option>
                        <option value="Complications" ${record.success_status === 'Complications' ? 'selected' : ''}>Complications</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Surgery Notes:</label>
                    <textarea name="notes" rows="4">${record.notes || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Follow-up Notes (6 months later):</label>
                    <textarea name="follow_up_notes" rows="3" placeholder="Add follow-up observations...">${record.follow_up_notes || ''}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Update Record</button>
            </form>
        `;
        app.showModal(form);
    }

    async createRecord(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validateRecordForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.createRecord(data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to create record:', error);
        }
    }

    async updateRecord(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validateRecordForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.updateRecord(id, data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to update record:', error);
        }
    }

    async deleteRecord(id) {
        if (confirm('Are you sure you want to delete this medical record?')) {
            try {
                await api.deleteRecord(id);
                this.render();
            } catch (error) {
                console.error('Failed to delete record:', error);
            }
        }
    }

    showProfile(id) {
        const record = this.records.find(r => r.id === id);
        const profile = `
            <h2 style="text-align: center; color: #740A03; margin-bottom: 2rem;">📋 Complete Medical Record Profile</h2>
            
            <div style="display: grid; gap: 1.5rem;">
                <!-- Record Information -->
                <div style="background: linear-gradient(135deg, #6f42c1, #5a32a3); padding: 1.5rem; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        📝 Record Information
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>Record ID:</strong> #${record.id}</div>
                        <div><strong>Match ID:</strong> #${record.match_id}</div>
                        <div><strong>Surgery Date:</strong> ${record.surgery_date || 'Not Set'}</div>
                        <div><strong>Success Status:</strong> <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 10px;">${record.success_status || 'Pending'}</span></div>
                        <div style="grid-column: 1 / -1;"><strong>Match Stage:</strong> ${record.match_stage || 'N/A'}</div>
                        <div style="grid-column: 1 / -1;"><strong>Match Created:</strong> ${record.match_created ? new Date(record.match_created).toLocaleString() : 'N/A'}</div>
                    </div>
                </div>

                <!-- Donor Information -->
                <div style="background: linear-gradient(135deg, #28a745, #20c997); padding: 1.5rem; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        🩸 Donor Profile
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>ID:</strong> #${record.donor.id}</div>
                        <div><strong>Name:</strong> ${record.donor.name}</div>
                        <div><strong>Blood Group:</strong> ${record.donor.blood_group}</div>
                        <div><strong>Organ Type:</strong> ${record.donor.organ_type}</div>
                        <div><strong>Contact:</strong> ${record.donor.contact}</div>
                        <div><strong>Status:</strong> <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 10px;">${record.donor.status}</span></div>
                    </div>
                </div>

                <!-- Patient Information -->
                <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 1.5rem; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        🫀 Patient Profile
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>ID:</strong> #${record.patient.id}</div>
                        <div><strong>Name:</strong> ${record.patient.name}</div>
                        <div><strong>Blood Group:</strong> ${record.patient.blood_group}</div>
                        <div><strong>Organ Needed:</strong> ${record.patient.organ_needed}</div>
                        <div><strong>Urgency Level:</strong> <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 10px;">${record.patient.urgency_level}/10</span></div>
                        <div><strong>Contact:</strong> ${record.patient.contact}</div>
                        <div style="grid-column: 1 / -1;"><strong>Status:</strong> <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 10px;">${record.patient.status}</span></div>
                    </div>
                </div>

                <!-- Hospital Information -->
                <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 1.5rem; border-radius: 15px; color: white;">
                    <h3 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        🏥 Hospital Details
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div><strong>ID:</strong> #${record.hospital.id}</div>
                        <div><strong>Name:</strong> ${record.hospital.name}</div>
                        <div><strong>Location:</strong> ${record.hospital.location}</div>
                        <div><strong>Capacity:</strong> ${record.hospital.capacity} beds</div>
                        <div style="grid-column: 1 / -1;"><strong>Operating Status:</strong> <span style="background: rgba(255,255,255,0.3); padding: 0.3rem 0.8rem; border-radius: 10px;">${record.hospital.operating_status}</span></div>
                    </div>
                </div>

                <!-- Surgery Notes -->
                <div style="background: rgba(243, 244, 244, 0.95); padding: 1.5rem; border-radius: 15px; color: #280905;">
                    <h3 style="margin-bottom: 1rem; color: #740A03;">📝 Surgery Notes</h3>
                    <p style="background: white; padding: 1rem; border-radius: 10px; min-height: 60px;">${record.notes || 'No notes available'}</p>
                </div>

                <!-- Follow-up Notes -->
                <div style="background: rgba(243, 244, 244, 0.95); padding: 1.5rem; border-radius: 15px; color: #280905;">
                    <h3 style="margin-bottom: 1rem; color: #740A03;">📊 Follow-up Notes</h3>
                    <p style="background: white; padding: 1rem; border-radius: 10px; min-height: 60px;">${record.follow_up_notes || 'No follow-up notes yet'}</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="app.hideModal()" style="padding: 1rem 3rem;">Close</button>
            </div>
        `;
        app.showModal(profile);
    }
}

window.recordController = new RecordController();