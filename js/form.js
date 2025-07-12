import {
  employees,
  addEmployee,
  updateEmployee,
  getEmployee,
  deleteEmployee,
  validateEmployee,
  loadEmployees,
} from './data.js';

let isEditMode = false;
let currentEmployeeId = null;

// Initialize form
export async function initializeForm() {
  await loadEmployees(); // ✅ Wait for localStorage data to load
  setupFormMode();
  setupFormValidation();
  setupFormSubmission();
  setupFormNavigation();
}

// Setup form mode (add/edit)
function setupFormMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get('id');

  if (employeeId) {
    isEditMode = true;
    currentEmployeeId = parseInt(employeeId);
    loadEmployeeForEdit();
  }

  updateFormTitle();
}

// Load employee data for editing
function loadEmployeeForEdit() {
  const employee = getEmployee(currentEmployeeId);
  if (employee) {
    populateFormFields(employee);
  } else {
    showNotification('Employee not found', 'error');
    setTimeout(() => (window.location.href = 'index.html'), 2000);
  }
}

// Populate form fields
function populateFormFields(employee) {
  const fields = ['firstName', 'lastName', 'email', 'department', 'role'];
  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (input && employee[field]) {
      input.value = employee[field];
    }
  });
}

// Update form title and button text
function updateFormTitle() {
  const title = document.getElementById('formTitle');
  const submitBtn = document.getElementById('submitBtn');

  if (title) {
    title.textContent = isEditMode ? 'Edit Employee' : 'Add New Employee';
  }

  if (submitBtn) {
    submitBtn.textContent = isEditMode ? 'Update Employee' : 'Add Employee';
  }
}

// Setup form validation
function setupFormValidation() {
  const form = document.getElementById('employeeForm');
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

// Validate individual field
function validateField(input) {
  const fieldName = input.name;
  const value = input.value.trim();
  const errorElement = document.getElementById(`${fieldName}Error`);

  let errorMessage = '';

  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (!value) {
        errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
      } else if (value.length < 2) {
        errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
      }
      break;

    case 'email':
      if (!value) {
        errorMessage = 'Email is required';
      } else if (!isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
      } else if (isDuplicateEmail(value)) {
        errorMessage = 'This email is already in use';
      }
      break;

    case 'department':
      if (!value) errorMessage = 'Department is required';
      break;

    case 'role':
      if (!value) {
        errorMessage = 'Role is required';
      } else if (value.length < 2) {
        errorMessage = 'Role must be at least 2 characters';
      }
      break;
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
    input.classList.toggle('error', !!errorMessage);
  }

  return !errorMessage;
}

// Clear field error
function clearFieldError(input) {
  const errorElement = document.getElementById(`${input.name}Error`);
  if (errorElement) {
    errorElement.textContent = '';
    input.classList.remove('error');
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check for duplicate email
function isDuplicateEmail(email) {
  return employees.some(
    (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.id !== currentEmployeeId
  );
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const employeeData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    email: formData.get('email').trim(),
    department: formData.get('department'),
    role: formData.get('role').trim(),
  };

  const isValid = validateAllFields(employeeData);
  if (!isValid) {
    showNotification('Please fix the errors above', 'error');
    return;
  }

  if (isEditMode) {
    handleUpdate(employeeData);
  } else {
    handleAdd(employeeData);
  }
}

// Validate all fields
function validateAllFields(data) {
  const form = document.getElementById('employeeForm');
  const inputs = form.querySelectorAll('input[required], select[required]');
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

// Handle add
function handleAdd(employeeData) {
  const result = addEmployee(employeeData);
  if (result.success) {
    showNotification('Employee added successfully!', 'success');
    setTimeout(() => (window.location.href = 'index.html'), 1500);
  } else {
    displayValidationErrors(result.errors);
  }
}

// Handle update
function handleUpdate(employeeData) {
  const result = updateEmployee(currentEmployeeId, employeeData);
  if (result.success) {
    showNotification('Employee updated successfully!', 'success');
    setTimeout(() => (window.location.href = 'index.html'), 1500);
  } else {
    displayValidationErrors(result.errors);
  }
}

// Display validation errors
function displayValidationErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.getElementById(`${field}Error`);
    const inputElement = document.getElementById(field);

    if (errorElement) {
      errorElement.textContent = message;
    }
    if (inputElement) {
      inputElement.classList.add('error');
    }
  });
}

// Setup form submission
function setupFormSubmission() {
  const form = document.getElementById('employeeForm');
  form.addEventListener('submit', handleFormSubmit);
}

// Setup cancel/delete buttons
function setupFormNavigation() {
  const cancelBtn = document.getElementById('cancelBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (hasUnsavedChanges()) {
        if (confirm('You have unsaved changes. Leave without saving?')) {
          window.location.href = 'index.html';
        }
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  if (deleteBtn && isEditMode) {
    deleteBtn.addEventListener('click', handleDelete);
  }
}

// Check for unsaved changes
function hasUnsavedChanges() {
  const current = getEmployee(currentEmployeeId);
  if (!current) return false;

  const form = document.getElementById('employeeForm');
  const formData = new FormData(form);

  return ['firstName', 'lastName', 'email', 'department', 'role'].some(
    (field) => formData.get(field).trim() !== current[field]
  );
}

// Handle delete
function handleDelete() {
  if (confirm('Are you sure you want to delete this employee?')) {
    const result = deleteEmployee(currentEmployeeId);
    if (result.success) {
      showNotification('Employee deleted successfully!', 'success');
      setTimeout(() => (window.location.href = 'index.html'), 1500);
    } else {
      showNotification('Error deleting employee', 'error');
    }
  }
}

// Show toast
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);

  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
}

// Init
document.addEventListener('DOMContentLoaded', initializeForm);
