import { Page, Locator } from '@playwright/test';
import { markets, Market } from '../config/markets.config';

export class ProductPage {
  readonly page: Page;
  readonly market: Market;
  readonly addToCartButton: Locator;
  readonly basketCount: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page, market: Market = 'uk') {
    this.page = page;
    this.market = market;
    this.addToCartButton = page.getByTestId('pdpAddToProduct');
    this.basketCount = page.getByTestId('cartQuantity');
    this.checkoutButton = page.getByTestId('miniCartCheckoutButton');
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }

  async getBasketCount(): Promise<number> {
    const value = await this.basketCount.getAttribute('value');
    return parseInt(value || '0', 10);
  }

  async goToCartPage() {
    await this.checkoutButton.click();
  }
}