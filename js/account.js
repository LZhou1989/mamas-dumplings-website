// API base URL
const API_BASE = '/api';

// Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        // Redirect to dashboard if already logged in
        window.location.href = '/dashboard';
        return;
    }

    // Handle login form submission
    const loginForm = document.querySelector('.login-section form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Get form data
                const email = this.querySelector('#email').value;
                const password = this.querySelector('#password').value;
                
                // Validation
                if (!email || !password) {
                    showMessage('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Logging in...';
                
                // Send login request
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Store token and user data
                    localStorage.setItem('authToken', data.data.token);
                    localStorage.setItem('userData', JSON.stringify(data.data.user));
                    
                    showMessage('Login successful! Redirecting to your account...', 'success');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
                }
                
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Login failed. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Handle registration form submission
    const registerForm = document.querySelector('.register-section form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Get form data
                const firstName = this.querySelector('#first-name').value;
                const lastName = this.querySelector('#last-name').value;
                const email = this.querySelector('#register-email').value;
                const password = this.querySelector('#register-password').value;
                const confirmPassword = this.querySelector('#confirm-password').value;
                
                // Validation
                if (!firstName || !lastName || !email || !password || !confirmPassword) {
                    showMessage('Please fill in all required fields.', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showMessage('Passwords do not match.', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showMessage('Password must be at least 6 characters long.', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showMessage('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Creating Account...';
                
                // Send registration request
                const response = await fetch(`${API_BASE}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: `${firstName} ${lastName}`,
                        email,
                        password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMessage('Account created successfully! You can now log in.', 'success');
                    
                    // Clear form
                    registerForm.reset();
                    
                    // Switch to login form
                    setTimeout(() => {
                        document.querySelector('.login-section').scrollIntoView({ behavior: 'smooth' });
                    }, 2000);
                } else {
                    showMessage(data.message || 'Registration failed. Please try again.', 'error');
                }
                
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Registration failed. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
    
    // Handle form switching
    const switchToRegisterLink = document.querySelector('.switch-to-register');
    const switchToLoginLink = document.querySelector('.switch-to-login');
    
    if (switchToRegisterLink) {
        switchToRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.register-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (switchToLoginLink) {
        switchToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.login-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Show message function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // Add styles
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            messageElement.style.background = '#4CAF50';
            break;
        case 'error':
            messageElement.style.background = '#f44336';
            break;
        case 'warning':
            messageElement.style.background = '#ff9800';
            break;
        default:
            messageElement.style.background = '#2196F3';
    }
    
    document.body.appendChild(messageElement);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentElement) {
            messageElement.remove();
        }
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 