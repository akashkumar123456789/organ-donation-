// Add this to each controller's class

// For PatientController
async downloadPatient(id) {
    try {
        const response = await api.request('GET', `/export/patient/${id}`);
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
        console.error('Failed to download patient:', error);
    }
}

// For HospitalController
async downloadHospital(id) {
    try {
        const response = await api.request('GET', `/export/hospital/${id}`);
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
        console.error('Failed to download hospital:', error);
    }
}

// For MatchController
async downloadMatch(id) {
    try {
        const response = await api.request('GET', `/export/match/${id}`);
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
        console.error('Failed to download match:', error);
    }
}

// For RecordController
async downloadRecord(id) {
    try {
        const response = await api.request('GET', `/export/record/${id}`);
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
        console.error('Failed to download record:', error);
    }
}

// Add download button to table rows:
// <button class="btn btn-primary" onclick="controllerName.downloadMethod(${id})" title="Download CSV">📥</button>
