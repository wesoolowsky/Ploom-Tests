import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { Market, markets } from '../config/markets.config';

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

        try {
          const response = await page.request.head(url, { timeout: 10000 });
          const status: number = response.status();
          expect(status).toBeGreaterThanOrEqual(200);
          expect(status).toBeLessThan(400);
          console.log(`Link ${url} works correctly - status: ${status}`);
        } catch (error) {
          console.error(`Error checking link ${url}: ${(error as Error).message}`);
          throw new Error(`Link ${url} does not work: ${(error as Error).message}`);
        }
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

        try {
          const response = await page.request.head(imageUrl, { timeout: 10000 });
          const status: number = response.status();
          expect(status).toBeGreaterThanOrEqual(200);
          expect(status).toBeLessThan(400);

          let isLoaded = await page.evaluate((url: string) => {
            const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
            return img instanceof HTMLImageElement && img.naturalWidth > 0;
          }, imageUrl);

          if (!isLoaded) {
            await page.evaluate((url: string) => {
              const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
              if (img) img.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, imageUrl);
            await page.waitForTimeout(1000);

            isLoaded = await page.evaluate((url: string) => {
              const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
              return img instanceof HTMLImageElement && img.naturalWidth > 0;
            }, imageUrl);
          }

          expect(isLoaded, `Image ${imageUrl} did not load even after scrolling`).toBe(true);

          console.log(`Image ${imageUrl} loaded correctly - status: ${status}`);
        } catch (error) {
          console.error(`Error checking image ${imageUrl}: ${(error as Error).message}`);
          throw new Error(`Image ${imageUrl} did not load: ${(error as Error).message}`);
        }
      }
    });
  });
}