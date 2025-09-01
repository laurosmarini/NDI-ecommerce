// SHOPPING CART MANAGEMENT - NEOBRUTALIST E-COMMERCE

class ShoppingCart {
  constructor() {
    this.items = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.loadCartFromStorage();
    this.bindEvents();
    this.updateCartUI();
    this.createCartIcon();
  }

  // Load cart from localStorage
  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('gemini-cart');
      this.items = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      this.items = [];
    }
  }

  // Save cart to localStorage
  saveCartToStorage() {
    try {
      localStorage.setItem('gemini-cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  // Create cart icon in navigation
  createCartIcon() {
    const navbar = document.querySelector('.nav-links');
    if (!navbar) return;

    const cartItem = document.createElement('li');
    cartItem.innerHTML = `
      <a href="#" class="cart-toggle nav-link" aria-label="Shopping cart">
        <div class="cart-icon">
          🛒
          <span class="cart-count" aria-live="polite">0</span>
        </div>
      </a>
    `;
    
    navbar.appendChild(cartItem);
    
    // Create cart dropdown
    this.createCartDropdown();
  }

  // Create cart dropdown/sidebar
  createCartDropdown() {
    const cartDropdown = document.createElement('div');
    cartDropdown.className = 'cart-dropdown';
    cartDropdown.innerHTML = `
      <div class="cart-header">
        <h3>Shopping Cart</h3>
        <button class="cart-close" aria-label="Close cart">×</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-footer">
        <div class="cart-total">
          <strong>Total: $<span class="total-amount">0.00</span></strong>
        </div>
        <div class="cart-actions">
          <a href="cart.html" class="btn btn--secondary">View Cart</a>
          <a href="checkout.html" class="btn btn--primary">Checkout</a>
        </div>
      </div>
    `;

    // Add styles for cart dropdown
    const style = document.createElement('style');
    style.textContent = `
      .cart-dropdown {
        position: fixed;
        top: 0;
        right: -400px;
        width: 380px;
        height: 100vh;
        background: var(--white);
        border-left: var(--border-width-thick) solid var(--black);
        box-shadow: var(--shadow-brutal-2xl);
        z-index: var(--z-modal);
        transition: right var(--transition-normal) var(--ease-brutal);
        display: flex;
        flex-direction: column;
      }

      .cart-dropdown.active {
        right: 0;
      }

      .cart-header {
        padding: var(--space-4);
        border-bottom: var(--border-width-normal) solid var(--black);
        background: var(--neon-pink);
        color: var(--white);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cart-header h3 {
        margin: 0;
        font-size: var(--font-size-lg);
        text-shadow: none;
        color: var(--white);
      }

      .cart-close {
        background: none;
        border: none;
        color: var(--white);
        font-size: var(--font-size-2xl);
        cursor: pointer;
        padding: var(--space-1);
        border-radius: var(--border-radius-sm);
        transition: background var(--transition-fast) var(--ease-brutal);
      }

      .cart-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: var(--space-4);
      }

      .cart-empty {
        text-align: center;
        padding: var(--space-8);
        color: var(--gray-900);
      }

      .cart-footer {
        padding: var(--space-4);
        border-top: var(--border-width-normal) solid var(--black);
        background: var(--gray-100);
      }

      .cart-total {
        margin-bottom: var(--space-4);
        font-size: var(--font-size-lg);
        text-align: center;
        color: var(--lime-green);
        text-shadow: 1px 1px 0px var(--black);
      }

      .cart-actions {
        display: flex;
        gap: var(--space-2);
      }

      .cart-actions .btn {
        flex: 1;
        text-align: center;
        font-size: var(--font-size-sm);
      }

      @media (max-width: 768px) {
        .cart-dropdown {
          width: 100vw;
          right: -100vw;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(cartDropdown);
  }

  // Bind event listeners
  bindEvents() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-to-cart-btn')) {
        e.preventDefault();
        this.addToCartFromButton(e.target);
      }
    });

    // Cart toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-toggle')) {
        e.preventDefault();
        this.toggleCart();
      }
    });

    // Cart close
    document.addEventListener('click', (e) => {
      if (e.target.matches('.cart-close')) {
        this.closeCart();
      }
    });

    // Quantity controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('.quantity-btn')) {
        const action = e.target.dataset.action;
        const productId = e.target.dataset.productId;
        
        if (action === 'increase') {
          this.updateQuantity(productId, 1);
        } else if (action === 'decrease') {
          this.updateQuantity(productId, -1);
        }
      }
    });

    // Remove item
    document.addEventListener('click', (e) => {
      if (e.target.matches('.remove-item')) {
        const productId = e.target.dataset.productId;
        this.removeItem(productId);
      }
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('.cart-dropdown') && !e.target.closest('.cart-toggle')) {
        this.closeCart();
      }
    });
  }

  // Add item to cart from button
  addToCartFromButton(button) {
    const productElement = button.closest('.product, .related-product, .product-card');
    if (!productElement) return;

    const product = {
      id: this.generateProductId(productElement),
      name: this.getProductName(productElement),
      price: this.getProductPrice(productElement),
      image: this.getProductImage(productElement),
      quantity: 1
    };

    this.addItem(product);
    this.showAddedToCartFeedback(button);
  }

  // Generate unique product ID
  generateProductId(element) {
    const name = this.getProductName(element);
    return name.toLowerCase().replace(/\s+/g, '-');
  }

  // Get product name
  getProductName(element) {
    const nameElement = element.querySelector('.product-title, h3, h4, .product-name');
    return nameElement ? nameElement.textContent.trim() : 'Unknown Product';
  }

  // Get product price
  getProductPrice(element) {
    const priceElement = element.querySelector('.product-price, .price');
    if (!priceElement) return 0;
    
    const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(priceText) || 0;
  }

  // Get product image
  getProductImage(element) {
    const imgElement = element.querySelector('img');
    return imgElement ? imgElement.src : '/placeholder-product.jpg';
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.items.push({ ...product });
    }

    this.saveCartToStorage();
    this.updateCartUI();
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveCartToStorage();
    this.updateCartUI();
  }

  // Update item quantity
  updateQuantity(productId, change) {
    const item = this.items.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCartToStorage();
      this.updateCartUI();
    }
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCartToStorage();
    this.updateCartUI();
  }

  // Get cart totals
  getTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // Update cart UI
  updateCartUI() {
    const totals = this.getTotals();
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = totals.itemCount;
      cartCount.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    }

    // Update total amount
    const totalAmount = document.querySelector('.total-amount');
    if (totalAmount) {
      totalAmount.textContent = totals.total;
    }

    // Update cart items
    this.updateCartItems();
  }

  // Update cart items display
  updateCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>Your cart is empty</p>
          <p>Add some products to get started!</p>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="quantity-controls">
            <button class="quantity-btn btn btn--sm" data-action="decrease" data-product-id="${item.id}" aria-label="Decrease quantity">-</button>
            <input type="number" class="quantity-input input" value="${item.quantity}" min="1" readonly>
            <button class="quantity-btn btn btn--sm" data-action="increase" data-product-id="${item.id}" aria-label="Increase quantity">+</button>
            <button class="remove-item btn btn--danger btn--sm" data-product-id="${item.id}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Show added to cart feedback
  showAddedToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added to Cart!';
    button.classList.add('animate-pulse');
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('animate-pulse');
      button.disabled = false;
    }, 1500);

    // Show brief cart preview
    this.openCart();
    setTimeout(() => {
      if (this.isOpen) this.closeCart();
    }, 2000);
  }

  // Toggle cart visibility
  toggleCart() {
    if (this.isOpen) {
      this.closeCart();
    } else {
      this.openCart();
    }
  }

  // Open cart
  openCart() {
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (cartDropdown) {
      cartDropdown.classList.add('active');
      this.isOpen = true;
      
      // Focus management for accessibility
      const closeButton = cartDropdown.querySelector('.cart-close');
      if (closeButton) closeButton.focus();
    }
  }

  // Close cart
  closeCart() {
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (cartDropdown) {
      cartDropdown.classList.remove('active');
      this.isOpen = false;
    }
  }

  // Get cart data for checkout
  getCartData() {
    return {
      items: this.items,
      totals: this.getTotals()
    };
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.geminiCart = new ShoppingCart();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingCart;
}