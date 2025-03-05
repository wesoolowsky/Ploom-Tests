import { Page, Locator } from '@playwright/test';
import { markets, Market } from '../config/markets.config';

export class HomePage {
  readonly page: Page;
  readonly market: Market;
  readonly oneTrustAccept: Locator;
  readonly ageConfirmation: Locator;
  readonly shopLink: Locator;

  constructor(page: Page, market: Market = 'uk') {
    this.page = page;
    this.market = market;
    this.oneTrustAccept = page.locator('#onetrust-accept-btn-handler');
    this.ageConfirmation = page.locator('.ageconfirmation__confirmBtn');
    this.shopLink = page.locator('.navigation__linkWrapper').getByText(markets[market].shopLink);
  }

  async goto() {
    await this.page.goto(`${markets[this.market].baseUrl}`);
    await this.oneTrustAccept.click();
    await this.ageConfirmation.click();
    await this.shopLink.click();
    await this.page.locator('.header__wrapper').hover();
  }

  async goToShopPage(): Promise<void> {
    await this.goto();
  }
}