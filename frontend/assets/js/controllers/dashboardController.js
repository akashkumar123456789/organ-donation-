class DashboardController {
    constructor() {
        this.dashboardData = [];
    }

    async render() {
        await this.loadDashboardData();
        const content = `
            <div class="page-header">
                <h1>📊 LifeCare Dashboard</h1>
                <div class="export-buttons">
                    <button class="btn btn-primary" onclick="dashboardController.exportCSV('all')">📄 Export All</button>
                    <button class="btn btn-secondary" onclick="dashboardController.exportCSV('donors')">🩸 Donors</button>
                    <button class="btn btn-secondary" onclick="dashboardController.exportCSV('patients')">🏥 Patients</button>
                    <button class="btn btn-secondary" onclick="dashboardController.exportCSV('hospitals')">🏢 Hospitals</button>
                    <button class="btn btn-secondary" onclick="dashboardController.exportCSV('matches')">🔄 Matches</button>
                    <button class="btn btn-secondary" onclick="dashboardController.exportCSV('records')">📋 Records</button>
                </div>
            </div>
            <div class="stats-cards">
                <div class="stat-card">
                    <div style="font-size: 3rem; margin-bottom: 1rem; color: #28a745;">🩸</div>
                    <h3 style="color: #28a745;">${this.dashboardData.filter(item => item.donor && item.donor.status === 'Available').length}</h3>
                    <p>Available Donors</p>
                </div>
                <div class="stat-card">
                    <div style="font-size: 3rem; margin-bottom: 1rem; color: #ffc107;">🏥</div>
                    <h3 style="color: #ffc107;">${this.dashboardData.filter(item => item.patient && item.patient.status === 'Waiting').length}</h3>
                    <p>Waiting Patients</p>
                </div>
                <div class="stat-card">
                    <div style="font-size: 3rem; margin-bottom: 1rem; color: #007bff;">🔄</div>
                    <h3 style="color: #007bff;">${this.dashboardData.filter(item => item.match && item.match.stage === 'Initiated').length}</h3>
                    <p>Active Matches</p>
                </div>
                <div class="stat-card">
                    <div style="font-size: 3rem; margin-bottom: 1rem; color: #6f42c1;">✅</div>
                    <h3 style="color: #6f42c1;">${this.dashboardData.filter(item => item.record && item.record.success_status === 'Successful').length}</h3>
                    <p>Successful Surgeries</p>
                </div>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Donor</th>
                            <th>Blood Type</th>
                            <th>Organ</th>
                            <th>Patient</th>
                            <th>Urgency</th>
                            <th>Hospital</th>
                            <th>Stage</th>
                            <th>Surgery Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.dashboardData.map(item => `
                            <tr>
                                <td>${item.donor.name || 'N/A'}</td>
                                <td>${item.donor.blood_group || 'N/A'}</td>
                                <td>${item.donor.organ_type || 'N/A'}</td>
                                <td>${item.patient.name || 'N/A'}</td>
                                <td><span class="urgency-${item.patient.urgency_level > 7 ? 'high' : item.patient.urgency_level > 4 ? 'medium' : 'low'}">${item.patient.urgency_level || 'N/A'}/10</span></td>
                                <td>${item.hospital.name || 'N/A'}</td>
                                <td><span class="status-badge status-${item.match.stage ? item.match.stage.toLowerCase().replace(' ', '') : 'unknown'}">${item.match.stage || 'N/A'}</span></td>
                                <td><span class="status-badge status-${item.record.success_status ? item.record.success_status.toLowerCase() : 'pending'}">${item.record.success_status || 'Pending'}</span></td>
                                <td>${item.record.surgery_date || item.match.created_at ? new Date(item.record.surgery_date || item.match.created_at).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }

    async loadDashboardData() {
        try {
            const response = await api.request('GET', '/dashboard');
            this.dashboardData = response.dashboard || [];
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.dashboardData = [];
        }
    }

    async exportCSV(type) {
        try {
            const response = await api.request('GET', `/export/${type}`);
            if (response.csv_data) {
                this.downloadCSV(response.csv_data, response.filename);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    }

    downloadCSV(csvData, filename) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

window.dashboardController = new DashboardController();