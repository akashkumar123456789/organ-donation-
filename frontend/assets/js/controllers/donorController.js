class DonorController {
    constructor() {
        this.donors = [];
    }

    async render() {
        await this.loadDonors();
        const content = `
            <div class="page-header">
                <h1>🩸 Donor Profiles</h1>
                <button class="btn btn-primary" onclick="donorController.showCreateForm()">➕ Add New Donor</button>
            </div>
            <div class="stats-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div class="stat-card" style="background: rgba(46, 204, 113, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(46, 204, 113, 0.3);">
                    <h3 style="color: #2ecc71; font-size: 2rem; margin-bottom: 0.5rem;">${this.donors.filter(d => d.status === 'Available').length}</h3>
                    <p>Available Donors</p>
                </div>
                <div class="stat-card" style="background: rgba(52, 152, 219, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(52, 152, 219, 0.3);">
                    <h3 style="color: #3498db; font-size: 2rem; margin-bottom: 0.5rem;">${this.donors.length}</h3>
                    <p>Total Donors</p>
                </div>
                <div class="stat-card" style="background: rgba(155, 89, 182, 0.2); padding: 1.5rem; border-radius: 15px; text-align: center; border: 1px solid rgba(155, 89, 182, 0.3);">
                    <h3 style="color: #9b59b6; font-size: 2rem; margin-bottom: 0.5rem;">${this.donors.filter(d => d.status === 'Matched').length}</h3>
                    <p>Matched Donors</p>
                </div>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Blood Group</th>
                            <th>Organ Type</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.donors.map(donor => `
                            <tr>
                                <td>${donor.name}</td>
                                <td>${donor.blood_group}</td>
                                <td>${donor.organ_type}</td>
                                <td>${donor.contact}</td>
                                <td><span class="status-badge status-${donor.status.toLowerCase()}">${donor.status}</span></td>
                                <td>
                                    <button class="btn btn-secondary" onclick="donorController.showEditForm(${donor.id})">Edit</button>
                                    <button class="btn btn-primary" onclick="donorController.downloadDonor(${donor.id})" title="Download CSV">📥</button>
                                    <button class="btn btn-danger" onclick="donorController.deleteDonor(${donor.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }

    async loadDonors() {
        try {
            const response = await api.getDonors();
            this.donors = response.donors;
        } catch (error) {
            console.error('Failed to load donors:', error);
        }
    }

    showCreateForm() {
        const form = `
            <h3>Add New Donor</h3>
            <form onsubmit="donorController.createDonor(event)">
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
                    <label>Organ Type:</label>
                    <select name="organ_type" required>
                        <option value="Heart">Heart</option>
                        <option value="Kidney">Kidney</option>
                        <option value="Liver">Liver</option>
                        <option value="Lungs">Lungs</option>
                        <option value="Cornea">Cornea</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contact:</label>
                    <input type="text" name="contact">
                </div>
                <button type="submit" class="btn btn-primary">Add Donor</button>
            </form>
        `;
        app.showModal(form);
    }

    showEditForm(id) {
        const donor = this.donors.find(d => d.id === id);
        const form = `
            <h3>Edit Donor</h3>
            <form onsubmit="donorController.updateDonor(event, ${id})">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value="${donor.name}" required>
                </div>
                <div class="form-group">
                    <label>Blood Group:</label>
                    <select name="blood_group" required>
                        <option value="A+" ${donor.blood_group === 'A+' ? 'selected' : ''}>A+</option>
                        <option value="A-" ${donor.blood_group === 'A-' ? 'selected' : ''}>A-</option>
                        <option value="B+" ${donor.blood_group === 'B+' ? 'selected' : ''}>B+</option>
                        <option value="B-" ${donor.blood_group === 'B-' ? 'selected' : ''}>B-</option>
                        <option value="AB+" ${donor.blood_group === 'AB+' ? 'selected' : ''}>AB+</option>
                        <option value="AB-" ${donor.blood_group === 'AB-' ? 'selected' : ''}>AB-</option>
                        <option value="O+" ${donor.blood_group === 'O+' ? 'selected' : ''}>O+</option>
                        <option value="O-" ${donor.blood_group === 'O-' ? 'selected' : ''}>O-</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Organ Type:</label>
                    <select name="organ_type" required>
                        <option value="Heart" ${donor.organ_type === 'Heart' ? 'selected' : ''}>Heart</option>
                        <option value="Kidney" ${donor.organ_type === 'Kidney' ? 'selected' : ''}>Kidney</option>
                        <option value="Liver" ${donor.organ_type === 'Liver' ? 'selected' : ''}>Liver</option>
                        <option value="Lungs" ${donor.organ_type === 'Lungs' ? 'selected' : ''}>Lungs</option>
                        <option value="Cornea" ${donor.organ_type === 'Cornea' ? 'selected' : ''}>Cornea</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contact:</label>
                    <input type="text" name="contact" value="${donor.contact}">
                </div>
                <div class="form-group">
                    <label>Status:</label>
                    <select name="status">
                        <option value="Available" ${donor.status === 'Available' ? 'selected' : ''}>Available</option>
                        <option value="Matched" ${donor.status === 'Matched' ? 'selected' : ''}>Matched</option>
                        <option value="Unavailable" ${donor.status === 'Unavailable' ? 'selected' : ''}>Unavailable</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update Donor</button>
            </form>
        `;
        app.showModal(form);
    }

    async createDonor(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validateDonorForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.createDonor(data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to create donor:', error);
        }
    }

    async updateDonor(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        const errors = FormValidator.validateDonorForm(data);
        if (errors.length > 0) {
            FormValidator.showError(errors.join('\n'));
            return;
        }
        
        try {
            await api.updateDonor(id, data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to update donor:', error);
        }
    }

    async deleteDonor(id) {
        if (confirm('Are you sure you want to delete this donor?')) {
            try {
                await api.deleteDonor(id);
                this.render();
            } catch (error) {
                console.error('Failed to delete donor:', error);
            }
        }
    }

    async downloadDonor(id) {
        try {
            const response = await api.request('GET', `/export/donor/${id}`);
            if (response.csv_data) {
                const blob = new Blob([response.csv_data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = response.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to download donor:', error);
        }
    }
}

window.donorController = new DonorController();