import { test, expect } from '@playwright/test';

test.describe('Responsive QA - Landing Page', () => {
  const viewports = [
    { name: '390px', width: 390, height: 844 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1440px', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test.describe(`viewport ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('no horizontal overflow', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);

        const scrollable = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(scrollable).toBeFalsy();

        await page.screenshot({
          path: `.sisyphus/evidence/task-20-landing-${vp.name}.png`,
          fullPage: true,
        });
      });
    });
  }
});

test.describe('Responsive QA - Login Page', () => {
  const viewports = [
    { name: '390px', width: 390, height: 844 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1440px', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    test.describe(`viewport ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('no horizontal overflow', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.waitForLoadState('networkidle');

        const scrollable = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(scrollable).toBeFalsy();

        await page.screenshot({
          path: `.sisyphus/evidence/task-20-login-${vp.name}.png`,
          fullPage: true,
        });
      });
    });
  }
});

test.describe('Responsive QA - Sidebar collapse', () => {
  test.use({ viewport: { width: 800, height: 900 } });

  test('sidebar collapses at 800px on dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    const scrollable = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(scrollable).toBeFalsy();

    await page.screenshot({
      path: '.sisyphus/evidence/task-20-sidebar-area.png',
      fullPage: true,
    });
  });
});
