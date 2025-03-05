import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 2,
  reporter: 'html',
  use: {
    baseURL: 'https://www.ploom.co.uk/en',
    trace: 'on-first-retry',
    actionTimeout: 30000, 
    navigationTimeout: 30000,
    headless: true,
    launchOptions: {
      args: [
        "--start-maximized",
        "--no-sandbox", 
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage"
      ],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
      },
    },
  ],
});