import { Page, expect } from '@playwright/test';

export async function validateLink(page: Page, url: string): Promise<void> {
  try {
    const response = await page.request.head(url, { timeout: 10000 });
    const status: number = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);
  } catch (error) {
    console.error(`Error checking link ${url}: ${(error as Error).message}`);
    throw new Error(`Link ${url} does not work: ${(error as Error).message}`);
  }
}

export async function validateImage(page: Page, imageUrl: string): Promise<void> {
  try {
    const response = await page.request.head(imageUrl, { timeout: 10000 });
    const status: number = response.status();
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(400);

    let isLoaded = await page.evaluate((url: string) => {
      const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
      return img instanceof HTMLImageElement && img.naturalWidth > 0;
    }, imageUrl);

    if (!isLoaded) {
      await page.evaluate((url: string) => {
        const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
        if (img) img.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, imageUrl);
      await page.waitForTimeout(1000);

      isLoaded = await page.evaluate((url: string) => {
        const img = Array.from(document.querySelectorAll('img')).find(i => i.src === url);
        return img instanceof HTMLImageElement && img.naturalWidth > 0;
      }, imageUrl);
    }

    expect(isLoaded, `Image ${imageUrl} did not load even after scrolling`).toBe(true);
  } catch (error) {
    console.error(`Error checking image ${imageUrl}: ${(error as Error).message}`);
    throw new Error(`Image ${imageUrl} did not load: ${(error as Error).message}`);
  }
}