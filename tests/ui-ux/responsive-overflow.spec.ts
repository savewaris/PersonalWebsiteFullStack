import { test, expect } from '@playwright/test';

/**
 * Responsive Viewport & Layout Integrity Test Suite
 * Automatically detects horizontal overflow, clipping, and responsive breakage
 * across Mobile (375px), Tablet (768px), and Desktop (1440px).
 */
test.describe('Global Standards: Responsive Viewport & Zero-Overflow', () => {
  const routes = ['/', '/login'];

  for (const route of routes) {
    test(`Route "${route}" must not have horizontal scrollbar or element overflow`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      // Check if page body/html exceeds viewport width
      const overflowInfo = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const viewWidth = window.innerWidth;
        const hasHorizontalScroll = docWidth > viewWidth;

        // Find elements that bleed outside viewport
        const offendingElements: string[] = [];
        const allElements = document.querySelectorAll('*');

        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > viewWidth + 1) { // 1px tolerance for subpixel rounding
            const identifier = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).split(' ')[0] : ''}`;
            if (offendingElements.length < 5) {
              offendingElements.push(`${identifier} (right: ${Math.round(rect.right)}px > view: ${viewWidth}px)`);
            }
          }
        });

        return {
          hasHorizontalScroll,
          docWidth,
          viewWidth,
          offendingElements,
        };
      });

      expect(
        overflowInfo.hasHorizontalScroll,
        `Horizontal overflow detected on ${route}! Document width (${overflowInfo.docWidth}px) exceeds viewport width (${overflowInfo.viewWidth}px). Offending elements: ${overflowInfo.offendingElements.join(', ')}`
      ).toBe(false);
    });
  }
});
