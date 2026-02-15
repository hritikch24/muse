const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  
  console.log('=== MUSE APP COMPREHENSIVE TEST ===\n');
  let passed = 0, failed = 0;
  
  try {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // ===== AUTH TESTS =====
    console.log('--- AUTH TESTS ---');
    
    // 1. Sign up
    console.log('1. Sign up with strong password');
    await page.click('text=Sign up');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    if (page.url().includes('onboarding')) { passed++; console.log('   ✅ Signup OK'); }
    else { failed++; console.log('   ❌ Signup failed'); }
    
    // ===== ONBOARDING TESTS =====
    console.log('\n--- ONBOARDING TESTS ---');
    
    // 2. Onboarding validation - photo required
    console.log('2. Photo validation');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const text1 = await page.evaluate(() => document.body.innerText);
    if (text1.includes('photo')) { passed++; console.log('   ✅ Photo required'); }
    else { failed++; console.log('   ❌ No photo validation'); }
    
    // 3. Add photo and continue
    console.log('3. Add photo');
    await page.click('text=Add Photo');
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]');
      if (input) {
        const dt = new DataTransfer();
        const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const blob = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const file = new File([blob], 'test.png', { type: 'image/png' });
        dt.items.add(file);
        input.files = dt.files;
      }
    });
    await page.waitForTimeout(300);
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(400);
    
    // 4. Name validation
    console.log('4. Name validation');
    await page.fill('input[placeholder="Your name"]', '');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const text2 = await page.evaluate(() => document.body.innerText);
    if (text2.includes('Name')) { passed++; console.log('   ✅ Name validation'); }
    else { failed++; console.log('   ❌ Name validation failed'); }
    
    // 5. Complete onboarding
    console.log('5. Complete onboarding');
    await page.fill('input[placeholder="Your name"]', 'John');
    await page.fill('input[placeholder="Your age"]', '25');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(400);
    await page.click('button:has-text("Travel")');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Write your answer..."]', 'Coffee!');
    await page.click('button:has-text("Get Started")');
    await page.waitForTimeout(1500);
    
    if (!page.url().includes('onboarding')) { passed++; console.log('   ✅ Onboarding complete'); }
    else { failed++; console.log('   ❌ Onboarding incomplete'); }
    
    // ===== DISCOVERY TESTS =====
    console.log('\n--- DISCOVERY TESTS ---');
    
    // 6. Discovery page
    console.log('6. Discovery page');
    const body = await page.evaluate(() => document.body.innerText);
    if (body.includes('miles') || body.includes('LIKE')) { passed++; console.log('   ✅ Profiles displayed'); }
    else { failed++; console.log('   ❌ No profiles'); }
    
    // 7. Like button
    console.log('7. Swipe like');
    const btns = await page.locator('button').all();
    if (btns[6]) { await btns[6].click(); await page.waitForTimeout(300); passed++; console.log('   ✅ Like'); }
    else { failed++; console.log('   ❌ Like failed'); }
    
    // ===== PROFILE TESTS =====
    console.log('\n--- PROFILE TESTS ---');
    
    // 8. Navigate to Profile
    console.log('8. Profile page');
    await page.goto('http://localhost:3000/profile');
    await page.waitForTimeout(1000);
    const profileText = await page.evaluate(() => document.body.innerText);
    if (profileText.includes('Profile') || profileText.includes('Edit')) { passed++; console.log('   ✅ Profile page'); }
    else { failed++; console.log('   ❌ Profile page missing'); }
    
    // 9. Premium section
    console.log('9. Premium section');
    if (profileText.includes('Premium') || profileText.includes('Upgrade')) { passed++; console.log('   ✅ Premium section'); }
    else { failed++; console.log('   ❌ No premium'); }
    
    // 10. Logout
    console.log('10. Logout');
    const logoutBtns = await page.locator('button').all();
    let found = false;
    for (const btn of logoutBtns) {
      const txt = await btn.textContent();
      if (txt && txt.includes('Log Out')) {
        await btn.click();
        found = true;
        break;
      }
    }
    await page.waitForTimeout(500);
    if (found) { passed++; console.log('   ✅ Logout button'); }
    else { failed++; console.log('   ❌ No logout'); }
    
    // ===== AUTH RE-TEST =====
    console.log('\n--- AUTH RE-TEST ---');
    
    // 11. Wrong password
    console.log('11. Wrong password');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    const errText = await page.evaluate(() => document.body.innerText);
    if (errText.includes('Incorrect')) { passed++; console.log('   ✅ Wrong password rejected'); }
    else { failed++; console.log('   ❌ Wrong password accepted'); }
    
    // 12. Correct login
    console.log('12. Correct login');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    if (!page.url().includes('auth')) { passed++; console.log('   ✅ Login successful'); }
    else { failed++; console.log('   ❌ Login failed'); }
    
    console.log('\n=== FINAL RESULTS: ' + passed + '/' + (passed+failed) + ' PASSED ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
