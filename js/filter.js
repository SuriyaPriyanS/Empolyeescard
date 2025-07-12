// Update filter status (continued)
import { employees } from './data.js';
import { renderEmployees as render } from './dashboard.js';

let filteredEmployees = [...employees];
let activeFilters = {
    search: '',
    firstName: '',
    department: '',
    role: ''
};

// Initialize filters
export function initializeFilters() {
    setupSearchBar();
    setupFilterSidebar();
    setupFilterInputs();
}

// Setup search bar
function setupSearchBar() {
    const searchBar = document.getElementById('searchBar');
    if (!searchBar) return;
    
    let searchTimeout;
    
    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            activeFilters.search = e.target.value.toLowerCase().trim();
            applyFilters();
        }, 300); // Debounce search
    });
    
    // Add search suggestions
    setupSearchSuggestions(searchBar);
}

// Setup search suggestions
function setupSearchSuggestions(searchBar) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchBar.parentNode.appendChild(suggestionsContainer);
    
    searchBar.addEventListener('focus', showSuggestions);
    searchBar.addEventListener('blur', () => {
        setTimeout(() => hideSuggestions(), 200);
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

// Setup filter sidebar
function setupFilterSidebar() {
    const filterBtn = document.getElementById('filterBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    
    if (!filterBtn || !filterSidebar) return;
    
    filterBtn.addEventListener('click', () => {
        filterSidebar.classList.toggle('hidden');
        filterBtn.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!filterSidebar.contains(e.target) && !filterBtn.contains(e.target)) {
            filterSidebar.classList.add('hidden');
            filterBtn.classList.remove('active');
        }
    });
}

// Setup filter inputs
function setupFilterInputs() {
    const filterInputs = {
        firstName: document.getElementById('filterFirstName'),
        department: document.getElementById('filterDepartment'),
        role: document.getElementById('filterRole')
    };
    
    Object.entries(filterInputs).forEach(([key, input]) => {
        if (input) {




            if(key === 'role') {
                input.addEventListener('keyup', (e) => {
                    if(e.key === 'Enter') {
                        activeFilters[key] = input.value.toLowerCase().trim();
                        applyFilters();
                    }
                });
            } else {
                input.addEventListener('input', () => {
                    activeFilters[key] = input.value.toLowerCase().trim();
                });
            }
        }
    });
    
    // Apply and clear buttons
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

// Apply all filters
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

// Clear all filters
function clearAllFilters() {
    activeFilters = {
        search: '',
        firstName: '',
        department: '',
        role: ''
    };
    
    // Clear input fields
    document.getElementById('searchBar').value = '';
    document.getElementById('filterFirstName').value = '';
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterRole').value = '';
    
    applyFilters();
}

// Update filter status
function updateFilterStatus() {
    const totalCount = employees.length;
    const filteredCount = filteredEmployees.length;
    
    let statusElement = document.getElementById('filterStatus');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'filterStatus';
        statusElement.className = 'filter-status';
        
        const header = document.getElementById('header');
        header.appendChild(statusElement);
    }
    
    const hasActiveFilters = Object.values(activeFilters).some(filter => filter !== '');
    
    if (hasActiveFilters) {
        statusElement.innerHTML = `
            <span class="status-text">
                Showing ${filteredCount} of ${totalCount} employees
            </span>
            <button class="clear-all-btn" onclick="clearAllFilters()">
                Clear All Filters
            </button>
        `;
        statusElement.classList.add('active');
    } else {
        statusElement.innerHTML = `<span class="status-text">Showing all ${totalCount} employees</span>`;
        statusElement.classList.remove('active');
    }
}

// Update pagination based on filtered results
function updatePagination() {
    const paginationModule = window.paginationModule;
    if (paginationModule && paginationModule.updateWithFilteredData) {
        paginationModule.updateWithFilteredData(filteredEmployees);
    }
}

// Export functions
export { filteredEmployees, applyFilters, clearAllFilters };

// Make clearAllFilters global for template access
window.clearAllFilters = clearAllFilters;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFilters);
