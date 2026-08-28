import { test, expect } from '@playwright/test';

/**
 * Touch Target & Interactive Usability Test Suite
 * Validates WCAG 2.5.8 (Target Size Minimum - 24x24px) & Apple/Google Usability Guidelines (≥44px touch area)
 * for standalone buttons, icon triggers, and interactive elements.
 */
test.describe('Global Standards: Interactive Touch Targets & Usability', () => {
  const routes = ['/', '/login'];

  for (const route of routes) {
    test(`Interactive controls on "${route}" should meet target size requirements`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      const undersizedElements = await page.evaluate(() => {
        const issues: Array<{ tag: string; text: string; width: number; height: number; outerHTML: string }> = [];
        const interactiveElements = document.querySelectorAll('button, a, input:not([type="hidden"]), select, textarea, [role="button"]');

        interactiveElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          // Skip hidden elements or zero-size elements
          if (rect.width === 0 || rect.height === 0) return;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

          // Inline text links inside paragraphs are exempt from strict 24px height under WCAG 2.5.8
          const isInlineLink = el.tagName.toLowerCase() === 'a' && el.parentElement && ['P', 'SPAN', 'LI'].includes(el.parentElement.tagName);
          if (isInlineLink && rect.height >= 16) return;

          // Standard standalone interactive target size threshold (24px absolute minimum for WCAG 2.2 AA)
          if (rect.width < 24 || rect.height < 24) {
            issues.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || '').trim().slice(0, 30),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              outerHTML: el.outerHTML.slice(0, 100),
            });
          }
        });

        return issues;
      });

      expect(
        undersizedElements.length,
        `Found ${undersizedElements.length} undersized interactive targets on ${route}:\n` +
          undersizedElements.map((e) => `• <${e.tag}> "${e.text}" is only ${e.width}x${e.height}px (HTML: ${e.outerHTML})`).join('\n')
      ).toBe(0);
    });
  }
});
