// Footer component for the Employee Management System
export function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    
    footer.innerHTML = `
        <div class="footer-content">
            <div class="footer-section">
                <h4>Employee Management System</h4>
                <p>Efficiently manage your workforce with our comprehensive employee management solution.</p>
            </div>
            
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#employees">All Employees</a></li>
                    <li><a href="#departments">Departments</a></li>
                    <li><a href="#reports">Reports</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Contact Info</h4>
                <ul>
                    <li>📧 suriyapriyan056@gmail.com</li>
                    <li>📞 9025071091</li>
                    <li>📍 Chennai</li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h4>Follow Us</h4>
                <div class="social-links">
                    <a href="#" aria-label="LinkedIn">💼</a>
                    <a href="#" aria-label="Twitter">🐦</a>
                    <a href="#" aria-label="Facebook">📘</a>
                    <a href="#" aria-label="Instagram">📷</a>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="footer-bottom-content">
                <p>&copy; ${new Date().getFullYear()} Employee Management System. All rights reserved.</p>
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                    <a href="#cookies">Cookie Policy</a>
                </div>
            </div>
        </div>
    `;
    
    return footer;
}

// Initialize footer
export function initializeFooter() {
    const existingFooter = document.querySelector('.app-footer');
    if (existingFooter) {
        existingFooter.remove();
    }
    
    const footer = createFooter();
    document.body.appendChild(footer);
    
    // Add smooth scrolling for anchor links
    footer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFooter);
