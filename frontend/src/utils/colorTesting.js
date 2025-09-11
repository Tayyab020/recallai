/**
 * Automated color consistency testing utilities
 */

// Design system color definitions for validation
export const DESIGN_COLORS = {
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

// CSS variable mappings
export const CSS_VARIABLES = {
    '--color-primary-navy': DESIGN_COLORS.primaryNavy,
    '--color-secondary-navy': DESIGN_COLORS.secondaryNavy,
    '--color-tertiary-navy': DESIGN_COLORS.tertiaryNavy,
    '--color-medium-gray': DESIGN_COLORS.mediumGray,
    '--color-cool-gray': DESIGN_COLORS.coolGray,
    '--color-charcoal-gray': DESIGN_COLORS.charcoalGray,
    '--color-white': DESIGN_COLORS.white,
    '--color-light-gray': DESIGN_COLORS.lightGray,
    '--color-black': DESIGN_COLORS.black
};

/**
 * Convert hex color to RGB object
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
 * Convert RGB to hex
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Get computed color value from CSS
 */
function getComputedColor(element, property) {
    const computed = window.getComputedStyle(element);
    const color = computed.getPropertyValue(property);

    // Convert rgb() to hex
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return rgbToHex(
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3])
        );
    }

    return color;
}

/**
 * Validate CSS variables are properly defined
 */
export function validateCSSVariables() {
    const results = [];
    const rootStyles = getComputedStyle(document.documentElement);

    Object.entries(CSS_VARIABLES).forEach(([variable, expectedValue]) => {
        const actualValue = rootStyles.getPropertyValue(variable).trim();
        const isValid = actualValue.toLowerCase() === expectedValue.toLowerCase();

        results.push({
            variable,
            expected: expectedValue,
            actual: actualValue,
            isValid,
            status: isValid ? 'PASS' : 'FAIL'
        });
    });

    return results;
}

/**
 * Test color consistency across components
 */
export function testComponentColorConsistency() {
    const results = [];

    // Test Material-UI components
    const componentTests = [
        {
            selector: '.MuiAppBar-root',
            property: 'background-color',
            expected: DESIGN_COLORS.primaryNavy,
            description: 'AppBar background should be primary navy'
        },
        {
            selector: '.MuiButton-contained',
            property: 'background-color',
            expected: DESIGN_COLORS.primaryNavy,
            description: 'Primary button background should be primary navy'
        },
        {
            selector: '.MuiCard-root',
            property: 'background-color',
            expected: DESIGN_COLORS.white,
            description: 'Card background should be white'
        },
        {
            selector: 'body',
            property: 'background-color',
            expected: DESIGN_COLORS.lightGray,
            description: 'Body background should be light gray'
        }
    ];

    componentTests.forEach(test => {
        const elements = document.querySelectorAll(test.selector);

        if (elements.length === 0) {
            results.push({
                ...test,
                status: 'SKIP',
                message: 'Element not found in DOM'
            });
            return;
        }

        elements.forEach((element, index) => {
            const actualColor = getComputedColor(element, test.property);
            const isValid = actualColor.toLowerCase() === test.expected.toLowerCase();

            results.push({
                ...test,
                elementIndex: index,
                actual: actualColor,
                isValid,
                status: isValid ? 'PASS' : 'FAIL'
            });
        });
    });

    return results;
}

/**
 * Validate contrast ratios for accessibility
 */
