import { test, expect } from '@playwright/test';

test.describe('Auth Pages QA Scenarios', () => {
  test('Login form renders correctly', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.locator('input[type="text"]#email')).toBeVisible();
    await expect(page.locator('input[type="password"]#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]', { hasText: 'Masuk' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Masuk dengan Google' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Lupa password?' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Daftar Sekarang' })).toBeVisible();
    
    await page.screenshot({ path: '.sisyphus/evidence/task-9-login.png' });
  });

  test('Register form has all fields', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.locator('input[type="text"]#fullName')).toBeVisible();
    await expect(page.locator('input[type="email"]#email')).toBeVisible();
    await expect(page.locator('input[type="password"]#password')).toBeVisible();
    await expect(page.locator('input[type="password"]#confirmPassword')).toBeVisible();
    await expect(page.locator('button[type="submit"]', { hasText: 'Daftar' })).toBeVisible();
    
    await page.screenshot({ path: '.sisyphus/evidence/task-9-register.png' });
  });

  test('Forgot password page has email field', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.locator('input[type="email"]#email')).toBeVisible();
    await expect(page.locator('button[type="submit"]', { hasText: 'Kirim tautan reset' })).toBeVisible();
    await expect(page.locator('a', { hasText: 'Kembali ke login' })).toBeVisible();
    
    await page.screenshot({ path: '.sisyphus/evidence/task-9-forgot-password.png' });
  });

  test('Login form shows validation errors', async ({ page }) => {
    await page.goto('/login');
    
    await page.click('button[type="submit"]:has-text("Masuk")');
    await expect(page.locator('text=Email atau username harus diisi')).toBeVisible();
    await expect(page.locator('text=Password harus diisi')).toBeVisible();
    
    await page.fill('input#email', 'notanemail');
    await page.click('button[type="submit"]:has-text("Masuk")');
    await expect(page.locator('text=Format email tidak valid')).toBeVisible();
    
    await page.screenshot({ path: '.sisyphus/evidence/task-9-validation.png' });
  });

  test('Password visibility toggle works', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input#password', 'test123');
    await expect(page.locator('input#password')).toHaveAttribute('type', 'password');
    
    await page.click('button[aria-label="Lihat password"]');
    await expect(page.locator('input#password')).toHaveAttribute('type', 'text');
    
    await page.click('button[aria-label="Sembunyikan password"]');
    await expect(page.locator('input#password')).toHaveAttribute('type', 'password');
    
    await page.screenshot({ path: '.sisyphus/evidence/task-9-password-toggle.png' });
  });
});
