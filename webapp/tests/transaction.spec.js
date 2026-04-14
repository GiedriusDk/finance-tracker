import { test, expect } from '@playwright/test';

test('user can create an income transaction', async ({ page }) => {
  const email = 'giedrius_test_1@example.com';
  const password = '123456';
  const description = `Playwright Transaction ${Date.now()}`;

  await page.goto('http://localhost:5173');

  await page.getByRole('button', { name: 'Login' }).first().click();

  await expect(page.locator('.auth-form')).toBeVisible();

  await page.locator('.auth-form input[name="email"]').fill(email);
  await page.locator('.auth-form input[name="password"]').fill(password);
  await page.locator('.auth-form').getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('.user-email')).toBeVisible();

  await page.fill('input[name="amount"]', '123');
  await page.fill('input[name="description"]', description);
  await page.selectOption('select[name="type"]', 'Income');
  await page.fill('input[name="date"]', '2024-06-01T12:00');
  await page.selectOption('select[name="categoryId"]', { label: 'JOB' });

  const createTransactionResponse = page.waitForResponse(response =>
    response.url().includes('/transactions') &&
    response.request().method() === 'POST' &&
    response.status() === 200
  );

  await page.getByRole('button', { name: 'Submit' }).click();

  const response = await createTransactionResponse;
  const responseBody = await response.json();

  expect(responseBody).toHaveProperty('id');
  expect(responseBody.description).toBe(description);
  expect(responseBody.amount).toBe(123);
  expect(responseBody.type).toBe('Income');

  await expect(page.getByText(description)).toBeVisible({ timeout: 10000 });

  
  const row = page.locator('tr', { hasText: description });
  const deleteTransactionResponse = page.waitForResponse(response =>
    response.url().includes(`/transactions/${responseBody.id}`) &&
    response.request().method() === 'DELETE' &&
    response.status() === 204
  );

  await row.getByRole('button', { name: 'Delete' }).click();
  await deleteTransactionResponse;

  await expect(page.getByText(description)).not.toBeVisible({ timeout: 10000 });
});