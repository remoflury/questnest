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


  test("create questboard and add, toggle, edit quests", async ({ page }) => {
    const name = "Playwright Testboard-" + Math.random().toFixed(4)
    const description = "Playwright Description"
    let questboardId = ''

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
      expect(headingText).toContain(name)
      const currentURL = page.url();

      questboardId = currentURL.match(/\/quests\/(\d+)/)![1]

      // create quests
      await page.getByTestId("createquests-btn").click()

      await page.getByTestId(`addquest-input-0`).fill(`Playwright Quest 1`)
      await page.getByTestId(`addquest-input-1`).fill(`Playwright Quest 2`)
      await page.getByTestId(`addquest-input-2`).fill(`Playwright Quest 3`)
      await page.getByTestId(`addquest-input-3`).fill(`Playwright Quest 4`)
      await page.getByTestId(`addquest-input-4`).fill(`Playwright Quest 5`)
      await page.getByTestId(`addquest-input-5`).fill(`Playwright Quest 6`)
      await page.getByTestId(`addquest-input-6`).fill(`Playwright Quest 7`)
      await page.getByTestId(`addquest-input-7`).fill(`Playwright Quest 8`)
      await page.getByTestId(`addquest-input-8`).fill(`Playwright Quest 9`)
      await page.getByTestId(`addquest-input-9`).fill(`Playwright Quest 10`)
      await page.getByTestId(`addquest-input-10`).fill(`Playwright Quest 11`)
      await page.getByTestId(`addquest-input-11`).fill(`Playwright Quest 12`)
      await page.getByTestId(`addquest-input-12`).fill(`Playwright Quest 13`)
      await page.getByTestId(`addquest-input-13`).fill(`Playwright Quest 14`)
      await page.getByTestId(`addquest-input-14`).fill(`Playwright Quest 15`)
      await page.getByTestId(`addquest-input-15`).fill(`Playwright Quest 16`)
      await page.getByTestId(`addquest-input-16`).fill(`Playwright Quest 17`)
      await page.getByTestId(`addquest-input-17`).fill(`Playwright Quest 18`)
      await page.getByTestId(`addquest-input-18`).fill(`Playwright Quest 19`)
      await page.getByTestId(`addquest-input-19`).fill(`Playwright Quest 20`)
      await page.getByTestId(`addquest-input-20`).fill(`Playwright Quest 21`)
      await page.getByTestId(`addquest-input-21`).fill(`Playwright Quest 22`)
      await page.getByTestId(`addquest-input-22`).fill(`Playwright Quest 23`)
      await page.getByTestId(`addquest-input-23`).fill(`Playwright Quest 24`)
      
      await page.getByTestId("submit-addquests").click()

      await page.goto(`/quests/${questboardId}`)
    })

    await test.step("toggle quest", async () => {
      await page.goto(`/quests/${questboardId}`)

      // toggle it to done
      await page.getByTestId("togglequest-submit-0").click()
      await page.getByTestId("togglequest-submit-1").click()

      await page.goto(`/quests/${questboardId}`, { timeout: 2000 })

      const form1 = page.getByTestId("togglequest-form-0")
      const form2 = page.getByTestId("togglequest-form-1")
      // check if it is green (quest done)
      const form1IsDone = await form1.evaluate((element) => element.classList.contains("bg-primary"));
      expect(form1IsDone).toBeTruthy()
      const form2IsDone = await form2.evaluate((element) => element.classList.contains("bg-primary"));
      expect(form2IsDone).toBeTruthy()

      // retoggle the same to undone
      await page.getByTestId("togglequest-submit-0").click()
      await page.getByTestId("togglequest-submit-1").click()

      await page.goto(`/quests/${questboardId}`)
      await new Promise(resolve => setTimeout(resolve, 5000))

      // check if it is not green (quest done)
      const form1IsUndone = await form1.evaluate((element) => !element.classList.contains("bg-primary"));
      expect(form1IsUndone).toBeTruthy()
      const form2IsUnDone = await form2.evaluate((element) => !element.classList.contains("bg-primary"));
      expect(form2IsUnDone).toBeTruthy()
    })
    await test.step("edit quest", async () => {
      await page.goto(`/quests/${questboardId}`)
      
      await page.getByTestId('editquest-btn').click()
      await page.getByTestId(`addquest-input-0`).fill(`Playwright Quest 1 edited`)
      await page.getByTestId("submit-editquests").click()

      await page.goto(`/quests/${questboardId}`)

      // check if the form has the text content
      const textQuest = await page.getByTestId("questtext-0").textContent()
      expect(textQuest).toContain("Playwright Quest 1 edited")
    })
  })


})