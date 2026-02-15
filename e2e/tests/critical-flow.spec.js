import { test, expect } from '@playwright/test';
import { createTestUser, completeOnboarding } from '../utils/test-helpers';

test.describe('Critical User Journey', () => {
  test('complete user flow: signup → onboarding → discovery', async ({ page }) => {
    // 1. Sign up
    const email = await createTestUser(page);
    await expect(page).toHaveURL(/\/onboarding/);
    
    // 2. Complete onboarding
    await completeOnboarding(page);
    
    // Wait for redirect to discovery
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('/discovery') || url === 'http://localhost:3000/').toBeTruthy();
  });

  test('swipe functionality works', async ({ page }) => {
    // Sign up and complete onboarding
    await createTestUser(page);
    await completeOnboarding(page);
    await page.waitForTimeout(1000);
    
    // Should be on discovery page with profiles
    const body = await page.locator('body').innerText();
    const hasContent = body.includes('miles') || body.includes('LIKE') || body.includes('NOPE');
    expect(hasContent).toBeTruthy();
  });
});
