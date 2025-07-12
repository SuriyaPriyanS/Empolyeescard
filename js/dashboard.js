// dashboard.js
import { employees, deleteEmployee } from './data.js';

let currentEmployees = [...employees];
let currentSort = { field: null, direction: 'asc' };

// Initialize dashboard
export function initializeDashboard() {
    renderEmployees();
    setupSortButtons();
    setupResponsiveGrid();
}

// Render employees with enhanced cards
export function renderEmployees(employeesToRender = currentEmployees) {
    const employeeGrid = document.getElementById('employeeGrid');

    if (!employeeGrid) return;

    if (employeesToRender.length === 0) {
        employeeGrid.innerHTML = `
            <div class="no-employees">
                <div class="no-employees-icon">👥</div>
                <h3>No employees found</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <button onclick="clearAllFilters()" class="primary-btn">Clear Filters</button>
            </div>
        `;
        return;
    }

    employeeGrid.innerHTML = employeesToRender
        .map(employee => createEmployeeCard(employee))
        .join('');

    animateCards();
}

// Create enhanced employee card
function createEmployeeCard(employee) {
    return `
        <div class="employee-card" data-id="${employee.id}">
            <div class="employee-header">
                <div class="employee-avatar">
                    ${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}
                </div>
                <div class="employee-title">
                    <h3>${employee.firstName} ${employee.lastName}</h3>
                    <span class="employee-id">#${employee.id.toString().padStart(3, '0')}</span>
                </div>
            </div>

            <div class="employee-info">
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${employee.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Department:</span>
                    <span class="info-value department-badge ${employee.department.toLowerCase()}">${employee.department}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Role:</span>
                    <span class="info-value">${employee.role}</span>
                </div>
            </div>

            <div class="employee-actions">
                <button class="action-btn edit-btn" onclick="window.editEmployee(${employee.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="window.deleteEmployee(${employee.id})">Delete</button>
            </div>
        </div>
    `;
}

// Setup sorting functionality
function setupSortButtons() {
    document.getElementById('sortFirstName')?.addEventListener('click', () => sortEmployees('firstName'));
    document.getElementById('sortDepartment')?.addEventListener('click', () => sortEmployees('department'));
}

// Sort employees
function sortEmployees(field) {
    const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';

    currentEmployees.sort((a, b) => {
        const aValue = a[field].toLowerCase();
        const bValue = b[field].toLowerCase();

        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    currentSort = { field, direction };
    updateSortButtons();
    renderEmployees();
}

function updateSortButtons() {
    const buttons = document.querySelectorAll('[id^="sort"]');
    buttons.forEach(btn => btn.classList.remove('active', 'asc', 'desc'));

    if (currentSort.field) {
        const activeBtn = document.getElementById(`sort${currentSort.field.charAt(0).toUpperCase() + currentSort.field.slice(1)}`);
        if (activeBtn) {
            activeBtn.classList.add('active', currentSort.direction);
        }
    }
}

// Animate cards on render
function animateCards() {
    const cards = document.querySelectorAll('.employee-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Responsive grid logic
function setupResponsiveGrid() {
    const grid = document.getElementById('employeeGrid');
    if (!grid) return;

    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const width = entry.contentRect.width;
            const columns = Math.floor(width / 300);
            grid.style.gridTemplateColumns = `repeat(${Math.max(1, columns)}, 1fr)`;
        }
    });

    resizeObserver.observe(grid);
}

// Global functions
window.editEmployee = function(id) {
    window.location.href = `form.html?id=${id}`;
};

window.deleteEmployee = function(id) {
    const confirmed = confirm("Are you sure you want to delete this employee?");
    if (confirmed) {
        const result = deleteEmployee(id);
        if (result.success) {
            alert("Employee deleted successfully!");
            location.reload();
        } else {
            alert("Error deleting employee.");
        }
    }
};

// On DOM loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
