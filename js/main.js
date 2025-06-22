// Global variables
let products = [];
let cart = [];

// API base URL
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', async () => {
    // Load products from API
    await loadProducts();
    
    // Initialize cart from localStorage
    initializeCart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up mobile filter dropdown
    setupMobileFilterDropdown();
    
    // Initial render
    renderProducts();
    updateCartCount();
});

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        
        if (data.success) {
            products = data.data;
            console.log('Products loaded from API:', products);
        } else {
            console.error('Failed to load products:', data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render products in the grid
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.filter = `dumpling-${product.subcategory.toLowerCase()}`;
        
        productCard.innerHTML = `
            <div class="product-card-inner">
                <div class="product-card-front">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-card-back">
                    <h4>${product.name.split(' ').slice(0, 2).join(' ')}</h4>
                    <p>${product.description}</p>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">€${product.price.toFixed(2)}</p>
                <div class="product-details">
                    <span class="rating">★ ${product.rating}</span>
                    <span class="reviews">(${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Re-attach event listeners for new buttons
    setupAddToCartListeners();
    setupReviewListeners();
}

// --- FILTERING LOGIC ---
function setupEventListeners() {
    const allCheckboxes = document.querySelectorAll('.filters input[name="filter"]');
    
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
    
    // Cart modal event listeners
    setupCartModalListeners();
    
    // Search functionality
    setupSearchListeners();
}

function filterProducts() {
    const productCards = document.querySelectorAll('.product-card');
    const allCheckboxes = document.querySelectorAll('.filters input[name="filter"]');
    
    const selectedFilters = Array.from(allCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    productCards.forEach(card => {
        const cardFilter = card.dataset.filter;
        let shouldShow = false;

        if (selectedFilters.length === 0) {
            // If no filters are selected, only show dumplings
            if (cardFilter.startsWith('dumpling')) {
                shouldShow = true;
            }
        } else {
            // If filters are selected, show cards that match the selection
            if (selectedFilters.includes(cardFilter)) {
                shouldShow = true;
            }
        }
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// --- SHOPPING CART LOGIC ---
function setupAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function updateCartCount() {
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Cart (${totalItems})`;
    }
}

function addToCart(e) {
    const productId = parseInt(e.target.dataset.productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    showNotification(`${product.name} added to cart!`);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// --- CART MODAL LOGIC ---
function setupCartModalListeners() {
    const cartModal = document.getElementById('cart-modal');
    const cartLink = document.getElementById('cart-link');
    const cartCloseButton = document.querySelector('#cart-modal .close-button');
    const checkoutButton = document.getElementById('checkout-button');

    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (cartCloseButton) {
        cartCloseButton.addEventListener('click', closeModal);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = '/checkout';
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == cartModal) {
            closeModal();
        }
    });
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-modal';

            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image-modal">
                <div class="cart-item-details-modal">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls-modal">
                        <button class="quantity-btn-modal" data-index="${index}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn-modal" data-index="${index}" data-action="increase">+</button>
                    </div>
                </div>
                <div class="cart-item-price-modal">
                    <span>€${lineTotal.toFixed(2)}</span>
                    <button class="remove-item-modal" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    const subtotalElement = document.getElementById('cart-subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
    }
    
    updateCartCount();
    addCartEventListeners();
}

function addCartEventListeners() {
    document.querySelectorAll('.quantity-btn-modal').forEach(button => {
        button.addEventListener('click', updateQuantity);
    });
    document.querySelectorAll('.remove-item-modal').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

function updateQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const action = e.target.dataset.action;
    
    if (action === 'increase') {
        cart[index].quantity++;
    } else if (action === 'decrease') {
        cart[index].quantity--;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
}

function removeItem(e) {
    const index = parseInt(e.target.dataset.index);
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
}

function openModal() {
    renderCartItems();
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'block';
    }
}

function closeModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// --- CART INITIALIZATION ---
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error parsing saved cart:', error);
            cart = [];
        }
    }
}

// --- SEARCH FUNCTIONALITY ---
function setupSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchModal = document.getElementById('search-modal');
    const searchCloseButton = document.querySelector('#search-modal .close-button');
    const searchLink = document.getElementById('search-link');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', closeSearchModal);
    }

    if (searchLink) {
        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            openSearchModal();
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == searchModal) {
            closeSearchModal();
        }
    });
}

async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/search/${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
            displaySearchResults(data.data);
            openSearchModal();
        } else {
            showNotification('No products found');
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Search failed. Please try again.');
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    if (!searchResultsContainer) return;
    
    searchResultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-details">
                <h4>${product.name}</h4>
                <p>€${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        searchResultsContainer.appendChild(resultItem);
    });
    
    // Re-attach event listeners for search result buttons
    document.querySelectorAll('#search-results .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function openSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.style.display = 'block';
    }
}

