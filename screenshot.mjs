import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  // Wait a bit to let the R3F canvas render and shaders load
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
