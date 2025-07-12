<#include "layout.ftl">
<@layout pageTitle="Employee Directory - ${isEdit?then('Edit', 'Add')} Employee">
    <div class="form-container">
        <div class="form-header">
            <h1>${isEdit?then('Edit Employee', 'Add New Employee')}</h1>
            <a href="index.html" class="back-link">← Back to Directory</a>
        </div>

        <form id="employeeForm" class="employee-form">
            <#if isEdit>
                <input type="hidden" id="employeeId" name="id" value="${employee.id}">
            </#if>

            <div class="form-row">
                <div class="form-group">
                    <label for="firstName">First Name <span class="required">*</span></label>
                    <input type="text" 
                           id="firstName" 
                           name="firstName" 
                           value="${employee.firstName!''}" 
                           required
                           placeholder="Enter first name">
                    <span class="error-message" id="firstNameError"></span>
                </div>

                <div class="form-group">
                    <label for="lastName">Last Name <span class="required">*</span></label>
                    <input type="text" 
                           id="lastName" 
                           name="lastName" 
                           value="${employee.lastName!''}" 
                           required
                           placeholder="Enter last name">
                    <span class="error-message" id="lastNameError"></span>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email Address <span class="required">*</span></label>
                <input type="email" 
                       id="email" 
                       name="email" 
                       value="${employee.email!''}" 
                       required
                       placeholder="Enter email address">
                <span class="error-message" id="emailError"></span>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="department">Department <span class="required">*</span></label>
                    <select id="department" name="department" required>
                        <option value="">Select Department</option>
                        <#list departments as dept>
                            <option value="${dept}" 
                                    <#if employee?? && employee.department == dept>selected</#if>>
                                ${dept}
                            </option>
                        </#list>
                    </select>
                    <span class="error-message" id="departmentError"></span>
                </div>

                <div class="form-group">
                    <label for="role">Role <span class="required">*</span></label>
                    <input type="text" 
                           id="role" 
                           name="role" 
                           value="${employee.role!''}" 
                           required
                           placeholder="Enter job role">
                    <span class="error-message" id="roleError"></span>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="primary-btn">
                    ${isEdit?then('Update Employee', 'Add Employee')}
                </button>
                <button type="button" id="cancelBtn" class="secondary-btn">Cancel</button>
                <#if isEdit>
                    <button type="button" id="deleteBtn" class="danger-btn">Delete Employee</button>
                </#if>
            </div>
        </form>
    </div>

    <script>
        // Pass Freemarker data to JavaScript
        window.formData = {
            isEdit: ${isEdit?c},
            employee: <#if employee??>{
                id: ${employee.id},
                firstName: "${employee.firstName}",
                lastName: "${employee.lastName}",
                email: "${employee.email}",
                department: "${employee.department}",
                role: "${employee.role}"
            }<#else>null</#if>,
            departments: [<#list departments as dept>"${dept}"<#if dept_has_next>,</#if></#list>]
        };
    </script>
    <script src="js/data.js" type="module"></script>
    <script src="js/form.js" type="module"></script>
</@layout>
