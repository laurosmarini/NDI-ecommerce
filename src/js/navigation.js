// NAVIGATION FUNCTIONALITY - NEOBRUTALIST E-COMMERCE

class NavigationManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileNavigation();
    this.setupSkipLinks();
    this.setupActiveLinks();
    this.setupSmoothScrolling();
  }

  // Setup mobile navigation hamburger menu
  setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Update ARIA attributes
      const isExpanded = navLinks.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      
      // Add hamburger animation
      this.animateHamburger(hamburger, isExpanded);
    });

    // Close mobile menu when clicking nav links
    navLinks.addEventListener('click', (e) => {
      if (e.target.matches('a')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        this.animateHamburger(hamburger, false);
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        this.animateHamburger(hamburger, false);
        hamburger.focus();
      }
    });
  }

  // Animate hamburger menu
  animateHamburger(hamburger, isActive) {
    const bars = hamburger.querySelectorAll('.bar');
    
    if (isActive) {
      bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  }

  // Setup skip links for accessibility
  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Ensure main content has ID
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }
  }

  // Setup active link highlighting
  setupActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath || 
          (linkPath === 'index.html' && currentPath === '') ||
          (linkPath === '.' && currentPath === 'index.html')) {
        link.classList.add('nav-link--active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Setup smooth scrolling for anchor links
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').substring(1);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();
      
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update focus for accessibility
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
    });
  }
}

// Breadcrumb navigation
class BreadcrumbManager {
  constructor() {
    this.init();
  }

  init() {
    this.createBreadcrumbs();
  }

  createBreadcrumbs() {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    const currentFile = pathSegments[pathSegments.length - 1] || 'index.html';
    
    const breadcrumbData = this.getBreadcrumbData(currentFile);
    if (breadcrumbData.length <= 1) return;

    const breadcrumbNav = document.createElement('nav');
    breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbNav.className = 'breadcrumb-nav';
    
    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb-list';
    
    breadcrumbData.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'breadcrumb-item';
      
      if (index === breadcrumbData.length - 1) {
        listItem.innerHTML = `<span aria-current="page">${item.label}</span>`;
      } else {
        listItem.innerHTML = `<a href="${item.url}">${item.label}</a>`;
      }
      
      breadcrumbList.appendChild(listItem);
    });
    
    breadcrumbNav.appendChild(breadcrumbList);
    
    // Insert after header
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    if (header && main) {
      header.insertAdjacentElement('afterend', breadcrumbNav);
    }
    
    this.addBreadcrumbStyles();
  }

  getBreadcrumbData(currentFile) {
    const breadcrumbs = [
      { label: 'Home', url: 'index.html' }
    ];

    const pageMapping = {
      'ecommerce.html': { label: 'Products', url: 'ecommerce.html' },
      'cart.html': { label: 'Shopping Cart', url: 'cart.html' },
      'checkout.html': { label: 'Checkout', url: 'checkout.html' },
      'login.html': { label: 'Login', url: 'login.html' },
      'gallery.html': { label: 'Gallery', url: 'gallery.html' },
      'blog.html': { label: 'Blog', url: 'blog.html' },
      'pricing.html': { label: 'Pricing', url: 'pricing.html' }
    };

    if (pageMapping[currentFile]) {
      breadcrumbs.push(pageMapping[currentFile]);
    }

    return breadcrumbs;
  }

  addBreadcrumbStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .breadcrumb-nav {
        background: var(--white);
        border-bottom: var(--border-width-thin) solid var(--black);
        padding: var(--space-2) 0;
      }

      .breadcrumb-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--space-2);
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 var(--space-4);
      }

      .breadcrumb-item {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .breadcrumb-item:not(:last-child)::after {
        content: "›";
        margin-left: var(--space-2);
        color: var(--gray-900);
        font-weight: bold;
      }

      .breadcrumb-item a {
        color: var(--neon-pink);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all var(--transition-fast) var(--ease-brutal);
      }

      .breadcrumb-item a:hover,
      .breadcrumb-item a:focus {
        color: var(--electric-blue);
        border-bottom-color: var(--electric-blue);
      }

      .breadcrumb-item span[aria-current="page"] {
        color: var(--black);
        font-weight: var(--font-weight-bold);
      }

      @media (max-width: 640px) {
        .breadcrumb-list {
          padding: 0 var(--space-4);
        }
        
        .breadcrumb-item {
          font-size: var(--font-size-xs);
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Page loading manager
class PageLoadManager {
  constructor() {
    this.init();
  }

  init() {
    this.addLoadingStates();
    this.setupPageTransitions();
    this.handleLoadedState();
  }

  addLoadingStates() {
    // Add loading class to body
    document.body.classList.add('page-loading');
    
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Loading GEMINI Store...</p>
      </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    this.addLoadingStyles();
  }

  addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .page-loading {
        overflow: hidden;
      }

      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--white);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        transition: opacity var(--transition-slow) ease-out;
      }

      .loading-overlay.fade-out {
        opacity: 0;
        pointer-events: none;
      }

      .loading-content {
        text-align: center;
      }

      .loading-spinner {
        width: 60px;
        height: 60px;
        border: var(--border-width-thick) solid var(--gray-100);
        border-top: var(--border-width-thick) solid var(--neon-pink);
        border-radius: 50%;
        margin: 0 auto var(--space-4);
        animation: spin 1s linear infinite;
      }

      .loading-content p {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-bold);
        color: var(--neon-pink);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
  }

  setupPageTransitions() {
    // Add transition effects to links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link || link.getAttribute('href').startsWith('#') || 
          link.getAttribute('target') === '_blank' ||
          link.href.startsWith('mailto:') || 
          link.href.startsWith('tel:')) {
        return;
      }

      // Add subtle loading effect for navigation
      const originalText = link.textContent;
      link.style.opacity = '0.7';
      
      setTimeout(() => {
        if (link.style) link.style.opacity = '1';
      }, 200);
    });
  }

  handleLoadedState() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoadingOverlay();
      }, 500);
    });

    // Fallback in case load event doesn't fire
    setTimeout(() => {
      this.hideLoadingOverlay();
    }, 3000);
  }

  hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove('page-loading');
      }, 400);
    }
  }
}

// Initialize navigation components
document.addEventListener('DOMContentLoaded', () => {
  new NavigationManager();
  new BreadcrumbManager();
  new PageLoadManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NavigationManager, BreadcrumbManager, PageLoadManager };
}