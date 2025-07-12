// Mock data (used only if no localStorage yet)
let employees = [];

const mockEmployees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    role: "Senior Developer"
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    department: "HR",
    role: "HR Manager"
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    department: "Engineering",
    role: "Frontend Developer"
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@company.com",
    department: "Marketing",
    role: "Marketing Specialist"
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    department: "Sales",
    role: "Sales Manager"
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    department: "HR",
    role: "Recruiter"
  },
  {
    id: 7,
    firstName: "Chris",
    lastName: "Miller",
    email: "chris.miller@company.com",
    department: "Engineering",
    role: "Backend Developer"
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Garcia",
    email: "lisa.garcia@company.com",
    department: "Marketing",
    role: "Content Manager"
  }
];

// Available departments and roles
const departments = ["Engineering", "HR", "Marketing", "Sales", "Finance"];
const roles = ["Developer", "Manager", "Specialist", "Analyst", "Coordinator"];

export { employees, departments, roles };

// Load from localStorage or fallback to mock data
export async function loadEmployees() {
  const stored = localStorage.getItem('employees');
  console.log('Loading employees from localStorage:', stored);
  employees.length = 0;
  if (stored) {
    try {
      employees.push(...JSON.parse(stored));
      console.log(`Loaded ${employees.length} employees from localStorage`);
    } catch (error) {
      console.error('Error parsing employee data:', error);
    }
  } else {
    // First-time use — use mock data and save it
    employees.push(...mockEmployees);
    saveEmployees();
    console.log('Initialized with mock data', employees);
  }
}

// Save employees to localStorage
export function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Generate new unique ID
export function generateId() {
  return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
}

// Validation logic
export function validateEmployee(employee) {
  const errors = {};

  if (!employee.firstName?.trim()) errors.firstName = 'First name is required';
  if (!employee.lastName?.trim()) errors.lastName = 'Last name is required';

  if (!employee.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(employee.email)) {
    errors.email = 'Please enter a valid email address';
  } else if (isDuplicateEmail(employee.email, employee.id)) {
    errors.email = 'This email is already in use';
  }

  if (!employee.department?.trim()) errors.department = 'Department is required';
  if (!employee.role?.trim()) errors.role = 'Role is required';

  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isDuplicateEmail(email, excludeId = null) {
  return employees.some(emp =>
    emp.email.toLowerCase() === email.toLowerCase() &&
    emp.id !== excludeId
  );
}

// CRUD operations

export function getEmployee(id) {
      console.log("All employees before getEmployee:", employees); // debug
  return employees.find(emp => emp.id === id);
}




export function addEmployee(employeeData) {
  const errors = validateEmployee(employeeData);
  if (Object.keys(errors).length > 0) return { success: false, errors };

  const newEmployee = {
    id: generateId(),
    ...employeeData
  };
  employees.push(newEmployee);
  saveEmployees();
  return { success: true, employee: newEmployee };
}

export function updateEmployee(id, employeeData) {
  const index = employees.findIndex(emp => emp.id === id);
  
  if (index === -1) return { success: false, errors: { general: 'Employee not found' } };

  const errors = validateEmployee({ ...employeeData, id });
  if (Object.keys(errors).length > 0) return { success: false, errors };

  employees[index] = { id, ...employeeData };
  saveEmployees();
  return { success: true, employee: employees[index] };
}

export function deleteEmployee(id) {
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return { success: false, error: 'Employee not found' };

  const deleted = employees.splice(index, 1)[0];
  saveEmployees();
  return { success: true, employee: deleted };
}

// ✅ Load on module import
loadEmployees();
