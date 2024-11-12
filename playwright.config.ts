import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read from ".env" file.
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '.env') });
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: 'http://localhost:5173',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry'
	},

	/* Configure projects for major browsers */
	projects: [
		// Setup project
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},

		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},

		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},

		/* Test against mobile viewports. */
		{
			name: 'Mobile Chrome',
			use: {
				...devices['Pixel 5'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},
		{
			name: 'Mobile Safari',
			use: {
				...devices['iPhone 12'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},
		{
			name: 'Firefox',
			use: {
				...devices['Galaxy S5'], // Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		}

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: true
		// url: 'http://127.0.0.1:3000',
	}
});
