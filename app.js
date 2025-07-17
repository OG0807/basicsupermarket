// Product data
const products = [
  {"id": 1, "name": "Bananas", "category": "Produce", "price": 0.99},
  {"id": 2, "name": "Apples", "category": "Produce", "price": 1.29, "image": "https://www.shutterstock.com/image-photo/red-apple-cut-half-water-droplets-2532255795"},
  {"id": 3, "name": "Milk (1L)", "category": "Dairy", "price": 1.99, "image": "https://via.placeholder.com/150?text=Milk"},
  {"id": 4, "name": "Cheddar Cheese", "category": "Dairy", "price": 2.79, "image": "https://via.placeholder.com/150?text=Cheddar"},
  {"id": 5, "name": "White Bread", "category": "Bakery", "price": 1.49, "image": "https://via.placeholder.com/150?text=Bread"},
  {"id": 6, "name": "Chocolate Cookies", "category": "Snacks", "price": 2.49, "image": "https://via.placeholder.com/150?text=Cookies"},
  {"id": 7, "name": "Orange Juice", "category": "Beverages", "price": 3.19, "image": "https://via.placeholder.com/150?text=OJ"},
  {"id": 8, "name": "Cola (2L)", "category": "Beverages", "price": 1.89, "image": "https://via.placeholder.com/150?text=Cola"},
  {"id": 9, "name": "Paper Towels", "category": "Household", "price": 4.99, "image": "https://via.placeholder.com/150?text=Paper+Towels"},
  {"id": 10, "name": "Laundry Detergent", "category": "Household", "price": 6.49, "image": "https://via.placeholder.com/150?text=Detergent"}
];

// Cart state
let cart = [];

// DOM elements - will be initialized after DOM loads
let productGrid, categoryFilter, cartBtn, cartBadge, cartDrawer, cartOverlay, closeCart, cartItems, cartTotal, emptyCart, cartFooter, checkoutBtn;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    displayProducts(products);
    updateCartDisplay();
    attachEventListeners();
});

// Initialize DOM elements
function initializeElements() {
    productGrid = document.getElementById('productGrid');
    categoryFilter = document.getElementById('categoryFilter');
    cartBtn = document.getElementById('cartBtn');
    cartBadge = document.getElementById('cartBadge');
    cartDrawer = document.getElementById('cartDrawer');
    cartOverlay = document.getElementById('cartOverlay');
    closeCart = document.getElementById('closeCart');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    emptyCart = document.getElementById('emptyCart');
    cartFooter = document.getElementById('cartFooter');
    checkoutBtn = document.getElementById('checkoutBtn');
}

// Display products in grid
function displayProducts(productsToShow) {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <div class="product-card__content">
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__price">$${product.price.toFixed(2)}</p>
                <button class="btn btn--primary product-card__button" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        
        // Add event listener for the add to cart button
        const addButton = productCard.querySelector('.product-card__button');
        addButton.addEventListener('click', function() {
            addToCart(product.id);
        });
        
        productGrid.appendChild(productCard);
    });
}

// Filter products by category
function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(product => product.category === selectedCategory);
    
    displayProducts(filteredProducts);
}

// Add item to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    if (!cartBadge) return;
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
    
    // Update cart drawer
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItems) cartItems.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'block';
        
        // Render cart items
        if (cartItems) {
            cartItems.innerHTML = '';
            let total = 0;
            
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                const subtotal = product.price * cartItem.qty;
                total += subtotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item__info">
                        <div class="cart-item__name">${product.name}</div>
                        <div class="cart-item__price">$${product.price.toFixed(2)} each</div>
                    </div>
                    <div class="cart-item__controls">
                        <button class="quantity-btn" data-product-id="${product.id}" data-change="-1">−</button>
                        <span class="quantity-display">${cartItem.qty}</span>
                        <button class="quantity-btn" data-product-id="${product.id}" data-change="1">+</button>
                        <button class="remove-btn" data-product-id="${product.id}" title="Remove item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                `;
                
                // Add event listeners for quantity buttons
                const quantityBtns = cartItemElement.querySelectorAll('.quantity-btn');
                quantityBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productId = parseInt(this.dataset.productId);
                        const change = parseInt(this.dataset.change);
                        updateQuantity(productId, change);
                    });
                });
                
                // Add event listener for remove button
                const removeBtn = cartItemElement.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.productId);
                    removeFromCart(productId);
                });
                
                cartItems.appendChild(cartItemElement);
            });
            
            if (cartTotal) {
                cartTotal.textContent = total.toFixed(2);
            }
        }
    }
}

// Open cart drawer
function openCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close cart drawer
function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for shopping!');
    cart = [];
    updateCartDisplay();
    closeCartDrawer();
}

// Attach event listeners
function attachEventListeners() {
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    // Cart button
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    // Close cart button
    if (closeCart) {
        closeCart.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartDrawer();
        });
    }
    
    // Cart overlay
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartDrawer();
        });
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkout();
        });
    }
    
    // Close cart on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('active')) {
            closeCartDrawer();
        }
    });
}
