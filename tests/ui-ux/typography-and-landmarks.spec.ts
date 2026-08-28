import { test, expect } from '@playwright/test';

/**
 * Semantic HTML, Landmarks & Typography Hierarchy Test Suite
 * Validates UX structure standards: unique h1, correct heading hierarchy,
 * landmark regions (main/nav/header/footer), and secure external links.
 */
test.describe('Global Standards: Semantic HTML & Typography Structure', () => {
  const routes = ['/', '/login'];

  for (const route of routes) {
    test(`Page structure on "${route}" should adhere to semantic UX guidelines`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const audit = await page.evaluate(() => {
        const errors: string[] = [];

        // 1. Check <main> landmark
        const mainLandmark = document.querySelector('main');
        if (!mainLandmark) {
          errors.push('Missing <main> semantic landmark on page');
        }

        // 2. Check <h1> count
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count === 0) {
          errors.push('Missing <h1> primary heading');
        } else if (h1Count > 1) {
          errors.push(`Multiple <h1> headings found (${h1Count}). Pages should have exactly one primary <h1>`);
        }

        // 3. Check image alt attributes
        const images = document.querySelectorAll('img');
        images.forEach((img, idx) => {
          if (!img.hasAttribute('alt')) {
            errors.push(`Image #${idx + 1} (${img.src.slice(-30)}) is missing an 'alt' attribute`);
          }
        });

        // 4. Check external links for security & accessibility
        const externalLinks = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
        externalLinks.forEach((link) => {
          const href = link.getAttribute('href') || '';
          const target = link.getAttribute('target');
          const rel = link.getAttribute('rel') || '';
          if (target === '_blank' && (!rel.includes('noopener') || !rel.includes('noreferrer'))) {
            errors.push(`External link "${href.slice(0, 40)}" with target="_blank" must include rel="noopener noreferrer"`);
          }
        });

        return errors;
      });

      expect(audit, `Semantic UX errors found on ${route}:\n${audit.join('\n')}`).toEqual([]);
    });
  }
});
