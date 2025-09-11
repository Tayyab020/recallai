/**
 * Accessibility utilities for color contrast validation and compliance
 */

// Color values from design system
const COLORS = {
    primaryNavy: '#000776',
    secondaryNavy: '#003366',
    tertiaryNavy: '#0A1128',
    mediumGray: '#8E8982',
    coolGray: '#C0C0C0',
    charcoalGray: '#36454F',
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    black: '#000000'
};

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(rgb) {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastRequirement(foreground, background, level = 'AA', size = 'normal') {
    const ratio = getContrastRatio(foreground, background);

    if (level === 'AAA') {
        return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    }

    // AA level (default)
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Validate all design system color combinations
 */
export function validateDesignSystemContrast() {
    const results = [];

    // Text on backgrounds
    const textCombinations = [
        { name: 'Primary Navy on White', fg: COLORS.primaryNavy, bg: COLORS.white },
        { name: 'Tertiary Navy on White', fg: COLORS.tertiaryNavy, bg: COLORS.white },
        { name: 'Tertiary Navy on Light Gray', fg: COLORS.tertiaryNavy, bg: COLORS.lightGray },
        { name: 'Charcoal Gray on White', fg: COLORS.charcoalGray, bg: COLORS.white },
        { name: 'Charcoal Gray on Light Gray', fg: COLORS.charcoalGray, bg: COLORS.lightGray },
        { name: 'Medium Gray on White', fg: COLORS.mediumGray, bg: COLORS.white },
        { name: 'White on Primary Navy', fg: COLORS.white, bg: COLORS.primaryNavy },
        { name: 'White on Secondary Navy', fg: COLORS.white, bg: COLORS.secondaryNavy },
        { name: 'White on Charcoal Gray', fg: COLORS.white, bg: COLORS.charcoalGray },
        { name: 'Cool Gray on Charcoal Gray', fg: COLORS.coolGray, bg: COLORS.charcoalGray }
    ];

    textCombinations.forEach(combo => {
        const ratio = getContrastRatio(combo.fg, combo.bg);
        const meetsAA = meetsContrastRequirement(combo.fg, combo.bg, 'AA', 'normal');
        const meetsAALarge = meetsContrastRequirement(combo.fg, combo.bg, 'AA', 'large');

        results.push({
            combination: combo.name,
            ratio: ratio.toFixed(2),
            meetsAA,
            meetsAALarge,
            foreground: combo.fg,
            background: combo.bg
        });
    });

    return results;
}

/**
 * Add focus indicators to elements that don't have them
 */
export function enhanceFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
    /* Enhanced focus indicators for accessibility */
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible,
    [tabindex]:focus-visible,
    a:focus-visible {
      outline: 2px solid var(--color-secondary-navy) !important;
      outline-offset: 2px !important;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      :root {
        --color-primary-navy: #000000;
        --color-secondary-navy: #000000;
        --color-tertiary-navy: #000000;
        --color-charcoal-gray: #000000;
        --color-medium-gray: #666666;
        --color-cool-gray: #999999;
        --color-white: #FFFFFF;
        --color-light-gray: #FFFFFF;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;

    document.head.appendChild(style);
}

/**
 * Check for color-only information and add alternative indicators
 */
export function addAlternativeIndicators() {
    // Add screen reader text for color-coded elements
    const srOnlyStyle = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

    const style = document.createElement('style');
    style.textContent = srOnlyStyle;
    document.head.appendChild(style);
}

/**
 * Initialize accessibility enhancements
 */
export function initializeAccessibility() {
    enhanceFocusIndicators();
    addAlternativeIndicators();

    // Log contrast validation results in development
    if (process.env.NODE_ENV === 'development') {
        const results = validateDesignSystemContrast();
        console.group('🎨 Design System Contrast Validation');
        results.forEach(result => {
            const status = result.meetsAA ? '✅' : '❌';
            console.log(`${status} ${result.combination}: ${result.ratio}:1`);
        });
        console.groupEnd();
    }
}

export default {
    getContrastRatio,
    meetsContrastRequirement,
    validateDesignSystemContrast,
    initializeAccessibility
};