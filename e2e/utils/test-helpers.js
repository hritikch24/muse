export async function createTestUser(page, email = null) {
  const testEmail = email || `test${Date.now()}@example.com`;
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  
  // Click the Sign Up tab/button in the footer
  await page.locator('button:has-text("Sign up")').first().click();
  
  await page.getByPlaceholder(/email/i).fill(testEmail);
  await page.getByPlaceholder(/password/i).fill('Test123!@#');
  await page.getByRole('button', { name: /create account/i }).click();
  
  return testEmail;
}

export async function loginTestUser(page, email, password = 'Test123!@#') {
  await page.goto('/');
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

export async function completeOnboarding(page) {
  await page.waitForURL(/\/onboarding/);
  
  // Upload photo
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles({
    name: 'test.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
  });
  
  await page.getByRole('button', { name: /continue/i }).click();
  await page.waitForTimeout(500);
  
  // Fill basic info
  await page.getByPlaceholder(/name/i).fill('Test User');
  await page.getByPlaceholder(/age/i).fill('25');
  await page.getByRole('button', { name: /continue/i }).click();
  await page.waitForTimeout(500);
  
  // Select interests
  const interestBtn = page.locator('button').filter({ hasText: /Travel|Music|Food/i }).first();
  await interestBtn.click();
  await page.getByRole('button', { name: /continue/i }).click();
  await page.waitForTimeout(500);
  
  // Fill prompt
  const promptInput = page.locator('input[placeholder*="answer"]').first();
  if (await promptInput.isVisible()) {
    await promptInput.fill('Test answer');
  }
  await page.getByRole('button', { name: /get started/i }).click();
  await page.waitForTimeout(1000);
}
