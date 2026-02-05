class HospitalController {
    constructor() {
        this.hospitals = [];
    }

    async render() {
        await this.loadHospitals();
        const content = `
            <div class="page-header">
                <h1>🏥 Hospital Inventory</h1>
                <button class="btn btn-primary" onclick="hospitalController.showCreateForm()">Add New Hospital</button>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Capacity</th>
                            <th>Operating Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.hospitals.map(hospital => `
                            <tr>
                                <td>${hospital.name}</td>
                                <td>${hospital.location}</td>
                                <td>${hospital.capacity}</td>
                                <td><span class="status-badge status-${hospital.operating_status.toLowerCase()}">${hospital.operating_status}</span></td>
                                <td>
                                    <button class="btn btn-secondary" onclick="hospitalController.showEditForm(${hospital.id})">Edit</button>
                                    <button class="btn btn-danger" onclick="hospitalController.deleteHospital(${hospital.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }

    async loadHospitals() {
        try {
            const response = await api.getHospitals();
            this.hospitals = response.hospitals;
        } catch (error) {
            console.error('Failed to load hospitals:', error);
        }
    }

    showCreateForm() {
        const form = `
            <h3>Add New Hospital</h3>
            <form onsubmit="hospitalController.createHospital(event)">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Location:</label>
                    <input type="text" name="location" required>
                </div>
                <div class="form-group">
                    <label>Capacity:</label>
                    <input type="number" name="capacity" value="10" required>
                </div>
                <button type="submit" class="btn btn-primary">Add Hospital</button>
            </form>
        `;
        app.showModal(form);
    }

    showEditForm(id) {
        const hospital = this.hospitals.find(h => h.id === id);
        const form = `
            <h3>Edit Hospital</h3>
            <form onsubmit="hospitalController.updateHospital(event, ${id})">
                <div class="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value="${hospital.name}" required>
                </div>
                <div class="form-group">
                    <label>Location:</label>
                    <input type="text" name="location" value="${hospital.location}" required>
                </div>
                <div class="form-group">
                    <label>Capacity:</label>
                    <input type="number" name="capacity" value="${hospital.capacity}" required>
                </div>
                <div class="form-group">
                    <label>Operating Status:</label>
                    <select name="operating_status">
                        <option value="Active" ${hospital.operating_status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Full" ${hospital.operating_status === 'Full' ? 'selected' : ''}>Full</option>
                        <option value="Maintenance" ${hospital.operating_status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update Hospital</button>
            </form>
        `;
        app.showModal(form);
    }

    async createHospital(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        try {
            await api.createHospital(data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to create hospital:', error);
        }
    }

    async updateHospital(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        try {
            await api.updateHospital(id, data);
            app.hideModal();
            this.render();
        } catch (error) {
            console.error('Failed to update hospital:', error);
        }
    }

    async deleteHospital(id) {
        if (confirm('Are you sure you want to delete this hospital?')) {
            try {
                await api.deleteHospital(id);
                this.render();
            } catch (error) {
                console.error('Failed to delete hospital:', error);
            }
        }
    }
}

window.hospitalController = new HospitalController();