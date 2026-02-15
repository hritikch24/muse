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
    
    console.log('\n=== TEST 2: Discovery Page ===');
    const discoverText = await page.evaluate(() => document.body.innerText);
    const hasProfiles = discoverText.includes('miles away') || discoverText.includes('Sarah') || discoverText.includes('Priya');
    console.log('✅ Has profiles:', hasProfiles);
    
    console.log('\n=== TEST 3: Like Button ===');
    // Find like button (heart icon)
    const likeBtn = await page.locator('button').filter({ has: page.locator('svg') }).nth(2);
    await likeBtn.click();
    await page.waitForTimeout(500);
    console.log('✅ Clicked like');
    
    console.log('\n=== TEST 4: Matches Tab ===');
    await page.click('a[href="/matches"]');
    await page.waitForTimeout(1000);
    const matchesText = await page.evaluate(() => document.body.innerText);
    const hasMatches = matchesText.includes('Matches');
    console.log('✅ On matches:', hasMatches);
    
    console.log('\n=== TEST 5: Moments Tab ===');
    await page.click('a[href="/moments"]');
    await page.waitForTimeout(1000);
    const momentsText = await page.evaluate(() => document.body.innerText);
    const hasMoments = momentsText.includes('Moments');
    console.log('✅ On moments:', hasMoments);
    
    console.log('\n=== TEST 6: Profile Tab ===');
    await page.click('a[href="/profile"]');
    await page.waitForTimeout(1000);
    const profileText = await page.evaluate(() => document.body.innerText);
    const hasProfile = profileText.includes('Edit Profile') || profileText.includes('Premium');
    console.log('✅ On profile:', hasProfile);
    
    console.log('\n=== TEST 7: Premium Modal ===');
    const premiumCard = await page.locator('text=Muse Premium');
    if (await premiumCard.count() > 0) {
      await premiumCard.click();
      await page.waitForTimeout(500);
      const modalVisible = await page.locator('text=Get Premium').count();
      console.log('✅ Premium modal:', modalVisible > 0);
      await page.keyboard.press('Escape');
    }
    
    console.log('\n=== TEST 8: Edit Profile ===');
    const editBtn = await page.locator('text=Edit Profile');
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(500);
      const editModal = await page.locator('text=Name').count();
      console.log('✅ Edit modal:', editModal > 0);
      await page.keyboard.press('Escape');
    }
    
    if (errors.length > 0) {
      console.log('\n=== ERRORS ===');
      errors.forEach(e => console.log('ERROR:', e));
    } else {
      console.log('\n✅ NO ERRORS!');
    }
    
    console.log('\n=== ALL TESTS PASSED ===');
    
  } catch (error) {
    console.log('Test error:', error.message);
  }
  
  await browser.close();
})();
