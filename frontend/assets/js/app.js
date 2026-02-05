class App {
    constructor() {
        this.currentPage = null;
        this.controllers = {};
        this.init();
    }

    init() {
        // Initialize controllers after API is loaded
        this.controllers = {
            dashboard: window.dashboardController || new DashboardController(),
            donors: window.donorController || new DonorController(),
            patients: window.patientController || new PatientController(),
            hospitals: window.hospitalController || new HospitalController(),
            matches: window.matchController || new MatchController(),
            records: window.recordController || new RecordController()
        };
        this.setupNavigation();
        this.setupModal();
    }

    setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.loadPage(page);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadPage(page) {
        this.currentPage = page;
        const controller = this.controllers[page];
        if (controller) {
            controller.render();
        }
    }

    showModal(content) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }

    hideModal() {
        document.getElementById('modal').style.display = 'none';
    }

    showHome() {
        const content = `
            <div class="welcome-section">
                <h1>🏥 Welcome to Organ Donation System</h1>
                <div class="hero-icons">
                    <span class="hero-icon">🫀</span>
                    <span class="hero-icon">🩸</span>
                    <span class="hero-icon">🏥</span>
                    <span class="hero-icon">💝</span>
                </div>
                <p style="font-size: 1.2rem; margin-top: 1rem; color: #740A03;">Advanced Organ Donation Management Platform</p>
                <p style="margin-top: 1rem; color: #C3110C;">Connecting donors with patients through innovative technology and compassionate care management.</p>
                <div style="margin-top: 3rem;">
                    <button class="btn btn-primary" onclick="app.loadPage('dashboard')" style="margin: 0 1rem;">🚀 Get Started</button>
                    <button class="btn btn-secondary" onclick="app.loadPage('donors')" style="margin: 0 1rem;">👥 View Donors</button>
                </div>
            </div>
        `;
        document.getElementById('app-content').innerHTML = content;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});