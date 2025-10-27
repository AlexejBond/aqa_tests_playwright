// import test, { expect } from "@playwright/test";

// test.describe("[Heroku App] [Dropdown]", () => {
//   test.beforeEach(async ({ page }) => {
//     const url = "https://the-internet.herokuapp.com/";
//     const dropdownLink = page.locator('a[href="/dropdown"]');
//     await page.goto(url);
//     await dropdownLink.click();
//   });

//   test("Should select option 1", async ({ page }) => {
//     const dropdown = page.locator("#dropdown");
//     await dropdown.selectOption("1");
//     await expect(dropdown).toHaveValue("1");
//   });

//   test("Should select option 2", async ({ page }) => {
//     const dropdown = page.locator("#dropdown");
//     await dropdown.selectOption("Option 2");
//     await expect(dropdown).toHaveValue("2");
//   });
// });