import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * WCAG 2.2 AA Accessibility Test Suite
 * Automatically verifies color contrast, ARIA landmarks, form labels, and image alt tags.
 */
test.describe('Global Standards: WCAG 2.2 AA Accessibility', () => {
  const routes = ['/', '/login'];

  for (const route of routes) {
    test(`Route "${route}" should meet WCAG 2.2 AA standards`, async ({ page }, testInfo) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000); // Allow dynamic animations to settle

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
        .analyze();

      // Attach detailed report for debugging
      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
      });

      // Filter out non-critical violations or assert zero critical/serious violations
      const seriousOrCritical = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (seriousOrCritical.length > 0) {
        const failureDetails = seriousOrCritical
          .map((v) => `[${v.impact?.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes.length} nodes) -> Help: ${v.helpUrl}`)
          .join('\n');
        expect(seriousOrCritical, `Accessibility violations detected on ${route}:\n${failureDetails}`).toHaveLength(0);
      }

      expect(accessibilityScanResults.violations).toHaveLength(0);
    });
  }
});
