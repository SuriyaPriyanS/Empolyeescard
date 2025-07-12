import { employees, addEmployee, updateEmployee, deleteEmployee, getEmployee } from './data.js';
import { render } from './dashboard.js';

// Delete employee with confirmation
export function deleteEmployeeWithConfirmation(id) {
    const employee = getEmployee(id);
    if (!employee) {
        showNotification('Employee not found', 'error');
        return;
    }
    
    showDeleteModal(employee);
}

// Show delete confirmation modal
function showDeleteModal(employee) {
    const modal = document.getElementById('deleteModal');
    if (!modal) {
        createDeleteModal();
        return showDeleteModal(employee);
    }
    
    modal.classList.remove('hidden');
    
    const confirmBtn = document.getElementById('confirmDelete');
    const cancelBtn = document.getElementById('cancelDelete');
    
    // Remove existing listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add new listeners
    newConfirmBtn.addEventListener('click', () => {
        performDelete(employee.id);
        modal.classList.add('hidden');
    });
    
    newCancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // Update modal content
    const modalContent = modal.querySelector('.modal-content p');
    if (modalContent) {
        modalContent.innerHTML = `
            Are you sure you want to delete <strong>${employee.firstName} ${employee.lastName}</strong>?
            <br><small>This action cannot be undone.</small>
        `;
    }
}

// Create delete modal if it doesn't exist
function createDeleteModal() {
    const modal = document.createElement('div');
    modal.id = 'deleteModal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Confirm Delete</h2>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this employee?</p>
                </div>
                <div class="modal-footer">
                    <button id="cancelDelete" class="secondary-btn">Cancel</button>
                    <button id="confirmDelete" class="danger-btn">Delete Employee</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            modal.classList.add('hidden');
        }
    });
}

// Perform deletion
function performDelete(id) {
    const result = deleteEmployee(id);
    
    if (result.success) {
        showNotification(`Employee ${result.employee.firstName} ${result.employee.lastName} deleted successfully`, 'success');
        
        // Refresh the display
        render();
        
        // Update any active filters
        const filterModule = window.filterModule;
        if (filterModule && filterModule.applyFilters) {
            filterModule.applyFilters();
        }
    } else {
        showNotification('Error deleting employee', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Export functions for global access
window.deleteEmployee = deleteEmployeeWithConfirmation;
window.editEmployee = function(id) {
    window.location.href = `form.html?id=${id}`;
};
