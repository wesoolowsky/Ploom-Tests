// pages/CartPage.ts
import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly removeButton: Locator;
  readonly productInCart: Locator;
  readonly basketCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.removeButton = page.getByTestId('cartRemoveButton');
    this.productInCart = page.locator('.RegularItem-module-rows-3TiKQ');
    this.basketCount = page.locator('.QuantityInput-module-input-7n5dx');
  }

  async removeProduct() {
    await this.removeButton.click();
  }

  async isProductInCart(): Promise<boolean> {
    return await this.productInCart.isVisible();
  }

  async getBasketCount(): Promise<number> {
    const count = await this.basketCount.textContent();
    return parseInt(count || '0', 10);
  }
}