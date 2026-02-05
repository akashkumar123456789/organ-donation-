class MatchController {
    constructor() {
        this.matches = [];
        this.donors = [];
        this.patients = [];
        this.hospitals = [];
    }

    async render() {
        await this.loadData();
        const content = `
            <div class="page-header">
                <h1>🔄 Organ Match Tracker</h1>
                <button class="btn btn-primary" onclick="matchController.showCreateForm()">Initiate New Match</button>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Donor</th>
                            <th>Patient</th>
                            <th>Hospital</th>
                            <th>Stage</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.matches.map(match => `
                            <tr>
                                <td>${match.donor_name || 'Unknown'}</td>
                                <td>${match.patient_name || 'Unknown'}</td>
                                <td>${match.hospital_name || 'Unknown'}</td>
                                <td><span class="status-badge status-${match.stage.toLowerCase().replace(' ', '')}">${match.stage}</span></td>
                                <td>${new Date(match.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick="matchController.showEditForm(${match.id})">Update Stage</button>
                                    <button class="btn btn-danger" onclick="matchController.deleteMatch(${match.id})">Cancel</button>
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
            const [matchResponse, donorResponse, patientResponse, hospitalResponse] = await Promise.all([
                api.getMatches(),
                api.getDonors(),
                api.getPatients(),
                api.getHospitals()
            ]);
            this.matches = matchResponse.matches || [];
            this.donors = donorResponse.donors || [];
            this.patients = patientResponse.patients || [];
            this.hospitals = hospitalResponse.hospitals || [];
        } catch (error) {
            console.error('Failed to load data:', error);
            this.matches = [];
            this.donors = [];
            this.patients = [];
            this.hospitals = [];
        }
    }

    showCreateForm() {
        const form = `
            <h3>Initiate New Match</h3>
            <form onsubmit="matchController.createMatch(event)">
                <div class="form-group">
                    <label>Donor:</label>
                    <select name="donor_id" required>
                        <option value="">Select Donor</option>
                        ${this.donors.filter(d => d.status === 'Available').map(donor => 
                            `<option value="${donor.id}">${donor.name} (${donor.blood_group} - ${donor.organ_type})</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Patient:</label>
                    <select name="patient_id" required>
                        <option value="">Select Patient</option>
                        ${this.patients.filter(p => p.status === 'Waiting').map(patient => 
                            `<option value="${patient.id}">${patient.name} (${patient.blood_group} - ${patient.organ_needed})</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Hospital:</label>
                    <select name="hospital_id" required>
                        <option value="">Select Hospital</option>
                        ${this.hospitals.filter(h => h.operating_status === 'Active').map(hospital => 
                            `<option value="${hospital.id}">${hospital.name} - ${hospital.location}</option>`
                        ).join('')}
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Initiate Match</button>
            </form>
        `;
        app.showModal(form);
    }

    showEditForm(id) {
        const match = this.matches.find(m => m.id === id);
        const form = `
            <h3>Update Match Stage</h3>
            <form onsubmit="matchController.updateMatch(event, ${id})">
                <div class="form-group">
                    <label>Current Stage:</label>
                    <select name="stage" required>
                        <option value="Initiated" ${match.stage === 'Initiated' ? 'selected' : ''}>Initiated</option>
                        <option value="Procurement" ${match.stage === 'Procurement' ? 'selected' : ''}>Procurement</option>
                        <option value="In Transit" ${match.stage === 'In Transit' ? 'selected' : ''}>In Transit</option>
                        <option value="Surgery" ${match.stage === 'Surgery' ? 'selected' : ''}>Surgery</option>
                        <option value="Completed" ${match.stage === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update Stage</button>
            </form>
        `;
        app.showModal(form);
    }

    async createMatch(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        try {
            await api.createMatch(data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to create match:', error);
        }
    }

    async updateMatch(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        try {
            await api.updateMatch(id, data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to update match:', error);
        }
    }

    async deleteMatch(id) {
        if (confirm('Are you sure you want to cancel this match?')) {
            try {
                await api.deleteMatch(id);
                this.render();
            } catch (error) {
                console.error('Failed to delete match:', error);
            }
        }
    }
}

window.matchController = new MatchController();