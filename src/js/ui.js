/**
 * UI Controller for Shopping Cart
 * Handles all DOM manipulations and user interactions
 */
class CartUI {
    constructor(cart, productManager) {
        this.cart = cart;
        this.productManager = productManager;
        this.currentFilters = {};
        this.currentPage = 'products';
        
        this.bindEvents();
        this.initializeUI();
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        this.updateCartIcon();
        this.renderProducts();
        this.setupFilters();
        this.setupCartSidebar();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Cart change events
        document.addEventListener('cartChanged', () => {
            this.updateCartIcon();
            this.updateCartSidebar();
            this.updateCartPage();
        });

        // Product interaction events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn')) {
                this.handleAddToCart(e);
            }
            if (e.target.matches('.cart-icon, .cart-toggle')) {
                this.toggleCartSidebar();
            }
            if (e.target.matches('.remove-item-btn')) {
                this.handleRemoveItem(e);
            }
            if (e.target.matches('.quantity-btn')) {
                this.handleQuantityChange(e);
            }
            if (e.target.matches('.filter-btn')) {
                this.handleFilterChange(e);
            }
            if (e.target.matches('.sort-select')) {
                this.handleSortChange(e);
            }
            if (e.target.matches('.nav-link')) {
                this.handleNavigation(e);
            }
            if (e.target.matches('.checkout-btn')) {
                this.initiateCheckout();
            }
        });

        // Search events
        document.addEventListener('input', (e) => {
            if (e.target.matches('.search-input')) {
                this.handleSearch(e);
            }
            if (e.target.matches('.quantity-input')) {
                this.handleQuantityInput(e);
            }
        });

        // Form events
        document.addEventListener('change', (e) => {
            if (e.target.matches('.variant-select')) {
                this.handleVariantChange(e);
            }
        });
    }

    /**
     * Update cart icon with item count
     */
    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        const cartCount = document.querySelector('.cart-count');
        
        if (cartIcon && cartCount) {
            const itemCount = this.cart.getTotalItems();
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'block' : 'none';
        }
    }

    /**
     * Render product grid
     */
    renderProducts(products = null) {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        const productsToRender = products || this.productManager.getFilteredProducts(this.currentFilters);
        
        container.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${!product.inStock ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-variants">
                        ${this.renderVariantSelectors(product)}
                    </div>
                    <button class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                            data-product-id="${product.id}"
                            ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render variant selectors for a product
     */
    renderVariantSelectors(product) {
        if (!product.variants) return '';
        
        return Object.entries(product.variants).map(([key, values]) => `
            <div class="variant-group">
                <label class="variant-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                <select class="variant-select" data-variant-type="${key}" data-product-id="${product.id}">
                    ${values.map(value => `<option value="${value}">${value}</option>`).join('')}
                </select>
            </div>
        `).join('');
    }

    /**
     * Setup filter controls
     */
    setupFilters() {
        const filtersContainer = document.querySelector('.filters');
        if (!filtersContainer) return;

        const categories = this.productManager.getCategories();
        const priceRange = this.productManager.getPriceRange();

        filtersContainer.innerHTML = `
            <div class="filter-group">
                <input type="text" class="search-input" placeholder="Search products...">
            </div>
            <div class="filter-group">
                <label>Category:</label>
                <select class="filter-select" data-filter="category">
                    <option value="">All Categories</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Price Range:</label>
                <input type="range" class="price-range" min="${priceRange.min}" max="${priceRange.max}" 
                       step="50" data-filter="maxPrice" value="${priceRange.max}">
                <span class="price-display">Up to $${priceRange.max}</span>
            </div>
            <div class="filter-group">
                <label>
                    <input type="checkbox" class="filter-checkbox" data-filter="inStockOnly" checked>
                    In Stock Only
                </label>
            </div>
            <div class="filter-group">
                <label>Sort By:</label>
                <select class="sort-select">
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
        `;
    }

    /**
     * Setup cart sidebar
     */
    setupCartSidebar() {
        const sidebar = document.querySelector('.cart-sidebar');
        if (!sidebar) return;

        this.updateCartSidebar();
    }

    /**
     * Update cart sidebar content
     */
    updateCartSidebar() {
        const sidebar = document.querySelector('.cart-sidebar-content');
        if (!sidebar) return;

        const cartSummary = this.cart.getSummary();
        
        if (cartSummary.items.length === 0) {
            sidebar.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <button class="continue-shopping-btn" onclick="this.closest('.cart-sidebar').classList.remove('active')">
                        Continue Shopping
                    </button>
                </div>
            `;
            return;
        }

        sidebar.innerHTML = `
            <div class="cart-items">
                ${cartSummary.items.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            ${Object.keys(item.variant).length > 0 ? `
                                <div class="cart-item-variants">
                                    ${Object.entries(item.variant).map(([key, value]) => 
                                        `<span class="variant">${key}: ${value}</span>`
                                    ).join('')}
                                </div>
                            ` : ''}
                            <div class="cart-item-controls">
                                <div class="quantity-controls">
                                    <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                           data-product-id="${item.id}">
                                    <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                                </div>
                                <button class="remove-item-btn" data-product-id="${item.id}">Remove</button>
                            </div>
                        </div>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>$${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Tax:</span>
                    <span>$${cartSummary.tax.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Shipping:</span>
                    <span>${cartSummary.shipping === 0 ? 'FREE' : '$' + cartSummary.shipping.toFixed(2)}</span>
                </div>
                <div class="summary-line total">
                    <span>Total:</span>
                    <span>$${cartSummary.total.toFixed(2)}</span>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
    }

    /**
     * Toggle cart sidebar visibility
     */
    toggleCartSidebar() {
        const sidebar = document.querySelector('.cart-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    /**
     * Handle add to cart button click
     */
    handleAddToCart(event) {
        const productId = event.target.dataset.productId;
        const product = this.productManager.getProductById(productId);
        
        if (!product || !product.inStock) return;

        // Get selected variants
        const productCard = event.target.closest('.product-card');
        const variantSelects = productCard.querySelectorAll('.variant-select');
        const selectedVariant = {};
        
        variantSelects.forEach(select => {
            selectedVariant[select.dataset.variantType] = select.value;
        });

        // Add to cart with animation
        this.cart.addItem(product, 1, selectedVariant);
        this.showAddToCartFeedback(event.target);
    }

    /**
     * Show feedback when item is added to cart
     */
    showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('added');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('added');
        }, 1500);
    }

    /**
     * Handle remove item from cart
     */
    handleRemoveItem(event) {
        const productId = event.target.dataset.productId;
        // Get variant info if needed
        this.cart.removeItem(productId);
    }

    /**
     * Handle quantity change buttons
     */
    handleQuantityChange(event) {
        const productId = event.target.dataset.productId;
        const action = event.target.dataset.action;
        const item = this.cart.findItem(productId);
        
        if (!item) return;

        if (action === 'increase') {
            this.cart.updateQuantity(productId, item.quantity + 1, item.variant);
        } else if (action === 'decrease') {
            this.cart.updateQuantity(productId, Math.max(1, item.quantity - 1), item.variant);
        }
    }

    /**
     * Handle quantity input change
     */
    handleQuantityInput(event) {
        const productId = event.target.dataset.productId;
        const quantity = parseInt(event.target.value) || 1;
        const item = this.cart.findItem(productId);
        
        if (item) {
            this.cart.updateQuantity(productId, quantity, item.variant);
        }
    }

    /**
     * Handle search input
     */
    handleSearch(event) {
        this.currentFilters.searchTerm = event.target.value;
        this.debounce(() => {
            this.renderProducts();
        }, 300);
    }

    /**
     * Handle filter changes
     */
    handleFilterChange(event) {
        const filterType = event.target.dataset.filter;
        
        if (event.target.type === 'checkbox') {
            this.currentFilters[filterType] = event.target.checked;
        } else {
            this.currentFilters[filterType] = event.target.value;
        }
        
        this.renderProducts();
    }

    /**
     * Handle sort changes
     */
    handleSortChange(event) {
        this.currentFilters.sortBy = event.target.value;
        this.renderProducts();
    }

    /**
     * Handle navigation between pages
     */
    handleNavigation(event) {
        event.preventDefault();
        const page = event.target.dataset.page;
        this.navigateToPage(page);
    }

    /**
     * Navigate to different pages
     */
    navigateToPage(page) {
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-link');
        
        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        document.querySelector(`#${page}-page`)?.classList.add('active');
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        
        this.currentPage = page;
        
        if (page === 'cart') {
            this.updateCartPage();
        }
    }

    /**
     * Update cart page content
     */
    updateCartPage() {
        const cartPage = document.querySelector('#cart-page .cart-content');
        if (!cartPage) return;

        const cartSummary = this.cart.getSummary();
        
        if (cartSummary.items.length === 0) {
            cartPage.innerHTML = `
                <div class="empty-cart-page">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <button class="nav-link" data-page="products">Continue Shopping</button>
                </div>
            `;
            return;
        }

        cartPage.innerHTML = `
            <div class="cart-items-list">
                ${cartSummary.items.map(item => `
                    <div class="cart-item-row" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            ${Object.keys(item.variant).length > 0 ? `
                                <div class="item-variants">
                                    ${Object.entries(item.variant).map(([key, value]) => 
                                        `<span>${key}: ${value}</span>`
                                    ).join(', ')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                                       data-product-id="${item.id}">
                                <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-item-btn" data-product-id="${item.id}">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-totals">
                <div class="totals-section">
                    <div class="total-line">
                        <span>Subtotal (${cartSummary.itemCount} items):</span>
                        <span>$${cartSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="total-line">
                        <span>Tax:</span>
                        <span>$${cartSummary.tax.toFixed(2)}</span>
                    </div>
                    <div class="total-line">
                        <span>Shipping:</span>
                        <span>${cartSummary.shipping === 0 ? 'FREE' : '$' + cartSummary.shipping.toFixed(2)}</span>
                    </div>
                    <div class="total-line grand-total">
                        <span>Total:</span>
                        <span>$${cartSummary.total.toFixed(2)}</span>
                    </div>
                    <button class="checkout-btn nav-link" data-page="checkout">Proceed to Checkout</button>
                </div>
            </div>
        `;
    }

    /**
     * Initiate checkout process
     */
    initiateCheckout() {
        if (this.cart.getTotalItems() === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        this.navigateToPage('checkout');
    }

    /**
     * Debounce function for search
     */
    debounce(func, wait) {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(func, wait);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Export for use in other modules
window.CartUI = CartUI;