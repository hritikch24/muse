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
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for React to render
    await page.waitForTimeout(2000);
    
    // Check what's on the page
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('Body HTML length:', bodyHTML.length);
    console.log('Body text:', await page.evaluate(() => document.body.innerText.substring(0, 500)));
    
    if (errors.length > 0) {
      console.log('\n=== CONSOLE ERRORS ===');
      errors.forEach(e => console.log('ERROR:', e));
    } else {
      console.log('\nNo console errors!');
    }
    
    // Check if auth page elements exist
    const hasSignIn = await page.locator('text=Sign In').count();
    const hasSignUp = await page.locator('text=Sign Up').count();
    const hasMuse = await page.locator('text=Muse').count();
    
    console.log('\n=== PAGE ELEMENTS ===');
    console.log('Sign In button:', hasSignIn > 0 ? 'FOUND' : 'NOT FOUND');
    console.log('Sign Up button:', hasSignUp > 0 ? 'FOUND' : 'NOT FOUND');
    console.log('Muse logo:', hasMuse > 0 ? 'FOUND' : 'NOT FOUND');
    
    if (hasSignIn > 0 || hasMuse > 0) {
      console.log('\n✅ APP IS WORKING!');
    } else {
      console.log('\n❌ APP NOT RENDERING PROPERLY');
    }
    
  } catch (error) {
    console.log('Navigation error:', error.message);
  }
  
  await browser.close();
})();