export function validateContrastRatios() {
    const contrastTests = [
        {
            foreground: DESIGN_COLORS.primaryNavy,
            background: DESIGN_COLORS.white,
            description: 'Primary navy text on white background',
            minRatio: 4.5
        },
        {
            foreground: DESIGN_COLORS.tertiaryNavy,
            background: DESIGN_COLORS.white,
            description: 'Tertiary navy text on white background',
            minRatio: 4.5
        },
        {
            foreground: DESIGN_COLORS.charcoalGray,
            background: DESIGN_COLORS.white,
            description: 'Charcoal gray text on white background',
            minRatio: 4.5
        },
        {
            foreground: DESIGN_COLORS.white,
            background: DESIGN_COLORS.primaryNavy,
            description: 'White text on primary navy background',
            minRatio: 4.5
        },
        {
            foreground: DESIGN_COLORS.coolGray,
            background: DESIGN_COLORS.charcoalGray,
            description: 'Cool gray text on charcoal background',
            minRatio: 3.0
        }
    ];

    return contrastTests.map(test => {
        const ratio = calculateContrastRatio(test.foreground, test.background);
        const passes = ratio >= test.minRatio;

        return {
            ...test,
            actualRatio: ratio.toFixed(2),
            passes,
            status: passes ? 'PASS' : 'FAIL'
        };
    });
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return 0;

        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Test cross-browser color rendering
 */
export function testCrossBrowserColors() {
    const results = {
        userAgent: navigator.userAgent,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        colorGamut: 'unknown',
        tests: []
    };

    // Detect color gamut support
    if (window.matchMedia) {
        if (window.matchMedia('(color-gamut: p3)').matches) {
            results.colorGamut = 'p3';
        } else if (window.matchMedia('(color-gamut: srgb)').matches) {
            results.colorGamut = 'srgb';
        }
    }

    // Test color rendering consistency
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.width = '1px';
    testElement.style.height = '1px';
    document.body.appendChild(testElement);

    Object.entries(DESIGN_COLORS).forEach(([name, hex]) => {
        testElement.style.backgroundColor = hex;
        const computed = getComputedColor(testElement, 'background-color');

        results.tests.push({
            colorName: name,
            expected: hex,
            rendered: computed,
            matches: computed.toLowerCase() === hex.toLowerCase()
        });
    });

    document.body.removeChild(testElement);
    return results;
}

/**
 * Visual regression testing for colors
 */
export function captureColorSnapshot() {
    const snapshot = {
        timestamp: new Date().toISOString(),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        colors: {}
    };

    // Capture colors from key elements
    const keyElements = [
        { selector: '.MuiAppBar-root', property: 'background-color', name: 'appBarBackground' },
        { selector: '.MuiButton-contained', property: 'background-color', name: 'primaryButtonBackground' },
        { selector: '.MuiCard-root', property: 'background-color', name: 'cardBackground' },
        { selector: 'body', property: 'background-color', name: 'bodyBackground' },
        { selector: 'h1, .MuiTypography-h1', property: 'color', name: 'headingColor' }
    ];

    keyElements.forEach(test => {
        const element = document.querySelector(test.selector);
        if (element) {
            snapshot.colors[test.name] = getComputedColor(element, test.property);
        }
    });

    return snapshot;
}

/**
 * Compare color snapshots for regression testing
 */
export function compareColorSnapshots(baseline, current) {
    const differences = [];

    Object.keys(baseline.colors).forEach(colorName => {
        const baselineColor = baseline.colors[colorName];
        const currentColor = current.colors[colorName];

        if (baselineColor !== currentColor) {
            differences.push({
                element: colorName,
                baseline: baselineColor,
                current: currentColor,
                changed: true
            });
        }
    });

    return {
        hasChanges: differences.length > 0,
        differences,
        summary: `${differences.length} color changes detected`
    };
}

/**
 * Run comprehensive color testing suite
 */
export function runColorTestSuite() {
    const results = {
        timestamp: new Date().toISOString(),
        cssVariables: validateCSSVariables(),
        componentConsistency: testComponentColorConsistency(),
        contrastRatios: validateContrastRatios(),
        crossBrowser: testCrossBrowserColors(),
        snapshot: captureColorSnapshot()
    };

    // Calculate overall pass rate
    const allTests = [
        ...results.cssVariables,
        ...results.componentConsistency,
        ...results.contrastRatios
    ];

    const passedTests = allTests.filter(test => test.status === 'PASS' || test.passes);
    results.summary = {
        total: allTests.length,
        passed: passedTests.length,
        failed: allTests.length - passedTests.length,
        passRate: ((passedTests.length / allTests.length) * 100).toFixed(1)
    };

    return results;
}

/**
 * Initialize automated color testing
 */
export function initializeColorTesting() {
    // Run tests in development mode
    if (process.env.NODE_ENV === 'development') {
        // Run initial test suite
        setTimeout(() => {
            const results = runColorTestSuite();

            console.group('🎨 Color Consistency Test Results');
            console.log(`Pass Rate: ${results.summary.passRate}% (${results.summary.passed}/${results.summary.total})`);

            // Log failures
            const failures = [
                ...results.cssVariables.filter(t => !t.isValid),
                ...results.componentConsistency.filter(t => !t.isValid),
                ...results.contrastRatios.filter(t => !t.passes)
            ];

            if (failures.length > 0) {
                console.warn('❌ Failed Tests:', failures);
            } else {
                console.log('✅ All color tests passed!');
            }

            console.groupEnd();
        }, 2000);

        // Set up periodic testing
        setInterval(() => {
            const quickTest = validateCSSVariables();
            const failures = quickTest.filter(t => !t.isValid);

            if (failures.length > 0) {
                console.warn('🎨 Color consistency issue detected:', failures);
            }
        }, 30000); // Check every 30 seconds
    }
}

export default {
    DESIGN_COLORS,
    CSS_VARIABLES,
    validateCSSVariables,
    testComponentColorConsistency,
    validateContrastRatios,
    testCrossBrowserColors,
    captureColorSnapshot,
    compareColorSnapshots,
    runColorTestSuite,
    initializeColorTesting
};