import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { Market, markets } from '../config/markets.config';
import { validateLink, validateImage } from '../utils/validation';

const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Check Links and Images on Product Page - ${market}`, () => {
    test('should validate links and image loading', async ({ page }) => {
      const homePage = new HomePage(page, market);
      await homePage.goToShopPage();

      const shopPage = new ShopPage(page, market);
      const sku = market === 'uk' ? 'ploom-x-advanced' : '15109183';
      await shopPage.goToProductPage(sku);

      await page.waitForLoadState('load', { timeout: 15000 });

      const linkHrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(link => link.getAttribute('href'))
          .filter((href): href is string => href !== null && !href.startsWith('mailto:') && !href.startsWith('tel:'));
      });

      for (const href of linkHrefs) {
        const url: string = href.startsWith('http')
          ? href
          : new URL(href, markets[market].baseUrl).href;
        await validateLink(page, url);
      }

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);

      const imageSrcs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .map(img => img.getAttribute('src'))
          .filter((src): src is string => src !== null && !src.startsWith('data:'));
      });

      for (const src of imageSrcs) {
        const imageUrl: string = src.startsWith('http')
          ? src
          : new URL(src, markets[market].baseUrl).href;
        await validateImage(page, imageUrl);
      }
    });
  });
}