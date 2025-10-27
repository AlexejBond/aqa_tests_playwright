// Разработать тест со следующими шагами:
//   - открыть https://the-internet.herokuapp.com/
//   - перейти на страницу Dynamic Controls
//   - Дождаться появления кнопки Remove
//   - Завалидировать текста в заголовке страницы
//   - Чекнуть чекбокс
//   - Кликнуть по кнопке Remove
//   - Дождаться исчезновения чекбокса
//   - Проверить наличие кнопки Add
//   - Завалидировать текст It's gone!
//   - Кликнуть на кнопку Add
//   - Дождаться появления чекбокса
//   - Завалидировать текст It's back!


import { test, expect } from "@playwright/test";


test.describe("HW-20: Task-1", () => {
  test("Dynamic Controls: Test remove / add checkbox", async ({ page }) => {

const herokuMainPageUrl = "https://the-internet.herokuapp.com/";
const mainPageTitle = page.getByRole("heading", { level: 1 });
const mainPageSubTitle = page.getByRole("heading", { level: 2 });

const dynamicControlsLink = page.getByRole("link", { name: "Dynamic Controls" });
const dynamicControlsPageTitle = page.getByText("Dynamic Controls");
const dynamicControlsPageSubTitle = page.getByText("This example demonstrates when elements (e.g., checkbox, input field, etc.) are changed asynchronously.");
const dynamicControlsRemoveButton = page.getByRole("button", { name: "Remove" });
const disappearingCheckbox = page.getByText(" A checkbox");
const dynamicControlsAddButton = page.getByRole("button", { name: "Add" });
const checkboxStatusMessage = page.locator("p#message");

await page.goto(herokuMainPageUrl);
await expect(mainPageTitle).toHaveText("Welcome to the-internet");
await expect(mainPageSubTitle).toHaveText("Available Examples");

await dynamicControlsLink.click();
await expect(dynamicControlsRemoveButton).toBeVisible();
await expect(dynamicControlsPageTitle).toHaveText("Dynamic Controls");
await expect(dynamicControlsPageSubTitle).toHaveText("This example demonstrates when elements (e.g., checkbox, input field, etc.) are changed asynchronously.");

await disappearingCheckbox.locator("input").check();
await dynamicControlsRemoveButton.click();
await expect(disappearingCheckbox).toBeHidden();
await expect(dynamicControlsAddButton).toBeVisible();
await expect(checkboxStatusMessage).toHaveText("It's gone!");
await dynamicControlsAddButton.click();
await expect(disappearingCheckbox).toBeVisible();
await expect(checkboxStatusMessage).toHaveText("It's back!");

});
});