function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
        searchModal.style.display = 'none';
    }
}

// --- REVIEWS MODAL LOGIC ---
function setupReviewListeners() {
    document.querySelectorAll('.reviews').forEach(span => {
        span.style.cursor = 'pointer';
        span.addEventListener('click', async (e) => {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;
            const productId = products[Array.from(productCard.parentNode.children).indexOf(productCard)].id;
            await openReviewsModal(productId);
        });
    });
}

async function openReviewsModal(productId) {
    // Create modal if not exists
    let modal = document.getElementById('reviews-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reviews-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000;`;
        document.body.appendChild(modal);
    }
    modal.innerHTML = `<div class="reviews-modal-content" style="background: #fff; padding: 32px; border-radius: 10px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative;">
        <button id="close-reviews-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        <div id="reviews-list"></div>
        <hr style="margin: 24px 0;">
        <h4>Write a Review</h4>
        <form id="review-form">
            <input type="text" name="userName" placeholder="Your Name" required style="width: 100%; margin-bottom: 8px;">
            <select name="rating" required style="width: 100%; margin-bottom: 8px;">
                <option value="">Rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
            </select>
            <input type="text" name="title" placeholder="Review Title" required style="width: 100%; margin-bottom: 8px;">
            <textarea name="comment" placeholder="Your review..." required style="width: 100%; margin-bottom: 8px;"></textarea>
            <button type="submit" style="background: #e74c3c; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Submit Review</button>
        </form>
    </div>`;
    document.getElementById('close-reviews-modal').onclick = () => modal.remove();
    // Fetch and render reviews
    await renderReviews(productId);
    // Handle form submit
    document.getElementById('review-form').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userName = form.userName.value.trim();
        const rating = form.rating.value;
        const title = form.title.value.trim();
        const comment = form.comment.value.trim();
        if (!userName || !rating || !title || !comment) return;
        // For demo, use a random userId
        const userId = 'guest-' + Math.random().toString(36).substr(2, 9);
        const res = await fetch(`/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, userId, userName, rating, title, comment })
        });
        form.reset();
        await renderReviews(productId);
    };
}

async function renderReviews(productId) {
    const list = document.getElementById('reviews-list');
    list.innerHTML = '<em>Loading reviews...</em>';
    const res = await fetch(`/api/reviews/product/${productId}`);
    const data = await res.json();
    if (!data.success || !data.data.length) {
        list.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
        return;
    }
    list.innerHTML = data.data.map(r => `
        <div class="review-item" style="border-bottom: 1px solid #eee; padding: 12px 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <strong>${r.userName}</strong>
                <span style="color: #e67e22;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                <span style="font-size: 12px; color: #888;">${new Date(r.date).toLocaleDateString()}</span>
            </div>
            <div style="font-weight: bold;">${r.title}</div>
            <div>${r.comment}</div>
            <button class="helpful-btn" data-review-id="${r.id}" style="background: none; border: none; color: #3498db; cursor: pointer; font-size: 13px;">Helpful (${r.helpful})</button>
        </div>
    `).join('');
    // Add helpful listeners
    list.querySelectorAll('.helpful-btn').forEach(btn => {
        btn.onclick = async () => {
            await fetch(`/api/reviews/${btn.dataset.reviewId}/helpful`, { method: 'PATCH' });
            await renderReviews(productId);
        };
    });
}

// Add CSS for notification animation
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

// Mobile Filter Dropdown Functionality
function setupMobileFilterDropdown() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterDropdown = document.getElementById('filter-dropdown');
    
    if (filterToggle && filterDropdown) {
        filterToggle.addEventListener('click', () => {
            filterDropdown.classList.toggle('active');
            
            // Update toggle button icon
            const chevronIcon = filterToggle.querySelector('.fa-chevron-down');
            if (chevronIcon) {
                if (filterDropdown.classList.contains('active')) {
                    chevronIcon.classList.remove('fa-chevron-down');
                    chevronIcon.classList.add('fa-chevron-up');
                } else {
                    chevronIcon.classList.remove('fa-chevron-up');
                    chevronIcon.classList.add('fa-chevron-down');
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!filterToggle.contains(e.target) && !filterDropdown.contains(e.target)) {
                filterDropdown.classList.remove('active');
                const chevronIcon = filterToggle.querySelector('.fa-chevron-up');
                if (chevronIcon) {
                    chevronIcon.classList.remove('fa-chevron-up');
                    chevronIcon.classList.add('fa-chevron-down');
                }
            }
        });
    }
} 