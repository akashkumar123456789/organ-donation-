class ApiService {
    constructor() {
        this.baseUrl = '/api';
    }

    async request(method, endpoint, data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Donor methods
    async getDonors() {
        return this.request('GET', '/donors');
    }

    async createDonor(data) {
        return this.request('POST', '/donors', data);
    }

    async updateDonor(id, data) {
        return this.request('PUT', `/donors/${id}`, data);
    }

    async deleteDonor(id) {
        return this.request('DELETE', `/donors/${id}`);
    }

    // Patient methods
    async getPatients() {
        return this.request('GET', '/patients');
    }

    async createPatient(data) {
        return this.request('POST', '/patients', data);
    }

    async updatePatient(id, data) {
        return this.request('PUT', `/patients/${id}`, data);
    }

    async deletePatient(id) {
        return this.request('DELETE', `/patients/${id}`);
    }

    // Hospital methods
    async getHospitals() {
        return this.request('GET', '/hospitals');
    }

    async createHospital(data) {
        return this.request('POST', '/hospitals', data);
    }

    async updateHospital(id, data) {
        return this.request('PUT', `/hospitals/${id}`, data);
    }

    async deleteHospital(id) {
        return this.request('DELETE', `/hospitals/${id}`);
    }

    // Match methods
    async getMatches() {
        return this.request('GET', '/matches');
    }

    async createMatch(data) {
        return this.request('POST', '/matches', data);
    }

    async updateMatch(id, data) {
        return this.request('PUT', `/matches/${id}`, data);
    }

    async deleteMatch(id) {
        return this.request('DELETE', `/matches/${id}`);
    }

    // Record methods
    async getRecords() {
        return this.request('GET', '/records');
    }

    async createRecord(data) {
        return this.request('POST', '/records', data);
    }

    async updateRecord(id, data) {
        return this.request('PUT', `/records/${id}`, data);
    }

    async deleteRecord(id) {
        return this.request('DELETE', `/records/${id}`);
    }

    // Dashboard route
    async getDashboard() {
        return this.request('GET', '/dashboard');
    }

    // Export routes
    async exportData(type) {
        return this.request('GET', `/export/${type}`);
    }
}

window.api = new ApiService();