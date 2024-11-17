import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
	test('homepage lead', async ({ page }) => {
		await page.goto('/');

		// Check if an h1 element is present
		const h1Count = await page.locator('h1').count();
		const lead = await page.getByTestId('lead').textContent();

		expect(h1Count).toBeGreaterThan(0);
		expect(lead?.length).toBeGreaterThan(20);
	});

	test('app btn', async ({ page }) => {
		await page.goto('/');
		await page.getByTestId("app-btn").click()

		await page.goto('/groups')
	})
});
