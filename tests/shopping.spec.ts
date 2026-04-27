import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());

  // カートをリセット
  await page.request.delete('/api/cart');

  await page.goto('/login.html');
  await page.fill('#username', 'test');
  await page.fill('#password', 'password');
  await page.click('#login-btn');
  await expect(page).toHaveURL(/index\.html/);
});

test('商品一覧が3件表示される', async ({ page }) => {
  await expect(page.locator('.product-card')).toHaveCount(3);
});

test('商品をカートに追加できる', async ({ page }) => {
  await page.click('.product-card:first-child .add-to-cart');
  await expect(page.locator('#cart-count')).toHaveText('1');
});

test('カートから注文できる', async ({ page }) => {
  await page.click('.product-card:first-child .add-to-cart');

  await page.goto('/cart.html');
  await expect(page.locator('.cart-item')).toHaveCount(1);

  await page.click('#order-btn');
  await expect(page.locator('#success-msg')).toBeVisible();
});