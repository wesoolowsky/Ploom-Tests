import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
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
        ...devices['Desktop Chrome'],
      },
    },
  ],
});