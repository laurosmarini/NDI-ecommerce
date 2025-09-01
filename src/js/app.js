/**
 * Main Application Entry Point
 * Initializes all modules and coordinates the shopping cart application
 */
class ShoppingCartApp {
    constructor() {
        this.cart = null;
        this.productManager = null;
        this.cartUI = null;
        this.checkoutManager = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize core modules
            this.initializeModules();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup coordination hooks
            this.setupCoordinationHooks();
            
            // Initialize UI
            this.initializeUI();
            
            console.log('Shopping Cart Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize shopping cart application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    /**
     * Initialize core modules
     */
    initializeModules() {
        // Initialize product manager
        this.productManager = new ProductManager();
        
        // Initialize shopping cart
        this.cart = new ShoppingCart();
        
        // Initialize UI controller
        this.cartUI = new CartUI(this.cart, this.productManager);
        
        // Initialize checkout manager
        this.checkoutManager = new CheckoutManager(this.cart);
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.syncCartState();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            this.handleHistoryChange(event);
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle cart sidebar overlay
        document.addEventListener('click', (event) => {
            if (event.target.matches('.overlay')) {
                this.closeSidebar();
            }
            if (event.target.matches('.cart-sidebar-close')) {
                this.closeSidebar();
            }
        });

        // Handle modal events
        document.addEventListener('click', (event) => {
            if (event.target.matches('.modal-close')) {
                this.closeModal();
            }
            if (event.target.matches('.modal') && !event.target.matches('.modal-content')) {
                this.closeModal();
            }
        });

        // Handle escape key for modals and sidebars
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
                this.closeSidebar();
            }
        });
    }

    /**
     * Setup coordination hooks for tracking
     */
    async setupCoordinationHooks() {
        try {
            // Hook: post-edit for cart state changes
            this.cart.originalSaveToStorage = this.cart.saveToStorage;
            this.cart.saveToStorage = () => {
                this.cart.originalSaveToStorage();
                this.executeHook('post-edit', 'cart-state', 'Cart state updated');
            };

            // Hook: notify for product interactions
            document.addEventListener('cartChanged', () => {
                this.executeHook('notify', 'cart-changed', `Cart updated - ${this.cart.getTotalItems()} items`);
            });

            console.log('Coordination hooks setup completed');
        } catch (error) {
            console.warn('Failed to setup coordination hooks:', error.message);
        }
    }

    /**
     * Execute coordination hook
     */
    async executeHook(hookType, context, message) {
        try {
            // Since the hooks are having Node.js module issues, we'll log locally for now
            const hookData = {
                timestamp: new Date().toISOString(),
                type: hookType,
                context: context,
                message: message,
                cartState: {
                    itemCount: this.cart.getTotalItems(),
                    total: this.cart.getTotal()
                }
            };
            
            // Store in localStorage for debugging
            const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
            logs.push(hookData);
            if (logs.length > 100) logs.splice(0, 50); // Keep last 100 entries
            localStorage.setItem('app_logs', JSON.stringify(logs));
            
            console.log('Hook executed:', hookData);
        } catch (error) {
            console.warn('Hook execution failed:', error);
        }
    }

    /**
     * Initialize UI components
     */
    initializeUI() {
        // Update products count
        this.updateProductsCount();
        
        // Initialize responsive behaviors
        this.initializeResponsive();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    /**
     * Update products count display
     */
    updateProductsCount() {
        const resultsCount = document.querySelector('.results-count');
        if (resultsCount) {
            const products = this.productManager.getAllProducts();
            resultsCount.textContent = `Showing ${products.length} products`;
        }
    }

    /**
     * Initialize responsive behaviors
     */
    initializeResponsive() {
        this.handleWindowResize();
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                this.executeHook('performance', 'page-load', `Page loaded in ${loadTime}ms`);
            }
        });

        // Monitor cart operations performance
        const originalAddItem = this.cart.addItem.bind(this.cart);
        this.cart.addItem = (...args) => {
            const startTime = performance.now();
            const result = originalAddItem(...args);
            const endTime = performance.now();
            console.log(`Add to cart operation took ${endTime - startTime}ms`);
            return result;
        };
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K for search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Ctrl/Cmd + Shift + C for cart
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
            event.preventDefault();
            this.cartUI.toggleCartSidebar();
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Update body classes for responsive styling
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
        
        // Close sidebar on desktop
        if (!isMobile) {
            this.closeSidebar();
        }
    }

    /**
     * Handle history changes
     */
    handleHistoryChange(event) {
        // Handle browser navigation if needed
        console.log('History changed:', event.state);
    }

    /**
     * Sync cart state across tabs
     */
    syncCartState() {
        // Reload cart from localStorage in case it was modified in another tab
        this.cart.loadFromStorage();
    }

    /**
     * Close sidebar
     */
    closeSidebar() {
        const sidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.overlay');
        
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    /**
     * Close modal
     */
    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('active'));
    }

    /**
     * Show error message
     */
    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    /**
     * Get application state for debugging
     */
    getState() {
        return {
            cart: this.cart.getSummary(),
            products: this.productManager.getAllProducts().length,
            currentPage: this.cartUI.currentPage,
            filters: this.cartUI.currentFilters
        };
    }

    /**
     * Reset application state
     */
    reset() {
        this.cart.clear();
        this.cartUI.currentFilters = {};
        this.cartUI.navigateToPage('products');
        console.log('Application state reset');
    }

    /**
     * Export cart data
     */
    exportCart() {
        const cartData = {
            items: this.cart.items,
            summary: this.cart.getSummary(),
            exportedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(cartData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cart-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import cart data
     */
    importCart(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const cartData = JSON.parse(event.target.result);
                this.cart.items = cartData.items || [];
                this.cart.saveToStorage();
                console.log('Cart imported successfully');
            } catch (error) {
                console.error('Failed to import cart:', error);
                this.showError('Failed to import cart data');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoppingCartApp();
    
    // Make app globally available for debugging
    window.debugCart = () => console.log(window.app.getState());
    window.resetCart = () => window.app.reset();
    window.exportCart = () => window.app.exportCart();
});

// Handle service worker for offline functionality (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}