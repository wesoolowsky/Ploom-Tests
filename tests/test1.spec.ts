import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { markets, Market } from '../config/markets.config';

const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Add to Cart - ${market}`, () => {
    test('should add product to cart', async ({ page }) => {
      const shopPage = new ShopPage(page, market);
      await shopPage.goto();
      await shopPage.openProductBySku('ploom-x-advanced');
      await shopPage.addProductToCart();

      const basketCount = await shopPage.getBasketCount();
      expect(basketCount).toBe(1);

      await shopPage.openCart(); // Fixed to open cart page
      const cartPage = new CartPage(page);
      expect(await cartPage.isProductInCart()).toBe(true);
    });
  });
}