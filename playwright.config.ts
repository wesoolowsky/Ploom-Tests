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
  
  // Retry failed tests once
  retries: 1,
  
  // Use 2 workers for parallel test execution
  workers: 2,
  
  // Use HTML reporter
  reporter: 'html',
  
  use: {
    // Base URL for your application
    baseURL: 'https://www.ploom.co.uk/en',
    
    // Capture trace on first retry
    trace: 'on-first-retry',
    
    // Timeouts for actions and navigation
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    // Run tests in headless mode
    headless: true,
    
    // Browser launch options
    launchOptions: {
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    }
  },
  
  // Define test projects
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: null, // Maximize browser window
      }
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: null
      }
    }
  ]
});