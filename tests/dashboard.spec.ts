import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server (default vite port setup, ensure dev is running)
    await page.goto('http://localhost:5173/');
    // Wait for queries to resolve (loader disappears)
    await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 8000 });
  });

  test('Visual: Theme validation & WhiteLabel Persona Switching', async ({ page }) => {
    // Default theme validation
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Click theme toggle switch
    await page.getByRole('switch').first().click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Test WhiteLabel Persona switching
    const squadTrigger = page.getByRole('button', { name: /H&M/i });
    await expect(squadTrigger).toBeVisible();
    await squadTrigger.click();

    // Select 'Pets' WhiteLabel Persona
    const petsOption = page.getByRole('menuitem', { name: /Pet/i });
    await expect(petsOption).toBeVisible();
    await petsOption.click();

    // Verify the dropdown trigger is updated
    const newSquadTrigger = page.getByRole('button', { name: /Pets/i });
    await expect(newSquadTrigger).toBeVisible();
  });

  test('Interaction: Legend filtering on charts', async ({ page }) => {
    // Find Pipeline Duration Trend chart legends
    const devLegend = page.locator('button:has-text("Dev")').first();
    const stagingLegend = page.locator('button:has-text("Staging")').first();

    await expect(devLegend).toHaveCSS('opacity', '1');
    await expect(stagingLegend).toHaveCSS('opacity', '1');

    // Toggle Dev off
    await devLegend.click();
    await expect(devLegend).toHaveCSS('opacity', '0.4');

    // Find E2E Test Results chart legends
    const passedLegend = page.locator('button:has-text("Passed")').first();
    await expect(passedLegend).toHaveCSS('opacity', '1');
    
    // Toggle Passed off
    await passedLegend.click();
    await expect(passedLegend).toHaveCSS('opacity', '0.4');
  });

  test('Interaction: Chart hover tooltips and rendering', async ({ page }) => {
    // We expect the pipeline chart to be rendered (it has SVG elements)
    const pipelineChart = page
      .locator('.lg\\:col-span-4')
      .locator('svg')
      .first();
    await expect(pipelineChart).toBeVisible();

    // Hover over the center of the chart
    await pipelineChart.hover({ position: { x: 200, y: 150 } });

    // Expect tooltip to show up
    const tooltip = page.locator('text=Dev:').first();
    await expect(tooltip).toBeVisible();
  });

  test('Accessibility: Keyboard navigation', async ({ page }) => {
    // Start keyboard navigation from body
    await page.keyboard.press('Tab');

    // First focusable element should be 'Dashboard' link
    const focusedText = await page.evaluate(() => document.activeElement?.textContent || '');
    expect(focusedText).toContain('Dashboard');

    await page.keyboard.press('Tab');
    const focusedText2 = await page.evaluate(() => document.activeElement?.textContent || '');
    expect(focusedText2).toContain('Design System');
  });
});
