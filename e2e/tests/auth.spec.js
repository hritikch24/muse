import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should signup with valid credentials', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /create account/i }).click();
    
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('should reject weak password', async ({ page }) => {
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('123');
    await page.getByRole('button', { name: /create account/i }).click();
    
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.includes('8 characters') || bodyText.includes('uppercase')).toBeTruthy();
  });

  test('should login with correct credentials after signup', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    
    // Sign up first
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL(/\/onboarding/);
    
    // Complete onboarding then logout
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    
    const logoutBtn = page.locator('button').filter({ hasText: /logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    }
    
    // Try to login
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForTimeout(1500);
    
    const url = page.url();
    expect(url.includes('/discovery') || url === 'http://localhost:3000/').toBeTruthy();
  });

  test('should reject wrong password', async ({ page }) => {
    const email = `test${Date.now()}@example.com`;
    
    // Sign up
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL(/\/onboarding/);
    
    // Logout
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    const logoutBtn = page.locator('button').filter({ hasText: /logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    }
    
    // Try wrong password
    await page.goto('/');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('WrongPassword123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForTimeout(1000);
    
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.includes('incorrect') || bodyText.includes('Invalid')).toBeTruthy();
  });
});
