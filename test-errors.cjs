const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:4173/');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
