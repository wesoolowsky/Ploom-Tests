// tests/test2.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { markets, Market } from '../config/markets.config';

// Markets to test
const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Remove Product from Cart - ${market}`, () => {
    test('should remove product from cart', async ({ page }) => {
      // Precondition: Add a product to the cart
      const homePage = new HomePage(page, market);
      await homePage.goToShopPage();

      const shopPage = new ShopPage(page, market);
      const sku = market === 'uk' ? 'ploom-x-advanced' : '15109183';
      await shopPage.goToProductPage(sku);

      const productPage = new ProductPage(page, market);
      await productPage.addProductToCart();

      // Wait for the basket count to update on the product page
      await productPage.basketCount.waitFor({ state: 'visible', timeout: 10000 });
      const basketCount = await productPage.getBasketCount();
      expect(basketCount).toBe(1); // Verify product is added

      // Open the cart (equivalent to the end state of test1)
      await productPage.goToCartPage();

      // CartPage: Verify the product is initially in the cart (precondition check)
      const cartPage = new CartPage(page);
      await cartPage.productInCart.waitFor({ state: 'visible', timeout: 10000 }); // Ensure product is visible
      expect(await cartPage.isProductInCart()).toBe(true); // Confirm product is in cart

      // Remove the product from the cart
      await cartPage.removeProduct();
      await cartPage.submitRemove();

      // Verify that the product is no longer in the cart
      await cartPage.openBasket();
      await expect(cartPage.emptyBasket).toBeVisible({ timeout: 10000 });
      });
  });
}