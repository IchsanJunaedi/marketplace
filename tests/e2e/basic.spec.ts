import { test, expect } from '@playwright/test';

test('has title and shop link', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/EnterpriseStore/);
  
  const shopLink = page.getByRole('link', { name: /Shop/i });
  await expect(shopLink).toBeVisible();
});

test('can navigate to products page', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByText(/Showing/)).toBeVisible();
});
