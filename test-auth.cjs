const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== MUSE APP FULL TEST ===\n');
  let passed = 0, failed = 0;
  
  try {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // 1. Signup
    console.log('1. Sign up');
    await page.click('text=Sign up');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder="Your name"]', 'Test');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    if (page.url().includes('onboarding')) { passed++; console.log('   ✅'); }
    else { failed++; console.log('   ❌'); }
    
    // 2. Complete onboarding
    console.log('2. Onboarding');
    await page.waitForTimeout(2000);
    
    // Use the data-testid selector
    for (let i = 0; i < 4; i++) {
      try {
        await page.click('[data-testid="onboarding-next"]', { timeout: 2000 });
        await page.waitForTimeout(500);
      } catch (e) {
        break;
      }
    }
    
    if (!page.url().includes('onboarding')) { passed++; console.log('   ✅'); }
    else { failed++; console.log('   ❌ - still at ' + page.url()); }
    
    // 3. Discovery
    console.log('3. Discovery');
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes('miles') || text.includes('LIKE')) { passed++; console.log('   ✅'); }
    else { failed++; console.log('   ❌'); }
    
    // 4. Swipe
    console.log('4. Swipe');
    try {
      await page.click('text=LIKE', { timeout: 2000 });
      await page.waitForTimeout(300);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 5. Navigation - click on a nav link
    console.log('5. Navigation');
    try {
      await page.click('a:has-text("Matches"), a:has-text("Moments"), a:has-text("Profile")', { timeout: 2000 });
      await page.waitForTimeout(500);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 6. Logout
    console.log('6. Logout');
    const btns = await page.locator('button').all();
    let found = false;
    for (const btn of btns) {
      const txt = await btn.textContent();
      if (txt && txt.includes('Log Out')) {
        await btn.click();
        await page.waitForTimeout(500);
        found = true;
        break;
      }
    }
    if (found || page.url().includes('auth')) { passed++; console.log('   ✅'); }
    else { failed++; console.log('   ❌'); }
    
    // 7. Wrong password
    console.log('7. Wrong password');
    try {
      await page.fill('input[type="email"]', 'test@muse.com');
      await page.fill('input[type="password"]', 'wrong');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
      const err = await page.evaluate(() => document.body.innerText);
      if (err.includes('Incorrect')) { passed++; console.log('   ✅'); }
      else { failed++; console.log('   ❌'); }
    } catch { failed++; console.log('   ❌'); }
    
    // 8. Correct login
    console.log('8. Correct login');
    try {
      await page.fill('input[type="password"]', 'Password123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1500);
      if (!page.url().includes('auth')) { passed++; console.log('   ✅'); }
      else { failed++; console.log('   ❌'); }
    } catch { failed++; console.log('   ❌'); }
    
    console.log('\n=== RESULTS: ' + passed + '/' + (passed+failed) + ' PASSED ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
