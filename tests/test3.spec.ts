import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { markets, Market } from '../config/markets.config';

const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Broken Links/Images - ${market}`, () => {
    test('should have no broken links or images on product page', async ({ page }) => {
      const shopPage = new ShopPage(page, market);
      await shopPage.goto();
      await shopPage.openProductBySku('ploom-x-advanced');

      // Check links
      const links = await page.locator('a').all();
      for (const link of links) {
        const href = await link.getAttribute('href');
        if (href && href.startsWith('http')) {
          const response = await page.request.get(href);
          expect(response.ok()).toBe(true);
        }
      }

      // Check images
      const images = await page.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        if (src) {
          const response = await page.request.get(src);
          expect(response.ok()).toBe(true);
        }
      }
    });
  });
}