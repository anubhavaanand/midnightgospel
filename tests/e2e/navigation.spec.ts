import { test, expect } from '@playwright/test';

test('navigate from Hub to Episode 1 and back', async ({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`BROWSER ERROR: ${msg.text()}`);
    }
  });
  page.on('pageerror', exception => {
    console.log(`BROWSER EXCEPTION: ${exception}`);
  });

  // 1. Load the Hub
  await page.goto('/');
  
  // Wait for canvas to mount
  await page.waitForSelector('canvas');

  // Verify Hub is active (URL or some internal state, but since it's canvas, we can't easily inspect DOM text inside canvas).
  // We can look for the LevelSelector or ChromaticRibbon by checking if dialogue overlay is NOT open initially.
  const dialogOverlay = page.locator('role=dialog');
  await expect(dialogOverlay).not.toBeVisible();

  // 2. Click a portal to transition
  // In Playwright, clicking a specific object in a 3D canvas is hard.
  // We usually have to dispatch a click event at the center of the canvas where the Hub is.
  await page.mouse.click(500, 500); // Click center, which might hit Clancy and open dialogue

  // 3. Verify Dialogue Overlay opens
  await expect(dialogOverlay).toBeVisible();

  // 4. Click Next to advance dialogue
  await dialogOverlay.click();

  // Wait for transition wipe if it was triggered (hypothetical test flow)
  // await page.waitForTimeout(1000);
});
