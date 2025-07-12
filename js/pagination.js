import { employees } from './data.js';
import { renderEmployees as render } from './dashboard.js';

let currentPage = 0;
let pageSize = 10;
let totalPages = 0;
let currentData = [...employees];

// Initialize pagination
export function initializePagination() {
    setupPaginationControls();
    updatePagination();
}

// Setup pagination controls
function setupPaginationControls() {
    const pageSizeSelect = document.getElementById('pageSize');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (e) => {
            pageSize = parseInt(e.target.value);
            currentPage = 0;
            updatePagination();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updatePagination();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updatePagination();
            }
        });
    }
}

// Update pagination display and data
function updatePagination() {
    totalPages = Math.ceil(currentData.length / pageSize);
    
    // Ensure current page is valid
    if (currentPage >= totalPages) {
        currentPage = Math.max(0, totalPages - 1);
    }
    
    // Get current page data
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = currentData.slice(startIndex, endIndex);
    
    // Render current page
    render(pageData);
    
    // Update pagination info
    updatePaginationInfo();
    updatePaginationButtons();
    renderPageNumbers();
}

// Update pagination information display
function updatePaginationInfo() {
    const pageInfo = document.getElementById('pageInfo');
    if (!pageInfo) return;
    
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, currentData.length);
    
    if (currentData.length === 0) {
        pageInfo.textContent = 'No employees to display';
    } else {
        pageInfo.textContent = `Showing ${startItem}-${endItem} of ${currentData.length} employees`;
    }
}

// Update pagination button states
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.classList.toggle('disabled', currentPage === 0);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages - 1;
        nextBtn.classList.toggle('disabled', currentPage >= totalPages - 1);
    }
}

// Render page number buttons
function renderPageNumbers() {
    const pageNumbersContainer = document.querySelector('.page-numbers');
    if (!pageNumbersContainer) return;
    
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    let pageNumbersHTML = '';
    
    // First page button
    if (startPage > 0) {
        pageNumbersHTML += `<button class="page-btn" onclick="goToPage(0)">1</button>`;
        if (startPage > 1) {
            pageNumbersHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        pageNumbersHTML += `
            <button class="page-btn ${isActive ? 'active' : ''}" 
                    onclick="goToPage(${i})">
                ${i + 1}
            </button>
        `;
    }
    
    // Last page button
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            pageNumbersHTML += `<span class="page-ellipsis">...</span>`;
        }
        pageNumbersHTML += `<button class="page-btn" onclick="goToPage(${totalPages - 1})">${totalPages}</button>`;
    }
    
    pageNumbersContainer.innerHTML = pageNumbersHTML;
}

// Go to specific page
function goToPage(page) {
    if (page >= 0 && page < totalPages) {
        currentPage = page;
        updatePagination();
    }
}

// Update with filtered data
function updateWithFilteredData(filteredData) {
    currentData = filteredData;
    currentPage = 0;
    updatePagination();
}

// Export functions
export { updateWithFilteredData, goToPage };

// Make goToPage global for template access
window.goToPage = goToPage;

// Store pagination module globally for filter integration
window.paginationModule = { updateWithFilteredData };

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePagination);
