// MAIN SCRIPT - NEOBRUTALIST E-COMMERCE
// Import all modules
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Welcome to GEMINI Store - Neobrutalist E-Commerce!');
    
    // Initialize hamburger menu
    initializeHamburgerMenu();
    
    // Initialize all modules
    initializeAnimations();
    initializeInteractions();
    initializeAccessibility();
    
    console.log('✨ All systems initialized!');
});

// Original hamburger menu functionality
function initializeHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Animation system
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.card, .product, .review, .related-product');
    animatableElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Add animation styles
    addAnimationStyles();
}

// Add animation CSS
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s var(--ease-brutal);
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-ready:nth-child(2) { transition-delay: 0.1s; }
        .animate-ready:nth-child(3) { transition-delay: 0.2s; }
        .animate-ready:nth-child(4) { transition-delay: 0.3s; }
        .animate-ready:nth-child(5) { transition-delay: 0.4s; }
        
        .hover-lift {
            transition: transform var(--transition-normal) var(--ease-brutal);
        }
        
        .hover-lift:hover {
            transform: translateY(-4px) rotate(1deg);
        }
        
        .pulse-on-hover {
            transition: all var(--transition-normal) var(--ease-brutal);
        }
        
        .pulse-on-hover:hover {
            animation: pulse 1s ease-in-out;
        }
        
        .shake-on-error {
            animation: shake 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

// Interactive elements
function initializeInteractions() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn, .add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('pulse-on-hover');
        });
    });

    // Add subtle parallax to product images
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 5;
            const rotateY = (centerX - x) / centerX * 5;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Add click effects
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .add-to-cart-btn, .nav-link')) {
            createClickRipple(e);
        }
    });
}

// Create click ripple effect
function createClickRipple(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Add ripple styles
    if (!document.querySelector('#ripple-styles')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-styles';
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Accessibility enhancements
function initializeAccessibility() {
    // Add keyboard navigation for custom elements
    addKeyboardNavigation();
    
    // Add screen reader announcements
    addAriaLiveRegion();
    
    // Enhanced focus management
    improveFocusManagement();
    
    // Add reduced motion support
    respectReducedMotion();
}

// Keyboard navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Enter or Space on buttons
        if ((e.key === 'Enter' || e.key === ' ') && 
            e.target.matches('.add-to-cart-btn:not(button)')) {
            e.preventDefault();
            e.target.click();
        }
        
        // Arrow key navigation for product grids
        if (e.target.closest('.grid')) {
            handleGridNavigation(e);
        }
    });
}

// Grid navigation with arrow keys
function handleGridNavigation(e) {
    const grid = e.target.closest('.grid');
    const items = Array.from(grid.querySelectorAll('a, button, [tabindex="0"]'));
    const currentIndex = items.indexOf(e.target);
    
    if (currentIndex === -1) return;
    
    let targetIndex;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    
    switch(e.key) {
        case 'ArrowRight':
            targetIndex = currentIndex + 1;
            break;
        case 'ArrowLeft':
            targetIndex = currentIndex - 1;
            break;
        case 'ArrowDown':
            targetIndex = currentIndex + columns;
            break;
        case 'ArrowUp':
            targetIndex = currentIndex - columns;
            break;
        default:
            return;
    }
    
    if (targetIndex >= 0 && targetIndex < items.length) {
        e.preventDefault();
        items[targetIndex].focus();
    }
}

// ARIA live region for announcements
function addAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    
    document.body.appendChild(liveRegion);
    
    // Function to announce messages
    window.announceToScreenReader = function(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    };
}

// Improve focus management
function improveFocusManagement() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .focus-visible,
        *:focus-visible {
            outline: 3px solid var(--electric-blue) !important;
            outline-offset: 2px !important;
            box-shadow: 0 0 0 1px var(--white), 0 0 0 4px var(--electric-blue) !important;
        }
        
        .focus-trap {
            position: relative;
        }
        
        .focus-trap::before,
        .focus-trap::after {
            content: '';
            position: absolute;
            top: 0;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Track focus for better UX
    let isMouseActive = false;
    
    document.addEventListener('mousedown', () => {
        isMouseActive = true;
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            isMouseActive = false;
        }
    });
    
    document.addEventListener('focus', (e) => {
        if (!isMouseActive) {
            e.target.classList.add('focus-visible');
        }
    }, true);
    
    document.addEventListener('blur', (e) => {
        e.target.classList.remove('focus-visible');
    }, true);
}

// Respect reduced motion preferences
function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('🎯 Reduced motion preferences respected');
    }
}

// Error handling and reporting
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-notification';
    errorMessage.innerHTML = `
        <strong>Oops!</strong> Something went wrong. Please refresh the page.
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add error notification styles
    if (!document.querySelector('#error-styles')) {
        const errorStyle = document.createElement('style');
        errorStyle.id = 'error-styles';
        errorStyle.textContent = `
            .error-notification {
                position: fixed;
                top: var(--space-4);
                right: var(--space-4);
                background: var(--red);
                color: var(--white);
                padding: var(--space-3) var(--space-4);
                border: var(--border-width-normal) solid var(--black);
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-brutal-lg);
                z-index: var(--z-toast);
                font-weight: var(--font-weight-bold);
                max-width: 300px;
                animation: slideInRight 0.3s var(--ease-brutal);
            }
            
            .error-notification button {
                background: none;
                border: none;
                color: var(--white);
                font-size: var(--font-size-lg);
                font-weight: bold;
                cursor: pointer;
                padding: 0;
                margin-left: var(--space-2);
                float: right;
            }
            
            @keyframes slideInRight {
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
        document.head.appendChild(errorStyle);
    }
    
    document.body.appendChild(errorMessage);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorMessage.parentElement) {
            errorMessage.remove();
        }
    }, 5000);
});

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log(`📊 Page Load Time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
        }
    }
});

if ('PerformanceObserver' in window) {
    perfObserver.observe({entryTypes: ['navigation']});
}