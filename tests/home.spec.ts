import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
	test('homepage lead', async ({ page }) => {
		await page.goto('localhost:5173/');

		// Check if an h1 element is present
		const h1Count = await page.locator('h1').count();
		const lead = await page.getByTestId('lead').textContent();

		expect(h1Count).toBeGreaterThan(0);
		expect(lead?.length).toBeGreaterThan(20);
	});

	test('app btn', async ({ page }) => {
		await page.goto('localhost:5173/');
		await page.getByTestId("app-btn").click()

		await page.waitForURL('/quests');
		await page.goto('/groups')
	})

	// if user is logged out
	// ====================
	// test('cta sign up', async ({ page }) => {
	// 	await page.goto('/');

	// 	const signUpBtn = page.getByTestId('signup-btn');
	// 	expect(signUpBtn).toBeVisible();
	// 	await signUpBtn.click();
	// 	await expect(page.getByRole('heading')).toHaveText('Sign Up');
	// 	// const signInBtn = page.getByTestId('signin-btn')
	// 	// expect(signInBtn).toBeVisible()
	// });
	// test('cta sign in', async ({ page }) => {
	// 	await page.goto('/');

	// 	const signInBtn = page.getByTestId('signin-btn');
	// 	expect(signInBtn).toBeVisible();
	// 	await signInBtn.click();
	// 	await expect(page.getByRole('heading')).toHaveText('Sign In');
	// });
});
