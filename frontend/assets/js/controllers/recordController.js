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
                            <th>Donor</th>
                            <th>Patient</th>
                            <th>Surgery Date</th>
                            <th>Success Status</th>
                            <th>Notes</th>
                            <th>Follow-up</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.records.map(record => `
                            <tr>
                                <td>${record.donor_name || 'Unknown'}</td>
                                <td>${record.patient_name || 'Unknown'}</td>
                                <td>${record.surgery_date || 'Not Set'}</td>
                                <td><span class="status-badge status-${record.success_status ? record.success_status.toLowerCase() : 'pending'}">${record.success_status || 'Pending'}</span></td>
                                <td>${record.notes ? record.notes.substring(0, 50) + '...' : 'No notes'}</td>
                                <td>${record.follow_up_notes ? 'Yes' : 'No'}</td>
                                <td>
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
}

window.recordController = new RecordController();