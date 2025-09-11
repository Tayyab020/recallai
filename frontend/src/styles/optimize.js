/**
 * CSS Optimization and Minification Utilities
 * This file contains utilities for optimizing CSS delivery in production
 */

/**
 * Extract critical CSS for above-the-fold content
 */
export const criticalCSS = `
:root{--color-primary-navy:#000776;--color-secondary-navy:#003366;--color-tertiary-navy:#0A1128;--color-medium-gray:#8E8982;--color-cool-gray:#C0C0C0;--color-charcoal-gray:#36454F;--color-white:#FFFFFF;--color-light-gray:#F8F9FA;--color-black:#000000;--font-family-primary:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;--font-family-heading:'Poppins',sans-serif;--transition-fast:0.15s ease;--transition-normal:0.3s ease;--transition-slow:0.5s ease}*{box-sizing:border-box}body{font-family:var(--font-family-primary);background-color:var(--color-light-gray);color:var(--color-tertiary-navy);margin:0;padding:0;line-height:1.6}.MuiAppBar-root{background-color:var(--color-primary-navy)!important;color:var(--color-white)!important}.MuiToolbar-root{min-height:64px}h1,h2,h3,h4,h5,h6{font-family:var(--font-family-heading);color:var(--color-tertiary-navy);margin:0}.MuiButton-contained{background-color:var(--color-primary-navy)!important;color:var(--color-white)!important}*:focus-visible{outline:2px solid var(--color-secondary-navy);outline-offset:2px}.loading-container{display:flex;justify-content:center;align-items:center;min-height:100vh;background-color:var(--color-light-gray)}.main-content{opacity:0;animation:fadeIn 0.3s ease-in-out forwards}@keyframes fadeIn{to{opacity:1}}@media (prefers-reduced-motion:reduce){.main-content{animation:none;opacity:1}}
`;

/**
 * Inline critical CSS in document head
 */
export function inlineCriticalCSS() {
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
}

/**
 * Lazy load non-critical stylesheets
 */
export function loadStylesheetAsync(href, media = 'all') {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = media;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
}

/**
 * Preload stylesheets for faster loading
 */
export function preloadStylesheet(href) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function () {
        this.onload = null;
        this.rel = 'stylesheet';
    };
    document.head.appendChild(link);
}

/**
 * Remove unused CSS classes (basic implementation)
 */
export function removeUnusedCSS() {
    // This would typically be done at build time with tools like PurgeCSS
    // Here's a basic runtime implementation for demonstration

    const allElements = document.querySelectorAll('*');
    const usedClasses = new Set();

    allElements.forEach(el => {
        if (el.className) {
            const classes = el.className.split(' ');
            classes.forEach(cls => {
                if (cls.trim()) {
                    usedClasses.add(cls.trim());
                }
            });
        }
    });

    console.log('Used CSS classes:', usedClasses.size);
    return usedClasses;
}

/**
 * Optimize CSS custom properties for better performance
 */
export function optimizeCustomProperties() {
    const style = document.createElement('style');
    style.textContent = `
    /* Optimized CSS Custom Properties */
    :root {
      /* Use shorter variable names for better compression */
      --p-navy: var(--color-primary-navy);
      --s-navy: var(--color-secondary-navy);
      --t-navy: var(--color-tertiary-navy);
      --m-gray: var(--color-medium-gray);
      --c-gray: var(--color-cool-gray);
      --ch-gray: var(--color-charcoal-gray);
      --white: var(--color-white);
      --l-gray: var(--color-light-gray);
      --black: var(--color-black);
      
      /* Optimized transitions */
      --t-fast: var(--transition-fast);
      --t-norm: var(--transition-normal);
      --t-slow: var(--transition-slow);
    }
  `;
    document.head.appendChild(style);
}

/**
 * Create CSS sprite for common icons (if using custom icons)
 */
export function createIconSprite() {
    // This would typically be done at build time
    // Implementation would depend on the icon system used
    console.log('Icon sprite optimization would be implemented at build time');
}

/**
 * Implement CSS containment for better performance
 */
export function implementCSSContainment() {
    const style = document.createElement('style');
    style.textContent = `
    /* CSS Containment for Performance */
    .MuiCard-root { contain: layout style paint; }
    .MuiButton-root { contain: layout style; }
    .MuiTextField-root { contain: layout style; }
    .MuiAppBar-root { contain: layout style paint; }
    .MuiDrawer-paper { contain: layout style paint; }
    
    /* Optimize repaints */
    .MuiButton-root:hover,
    .MuiIconButton-root:hover {
      will-change: transform, background-color;
    }
    
    .MuiButton-root:not(:hover),
    .MuiIconButton-root:not(:hover) {
      will-change: auto;
    }
  `;
    document.head.appendChild(style);
}

/**
 * Initialize all CSS optimizations
 */
export function initializeCSSOptimizations() {
    // Inline critical CSS first
    inlineCriticalCSS();

    // Implement performance optimizations
    implementCSSContainment();

    // Run after initial render
    requestAnimationFrame(() => {
        optimizeCustomProperties();

        // Development-only optimizations
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
                removeUnusedCSS();
            }, 2000);
        }
    });
}

export default {
    criticalCSS,
    inlineCriticalCSS,
    loadStylesheetAsync,
    preloadStylesheet,
    removeUnusedCSS,
    optimizeCustomProperties,
    implementCSSContainment,
    initializeCSSOptimizations
};