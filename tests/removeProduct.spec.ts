import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { markets, Market } from '../config/markets.config';

const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Remove Product from Cart - ${market}`, () => {
    test('should remove product from cart', async ({ page }) => {
      
      const homePage = new HomePage(page, market);
      await homePage.goToShopPage();

      const shopPage = new ShopPage(page, market);
      const sku = market === 'uk' ? 'ploom-x-advanced' : '15109183';
      await shopPage.goToProductPage(sku);

      const productPage = new ProductPage(page, market);
      await productPage.addProductToCart();

      await productPage.basketCount.waitFor({ state: 'visible', timeout: 10000 });
      const basketCount = await productPage.getBasketCount();
      expect(basketCount).toBe(1);

      await productPage.goToCartPage();

      const cartPage = new CartPage(page);
      await cartPage.productInCart.waitFor({ state: 'visible', timeout: 10000 });
      expect(await cartPage.isProductInCart()).toBe(true);

      await cartPage.removeProduct();
      await cartPage.submitRemove();

      await cartPage.openBasket();
      await expect(cartPage.emptyBasket).toBeVisible({ timeout: 10000 });
      });
  });
}