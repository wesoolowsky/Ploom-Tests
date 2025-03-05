import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Global timeout for entire test run
  timeout: 60000,
  
  // Timeout for individual expect statements
  expect: {
    timeout: 10000
  },
  
  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  
  // Use HTML reporter
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  
  use: {
    // Base URL for your application
    baseURL: 'https://www.ploom.co.uk/en',
    
    // Capture trace on first retry
    trace: 'on-first-retry',
    
    // Timeouts for actions and navigation
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    // Browser launch options
    launchOptions: {
      args: [
        "--start-maximized",
      ]
    }
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
      },
    }
  ]
});