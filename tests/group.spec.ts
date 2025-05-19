import test, { expect } from '@playwright/test';
import { describe } from 'node:test';

describe('groups', () => {
	const groupname = `Playwright-${Math.random().toFixed(4)}`.trim();
	test('site loading', async ({ page }) => {
		await page.goto('/groups');
		const heading = page.getByTestId('title-group');
		await expect(heading).toBeVisible();

		const addGroupBtn = page.getByTestId('addgroup-btn');
		await expect(addGroupBtn).toBeVisible();
	});

	test('add group', async ({ page }) => {
		await page.goto('/groups');
		await page.getByTestId('addgroup-btn').click();

		await page.getByTestId('addgroup-input-name').fill(groupname);
		const submitBtn = page.getByTestId('submitgroup-btn');
		await submitBtn.isVisible();
		await submitBtn.click();

		await page.waitForURL(/\/groups\/\d+/);

		const heading = page.locator('h1');
		await expect(heading).toHaveCount(1);
		await expect(heading).toBeVisible();
	});
});
