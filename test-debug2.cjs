const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  
  try {
    console.log('=== Testing ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Login
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check URL
    console.log('URL:', page.url());
    
    // Get ALL page text
    const allText = await page.evaluate(() => document.body.innerText);
    console.log('ALL TEXT:', allText);
    
    // Check what elements exist
    const buttons = await page.locator('button').count();
    console.log('Buttons:', buttons);
    
    const links = await page.locator('a').count();
    console.log('Links:', links);
    
    // Click through tabs
    const navItems = await page.locator('nav a').count();
    console.log('Nav links:', navItems);
    
    for (let i = 0; i < navItems; i++) {
      const text = await page.locator('nav a').nth(i).innerText();
      console.log('Nav', i, ':', text);
    }
    
  } catch (error) {
    console.log('Error:', error.message);
  }
  
  await browser.close();
})();
