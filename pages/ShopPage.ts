// pages/ShopPage.ts
import { Page, Locator } from '@playwright/test';
import { markets, Market } from '../config/markets.config';

export class ShopPage {
  readonly page: Page;
  readonly market: Market;
  readonly addToCartButton: Locator;
  readonly cartCount: Locator;

  constructor(page: Page, market: Market = 'uk') {
    this.page = page;
    this.market = market;
    this.addToCartButton = page.getByTestId('pdpAddToProduct');
    this.cartCount = page.getByTestId('cartQuantity');
  }

  async openProductBySku(sku: string) {
    await this.page.locator(`[data-sku="${sku}"]`).click();
  }

  async goToProductPage(sku: string): Promise<void> {
    await this.openProductBySku(sku);
  }
}