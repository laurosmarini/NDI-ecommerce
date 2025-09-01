// PRODUCT DATA AND MANAGEMENT - NEOBRUTALIST E-COMMERCE

const PRODUCT_DATA = [
  {
    id: 'gemini-smartwatch',
    name: 'GEMINI Smartwatch',
    price: 299.99,
    description: 'The GEMINI Smartwatch is a stylish and functional smartwatch that helps you stay connected and active. It features a heart rate monitor, GPS, and a variety of other sensors to track your fitness and activity levels.',
    image: 'https://picsum.photos/seed/smartwatch/800/600',
    category: 'wearables',
    inStock: true,
    rating: 4.5,
    reviews: 89,
    features: [
      'Heart rate monitoring',
      'GPS tracking',
      'Water resistant (50m)',
      '7-day battery life',
      'Sleep tracking',
      'Smartphone notifications'
    ],
    specifications: {
      display: '1.4" AMOLED',
      battery: '7 days typical use',
      connectivity: 'Bluetooth 5.0, WiFi',
      waterRating: '5ATM',
      sensors: 'Heart rate, GPS, Accelerometer, Gyroscope'
    }
  },
  {
    id: 'gemini-headphones',
    name: 'GEMINI Headphones',
    price: 99.99,
    description: 'Premium wireless headphones with active noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
    image: 'https://picsum.photos/seed/headphones/800/600',
    category: 'audio',
    inStock: true,
    rating: 4.7,
    reviews: 156,
    features: [
      'Active noise cancellation',
      'Wireless connectivity',
      '30-hour battery life',
      'Quick charge (5 min = 2 hours)',
      'Premium leather cushions',
      'Built-in microphone'
    ],
    specifications: {
      drivers: '40mm dynamic',
      frequency: '20Hz - 20kHz',
      battery: '30 hours with ANC',
      connectivity: 'Bluetooth 5.2',
      weight: '250g'
    }
  },
  {
    id: 'gemini-speaker',
    name: 'GEMINI Speaker',
    price: 149.99,
    description: 'Portable Bluetooth speaker with incredible bass and 360-degree sound. Waterproof design perfect for any adventure.',
    image: 'https://picsum.photos/seed/speaker/800/600',
    category: 'audio',
    inStock: true,
    rating: 4.3,
    reviews: 203,
    features: [
      '360-degree sound',
      'Deep bass enhancement',
      'Waterproof (IPX7)',
      '12-hour battery life',
      'Voice assistant support',
      'Multi-device pairing'
    ],
    specifications: {
      power: '20W RMS',
      battery: '12 hours',
      connectivity: 'Bluetooth 5.0',
      waterRating: 'IPX7',
      dimensions: '180x80x80mm'
    }
  },
  {
    id: 'gemini-tablet',
    name: 'GEMINI Tablet',
    price: 399.99,
    description: 'High-performance tablet with stunning display and all-day battery life. Perfect for work, creativity, and entertainment.',
    image: 'https://picsum.photos/seed/tablet/800/600',
    category: 'tablets',
    inStock: true,
    rating: 4.6,
    reviews: 95,
    features: [
      '10.1" Retina display',
      'All-day battery life',
      'Fast charging',
      'Dual camera system',
      'Lightweight design',
      'Keyboard compatible'
    ],
    specifications: {
      display: '10.1" IPS LCD (2560x1600)',
      processor: 'Octa-core 2.4GHz',
      memory: '6GB RAM, 128GB storage',
      battery: '8000mAh (12+ hours)',
      cameras: '8MP rear, 5MP front'
    }
  },
  {
    id: 'gemini-earbuds',
    name: 'GEMINI Earbuds',
    price: 79.99,
    description: 'True wireless earbuds with exceptional sound quality and comfortable fit. Perfect for active lifestyles.',
    image: 'https://picsum.photos/seed/earbuds/800/600',
    category: 'audio',
    inStock: true,
    rating: 4.4,
    reviews: 128,
    features: [
      'True wireless design',
      'Noise isolation',
      '6+24 hour battery',
      'Sweat resistant',
      'Touch controls',
      'Quick pairing'
    ],
    specifications: {
      drivers: '6mm dynamic',
      battery: '6hr + 24hr case',
      connectivity: 'Bluetooth 5.1',
      waterRating: 'IPX4',
      weight: '4.5g each'
    }
  },
  {
    id: 'gemini-phone',
    name: 'GEMINI Phone',
    price: 699.99,
    description: 'Flagship smartphone with cutting-edge technology, pro-grade cameras, and lightning-fast performance.',
    image: 'https://picsum.photos/seed/smartphone/800/600',
    category: 'phones',
    inStock: false,
    rating: 4.8,
    reviews: 412,
    features: [
      'Triple camera system',
      '6.7" OLED display',
      '5G connectivity',
      'All-day battery',
      'Wireless charging',
      'Premium build quality'
    ],
    specifications: {
      display: '6.7" OLED (3200x1440)',
      processor: 'Flagship chipset',
      memory: '8GB RAM, 256GB storage',
      cameras: '108MP + 12MP + 12MP',
      battery: '4500mAh with fast charging'
    }
  }
];

