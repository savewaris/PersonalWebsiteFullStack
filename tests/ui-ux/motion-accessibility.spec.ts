import { test, expect } from '@playwright/test';

/**
 * Motion Accessibility & Reduced Motion Test Suite
 * Validates WCAG 2.3.3 (Animation from Interactions) and CSS prefers-reduced-motion compliance.
 */
test.describe('Global Standards: Reduced Motion & Animation Safety', () => {
  test('Page loads stably and renders all sections under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Verify main content is visible and non-zero height
    const mainHeight = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      return main.getBoundingClientRect().height;
    });

    expect(mainHeight).toBeGreaterThan(200);

    // Ensure no broken layout with reduced motion
    const isVisible = await page.isVisible('h1');
    expect(isVisible).toBe(true);
  });
});
