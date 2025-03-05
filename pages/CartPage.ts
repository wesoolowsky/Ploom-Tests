import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly removeButton: Locator;
  readonly removeSubmitButton: Locator;
  readonly productInCart: Locator;
  readonly basketCount: Locator;
  readonly basketIcon: Locator;
  readonly emptyBasket: Locator;

  constructor(page: Page) {
    this.page = page;
    this.removeButton = page.getByTestId('main-section').getByTestId('cartRemoveButton');
    this.removeSubmitButton = page.getByTestId('remove-item-submit-button');
    this.productInCart = page.locator('.RegularItem-module-rows-3TiKQ');
    this.basketCount = page.locator('.QuantityInput-module-input-7n5dx');
    this.basketIcon = page.getByTestId('cartIcon');
    this.emptyBasket = page.getByTestId('mini-cart-header').getByTestId('emptyCartContainer');
  }

  async removeProduct() {
    await this.removeButton.click();
  }

  async submitRemove() {
    await this.removeSubmitButton.click();
  }

  async openBasket() {
    await this.basketIcon.click();
  }

  async isProductInCart(): Promise<boolean> {
    try {
      await this.productInCart.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getBasketCount(): Promise<number> {
    const value = await this.basketCount.getAttribute('value');
    return parseInt(value || '0', 10);
  }
}