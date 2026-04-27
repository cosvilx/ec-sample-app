import { test, expect } from '@playwright/test';

test('正常ログイン', async ({ page }) => {
  await page.goto('/login.html');
  await page.fill('#username', 'test');
  await page.fill('#password', 'password');
  await page.click('#login-btn');
  await expect(page).toHaveURL(/index\.html/);
});

test('ログイン失敗（パスワード誤り）', async ({ page }) => {
  await page.goto('/login.html');
  await page.fill('#username', 'test');
  await page.fill('#password', 'wrongpassword');
  await page.click('#login-btn');
  await expect(page.locator('#error-msg')).toBeVisible();
});