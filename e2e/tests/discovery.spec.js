import { test, expect } from '@playwright/test';

test.describe('Discovery Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display profile cards after onboarding', async ({ page }) => {
    // Sign up
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForURL(/\/onboarding/);
    
    // Complete onboarding
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
    });
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);
    
    await page.getByPlaceholder(/name/i).fill('Test');
    await page.getByPlaceholder(/age/i).fill('25');
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);
    
    await page.locator('button').filter({ hasText: /Travel/ }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);
    
    await page.locator('input[placeholder*="answer"]').fill('Test');
    await page.getByRole('button', { name: /get started/i }).click();
    await page.waitForTimeout(1500);
    
    // Check discovery page
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.includes('miles') || bodyText.includes('LIKE')).toBeTruthy();
  });

  test('should have filter button', async ({ page }) => {
    // Sign up and complete onboarding (simplified)
    await page.locator('button:has-text("Sign up")').first().click();
    await page.getByPlaceholder(/email/i).fill('test2@example.com');
    await page.getByPlaceholder(/password/i).fill('Test123!@#');
    await page.getByRole('button', { name: /create account/i }).click();
    await page.waitForTimeout(1500);
    
    // Just check Filters button exists
    const filtersBtn = page.getByText(/Filters/);
    await expect(filtersBtn).toBeVisible();
  });
});
