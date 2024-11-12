import test, { expect } from "@playwright/test";
import { describe } from "node:test";

describe("groups", () => {
  test("site loading", async ({ page }) => {
    await page.goto('/quests')
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()


    const addGroupBtn = page.getByTestId("addquest-btn")
    await expect(addGroupBtn).toBeVisible()
  })

  test("add quest", async ({ page }) => {


    const name = "Playwright Testboard"
    const description = "Playwright Description"
    await page.goto('/quests')
    await page.getByTestId("addquest-btn").click()

    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Description').fill(description);
    await page.getByTestId("group-select").click()
    // const submitBtn = page.getByTestId('submitgroup-btn')
    // await submitBtn.isVisible()
    // await submitBtn.click()

    // await page.waitForURL(/\/groups\/\d+/);

    // const heading =  page.locator('h1')
    // await expect(heading).toBeVisible()
    // const headingText = await heading.textContent()
    // expect(headingText).toContain(groupname)
  })
})