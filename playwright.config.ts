import { defineConfig } from '@playwright/test';

const config = defineConfig({
  testDir: './tests',
  timeout: 40 * 1000, // overriding default timeout (default)
  expect: {
    timeout: 50 * 1000
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: true,
    video: 'on',
    trace: 'on'
  },
});

export default config;
