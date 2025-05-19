import { test as setup } from '@playwright/test';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('signin', async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto('/signin');

	await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
	await page.getByTestId('pw-input').fill(process.env.TEST_USER_PW!);
	await page.getByTestId('signin-btn').click();

	await page.waitForURL('/quests');

	await page.context().storageState({ path: authFile });
});
