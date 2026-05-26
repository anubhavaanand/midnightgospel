const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE - ${msg.type()}]: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGE ERROR]: ${err.toString()}`);
  });

  try {
    console.log('Navigating to http://localhost:5174/ ...');
    await page.goto('http://localhost:5174/', { waitUntil: 'load', timeout: 30000 });
    console.log('DOM Load event fired. Waiting 15 seconds to let heavy assets download/load...');
    await page.waitForTimeout(15000);
    
    const screenshotPath = path.join(__dirname, 'screenshot.png');
    console.log(`Taking screenshot and saving to ${screenshotPath}...`);
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved successfully.');
  } catch (err) {
    console.error('Navigation or wait failed:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
