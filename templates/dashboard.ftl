<#include "layout.ftl">
<@layout pageTitle="Employee Directory - Dashboard">
    <header id="header">
        <h1>Employee Directory</h1>
        <div class="header-controls">
            <input type="text" id="searchBar" placeholder="Search by name or email">
            <button id="filterBtn">Filter</button>
            <a href="form.html" class="add-btn">Add Employee</a>
        </div>
        <div class="sort-controls">
            <button id="sortFirstName">Sort by First Name</button>
            <button id="sortDepartment">Sort by Department</button>
        </div>
    </header>

    <!-- Filter Sidebar -->
    <div id="filterSidebar" class="sidebar hidden">
        <h3>Filter Employees</h3>
        <div class="filter-group">
            <label>First Name: 
                <input type="text" id="filterFirstName" placeholder="Enter first name">
            </label>
        </div>
        <div class="filter-group">
            <label>Department: 
                <select id="filterDepartment">
                    <option value="">All Departments</option>
                    <#list departments as dept>
                        <option value="${dept}">${dept}</option>
                    </#list>
                </select>
            </label>
        </div>
        <div class="filter-group">
            <label>Role: 
                <select id="filterRole">
                    <option value="">All Roles</option>
                    <#list roles as role>
                        <option value="${role}">${role}</option>
                    </#list>
                </select>
            </label>
        </div>
        <button id="applyFilter">Apply Filters</button>
        <button id="clearFilters">Clear All</button>
    </div>

    <!-- Employee Grid -->
    <div class="employee-grid" id="employeeGrid">
        <#if employees?has_content>
            <#list employees as employee>
                <div class="employee-card" data-id="${employee.id}">
                    <div class="employee-header">
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <span class="employee-id">#${employee.id}</span>
                    </div>
                    <div class="employee-info">
                        <p><strong>Email:</strong> ${employee.email}</p>
                        <p><strong>Department:</strong> ${employee.department}</p>
                        <p><strong>Role:</strong> ${employee.role}</p>
                    </div>
                    <div class="employee-actions">
                        <button class="edit-btn" onclick="editEmployee(${employee.id})">
                            <i class="icon-edit"></i> Edit
                        </button>
                        <button class="delete-btn" onclick="deleteEmployee(${employee.id})">
                            <i class="icon-delete"></i> Delete
                        </button>
                    </div>
                </div>
            </#list>
        <#else>
            <div class="no-employees">
                <h3>No employees found</h3>
                <p>Start by adding your first employee.</p>
                <a href="form.html" class="add-btn">Add Employee</a>
            </div>
        </#if>
    </div>

    <!-- Pagination -->
    <div class="pagination">
        <div class="pagination-info">
            <label>Show: 
                <select id="pageSize">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </label>
            <span id="pageInfo">Showing ${currentPage * pageSize + 1}-${(currentPage + 1) * pageSize} of ${totalEmployees}</span>
        </div>
        <div class="pagination-controls">
            <button id="prevPage" <#if currentPage == 0>disabled</#if>>Previous</button>
            <div class="page-numbers">
                <#list 1..totalPages as pageNum>
                    <button class="page-btn <#if pageNum-1 == currentPage>active</#if>" 
                            onclick="goToPage(${pageNum-1})">${pageNum}</button>
                </#list>
            </div>
            <button id="nextPage" <#if currentPage >= totalPages-1>disabled</#if>>Next</button>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal hidden">
        <div class="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div class="modal-actions">
                <button id="confirmDelete" class="danger-btn">Yes, Delete</button>
                <button id="cancelDelete" class="secondary-btn">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        // Pass Freemarker data to JavaScript
        window.employeeData = {
            employees: [
                <#list employees as employee>
                {
                    id: ${employee.id},
                    firstName: "${employee.firstName}",
                    lastName: "${employee.lastName}",
                    email: "${employee.email}",
                    department: "${employee.department}",
                    role: "${employee.role}"
                }<#if employee_has_next>,</#if>
                </#list>
            ],
            departments: [<#list departments as dept>"${dept}"<#if dept_has_next>,</#if></#list>],
            roles: [<#list roles as role>"${role}"<#if role_has_next>,</#if></#list>],
            pagination: {
                currentPage: ${currentPage},
                pageSize: ${pageSize},
                totalPages: ${totalPages},
                totalEmployees: ${totalEmployees}
            }
        };
    </script>
    <script src="js/data.js" type="module"></script>
    <script src="js/dashboard.js" type="module"></script>
    <script src="js/filter.js" type="module"></script>
    <script src="js/pagination.js" type="module"></script>
    <script src="js/crud.js" type="module"></script>
</@layout>
