// Enhanced Features: Search, Filter, Notifications

class EnhancedFeatures {
    constructor() {
        this.notifications = [];
    }

    // Search functionality
    addSearchToTable(tableId, searchInputId) {
        const searchInput = document.getElementById(searchInputId);
        const table = document.getElementById(tableId);
        
        if (!searchInput || !table) return;
        
        searchInput.addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let found = false;
                
                for (let j = 0; j < cells.length; j++) {
                    const cell = cells[j];
                    if (cell.textContent.toLowerCase().indexOf(filter) > -1) {
                        found = true;
                        break;
                    }
                }
                
                row.style.display = found ? '' : 'none';
            }
        });
    }

    // Notification system
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Export to PDF (basic implementation)
    exportToPDF(elementId, filename) {
        const printContent = document.getElementById(elementId);
        if (!printContent) {
            window.print();
            return;
        }
        
        // Create print-friendly version
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>' + filename + '</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; margin: 20px 0; }');
        printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
        printWindow.document.write('th { background-color: #740A03; color: white; }');
        printWindow.document.write('h1 { color: #740A03; }');
        printWindow.document.write('.status-badge { padding: 4px 8px; border-radius: 4px; }');
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
    
    // Quick PDF export for current page
    exportCurrentPageToPDF() {
        window.print();
    }

    // Sort table columns
    makeSortable(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                this.sortTable(table, index);
            });
        });
    }

    sortTable(table, column) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aText = a.cells[column].textContent.trim();
            const bText = b.cells[column].textContent.trim();
            return aText.localeCompare(bText);
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    // Validate form inputs
    validateForm(formData, requiredFields) {
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                errors.push(`${field} is required`);
            }
        });
        
        if (formData.contact && !/^\d{3}-\d{4}$/.test(formData.contact)) {
            errors.push('Contact must be in format: XXX-XXXX');
        }
        
        if (formData.urgency_level && (formData.urgency_level < 1 || formData.urgency_level > 10)) {
            errors.push('Urgency level must be between 1 and 10');
        }
        
        return errors;
    }

    // Loading spinner
    showLoading() {
        const loader = document.createElement('div');
        loader.id = 'loading-spinner';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }

    hideLoading() {
        const loader = document.getElementById('loading-spinner');
        if (loader) loader.remove();
    }
}

window.enhancedFeatures = new EnhancedFeatures();