class ProductManager {
  constructor() {
    this.products = PRODUCT_DATA;
    this.categories = this.getUniqueCategories();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateProductDisplays();
  }

  // Get unique categories
  getUniqueCategories() {
    return [...new Set(this.products.map(product => product.category))];
  }

  // Get all products
  getAllProducts() {
    return this.products;
  }

  // Get product by ID
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Get products by category
  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  // Search products
  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  // Filter products
  filterProducts(filters) {
    let filtered = this.products;

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.priceMin) {
      filtered = filtered.filter(product => product.price >= filters.priceMin);
    }

    if (filters.priceMax) {
      filtered = filtered.filter(product => product.price <= filters.priceMax);
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters.minRating) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    return filtered;
  }

  // Sort products
  sortProducts(products, sortBy) {
    const sorted = [...products];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  }

  // Create product card HTML
  createProductCard(product) {
    const stockStatus = product.inStock ? 
      '<span class="badge badge--success">In Stock</span>' : 
      '<span class="badge badge--danger">Out of Stock</span>';

    const rating = this.createRatingStars(product.rating);

    return `
      <div class="product-card card hover-lift" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            ${rating}
            <span class="review-count">(${product.reviews})</span>
          </div>
          <p class="product-description">${this.truncateText(product.description, 100)}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-actions">
            ${product.inStock ? 
              '<button class="add-to-cart-btn btn btn--primary">Add to Cart</button>' :
              '<button class="btn btn--secondary" disabled>Notify When Available</button>'
            }
            <button class="view-details-btn btn btn--outline" data-product-id="${product.id}">View Details</button>
          </div>
          ${stockStatus}
        </div>
      </div>
    `;
  }

  // Create rating stars
  createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  // Truncate text
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }

  // Update product displays
  updateProductDisplays() {
    const productGrids = document.querySelectorAll('.products-grid');
    
    productGrids.forEach(grid => {
      const category = grid.dataset.category || 'all';
      const limit = parseInt(grid.dataset.limit) || 0;
      
      let products = category === 'all' ? 
        this.getAllProducts() : 
        this.getProductsByCategory(category);
      
      if (limit > 0) {
        products = products.slice(0, limit);
      }
      
      grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    });
  }

  // Bind events
  bindEvents() {
    // Product search
    document.addEventListener('input', (e) => {
      if (e.target.matches('.product-search')) {
        this.handleSearch(e.target.value);
      }
    });

    // Category filter
    document.addEventListener('change', (e) => {
      if (e.target.matches('.category-filter')) {
        this.handleCategoryFilter(e.target.value);
      }
    });

    // Sort dropdown
    document.addEventListener('change', (e) => {
      if (e.target.matches('.sort-dropdown')) {
        this.handleSort(e.target.value);
      }
    });

    // View details button
    document.addEventListener('click', (e) => {
      if (e.target.matches('.view-details-btn')) {
        const productId = e.target.dataset.productId;
        this.showProductDetails(productId);
      }
    });

    // Price range filter
    document.addEventListener('input', (e) => {
      if (e.target.matches('.price-range')) {
        this.handlePriceFilter();
      }
    });
  }

  // Handle search
  handleSearch(query) {
    const results = this.searchProducts(query);
    this.displayProducts(results);
    
    // Announce results to screen reader
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`${results.length} products found for "${query}"`);
    }
  }

  // Handle category filter
  handleCategoryFilter(category) {
    const products = category === 'all' ? 
      this.getAllProducts() : 
      this.getProductsByCategory(category);
    
    this.displayProducts(products);
  }

  // Handle sort
  handleSort(sortBy) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const currentProducts = this.getCurrentDisplayedProducts(grid);
    const sorted = this.sortProducts(currentProducts, sortBy);
    this.displayProducts(sorted);
  }

  // Handle price filter
  handlePriceFilter() {
    const minPrice = parseFloat(document.querySelector('.price-min')?.value) || 0;
    const maxPrice = parseFloat(document.querySelector('.price-max')?.value) || Infinity;
    
    const filtered = this.filterProducts({
      priceMin: minPrice,
      priceMax: maxPrice
    });
    
    this.displayProducts(filtered);
  }

  // Display products
  displayProducts(products) {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => this.createProductCard(product)).join('');
    
    // Trigger animation for new products
    setTimeout(() => {
      grid.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
      });
    }, 50);
  }

  // Get currently displayed products
  getCurrentDisplayedProducts(grid) {
    const productIds = Array.from(grid.querySelectorAll('.product-card')).map(card => 
      card.dataset.productId
    );
    
    return productIds.map(id => this.getProductById(id)).filter(Boolean);
  }

  // Show product details modal
  showProductDetails(productId) {
    const product = this.getProductById(productId);
    if (!product) return;

    const modal = this.createProductModal(product);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);

    // Focus management
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) closeButton.focus();
  }

  // Create product details modal
  createProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal product-modal">
        <div class="modal-header">
          <h2>${product.name}</h2>
          <button class="modal-close btn btn--sm" aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
          <div class="product-modal-content">
            <div class="product-modal-image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-modal-details">
              <div class="product-rating">
                ${this.createRatingStars(product.rating)}
                <span class="review-count">(${product.reviews} reviews)</span>
              </div>
              <div class="product-price">$${product.price.toFixed(2)}</div>
              <p class="product-description">${product.description}</p>
              
              <div class="product-features">
                <h4>Features:</h4>
                <ul>
                  ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>
              
              <div class="product-specifications">
                <h4>Specifications:</h4>
                <dl>
                  ${Object.entries(product.specifications).map(([key, value]) => 
                    `<dt>${key}:</dt><dd>${value}</dd>`
                  ).join('')}
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          ${product.inStock ? 
            '<button class="add-to-cart-btn btn btn--primary btn--lg">Add to Cart</button>' :
            '<button class="btn btn--secondary btn--lg" disabled>Out of Stock</button>'
          }
          <button class="modal-close btn btn--outline">Close</button>
        </div>
      </div>
    `;

    // Bind close events
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.matches('.modal-close')) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
      }
    });

    // Escape key to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    return modal;
  }

  // Add product modal styles
  addProductModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .product-modal {
        max-width: 900px;
        width: 90%;
      }
      
      .product-modal-content {
        display: grid;
        gap: var(--space-6);
        grid-template-columns: 1fr;
      }
      
      @media (min-width: 768px) {
        .product-modal-content {
          grid-template-columns: 1fr 1fr;
        }
      }
      
      .product-modal-image img {
        width: 100%;
        height: auto;
        border: var(--border-width-normal) solid var(--black);
        border-radius: var(--border-radius-lg);
      }
      
      .product-modal-details {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      
      .product-features ul {
        list-style: none;
        padding: 0;
      }
      
      .product-features li {
        padding: var(--space-1) 0;
        border-bottom: 1px solid var(--gray-100);
      }
      
      .product-features li:before {
        content: "✓";
        color: var(--lime-green);
        font-weight: bold;
        margin-right: var(--space-2);
      }
      
      .product-specifications dl {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--space-2);
      }
      
      .product-specifications dt {
        font-weight: var(--font-weight-bold);
      }
      
      .product-specifications dd {
        margin: 0;
      }
      
      .out-of-stock-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-lg);
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.geminiProducts = new ProductManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProductManager, PRODUCT_DATA };
}