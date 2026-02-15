const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  try {
    console.log('=== TEST 1: Login ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    console.log('✅ Logged in');
    
    console.log('\n=== CHECK DISCOVERY PAGE ===');
    const pageHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('Page length:', pageHTML.length);
    console.log('Page text:', await page.evaluate(() => document.body.innerText));
    
    // Check if there's an empty state
    const emptyState = await page.locator('text=That').count();
    console.log('Empty state:', emptyState > 0);
    
    // Wait for profiles to load
    await page.waitForTimeout(2000);
    
    const pageText2 = await page.evaluate(() => document.body.innerText);
    console.log('After wait:', pageText2);
    
    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log('ERROR:', e));
    }
    
  } catch (error) {
    console.log('Test error:', error.message);
  }
  
  await browser.close();
})();
