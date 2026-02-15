const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('=== Testing Discovery ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Login first
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    console.log('URL after login:', page.url());
    
    // Click on Discover tab to refresh
    await page.click('text=Discover');
    await page.waitForTimeout(2000);
    
    // Get full page HTML
    const html = await page.content();
    console.log('Has profile card:', html.includes('miles') || html.includes('Sarah'));
    
    // Check main content area
    const mainContent = await page.locator('main').count();
    console.log('Main elements:', mainContent);
    
    // Get all text
    console.log('Full text:', await page.evaluate(() => document.body.innerText));
    
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  await browser.close();
})();
