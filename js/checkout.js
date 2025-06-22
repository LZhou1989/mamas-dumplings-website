// API base URL
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryContainer = document.getElementById('summary-items');
    const subtotalPriceElement = document.getElementById('subtotal-price');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutForm = document.querySelector('.checkout-form');
    const submitButton = document.querySelector('.checkout-form button[type="submit"]');

    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = '/';
        return;
    }

    function renderSummary() {
        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p>No items to check out.</p>';
            return;
        }

        let subtotalPrice = 0;
        summaryContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            
            const lineTotal = item.price * item.quantity;

            itemElement.innerHTML = `
                <div class="summary-item-image-container">
                    <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                    <span class="item-quantity-badge">${item.quantity}</span>
                </div>
                <div class="summary-item-details">
                    <h4>${item.name}</h4>
                </div>
                <div class="summary-item-price">€${lineTotal.toFixed(2)}</div>
            `;
            summaryContainer.appendChild(itemElement);

            subtotalPrice += lineTotal;
        });
        
        subtotalPriceElement.textContent = `€${subtotalPrice.toFixed(2)}`;
        totalPriceElement.textContent = `EUR €${subtotalPrice.toFixed(2)}`;
    }

    async function createOrder(formData) {
        try {
            // Prepare order data
            const orderData = {
                customerInfo: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: parseFloat(totalPriceElement.textContent.replace('EUR €', '')),
                shippingAddress: {
                    street: formData.get('address'),
                    city: formData.get('city'),
                    postalCode: formData.get('postal-code'),
                    country: formData.get('country')
                },
                paymentMethod: formData.get('payment-method') || 'Credit Card'
            };

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Processing Order...';

            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                // Order created successfully
                showSuccessMessage(result.data);
                localStorage.removeItem('cart'); // Clear cart
            } else {
                throw new Error(result.message || 'Failed to create order');
            }

        } catch (error) {
            console.error('Order creation error:', error);
            showErrorMessage('Failed to create order. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Place Order';
        }
    }

    function showSuccessMessage(orderData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <h2>🎉 Order Placed Successfully!</h2>
                <p>Thank you for your order, ${orderData.customerInfo?.name || 'Valued Customer'}!</p>
                <div class="order-details">
                    <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
                    <p><strong>Total Amount:</strong> €${orderData.totalAmount.toFixed(2)}</p>
                    <p><strong>Estimated Delivery:</strong> ${new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
                </div>
                <p>You will receive a confirmation email shortly.</p>
                <button onclick="window.location.href='/'">Continue Shopping</button>
            </div>
        `;
        
        // Add styles
        successMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const successContent = successMessage.querySelector('.success-content');
        successContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            max-width: 500px;
            margin: 20px;
        `;
        
        successContent.querySelector('button').style.cssText = `
            background: #e74c3c;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        `;
        
        document.body.appendChild(successMessage);
    }

    function showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h3>❌ Order Failed</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Try Again</button>
            </div>
        `;
        
        // Add styles
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        errorMessage.querySelector('button').style.cssText = `
            background: white;
            color: #e74c3c;
            border: none;
            padding: 8px 16px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 10px;
        `;
        
        document.body.appendChild(errorMessage);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorMessage.parentElement) {
                errorMessage.remove();
            }
        }, 5000);
    }

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(checkoutForm);
        
        // Basic validation
        const requiredFields = ['name', 'email', 'address', 'city', 'postal-code', 'country'];
        const missingFields = requiredFields.filter(field => !formData.get(field));
        
        if (missingFields.length > 0) {
            showErrorMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
        
        // Email validation
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorMessage('Please enter a valid email address');
            return;
        }
        
        await createOrder(formData);
    });

    renderSummary();
});

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