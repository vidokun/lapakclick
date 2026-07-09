import { test, expect } from '@playwright/test';

const viewports = [
  { name: '390px', width: 390, height: 844 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1440px', width: 1440, height: 900 },
];

test.describe('Responsive QA - Register Page', () => {
  for (const vp of viewports) {
    test.describe(`viewport ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });
      
      test('no horizontal overflow', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        await page.waitForLoadState('networkidle');

        const scrollable = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(scrollable).toBeFalsy();
      });
    });
  }
});

test.describe('Responsive QA - Forgot Password Page', () => {
  for (const vp of viewports) {
    test.describe(`viewport ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });
      
      test('no horizontal overflow', async ({ page }) => {
        await page.goto('http://localhost:3000/forgot-password');
        await page.waitForLoadState('networkidle');

        const scrollable = await page.evaluate(() =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(scrollable).toBeFalsy();
      });
    });
  }
});
