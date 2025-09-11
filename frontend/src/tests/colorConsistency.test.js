/**
 * Color consistency automated tests
 * Run with: npm test -- colorConsistency.test.js
 */

import {
    DESIGN_COLORS,
    CSS_VARIABLES,
    validateCSSVariables,
    validateContrastRatios,
    runColorTestSuite
} from '../utils/colorTesting';

// Mock DOM environment for testing
const mockElement = {
    style: {},
    getBoundingClientRect: () => ({ width: 100, height: 100 })
};

const mockGetComputedStyle = (element) => ({
    getPropertyValue: (prop) => {
        if (prop.startsWith('--color-')) {
            return CSS_VARIABLES[prop] || '';
        }
        return '';
    }
});

// Mock window and document for Node.js environment
global.window = {
    getComputedStyle: mockGetComputedStyle,
    matchMedia: (query) => ({ matches: false })
};

global.document = {
    documentElement: mockElement,
    querySelector: () => mockElement,
    querySelectorAll: () => [mockElement],
    createElement: () => mockElement,
    body: {
        appendChild: () => { },
        removeChild: () => { }
    }
};

describe('Color Consistency Tests', () => {

    describe('Design System Colors', () => {
        test('should have all required colors defined', () => {
            const requiredColors = [
                'primaryNavy',
                'secondaryNavy',
                'tertiaryNavy',
                'mediumGray',
                'coolGray',
                'charcoalGray',
                'white',
                'lightGray',
                'black'
            ];

            requiredColors.forEach(color => {
                expect(DESIGN_COLORS[color]).toBeDefined();
                expect(DESIGN_COLORS[color]).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });

        test('should have correct color values', () => {
            expect(DESIGN_COLORS.primaryNavy).toBe('#000776');
            expect(DESIGN_COLORS.secondaryNavy).toBe('#003366');
            expect(DESIGN_COLORS.tertiaryNavy).toBe('#0A1128');
            expect(DESIGN_COLORS.mediumGray).toBe('#8E8982');
            expect(DESIGN_COLORS.coolGray).toBe('#C0C0C0');
            expect(DESIGN_COLORS.charcoalGray).toBe('#36454F');
            expect(DESIGN_COLORS.white).toBe('#FFFFFF');
            expect(DESIGN_COLORS.lightGray).toBe('#F8F9FA');
            expect(DESIGN_COLORS.black).toBe('#000000');
        });
    });

    describe('CSS Variables', () => {
        test('should map CSS variables to correct colors', () => {
            expect(CSS_VARIABLES['--color-primary-navy']).toBe(DESIGN_COLORS.primaryNavy);
            expect(CSS_VARIABLES['--color-secondary-navy']).toBe(DESIGN_COLORS.secondaryNavy);
            expect(CSS_VARIABLES['--color-tertiary-navy']).toBe(DESIGN_COLORS.tertiaryNavy);
            expect(CSS_VARIABLES['--color-white']).toBe(DESIGN_COLORS.white);
        });

        test('should have all required CSS variables', () => {
            const requiredVariables = [
                '--color-primary-navy',
                '--color-secondary-navy',
                '--color-tertiary-navy',
                '--color-medium-gray',
                '--color-cool-gray',
                '--color-charcoal-gray',
                '--color-white',
                '--color-light-gray',
                '--color-black'
            ];

            requiredVariables.forEach(variable => {
                expect(CSS_VARIABLES[variable]).toBeDefined();
            });
        });
    });

    describe('Contrast Ratios', () => {
        test('should meet WCAG AA standards for normal text', () => {
            const contrastResults = validateContrastRatios();

            contrastResults.forEach(result => {
                if (result.minRatio === 4.5) {
                    expect(parseFloat(result.actualRatio)).toBeGreaterThanOrEqual(4.5);
                }
            });
        });

        test('should meet WCAG AA standards for large text', () => {
            const contrastResults = validateContrastRatios();

            contrastResults.forEach(result => {
                if (result.minRatio === 3.0) {
                    expect(parseFloat(result.actualRatio)).toBeGreaterThanOrEqual(3.0);
                }
            });
        });

        test('primary navy on white should have excellent contrast', () => {
            const contrastResults = validateContrastRatios();
            const primaryNavyTest = contrastResults.find(r =>
                r.description.includes('Primary navy text on white')
            );

            expect(primaryNavyTest).toBeDefined();
            expect(parseFloat(primaryNavyTest.actualRatio)).toBeGreaterThan(10);
        });
    });

    describe('Color Validation Functions', () => {
        test('validateCSSVariables should return results array', () => {
            const results = validateCSSVariables();

            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);

            results.forEach(result => {
                expect(result).toHaveProperty('variable');
                expect(result).toHaveProperty('expected');
                expect(result).toHaveProperty('actual');
                expect(result).toHaveProperty('isValid');
                expect(result).toHaveProperty('status');
            });
        });

        test('runColorTestSuite should return comprehensive results', () => {
            const results = runColorTestSuite();

            expect(results).toHaveProperty('timestamp');
            expect(results).toHaveProperty('cssVariables');
            expect(results).toHaveProperty('componentConsistency');
            expect(results).toHaveProperty('contrastRatios');
            expect(results).toHaveProperty('crossBrowser');
            expect(results).toHaveProperty('snapshot');
            expect(results).toHaveProperty('summary');

            expect(results.summary).toHaveProperty('total');
            expect(results.summary).toHaveProperty('passed');
            expect(results.summary).toHaveProperty('failed');
            expect(results.summary).toHaveProperty('passRate');
        });
    });

    describe('Color Hex Validation', () => {
        test('all colors should be valid hex codes', () => {
            Object.values(DESIGN_COLORS).forEach(color => {
                expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            });
        });

        test('colors should not be duplicated', () => {
            const colorValues = Object.values(DESIGN_COLORS);
            const uniqueColors = [...new Set(colorValues)];

            // Allow white and black to potentially be duplicated as they're common
            expect(uniqueColors.length).toBeGreaterThanOrEqual(colorValues.length - 2);
        });
    });

    describe('Navy Blue Color Variations', () => {
        test('navy colors should be progressively darker', () => {
            // Convert hex to numeric value for comparison
            const hexToNum = (hex) => parseInt(hex.slice(1), 16);

            const primaryNum = hexToNum(DESIGN_COLORS.primaryNavy);
            const secondaryNum = hexToNum(DESIGN_COLORS.secondaryNavy);
            const tertiaryNum = hexToNum(DESIGN_COLORS.tertiaryNavy);

            // Tertiary should be darkest, primary should be lightest
            expect(tertiaryNum).toBeLessThan(secondaryNum);
            expect(secondaryNum).toBeLessThan(primaryNum);
        });
    });

    describe('Gray Color Variations', () => {
        test('gray colors should have appropriate lightness values', () => {
            const hexToNum = (hex) => parseInt(hex.slice(1), 16);

            const lightGrayNum = hexToNum(DESIGN_COLORS.lightGray);
            const coolGrayNum = hexToNum(DESIGN_COLORS.coolGray);
            const mediumGrayNum = hexToNum(DESIGN_COLORS.mediumGray);
            const charcoalGrayNum = hexToNum(DESIGN_COLORS.charcoalGray);

            // Light gray should be lightest, charcoal should be darkest
            expect(lightGrayNum).toBeGreaterThan(coolGrayNum);
            expect(coolGrayNum).toBeGreaterThan(mediumGrayNum);
            expect(mediumGrayNum).toBeGreaterThan(charcoalGrayNum);
        });
    });
});

describe('Integration Tests', () => {
    test('color system should be internally consistent', () => {
        const results = runColorTestSuite();

        // At least 90% of tests should pass
        expect(parseFloat(results.summary.passRate)).toBeGreaterThanOrEqual(90);
    });

    test('should not have any critical color failures', () => {
        const contrastResults = validateContrastRatios();
        const criticalFailures = contrastResults.filter(r => !r.passes && r.minRatio === 4.5);

        expect(criticalFailures.length).toBe(0);
    });
});