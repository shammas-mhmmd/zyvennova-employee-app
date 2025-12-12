// ===== DATA MANAGEMENT =====
class EmployeeDataManager {
    constructor() {
        // In a real app, this would be the logged-in employee's ID
        this.currentEmployeeId = 'emp1';
        this.employee = this.loadEmployee();
        this.jobs = this.loadJobs();
    }

    loadEmployee() {
        // In production, this would fetch from server
        return {
            id: 'emp1',
            name: 'Ramesh Patel',
            phone: '+91 99887 76655',
            email: 'ramesh@example.com',
            role: 'Senior Technician',
            joinDate: '2023-01-15',
            completedWorks: 45,
            activeWorks: 2,
            rating: 4.8
        };
    }

    loadJobs() {
        // In production, this would fetch from server
        return [
            {
                id: 1,
                clientName: 'Rajesh Kumar',
                phone: '+91 98765 43210',
                address: '123 MG Road, Bangalore - 560001',
                date: '2025-12-15',
                type: 'New Installation',
                cameraCount: 8,
                status: 'upcoming',
                estimatedCost: 45000,
                notes: '4 dome cameras, 4 bullet cameras with NVR',
                tools: ['Dome Camera x4', 'Bullet Camera x4', 'NVR 16 Channel', 'Cat6 Cable', 'Power Supply 12V x8']
            },
            {
                id: 2,
                clientName: 'Tech Solutions Pvt Ltd',
                phone: '+91 98765 43212',
                address: '789 Whitefield, Bangalore - 560066',
                date: '2025-12-13',
                type: 'New Installation',
                cameraCount: 16,
                status: 'in-progress',
                estimatedCost: 95000,
                notes: 'Complete office surveillance system with 16 cameras',
                tools: ['Dome Camera x10', 'Bullet Camera x6', 'NVR 16 Channel', 'Cat6 Cable x2', 'Power Supply 12V x16'],
                progress: 65
            },
            {
                id: 3,
                clientName: 'Sharma Residency',
                phone: '+91 98765 43215',
                address: '456 Jayanagar, Bangalore - 560041',
                date: '2025-12-08',
                type: 'Maintenance',
                cameraCount: 6,
                status: 'completed',
                estimatedCost: 8000,
                notes: 'Quarterly maintenance and cleaning',
                completedDate: '2025-12-08'
            },
            {
                id: 4,
                clientName: 'Green Valley Apartments',
                phone: '+91 98765 43216',
                address: '321 HSR Layout, Bangalore - 560102',
                date: '2025-12-05',
                type: 'New Installation',
                cameraCount: 12,
                status: 'completed',
                estimatedCost: 72000,
                notes: 'Apartment complex surveillance',
                completedDate: '2025-12-05'
            },
            {
                id: 5,
                clientName: 'Retail Store - MG Road',
                phone: '+91 98765 43217',
                address: '654 MG Road, Bangalore - 560001',
                date: '2025-12-01',
                type: 'Repair',
                cameraCount: 3,
                status: 'completed',
                estimatedCost: 5000,
                notes: 'Replace faulty cameras',
                completedDate: '2025-12-01'
            }
        ];
    }

    getJobsByStatus(status) {
        return this.jobs.filter(job => job.status === status);
    }

    getJobById(id) {
        return this.jobs.find(job => job.id === id);
    }

    updateJobStatus(jobId, status, notes) {
        const job = this.getJobById(jobId);
        if (job) {
            job.status = status;
            if (notes) job.workNotes = notes;
            if (status === 'completed') {
                job.completedDate = new Date().toISOString().split('T')[0];
            }
            // In production, this would sync with server
            return true;
        }
        return false;
    }
}

