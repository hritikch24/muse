const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== ONBOARDING VALIDATION TEST ===\n');
  let passed = 0, failed = 0;
  
  try {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // Sign up first
    console.log('Setup: Sign up');
    await page.click('text=Sign up');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder="Your name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    console.log('   → Onboarding page: ' + (page.url().includes('onboarding') ? '✅' : '❌'));
    
    // TEST 1: Try to proceed without photo
    console.log('\n1. Step 0 - Photo validation');
    await page.waitForTimeout(500);
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err1 = await page.evaluate(() => document.body.innerText);
    if (err1.includes('at least one photo')) { passed++; console.log('   ✅ Requires photo'); }
    else { failed++; console.log('   ❌ Should require photo'); }
    
    // TEST 2: Name validation
    console.log('\n2. Step 1 - Name validation');
    // Add a photo first (use file input)
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image data')
    });
    await page.waitForTimeout(500);
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    
    // Clear name and try to proceed
    await page.fill('input[placeholder="Your name"]', '');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err2 = await page.evaluate(() => document.body.innerText);
    if (err2.includes('Name is required')) { passed++; console.log('   ✅ Name required'); }
    else { failed++; console.log('   ❌ Should require name: ' + err2.substring(0,50)); }
    
    // Test name too short
    await page.fill('input[placeholder="Your name"]', 'A');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err3 = await page.evaluate(() => document.body.innerText);
    if (err3.includes('at least 2 characters')) { passed++; console.log('   ✅ Name min length'); }
    else { failed++; console.log('   ❌ Should enforce min length'); }
    
    // Valid name
    await page.fill('input[placeholder="Your name"]', 'John');
    await page.fill('input[placeholder="Your age"]', '17');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err4 = await page.evaluate(() => document.body.innerText);
    if (err4.includes('at least 18')) { passed++; console.log('   ✅ Age 18+'); }
    else { failed++; console.log('   ❌ Should require 18+'); }
    
    // Valid age
    await page.fill('input[placeholder="Your age"]', '25');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    console.log('   → Moved to interests: ✅');
    
    // TEST 3: Interests validation
    console.log('\n3. Step 2 - Interests validation');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err5 = await page.evaluate(() => document.body.innerText);
    if (err5.includes('at least one interest')) { passed++; console.log('   ✅ Interests required'); }
    else { failed++; console.log('   ❌ Should require interests'); }
    
    // Select interests
    const interestBtns = await page.locator('button:has-text("Travel")').first();
    await interestBtns.click();
    await page.waitForTimeout(200);
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    console.log('   → Moved to prompts: ✅');
    
    // TEST 4: Prompts validation  
    console.log('\n4. Step 3 - Prompts validation');
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(500);
    const err6 = await page.evaluate(() => document.body.innerText);
    if (err6.includes('at least one prompt')) { passed++; console.log('   ✅ Prompt required'); }
    else { failed++; console.log('   ❌ Should require prompt'); }
    
    // Answer a prompt
    const promptInput = await page.locator('input[placeholder="Write your answer..."]').first();
    await promptInput.fill('I love coffee!');
    await page.waitForTimeout(300);
    await page.click('[data-testid="onboarding-next"]');
    await page.waitForTimeout(1000);
    
    if (!page.url().includes('onboarding')) { passed++; console.log('   ✅ Completed onboarding'); }
    else { failed++; console.log('   ❌ Should complete'); }
    
    console.log('\n=== RESULTS: ' + passed + '/' + (passed+failed) + ' PASSED ===');
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
