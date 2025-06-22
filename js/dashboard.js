// API base URL
const API_BASE = '/api';

// Dashboard functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/account';
        return;
    }

    // Load user data and orders
    await loadUserData();
    await loadOrderHistory();
    
    // Set up navigation
    setupNavigation();
    
    // Set up form handlers
    setupFormHandlers();
    
    // Show default section
    showSection('overview');
});

async function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            throw new Error('No user data found');
        }
        
        // Display user info
        const userNameElement = document.querySelector('.user-name');
        const userEmailElement = document.querySelector('.user-email');
        
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
        if (userEmailElement) {
            userEmailElement.textContent = userData.email;
        }
        
        // Populate profile form
        populateProfileForm(userData);
        
    } catch (error) {
        console.error('Error loading user data:', error);
        showMessage('Error loading user data', 'error');
    }
}

async function loadOrderHistory() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) return;
        
        const response = await fetch(`${API_BASE}/orders/customer/${userData.email}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayOrderHistory(data.data);
        } else {
            console.error('Failed to load orders:', data.message);
        }
        
    } catch (error) {
        console.error('Error loading order history:', error);
    }
}

function displayOrderHistory(orders) {
    const orderHistoryContainer = document.querySelector('.order-history');
    if (!orderHistoryContainer) return;
    
    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    orderHistoryContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        orderElement.innerHTML = `
            <div class="order-header">
                <h4>Order #${order.orderNumber}</h4>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${orderDate}</p>
                <p><strong>Items:</strong> ${totalItems}</p>
                <p><strong>Total:</strong> €${order.totalAmount.toFixed(2)}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <span>${item.name} x${item.quantity}</span>
                        <span>€${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        orderHistoryContainer.appendChild(orderElement);
    });
}

function populateProfileForm(userData) {
    const profileForm = document.querySelector('.profile-form');
    if (!profileForm) return;
    
    const nameInput = profileForm.querySelector('#name');
    const emailInput = profileForm.querySelector('#email');
    const phoneInput = profileForm.querySelector('#phone');
    
    if (nameInput) nameInput.value = userData.name || '';
    if (emailInput) emailInput.value = userData.email || '';
    if (phoneInput) phoneInput.value = userData.phone || '';
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(s => s.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function setupFormHandlers() {
    // Profile form
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Updating...';
                
                const formData = new FormData(this);
                const userData = JSON.parse(localStorage.getItem('userData'));
                
                const response = await fetch(`${API_BASE}/users/profile/${userData.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        phone: formData.get('phone')
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Update stored user data
                    const updatedUserData = { ...userData, ...data.data };
                    localStorage.setItem('userData', JSON.stringify(updatedUserData));
                    
                    showMessage('Profile updated successfully!', 'success');
                } else {
                    showMessage(data.message || 'Failed to update profile', 'error');
                }
                
            } catch (error) {
                console.error('Profile update error:', error);
                showMessage('Failed to update profile', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // Password form
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                const currentPassword = this.querySelector('#current-password').value;
                const newPassword = this.querySelector('#new-password').value;
                const confirmPassword = this.querySelector('#confirm-password').value;
                
                if (!currentPassword || !newPassword || !confirmPassword) {
                    showMessage('Please fill in all password fields', 'error');
                    return;
                }
                
                if (newPassword !== confirmPassword) {
                    showMessage('New passwords do not match', 'error');
                    return;
                }
                
                if (newPassword.length < 6) {
                    showMessage('New password must be at least 6 characters long', 'error');
                    return;
                }
                
                submitButton.disabled = true;
                submitButton.textContent = 'Changing Password...';
                
                const userData = JSON.parse(localStorage.getItem('userData'));
                
                const response = await fetch(`${API_BASE}/users/profile/${userData.id}/password`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showMessage('Password changed successfully!', 'success');
                    this.reset();
                } else {
                    showMessage(data.message || 'Failed to change password', 'error');
                }
                
            } catch (error) {
                console.error('Password change error:', error);
                showMessage('Failed to change password', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
    
    // Logout button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear stored data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Redirect to home page
            window.location.href = '/';
        });
    }
}

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

// Add CSS for animations and order styling
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
    
    .order-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        background: white;
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .order-status {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .order-status.pending { background: #fff3cd; color: #856404; }
    .order-status.confirmed { background: #d1ecf1; color: #0c5460; }
    .order-status.preparing { background: #d4edda; color: #155724; }
    .order-status.shipped { background: #cce5ff; color: #004085; }
    .order-status.delivered { background: #d4edda; color: #155724; }
    .order-status.cancelled { background: #f8d7da; color: #721c24; }
    
    .order-items {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    
    .order-item-detail {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 14px;
    }
`;
document.head.appendChild(style); 