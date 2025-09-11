/**
 * Responsive design validation and testing utilities
 */

// Breakpoint definitions matching Material-UI and design system
export const BREAKPOINTS = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
};

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint() {
    const width = window.innerWidth;

    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
}

/**
 * Check if current viewport matches a specific breakpoint
 */
export function isBreakpoint(breakpoint) {
    const current = getCurrentBreakpoint();
    return current === breakpoint;
}

/**
 * Check if current viewport is at or above a breakpoint
 */
export function isBreakpointUp(breakpoint) {
    const width = window.innerWidth;
    return width >= BREAKPOINTS[breakpoint];
}

/**
 * Check if current viewport is below a breakpoint
 */
export function isBreakpointDown(breakpoint) {
    const width = window.innerWidth;
    return width < BREAKPOINTS[breakpoint];
}

/**
 * Validate color fidelity across different screen types
 */
export function validateColorFidelity() {
    const results = {
        colorGamut: 'srgb',
        pixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth || 24,
        supportsP3: false,
        supportsHDR: false
    };

    // Check for P3 color gamut support
    if (window.matchMedia && window.matchMedia('(color-gamut: p3)').matches) {
        results.colorGamut = 'p3';
        results.supportsP3 = true;
    }

    // Check for HDR support
    if (window.matchMedia && window.matchMedia('(dynamic-range: high)').matches) {
        results.supportsHDR = true;
    }

    return results;
}

/**
 * Test touch capabilities
 */
export function detectTouchCapabilities() {
    return {
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        pointerType: window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
        hoverCapability: window.matchMedia && window.matchMedia('(hover: hover)').matches
    };
}

/**
 * Validate responsive layout at different breakpoints
 */
export function validateResponsiveLayout() {
    const results = [];

    Object.entries(BREAKPOINTS).forEach(([name, width]) => {
        // Simulate viewport width (for testing purposes)
        const originalWidth = window.innerWidth;

        // Test layout at this breakpoint
        const test = {
            breakpoint: name,
            width: width,
            issues: []
        };

        // Check for common responsive issues
        const elements = document.querySelectorAll('.MuiCard-root, .MuiButton-root, .MuiTextField-root');

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);

            // Check minimum touch target size
            if (rect.width < 44 || rect.height < 44) {
                if (el.classList.contains('MuiButton-root') || el.classList.contains('MuiIconButton-root')) {
                    test.issues.push(`Touch target too small: ${rect.width}x${rect.height}px`);
                }
            }

            // Check for horizontal overflow
            if (rect.right > window.innerWidth) {
                test.issues.push(`Element overflows viewport: ${el.className}`);
            }

            // Check font size readability
            const fontSize = parseFloat(styles.fontSize);
            if (fontSize < 14 && width < BREAKPOINTS.md) {
                test.issues.push(`Font size too small for mobile: ${fontSize}px`);
            }
        });

        results.push(test);
    });

    return results;
}

/**
 * Test color contrast at different screen conditions
 */
export function testColorContrast() {
    const colorPairs = [
        { fg: '#000776', bg: '#FFFFFF', name: 'Primary Navy on White' },
        { fg: '#0A1128', bg: '#FFFFFF', name: 'Tertiary Navy on White' },
        { fg: '#36454F', bg: '#FFFFFF', name: 'Charcoal Gray on White' },
        { fg: '#FFFFFF', bg: '#000776', name: 'White on Primary Navy' },
        { fg: '#C0C0C0', bg: '#36454F', name: 'Cool Gray on Charcoal' }
    ];

    return colorPairs.map(pair => {
        // Simple contrast ratio calculation
        const getLuminance = (hex) => {
            const rgb = parseInt(hex.slice(1), 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;

            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });

            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        const lum1 = getLuminance(pair.fg);
        const lum2 = getLuminance(pair.bg);
        const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

        return {
            ...pair,
            ratio: ratio.toFixed(2),
            passesAA: ratio >= 4.5,
            passesAAA: ratio >= 7
        };
    });
}

/**
 * Monitor viewport changes and validate responsive behavior
 */
export function monitorResponsiveChanges(callback) {
    let currentBreakpoint = getCurrentBreakpoint();

    const handleResize = () => {
        const newBreakpoint = getCurrentBreakpoint();

        if (newBreakpoint !== currentBreakpoint) {
            const changeInfo = {
                from: currentBreakpoint,
                to: newBreakpoint,
                width: window.innerWidth,
                height: window.innerHeight,
                timestamp: Date.now()
            };

            currentBreakpoint = newBreakpoint;

            if (callback) {
                callback(changeInfo);
            }

            // Log breakpoint changes in development
            if (process.env.NODE_ENV === 'development') {
                console.log('📱 Breakpoint changed:', changeInfo);
            }
        }
    };

    window.addEventListener('resize', handleResize);

    // Return cleanup function
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}

/**
 * Test responsive images and media
 */
export function validateResponsiveMedia() {
    const images = document.querySelectorAll('img');
    const results = [];

    images.forEach(img => {
        const result = {
            src: img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            displayWidth: img.offsetWidth,
            displayHeight: img.offsetHeight,
            issues: []
        };

        // Check if image is too large for display size
        if (img.naturalWidth > img.offsetWidth * 2) {
            result.issues.push('Image resolution too high for display size');
        }

        // Check if image has proper alt text
        if (!img.alt || img.alt.trim() === '') {
            result.issues.push('Missing alt text');
        }

        // Check if image is responsive
        const styles = window.getComputedStyle(img);
        if (styles.maxWidth !== '100%' && styles.width !== '100%') {
            result.issues.push('Image may not be responsive');
        }

        results.push(result);
    });

    return results;
}

/**
 * Initialize responsive design validation
 */
export function initializeResponsiveValidation() {
    // Import responsive CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/css/responsive.css';
    document.head.appendChild(link);

    // Monitor breakpoint changes in development
    if (process.env.NODE_ENV === 'development') {
        monitorResponsiveChanges((change) => {
            console.group('📱 Responsive Design Validation');
            console.log('Breakpoint change:', change);
            console.log('Touch capabilities:', detectTouchCapabilities());
            console.log('Color fidelity:', validateColorFidelity());
            console.groupEnd();
        });

        // Run initial validation
        setTimeout(() => {
            console.group('🎨 Responsive Color Validation');
            const contrastResults = testColorContrast();
            contrastResults.forEach(result => {
                const status = result.passesAA ? '✅' : '❌';
                console.log(`${status} ${result.name}: ${result.ratio}:1`);
            });
            console.groupEnd();
        }, 1000);
    }
}

export default {
    BREAKPOINTS,
    getCurrentBreakpoint,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    validateColorFidelity,
    detectTouchCapabilities,
    validateResponsiveLayout,
    testColorContrast,
    monitorResponsiveChanges,
    validateResponsiveMedia,
    initializeResponsiveValidation
};