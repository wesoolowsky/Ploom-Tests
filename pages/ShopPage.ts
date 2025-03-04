import { Page, Locator } from '@playwright/test';
import { markets, Market } from '../config/markets.config';

export class ShopPage {
  readonly page: Page;
  readonly market: Market;
  readonly oneTrustAccept: Locator;
  readonly ageConfirmation: Locator;
  readonly shopLink: Locator;
  readonly addToCartButton: Locator;
  readonly basketCount: Locator;

  constructor(page: Page, market: Market = 'uk') {
    this.page = page;
    this.market = market;
    this.oneTrustAccept = page.locator('#onetrust-accept-btn-handler');
    this.ageConfirmation = page.locator('.ageconfirmation__confirmBtn');
    this.shopLink = page.locator('.navigation__linkWrapper').getByText(markets[market].shopLink);
    this.addToCartButton = page.getByTestId('pdpAddToProduct');
    // Updated to match cart page quantity or subtitle
    this.basketCount = page.locator('.QuantityInput-module-input-7n5dx');
    // Alternative: this.basketCount = page.getByTestId('page-layout-subtitle');
  }

  async goto() {
    await this.page.goto(`${markets[this.market].baseUrl}`);
    await this.oneTrustAccept.waitFor({ state: 'visible', timeout: 10000 });
    await this.oneTrustAccept.click();
    await this.ageConfirmation.waitFor({ state: 'visible', timeout: 10000 });
    await this.ageConfirmation.click();
    await this.shopLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.shopLink.click();
    await this.page.locator('.header__wrapper').hover();
  }

  async openProductBySku(sku: string) {
    await this.page.locator(`[data-sku="${sku}"]`).click();
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }

  async getBasketCount(): Promise<number> {
    const text = await this.basketCount.textContent();
    const match = text?.match(/\d+/); // Extract number from text (e.g., "1 Item")
    return parseInt(match?.[0] || '0', 10);
  }

  async openCart() {
    await this.page.getByTestId('miniCart').click();
  }

  async gotoCheckout() {
    await this.page.getByTestId('miniCartCheckoutButton').click();
  }
}