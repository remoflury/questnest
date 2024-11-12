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


  test("create questboard and add quests", async ({ page }) => {
    const name = "Playwright Testboard-" + Math.random().toFixed(4)
    const description = "Playwright Description"
    await test.step("add questboard", async () => {
      await page.goto('/quests')
      await page.getByTestId("addquest-btn").click()
  
      await page.getByLabel('Name').fill(name);
      await page.getByLabel('Description').fill(description);
      await page.getByTestId("group-select").click()
      await page.getByTestId("group-select-0").click()
      await page.getByTestId("submit-questboard").click()
    })

    await test.step("add quests", async () => {
      await page.goto('/quests')
  
      await page.locator(`a:has(h2:has-text("${name}"))`).click()
      const heading = page.locator('h1')
      await page.waitForURL(/\/quests\/\d+/);
      await expect(heading).toBeVisible()
      const headingText = await heading.textContent()
      expect(headingText).toBe(name)

      // create quests
      await page.getByTestId("createquests-btn").click()
    })
  })

})