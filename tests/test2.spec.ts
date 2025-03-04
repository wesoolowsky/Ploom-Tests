import { test, expect } from '@playwright/test';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { markets, Market } from '../config/markets.config';

const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Remove from Cart - ${market}`, () => {
    test('should remove product from cart', async ({ page }) => {
      // Precondition: Add a product to the cart
      const shopPage = new ShopPage(page, market);
      await shopPage.goto();
      await shopPage.openProductBySku('ploom-x-advanced');
      await shopPage.addProductToCart();
      await shopPage.gotoCart();

      const cartPage = new CartPage(page);
      await cartPage.removeProduct();

      expect(await cartPage.isProductInCart()).toBe(false);
      const basketCount = await cartPage.getBasketCount();
      expect(basketCount).toBe(0);
    });
  });
}