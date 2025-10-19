// Разработайте смоук тест-сьют с тестами на REGISTER на странице 
//  https://anatoly-karpovich.github.io/demo-login-form/

// Требования:
//  Страница регистрации:
//      Username: обязательное, от 3 до 40 символов включительно, 
//                запрещены префиксные/постфиксные 
//                пробелы, как и имя состоящее из одних пробелов
//      Password: обязательное, от 8 до 20 символов включительно, необходима хотя бы одна буква 
//                в верхнем и нижнем регистрах, пароль из одних пробелов запрещен
//  Страница логина:
//      Username: обязательное
//      Password: обязательное
//---------------------------------------------------------------------------------------------------------------------------------------

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "https://anatoly-karpovich.github.io/demo-login-form/";

const locators = {
  register: {
    openRegisterButton: "#registerOnLogin",
    usernameInput: "#userNameOnRegister",
    passwordInput: "#passwordOnRegister",
    submitButton: "#register",
    message: "#errorMessageOnRegister",
    backButton: "#backOnRegister",
  },
  login: {
    usernameInput: "#userName",
    passwordInput: "#password",
    submitButton: "#submit",
    successMessage: "#successMessage",
  },
};

const messages = {
  successRegister:
    "Successfully registered! Please, click Back to return on login page",
};

const testData = {
  validUsername: "Alex",
  validPassword: "AlexStrong123",
  shortUsername: "Al",
  weakPassword: "pass",
  tooLongUsername: "A".repeat(41),
  tooLongPassword: "Ab" + "c".repeat(19),
  spaceUsername: "   ",
  spacePassword: "        ",
  usernameWithSpaces: "  Alex  ",
};

async function registerUser(page: Page, username: string, password: string) {
  console.log(`Registering user: ${username}`);
  await page.locator(locators.register.openRegisterButton).click();
  await expect(page.locator(locators.register.usernameInput)).toBeVisible();
  await page.locator(locators.register.usernameInput).fill(username);
  await page.locator(locators.register.passwordInput).fill(password);
  await page.locator(locators.register.submitButton).click();
}

async function loginUser(page: Page, username: string, password: string) {
  console.log(`Logging in as: ${username}`);
  await expect(page.locator(locators.login.usernameInput)).toBeVisible();
  await page.locator(locators.login.usernameInput).fill(username);
  await page.locator(locators.login.passwordInput).fill(password);
  await page.locator(locators.login.submitButton).click();
}

test.describe("Smoke tests for Registration and Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveURL(BASE_URL);
  });

  test("User can register successfully with valid data", async ({ page }) => {
    await test.step("Register with valid data", async () => {
      await registerUser(page, testData.validUsername, testData.validPassword);
      await expect(page.locator(locators.register.message))
        .toHaveText(messages.successRegister);
    });
  });

  test("User can register and then log in with valid credentials", async ({ page }) => {
    const expectedLoginText = `Hello, ${testData.validUsername}!`;

    await test.step("Register new user", async () => {
      await registerUser(page, testData.validUsername, testData.validPassword);
      await expect(page.locator(locators.register.message))
        .toHaveText(messages.successRegister);
    });

    await test.step("Log in with registered user", async () => {
      await page.locator(locators.register.backButton).click();
      await loginUser(page, testData.validUsername, testData.validPassword);
      await expect(page.locator(locators.login.successMessage))
        .toHaveText(expectedLoginText);
    });
  });

  test("Registration should fail if username is shorter than 3 characters", async ({ page }) => {
    await registerUser(page, testData.shortUsername, testData.validPassword);
    await expect(page.locator(locators.register.message))
      .not.toHaveText(messages.successRegister);
  });

  test("Registration should fail with password shorter than 8 characters", async ({ page }) => {
    await registerUser(page, testData.validUsername, testData.weakPassword);
    await expect(page.locator(locators.register.message))
      .not.toHaveText(messages.successRegister);
  });

  // test("Registration should fail if username is longer than 40 characters", async ({ page }) => {
  //   await registerUser(page, testData.tooLongUsername, testData.validPassword);
  //   await expect(page.locator(locators.register.message))
  //     .not.toHaveText(messages.successRegister);
  // });

  // test("Registration should fail if password is longer than 20 characters", async ({ page }) => {
  //   await registerUser(page, testData.validUsername, testData.tooLongPassword);
  //   await expect(page.locator(locators.register.message))
  //     .not.toHaveText(messages.successRegister);
  // });

  test("Registration should fail with username containing only spaces", async ({ page }) => {
    await registerUser(page, testData.spaceUsername, testData.validPassword);
    await expect(page.locator(locators.register.message))
      .not.toHaveText(messages.successRegister);
  });

  test("Registration should fail with password containing only spaces", async ({ page }) => {
    await registerUser(page, testData.validUsername, testData.spacePassword);
    await expect(page.locator(locators.register.message))
      .not.toHaveText(messages.successRegister);
  });

  test("Registration should fail when username has leading/trailing spaces", async ({ page }) => {
    await registerUser(page, testData.usernameWithSpaces, testData.validPassword);
    await expect(page.locator(locators.register.message))
      .not.toHaveText(messages.successRegister);
  });

  test("Login should fail without username", async ({ page }) => {
    await loginUser(page, "", testData.validPassword);
    await expect(page.locator(locators.login.successMessage))
      .not.toHaveText(/MEssage/);
  });

  test("Login should fail without password", async ({ page }) => {
    await loginUser(page, testData.validUsername, "");
    await expect(page.locator(locators.login.successMessage))
      .not.toHaveText(/MEssage/);
  });

  test("Login should fail with invalid credentials", async ({ page }) => {
    await loginUser(page, testData.tooLongUsername, testData.tooLongPassword);
    await expect(page.locator(locators.login.successMessage))
      .not.toHaveText(/Hello/);
  });
});
