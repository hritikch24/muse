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
    console.log('=== TEST 1: Auth Page ===');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    
    // Check auth page
    const hasSignIn = await page.locator('text=Sign In').count();
    console.log('✅ Sign In visible:', hasSignIn > 0);
    
    console.log('\n=== TEST 2: Fill Login ===');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    console.log('Filled email and password');
    
    // Click sign in and wait
    await page.click('button[type="submit"]');
    console.log('Clicked sign in');
    
    // Wait longer for state update
    await page.waitForTimeout(3000);
    
    // Check URL
    console.log('Current URL:', page.url());
    
    // Check page content
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('Page text:', pageText.substring(0, 500));
    
    // Check what's visible
    const hasMuse = await page.locator('text=Muse').count();
    const hasSignInNow = await page.locator('text=Sign In').count();
    const hasDiscover = await page.locator('text=Discover').count();
    const hasFilters = await page.locator('text=Filters').count();
    
    console.log('\n=== CHECKING STATE ===');
    console.log('Has Muse logo:', hasMuse > 0);
    console.log('Still has Sign In:', hasSignInNow > 0);
    console.log('Has Discover:', hasDiscover > 0);
    console.log('Has Filters:', hasFilters > 0);
    
    if (hasSignInNow > 0) {
      console.log('\n❌ LOGIN FAILED - Still on auth page');
    } else if (hasDiscover > 0 || hasFilters > 0) {
      console.log('\n✅ LOGIN SUCCESS - On discovery page');
    }
    
    if (errors.length > 0) {
      console.log('\n=== CONSOLE ERRORS ===');
      errors.forEach(e => console.log('ERROR:', e));
    }
    
  } catch (error) {
    console.log('Test error:', error.message);
  }
  
  await browser.close();
})();
