class PatientController {
    constructor() {
        this.patients = [];
    }

    async render() {
        await this.loadPatients();
        const content = `
            <div class="page-header">
                <h1>🏥 Patient Waitlist</h1>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-danger" onclick="enhancedFeatures.exportCurrentPageToPDF()" title="Export to PDF">📄 PDF</button>
                    <button class="btn btn-primary" onclick="patientController.showCreateForm()">➕ Add New Patient</button>
                </div>
            </div>
            <div class="stats-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: rgba(243, 156, 18, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(243, 156, 18, 0.3);">
                    <h3 style="color: #f39c12; font-size: 2rem; margin-bottom: 0.5rem;">${this.patients.filter(p => p.status === 'Waiting').length}</h3>
                    <p>Waiting Patients</p>
                </div>
                <div class="stat-card" style="background: rgba(231, 76, 60, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(231, 76, 60, 0.3);">
                    <h3 style="color: #e74c3c; font-size: 2rem; margin-bottom: 0.5rem;">${this.patients.filter(p => p.urgency_level >= 8).length}</h3>
                    <p>Critical Cases</p>
                </div>
                <div class="stat-card" style="background: rgba(46, 204, 113, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(46, 204, 113, 0.3);">
                    <h3 style="color: #2ecc71; font-size: 2rem; margin-bottom: 0.5rem;">${this.patients.filter(p => p.status === 'Completed').length}</h3>
                    <p>Successful Cases</p>
                </div>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Blood Group</th>
                            <th>Organ Needed</th>
                            <th>Urgency Level</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.patients.map(patient => `
                            <tr>
                                <td>${patient.name}</td>
                                <td>${patient.blood_group}</td>
                                <td>${patient.organ_needed}</td>
                                <td><span class="urgency-${patient.urgency_level > 7 ? 'high' : patient.urgency_level > 4 ? 'medium' : 'low'}">${patient.urgency_level}/10</span></td>
                                <td>${patient.contact}</td>
                                <td><span class="status-badge status-${patient.status.toLowerCase()}">${patient.status}</span></td>
                                <td>
                                    <button class="btn btn-secondary" onclick="patientController.showEditForm(${patient.id})">Edit</button>
                                    <button class="btn btn-danger" onclick="patientController.deletePatient(${patient.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }

    async loadPatients() {
        try {
            const response = await api.getPatients();
            this.patients = response.patients;
        } catch (error) {
            console.error('Failed to load patients:', error);
        }
    }

    showCreateForm() {
        const form = `
            <h3>Add New Patient</h3>
            <form onsubmit="patientController.createPatient(event)">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Blood Group:</label>
                    <select name="blood_group" required>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Organ Needed:</label>
                    <select name="organ_needed" required>
                        <option value="Heart">Heart</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Lungs">Lungs</option>
                        <option value="Cornea">Cornea</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Urgency Level (1-10):</label>
                    <input type="number" name="urgency_level" min="1" max="10" value="5" required>
                </div>
                <div class="form-group">
                    <label>Contact:</label>
                    <input type="text" name="contact">
                </div>
                <button type="submit" class="btn btn-primary">Add Patient</button>
            </form>
        `;
        app.showModal(form);
    }

    showEditForm(id) {
        const patient = this.patients.find(p => p.id === id);
        const form = `
            <h3>Edit Patient</h3>
            <form onsubmit="patientController.updatePatient(event, ${id})">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value="${patient.name}" required>
                </div>
                <div class="form-group">
                    <label>Blood Group:</label>
                    <select name="blood_group" required>
                        <option value="A+" ${patient.blood_group === 'A+' ? 'selected' : ''}>A+</option>
                        <option value="A-" ${patient.blood_group === 'A-' ? 'selected' : ''}>A-</option>
                        <option value="B+" ${patient.blood_group === 'B+' ? 'selected' : ''}>B+</option>
                        <option value="B-" ${patient.blood_group === 'B-' ? 'selected' : ''}>B-</option>
                        <option value="AB+" ${patient.blood_group === 'AB+' ? 'selected' : ''}>AB+</option>
                        <option value="AB-" ${patient.blood_group === 'AB-' ? 'selected' : ''}>AB-</option>
                        <option value="O+" ${patient.blood_group === 'O+' ? 'selected' : ''}>O+</option>
                        <option value="O-" ${patient.blood_group === 'O-' ? 'selected' : ''}>O-</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Organ Needed:</label>
                    <select name="organ_needed" required>
                        <option value="Heart" ${patient.organ_needed === 'Heart' ? 'selected' : ''}>Heart</option>
                        <option value="Kidney" ${patient.organ_needed === 'Kidney' ? 'selected' : ''}>Kidney</option>
                        <option value="Liver" ${patient.organ_needed === 'Liver' ? 'selected' : ''}>Liver</option>
                        <option value="Lungs" ${patient.organ_needed === 'Lungs' ? 'selected' : ''}>Lungs</option>
                        <option value="Cornea" ${patient.organ_needed === 'Cornea' ? 'selected' : ''}>Cornea</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Urgency Level (1-10):</label>
                    <input type="number" name="urgency_level" min="1" max="10" value="${patient.urgency_level}" required>
                </div>
                <div class="form-group">
                    <label>Contact:</label>
                    <input type="text" name="contact" value="${patient.contact}">
                </div>
                <div class="form-group">
                    <label>Status:</label>
                    <select name="status">
                        <option value="Waiting" ${patient.status === 'Waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="Matched" ${patient.status === 'Matched' ? 'selected' : ''}>Matched</option>
                        <option value="Completed" ${patient.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update Patient</button>
            </form>
        `;
        app.showModal(form);
    }

    async createPatient(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validatePatientForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.createPatient(data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to create patient:', error);
        }
    }

    async updatePatient(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validatePatientForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.updatePatient(id, data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to update patient:', error);
        }
    }

    async deletePatient(id) {
        if (confirm('Are you sure you want to delete this patient?')) {
            try {
                await api.deletePatient(id);
                this.render();
            } catch (error) {
                console.error('Failed to delete patient:', error);
            }
        }
    }
}

window.patientController = new PatientController();