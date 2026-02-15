const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('=== MATCHES TEST (Simplified) ===\n');
  
  try {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    // Quick signup
    await page.click('text=Sign up');
    await page.waitForTimeout(300);
    await page.fill('input[placeholder="Your name"]', 'Test');
    await page.fill('input[type="email"]', 'test@muse.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
    
    // Quick onboarding
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
    
    console.log('Setup: ' + (!page.url().includes('onboarding') ? 'Ready' : 'Failed'));
    
    // Get to matches via URL since navigation seems problematic
    await page.goto('http://localhost:3000/matches');
    await page.waitForTimeout(1000);
    
    const text = await page.evaluate(() => document.body.innerText);
    console.log('Matches page: ' + (text.includes('Match') ? '✅' : '❌'));
    console.log('Content preview:', text.substring(0, 100));
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
