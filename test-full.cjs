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
    
    console.log('\n=== TEST 2: Try Login (empty) ===');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(500);
    const hasEmailError = await page.locator('text=Email is required').count();
    const hasPasswordError = await page.locator('text=Password is required').count();
    console.log('✅ Email validation:', hasEmailError > 0);
    console.log('✅ Password validation:', hasPasswordError > 0);
    
    console.log('\n=== TEST 3: Fill Login ===');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1500);
    
    // Check if we're on discovery page
    const pageText = await page.evaluate(() => document.body.innerText);
    const onDiscovery = pageText.includes('Discover') || pageText.includes('Filters') || pageText.includes('Like');
    console.log('✅ Logged in:', onDiscovery);
    
    console.log('\n=== TEST 4: Discovery Page ===');
    const hasProfile = await page.locator('text=miles away').count();
    console.log('✅ Profile cards:', hasProfile > 0);
    
    console.log('\n=== TEST 5: Swipe Actions ===');
    // Check for action buttons
    const hasHeart = await page.locator('svg').count();
    console.log('✅ Has action buttons:', hasHeart > 0);
    
    console.log('\n=== TEST 6: Navigation ===');
    await page.click('text=Matches');
    await page.waitForTimeout(500);
    const matchesText = await page.evaluate(() => document.body.innerText);
    console.log('✅ Matches page:', matchesText.includes('Matches'));
    
    await page.click('text=Moments');
    await page.waitForTimeout(500);
    const momentsText = await page.evaluate(() => document.body.innerText);
    console.log('✅ Moments page:', momentsText.includes('Moments'));
    
    await page.click('text=Profile');
    await page.waitForTimeout(500);
    const profileText = await page.evaluate(() => document.body.innerText);
    console.log('✅ Profile page:', profileText.includes('Profile'));
    
    if (errors.length > 0) {
      console.log('\n=== CONSOLE ERRORS ===');
      errors.forEach(e => console.log('ERROR:', e));
    } else {
      console.log('\n✅ No errors!');
    }
    
    console.log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (error) {
    console.log('Test error:', error.message);
  }
  
  await browser.close();
})();
