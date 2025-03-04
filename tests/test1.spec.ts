// tests/test1.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { markets, Market } from '../config/markets.config';

// Markets to test
const testMarkets: Market[] = ['uk', 'pl'];

for (const market of testMarkets) {
  test.describe(`Add to Cart - ${market}`, () => {
    test('should add product to cart', async ({ page }) => {
      // Navigate to shop
      const homePage = new HomePage(page, market);
      await homePage.goToShopPage();

      // Open product by SKU (conditional based on market)
      const shopPage = new ShopPage(page, market);
      const sku = market === 'uk' ? 'ploom-x-advanced' : '15109183';
      await shopPage.goToProductPage(sku);

      // Add product to cart and get basket count
      const productPage = new ProductPage(page, market);
      await productPage.addProductToCart();

      // Wait for the basket count to update
      await productPage.basketCount.waitFor({ state: 'visible', timeout: 10000 });
      const basketCount = await productPage.getBasketCount();
      expect(basketCount).toBe(1); // Verify count on product page (value="1" from input)

      // Open the cart
      await productPage.goToCartPage();

      // Check if the product is in the basket
      const cartPage = new CartPage(page);
      await cartPage.productInCart.waitFor({ state: 'visible', timeout: 10000 }); // Ensure product is visible

      expect(await cartPage.isProductInCart()).toBe(true); // Verify product presence
    });
  });
}