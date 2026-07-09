import { test, expect } from '@playwright/test';
import path from 'path';

const EVIDENCE_DIR = '.sisyphus/evidence';

test.describe('Task F3: Real Manual QA Execution', () => {
  // ──────────────────────────────────────────────
  // CHECK 1: Landing page loads at 1440px
  // ──────────────────────────────────────────────
  test.describe('Check 1: Landing page loads at 1440px', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('hero, features, how-it-works, FAQ, CTA sections exist', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      // Check Hero section — key text "domain gratis" must be on page
      await expect(page.locator('text=domain gratis').first()).toBeVisible({ timeout: 5000 });

      // Check Hero CTA buttons
      await expect(page.getByRole('link', { name: /Klaim Subdomain Gratis/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Pelajari Lebih Lanjut/i })).toBeVisible();

      // Check Features section — scroll to it first
      await page.locator('#fitur').scrollIntoViewIfNeeded();
      await expect(page.locator('#fitur')).toBeVisible({ timeout: 5000 });

      // Check 4 feature cards
      const featureCards = page.locator('#fitur .grid > div');
      await expect(featureCards).toHaveCount(4);

      // Check specific feature card titles by text
      await expect(page.locator('text=Domain Gratis').first()).toBeVisible();
      await expect(page.locator('text=DNS Mudah').first()).toBeVisible();
      await expect(page.locator('text=Cepat Aktif').first()).toBeVisible();
      await expect(page.locator('text=100% Gratis').first()).toBeVisible();

      // Check HowItWorks section
      await page.locator('#cara-kerja').scrollIntoViewIfNeeded();
      await expect(page.locator('#cara-kerja')).toBeVisible({ timeout: 5000 });

      // Check 4 steps
      const steps = page.locator('#cara-kerja .grid > div');
      await expect(steps).toHaveCount(4);

      // Check specific step titles
      await expect(page.locator('text=Pilih Nama Subdomain').first()).toBeVisible();
      await expect(page.locator('text=Selesai! Subdomain Siap Digunakan').first()).toBeVisible();

      // Check FAQ section
      await page.locator('#faq').scrollIntoViewIfNeeded();
      await expect(page.locator('#faq')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('h2:has-text("Pertanyaan")')).toBeVisible();

      // Click first FAQ question to test accordion
      const firstQuestion = page.locator('text=Apa itu lapak.click?').first();
      await firstQuestion.click();
      await page.waitForTimeout(300);
      // Check answer became visible
      await expect(page.locator('text=lapak.click adalah layanan subdomain gratis').first()).toBeVisible();

      // Click again to close
      await firstQuestion.click();
      await page.waitForTimeout(300);

      // Check CTA section
      await expect(page.getByRole('link', { name: /Mulai Sekarang/i })).toBeVisible();
      await expect(page.locator('text=Siap Onlinekan Usaha Anda?').first()).toBeVisible();

      // Take evidence screenshot
      await page.screenshot({
        path: `${EVIDENCE_DIR}/task-f3-landing-1440px.png`,
        fullPage: true,
      });
    });
  });

  // ──────────────────────────────────────────────
  // CHECK 2: Login page renders with email/password fields and Google OAuth
  // ──────────────────────────────────────────────
  test.describe('Check 2: Login page renders correctly', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('email/password fields and Google OAuth button exist', async ({ page }) => {
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('networkidle');

      // Check heading
      await expect(page.locator('h1:has-text("Masuk")')).toBeVisible();

      // Check email input
      const emailInput = page.locator('#email');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'text');
      await expect(emailInput).toHaveAttribute('placeholder', 'nama@email.com');

      // Check password input
      const passwordInput = page.locator('#password');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(passwordInput).toHaveAttribute('placeholder', 'Masukkan password');

      // Check "Masuk" submit button
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText('Masuk');

      // Check Google OAuth button
      const googleButton = page.locator('button:has(svg title:text("Google"))');
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toContainText('Masuk dengan Google');

      // Check "Lupa password?" link
      await expect(page.getByRole('link', { name: /Lupa password/i })).toBeVisible();

      // Check "Belum punya akun? Daftar" link
      await expect(page.getByRole('link', { name: /Daftar Sekarang/i })).toBeVisible();

      // Check "Ingat saya" checkbox
      await expect(page.locator('text=Ingat saya')).toBeVisible();

      // Take evidence screenshot
      await page.screenshot({
        path: `${EVIDENCE_DIR}/task-f3-login-1440px.png`,
        fullPage: true,
      });
    });
  });

  // ──────────────────────────────────────────────
  // CHECK 3: Register page renders with registration form
  // ──────────────────────────────────────────────
  test.describe('Check 3: Register page renders correctly', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('registration form with all fields exists', async ({ page }) => {
      await page.goto('http://localhost:3000/register');
      await page.waitForLoadState('networkidle');

      // Check heading
      await expect(page.locator('h1:has-text("Daftar")')).toBeVisible();

      // Check Nama Lengkap input
      const nameInput = page.locator('#fullName');
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toHaveAttribute('placeholder', 'John Doe');

      // Check email input
      const emailInput = page.locator('#email');
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');

      // Check password input
      const passwordInput = page.locator('#password');
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');
      await expect(passwordInput).toHaveAttribute('placeholder', 'Minimal 6 karakter');

      // Check confirm password input
      const confirmPasswordInput = page.locator('#confirmPassword');
      await expect(confirmPasswordInput).toBeVisible();
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
      await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Ulangi password');

      // Check "Daftar" submit button
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toContainText('Daftar');

      // Check Google OAuth button for register
      const googleButton = page.locator('button:has(svg title:text("Google"))');
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toContainText('Daftar dengan Google');

      // Check "Sudah punya akun? Masuk" link
      await expect(page.getByRole('link', { name: /Masuk/i })).toBeVisible();

      // Take evidence screenshot
      await page.screenshot({
        path: `${EVIDENCE_DIR}/task-f3-register-1440px.png`,
        fullPage: true,
      });
    });
  });

  // ──────────────────────────────────────────────
  // CHECK 4: Dashboard redirects to login when unauthenticated
  // ──────────────────────────────────────────────
  test.describe('Check 4: Dashboard redirects to /login when unauthenticated', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('visiting /dashboard redirects to /login', async ({ page }) => {
      // Navigate to dashboard without authentication
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');

      // Should be redirected to /login
      await page.waitForURL('**/login', { timeout: 10000 });
      expect(page.url()).toContain('/login');

      // Verify we see the login page content
      await expect(page.locator('h1:has-text("Masuk")')).toBeVisible();

      // Take evidence screenshot
      await page.screenshot({
        path: `${EVIDENCE_DIR}/task-f3-dashboard-redirect.png`,
        fullPage: true,
      });
    });
  });

  // ──────────────────────────────────────────────
  // CHECK 5: Responsive — no overflow at 390px, 768px, 1440px
  // ──────────────────────────────────────────────
  const responsiveViewports = [
    { name: '390px', width: 390, height: 844 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1440px', width: 1440, height: 900 },
  ];

  for (const vp of responsiveViewports) {
    test.describe(`Check 5: Responsive — no overflow at ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('no horizontal scroll on landing page', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        // Check for horizontal overflow
        const hasOverflow = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(hasOverflow).toBeFalsy();

        // Also check body overflow
        const bodyOverflowX = await page.evaluate(() =>
          window.getComputedStyle(document.body).overflowX
        );
        // If overflow-x is hidden, that's also acceptable
        if (bodyOverflowX !== 'hidden') {
          expect(hasOverflow).toBeFalsy();
        }

        // Take evidence screenshot
        await page.screenshot({
          path: `${EVIDENCE_DIR}/task-f3-responsive-${vp.name}.png`,
          fullPage: true,
        });
      });
    });
  }
});