// ===== EMPLOYEE APP CONTROLLER =====
class EmployeeApp {
    constructor() {
        this.dataManager = new EmployeeDataManager();
        this.currentTab = 'assigned';
        this.selectedJob = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProfile();
        this.renderStats();
        this.renderAssignedJobs();
        this.renderCompletedJobs();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Modal controls
        const jobModal = document.getElementById('jobModal');
        const statusModal = document.getElementById('statusModal');
        const closeJobModal = document.getElementById('closeJobModal');
        const closeStatusModal = document.getElementById('closeStatusModal');
        const cancelStatusBtn = document.getElementById('cancelStatusBtn');

        closeJobModal.addEventListener('click', () => this.closeJobModal());
        closeStatusModal.addEventListener('click', () => this.closeStatusModal());
        cancelStatusBtn.addEventListener('click', () => this.closeStatusModal());

        jobModal.addEventListener('click', (e) => {
            if (e.target === jobModal) this.closeJobModal();
        });

        statusModal.addEventListener('click', (e) => {
            if (e.target === statusModal) this.closeStatusModal();
        });

        // Status form submission
        const statusForm = document.getElementById('statusForm');
        statusForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateJobStatus();
        });
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        document.getElementById(`${tab}Tab`).classList.add('active');
        this.currentTab = tab;
    }

    renderProfile() {
        const emp = this.dataManager.employee;
        document.getElementById('profileName').textContent = emp.name;
        document.getElementById('profileRole').textContent = emp.role;
        document.getElementById('profileEmail').textContent = emp.email;
        document.getElementById('profilePhone').textContent = emp.phone;
        document.getElementById('profileJoinDate').textContent = this.formatDate(emp.joinDate);
        document.getElementById('perfCompleted').textContent = emp.completedWorks;
        document.getElementById('perfRating').textContent = emp.rating;
        document.getElementById('perfActive').textContent = emp.activeWorks;
    }

    renderStats() {
        const assignedJobs = this.dataManager.getJobsByStatus('upcoming').length +
            this.dataManager.getJobsByStatus('in-progress').length;
        const todayJobs = this.getTodayJobs().length;
        const completedJobs = this.dataManager.getJobsByStatus('completed').length;

        document.getElementById('todayJobsCount').textContent = todayJobs;
        document.getElementById('completedCount').textContent = completedJobs;
        document.getElementById('pendingCount').textContent = assignedJobs;
    }

    getTodayJobs() {
        const today = new Date().toISOString().split('T')[0];
        return this.dataManager.jobs.filter(job =>
            job.date === today && (job.status === 'upcoming' || job.status === 'in-progress')
        );
    }

    renderAssignedJobs() {
        const container = document.getElementById('assignedJobsList');
        const upcomingJobs = this.dataManager.getJobsByStatus('upcoming');
        const inProgressJobs = this.dataManager.getJobsByStatus('in-progress');
        const allAssigned = [...inProgressJobs, ...upcomingJobs];

        if (allAssigned.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <svg style="width: 64px; height: 64px; margin: 0 auto 1rem; opacity: 0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                        <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
                        <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>No assigned jobs at the moment</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allAssigned.map(job => this.createJobCard(job)).join('');

        // Add click handlers
        container.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const jobId = parseInt(card.dataset.jobId);
                    this.showJobDetails(jobId);
                }
            });
        });

        container.querySelectorAll('.update-status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobId = parseInt(btn.dataset.jobId);
                this.openStatusModal(jobId);
            });
        });
    }

    renderCompletedJobs() {
        const container = document.getElementById('completedJobsList');
        const completedJobs = this.dataManager.getJobsByStatus('completed');

        if (completedJobs.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <p>No completed jobs yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = completedJobs.map(job => this.createJobCard(job, true)).join('');

        // Add click handlers
        container.querySelectorAll('.job-card').forEach(card => {
            card.addEventListener('click', () => {
                const jobId = parseInt(card.dataset.jobId);
                this.showJobDetails(jobId);
            });
        });
    }

    createJobCard(job, isCompleted = false) {
        const statusClass = job.status === 'in-progress' ? 'in-progress' :
            job.status === 'completed' ? 'completed' : 'upcoming';
        const statusText = job.status === 'in-progress' ? 'In Progress' :
            job.status === 'completed' ? 'Completed' : 'Upcoming';

        return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div>
                        <div class="job-title">${job.clientName}</div>
                        <div class="job-date">${this.formatDate(job.date)}</div>
                    </div>
                    <span class="job-status ${statusClass}">${statusText}</span>
                </div>

                <div class="job-details">
                    <div class="job-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-width="2"/>
                            <circle cx="12" cy="10" r="3" stroke-width="2"/>
                        </svg>
                        ${job.address}
                    </div>
                    <div class="job-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="7" width="20" height="14" rx="2" stroke-width="2"/>
                            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" stroke-width="2"/>
                        </svg>
                        ${job.cameraCount} cameras - ${job.type}
                    </div>
                    <div class="job-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke-width="2"/>
                        </svg>
                        ${job.phone}
                    </div>
                </div>

                ${!isCompleted ? `
                    <div class="job-footer">
                        <button class="btn-outline update-status-btn" data-job-id="${job.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-width="2" stroke-linecap="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Update Status
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    showJobDetails(jobId) {
        const job = this.dataManager.getJobById(jobId);
        if (!job) return;

        this.selectedJob = job;

        const modalBody = document.getElementById('jobModalBody');
        modalBody.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--spacing-md);">Client Information</h3>
                    <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                        <div class="detail-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke-width="2"/>
                                <circle cx="12" cy="7" r="4" stroke-width="2"/>
                            </svg>
                            ${job.clientName}
                        </div>
                        <div class="detail-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke-width="2"/>
                            </svg>
                            ${job.phone}
                        </div>
                        <div class="detail-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-width="2"/>
                                <circle cx="12" cy="10" r="3" stroke-width="2"/>
                            </svg>
                            ${job.address}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--spacing-md);">Job Details</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-lg);">
                            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 4px;">Type</div>
                            <div style="font-weight: 600;">${job.type}</div>
                        </div>
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-lg);">
                            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 4px;">Cameras</div>
                            <div style="font-weight: 600;">${job.cameraCount}</div>
                        </div>
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-lg);">
                            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 4px;">Date</div>
                            <div style="font-weight: 600;">${this.formatDate(job.date)}</div>
                        </div>
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-lg);">
                            <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 4px;">Estimated Cost</div>
                            <div style="font-weight: 600;">₹${job.estimatedCost.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                ${job.tools ? `
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--spacing-md);">Required Tools</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                            ${job.tools.map(tool => `
                                <span style="padding: 6px 12px; background: var(--bg-tertiary); border-radius: var(--radius-md); font-size: 0.8125rem;">
                                    ${tool}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${job.notes ? `
                    <div>
                        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: var(--spacing-md);">Notes</h3>
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-lg); font-size: 0.875rem; color: var(--text-secondary);">
                            ${job.notes}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('modalJobTitle').textContent = job.clientName;
        document.getElementById('jobModal').classList.add('active');
    }

    openStatusModal(jobId) {
        this.selectedJob = this.dataManager.getJobById(jobId);
        if (!this.selectedJob) return;

        document.getElementById('jobStatus').value = this.selectedJob.status;
        document.getElementById('statusModal').classList.add('active');
    }

    updateJobStatus() {
        if (!this.selectedJob) return;

        const status = document.getElementById('jobStatus').value;
        const notes = document.getElementById('workNotes').value;

        this.dataManager.updateJobStatus(this.selectedJob.id, status, notes);

        this.closeStatusModal();
        this.renderAssignedJobs();
        this.renderCompletedJobs();
        this.renderStats();

        this.showNotification('Job status updated successfully!');
    }

    closeJobModal() {
        document.getElementById('jobModal').classList.remove('active');
        this.selectedJob = null;
    }

    closeStatusModal() {
        document.getElementById('statusModal').classList.remove('active');
        document.getElementById('statusForm').reset();
    }

    showNotification(message) {
        // Simple notification - can be enhanced
        alert(message);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.employeeApp = new EmployeeApp();

    // Register service worker for PWA support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
});
