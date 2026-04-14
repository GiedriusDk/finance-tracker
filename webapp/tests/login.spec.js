import { test, expect } from '@playwright/test';


test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.click('text=Login');

  await page.fill('input[name="email"]', 'giedrius_test_1@example.com');

  await page.fill('input[name="password"]', '123456');

  await page.locator('button:has-text("Login")').click();

  await expect(page.locator('.user-email')).toBeVisible();
});