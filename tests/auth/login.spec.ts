import { test } from '@playwright/test';
// import path from 'path';

// const authFile = path.join(__dirname, '../playwright/.auth/user.json');

test('signin', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/signin')

  await page.getByLabel('Email').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('Password').fill(process.env.TEST_USER_PW!)
  await page.getByTestId('signin-btn').click()
});