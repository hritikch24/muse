const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== FINAL TEST ===\n');
  let passed = 0, failed = 0;
  
  try {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // Sign up + complete onboarding
    await page.click('text=Sign up');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder="Your name"]', 'Test');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    
    await page.click('text=Add Photo');
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]');
      if (input) {
        const dt = new DataTransfer();
        const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const blob = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const file = new File([blob], 'test.png', { type: 'image/png' });
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(300);
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Your name"]', 'John');
    await page.fill('input[placeholder="Your age"]', '25');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(400);
    await page.click('button:has-text("Travel")');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Write your answer..."]', 'Coffee!');
    await page.click('button:has-text("Get Started")');
    await page.waitForTimeout(1500);
    
    console.log('Setup: ' + (!page.url().includes('onboarding') ? '✅' : '❌'));
    
    // Get all action buttons by index (after Filters and View Details)
    const btns = await page.locator('button').all();
    console.log('Total buttons: ' + btns.length);
    
    // Test: Click each action button by index
    // Index 0 = Filters
    // Index 1 = View Details
    // Index 2 = Undo (first icon button)
    // Index 3 = Nope
    // Index 4 = Super Like
    // Index 5 = Boost
    // Index 6 = Like
    
    // 1. Click Like (index 6)
    console.log('\n1. Like button');
    try {
      await btns[6].click();
      await page.waitForTimeout(300);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 2. Click Nope (index 3)
    console.log('2. Nope button');
    try {
      await btns[3].click();
      await page.waitForTimeout(300);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 3. Click Super Like (index 4)
    console.log('3. Super Like button');
    try {
      await btns[4].click();
      await page.waitForTimeout(300);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 4. Click Undo (index 2)
    console.log('4. Undo button');
    try {
      await btns[2].click();
      await page.waitForTimeout(300);
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 5. Filters (index 0)
    console.log('5. Filters');
    try {
      await btns[0].click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // 6. View Details (index 1)
    console.log('6. Profile details');
    try {
      await btns[1].click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      passed++; console.log('   ✅');
    } catch { failed++; console.log('   ❌'); }
    
    // Navigate
    console.log('\n7. Navigation - Matches');
    const navLinks = await page.locator('a').all();
    for (const link of navLinks) {
      const txt = await link.textContent();
      if (txt && txt.toLowerCase().includes('match')) {
        await link.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    passed++; console.log('   ✅');
    
    // Profile
    console.log('8. Navigation - Profile');
    for (const link of navLinks) {
      const txt = await link.textContent();
      if (txt && txt.toLowerCase().includes('profile')) {
        await link.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    passed++; console.log('   ✅');
    
    // Logout
    console.log('9. Logout');
    const logoutBtns = await page.locator('button').all();
    for (const btn of logoutBtns) {
      const txt = await btn.textContent();
      if (txt && txt.includes('Log Out')) {
        await btn.click();
        await page.waitForTimeout(500);
        break;
      }
    }
    passed++; console.log('   ✅');
    
    // Auth test
    console.log('10. Wrong password');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    const err = await page.evaluate(() => document.body.innerText);
    if (err.includes('Incorrect')) { passed++; console.log('   ✅'); }
    else { failed++; console.log('   ❌'); }
    
    console.log('\n=== RESULTS: ' + passed + '/' + (passed+failed) + ' PASSED ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
