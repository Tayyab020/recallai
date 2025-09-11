/**
 * Performance optimization utilities for CSS and rendering
 */

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
    // Preload critical CSS if not already loaded
    const criticalCSS = document.querySelector('link[href*="critical.css"]');
    if (!criticalCSS) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = '/static/css/critical.css';
        link.onload = function () {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        document.head.appendChild(link);
    }
}

/**
 * Lazy load non-critical CSS
 */
export function loadNonCriticalCSS() {
    const nonCriticalCSS = [
        '/static/css/components.css',
        '/static/css/utilities.css'
    ];

    nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function () {
            this.media = 'all';
        };
        document.head.appendChild(link);
    });
}

/**
 * Optimize CSS animations for performance
 */
export function optimizeAnimations() {
    // Use CSS containment for better performance
    const style = document.createElement('style');
    style.textContent = `
    /* CSS Containment for Performance */
    .MuiCard-root {
      contain: layout style paint;
    }
    
    .MuiButton-root {
      contain: layout style;
    }
    
    .MuiTextField-root {
      contain: layout style;
    }
    
    /* Hardware Acceleration */
    .MuiButton-root,
    .MuiIconButton-root,
    .MuiFab-root {
      transform: translateZ(0);
      will-change: transform, opacity;
    }
    
    /* Optimize Transitions */
    .MuiButton-root:hover,
    .MuiIconButton-root:hover {
      transform: translateZ(0) scale(1.02);
    }
    
    /* Efficient Box Shadows */
    .MuiCard-root,
    .MuiPaper-root {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: box-shadow var(--transition-normal);
    }
    
    .MuiCard-root:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
  `;
    document.head.appendChild(style);
}

/**
 * Implement CSS-in-JS optimization for Material-UI
 */
export function optimizeMUIStyles() {
    // Add CSS variables for dynamic theming without re-renders
    const style = document.createElement('style');
    style.textContent = `
    /* Dynamic Theme Variables */
    .MuiThemeProvider-root {
      --mui-primary-main: var(--color-primary-navy);
      --mui-primary-light: var(--color-secondary-navy);
      --mui-primary-dark: var(--color-tertiary-navy);
      --mui-secondary-main: var(--color-medium-gray);
      --mui-background-default: var(--color-light-gray);
      --mui-background-paper: var(--color-white);
    }
    
    /* Reduce Paint Operations */
    .MuiAppBar-root {
      backface-visibility: hidden;
      transform: translateZ(0);
    }
    
    /* Optimize Text Rendering */
    body, .MuiTypography-root {
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
    document.head.appendChild(style);
}

/**
 * Monitor Core Web Vitals
 */
export function monitorPerformance() {
    if ('web-vital' in window) {
        // Monitor LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor FID (First Input Delay)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
            }
        }).observe({ entryTypes: ['first-input'] });

        // Monitor CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    console.log('CLS:', clsValue);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }
}

/**
 * Implement resource hints for better loading
 */
export function addResourceHints() {
    // DNS prefetch for external resources
    const dnsPrefetch = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];

    dnsPrefetch.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });

    // Preconnect to critical origins
    const preconnect = [
        'https://fonts.gstatic.com'
    ];

    preconnect.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
    // Run immediately
    preloadCriticalResources();
    addResourceHints();
    optimizeMUIStyles();

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeAnimations();
            loadNonCriticalCSS();
        });
    } else {
        optimizeAnimations();
        loadNonCriticalCSS();
    }

    // Monitor performance in development
    if (process.env.NODE_ENV === 'development') {
        setTimeout(monitorPerformance, 1000);
    }
}

export default {
    preloadCriticalResources,
    loadNonCriticalCSS,
    optimizeAnimations,
    optimizeMUIStyles,
    monitorPerformance,
    addResourceHints,
    initializePerformanceOptimizations
};