import { test, expect } from '@playwright/test';

test('verify that the Spacecast 3D Hub mounts with HUD overlay telemetry', async ({ page }) => {
  // Log browser console logs for easier debugging in CI
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
  
  // 2. Verify WebGL Canvas mounts successfully
  await page.waitForSelector('canvas');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // 3. Verify SPACECAST HUD Title mounts
  const headerTitle = page.locator('text=SPACECAST');
  await expect(headerTitle).toBeVisible();

  // 4. Verify Diagnostics Telemetry panel is visible
  const diagnosticsPanel = page.locator('text=SIMULATOR DIAGNOSTICS');
  await expect(diagnosticsPanel).toBeVisible();

  // 5. Verify Portal Z-Depth Gauge is visible
  const depthGauge = page.locator('text=PORTAL DEPTH GAUGE');
  await expect(depthGauge).toBeVisible();
});
