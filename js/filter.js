import { employees } from './data.js';
import { renderEmployees as render } from './dashboard.js';

let filteredEmployees = [...employees];
let activeFilters = {
    search: '',
    firstName: '',
    department: '',
    role: ''
};

// Initialize all filters
export function initializeFilters() {
    setupSearchBar();
    setupFilterSidebar();
    setupFilterInputs();
    applyFilters(); // Initial rendering
}

// --- Setup search bar with debounce and suggestions ---
function setupSearchBar() {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return;

    let searchTimeout;

    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            activeFilters.search = e.target.value.toLowerCase().trim();
            applyFilters();
        }, 300);
    });

    setupSearchSuggestions(searchBar);
}

// --- Search Suggestions ---
function setupSearchSuggestions(searchBar) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchBar.parentNode.appendChild(suggestionsContainer);

    searchBar.addEventListener('input', showSuggestions);
    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && !searchBar.contains(e.target)) {
            hideSuggestions();
        }
    });

    function showSuggestions() {
        const query = searchBar.value.toLowerCase();
        if (query.length < 2) {
            hideSuggestions();
            return;
        }

        const suggestions = employees
            .filter(emp =>
                emp.firstName.toLowerCase().includes(query) ||
                emp.lastName.toLowerCase().includes(query) ||
                emp.email.toLowerCase().includes(query)
            )
            .slice(0, 5)
            .map(emp => `
                <div class="suggestion-item" onclick="selectSuggestion('${emp.firstName} ${emp.lastName}')">
                    <strong>${emp.firstName} ${emp.lastName}</strong>
                    <span>${emp.email}</span>
                </div>
            `);

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.join('');
            suggestionsContainer.classList.add('visible');
        } else {
            hideSuggestions();
        }
    }

    function hideSuggestions() {
        suggestionsContainer.classList.remove('visible');
    }

    window.selectSuggestion = function(name) {
        searchBar.value = name;
        activeFilters.search = name.toLowerCase();
        applyFilters();
        hideSuggestions();
    };
}

// --- Filter Sidebar with open/close functionality ---
function setupFilterSidebar() {
    const filterBtn = document.getElementById('filterBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const closeBtn = document.getElementById('closeFilterSidebar');

    if (!filterSidebar) return;

    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterSidebar.classList.toggle('hidden');
            filterBtn.classList.toggle('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterSidebar.classList.add('hidden');
            if (filterBtn) filterBtn.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (
            !filterSidebar.contains(e.target) &&
            !filterBtn?.contains(e.target) &&
            !closeBtn?.contains(e.target)
        ) {
            filterSidebar.classList.add('hidden');
            filterBtn?.classList.remove('active');
        }
    });
}

// --- Filter Input Events ---
function setupFilterInputs() {
    const filterInputs = {
        firstName: document.getElementById('filterFirstName'),
        department: document.getElementById('filterDepartment'),
        role: document.getElementById('filterRole')
    };

    Object.entries(filterInputs).forEach(([key, input]) => {
        if (!input) return;

        input.addEventListener('input', () => {
            activeFilters[key] = input.value.toLowerCase().trim();
            applyFilters();
        });

        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                activeFilters[key] = input.value.toLowerCase().trim();
                applyFilters();
            }
        });
    });

    const applyBtn = document.getElementById('applyFilter');
    const clearBtn = document.getElementById('clearFilters');

    applyBtn?.addEventListener('click', () => {
        Object.entries(filterInputs).forEach(([key, input]) => {
            if (input) {
                activeFilters[key] = input.value.toLowerCase().trim();
            }
        });
        applyFilters();
    });

    clearBtn?.addEventListener('click', clearAllFilters);
}

// --- Filter Application Logic ---
function applyFilters() {
    filteredEmployees = employees.filter(employee => {
        const searchMatch = !activeFilters.search ||
            employee.firstName.toLowerCase().includes(activeFilters.search) ||
            employee.lastName.toLowerCase().includes(activeFilters.search) ||
            employee.email.toLowerCase().includes(activeFilters.search);

        const firstNameMatch = !activeFilters.firstName ||
            employee.firstName.toLowerCase().includes(activeFilters.firstName);

        const departmentMatch = !activeFilters.department ||
            employee.department.toLowerCase() === activeFilters.department;

        const roleMatch = !activeFilters.role ||
            employee.role.toLowerCase().includes(activeFilters.role);

        return searchMatch && firstNameMatch && departmentMatch && roleMatch;
    });

    render(filteredEmployees);
    updateFilterStatus();
    updatePagination();
}

// --- Clear All Filters ---
function clearAllFilters() {
    activeFilters = {
        search: '',
        firstName: '',
        department: '',
        role: ''
    };

    document.getElementById('searchBar').value = '';
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';

    applyFilters();
}

// --- Filter Status UI ---
function updateFilterStatus() {
    const totalCount = employees.length;
    const filteredCount = filteredEmployees.length;

    let statusElement = document.getElementById('filterStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'filterStatus';
        statusElement.className = 'filter-status';
        const header = document.getElementById('header');
        header?.appendChild(statusElement);
    }

    const hasFilters = Object.values(activeFilters).some(val => val !== '');

    if (hasFilters) {
        statusElement.innerHTML = `
            <span class="status-text">
                Showing ${filteredCount} of ${totalCount} employees
            </span>
            <button class="clear-all-btn" onclick="clearAllFilters()">Clear All Filters</button>
        `;
        statusElement.classList.add('active');
    } else {
        statusElement.innerHTML = `<span class="status-text">Showing all ${totalCount} employees</span>`;
        statusElement.classList.remove('active');
    }
}

// --- Pagination Hook ---
function updatePagination() {
    const paginationModule = window.paginationModule;
    if (paginationModule && typeof paginationModule.updateWithFilteredData === 'function') {
        paginationModule.updateWithFilteredData(filteredEmployees);
    }
}

// --- Exports ---
export { filteredEmployees, applyFilters, clearAllFilters };
window.clearAllFilters = clearAllFilters;

// Init on page load
document.addEventListener('DOMContentLoaded', initializeFilters);
