// Создайте ОДИН смоук тест со следующими шагами:

// 1. Переход на страницу https://anatoly-karpovich.github.io/demo-registration-form/
// 2. Заполните форму регистрации
// 3. Проверьте, что пользователь успешно зарегистрирован

import { test, expect, Page } from "@playwright/test";

const DEMO_REGISTRATION_FORM_URL = "https://anatoly-karpovich.github.io/demo-registration-form/";

enum RegistrationMessages {
  FormTitle = "Register",
  DetailsTitle = "Registration Details",
}

type Country = "USA" | "Canada" | "UK";
type Gender = "Male" | "Female";
type Hobbies = "Movies" | "Travelling" | "Gaming" | "Sports" | "Dancing";
type Language = "English" | "Spanish" | "French" | "German" | "Chinese" | "Russian";
type Skills = "Java" | "JavaScript" | "Python" | "C++" | "Ruby";
type MonthNames =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

interface IUserData {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  country: Country;
  gender: Gender;
  hobbies: Hobbies[];
  languages: Language[];
  skills: Skills[];
  birthDate: { day: number; month: MonthNames; year: number };
  password: string;
}

const locators = {
  pageTitle: "h2",
  form: {
    firstNameInput: "#firstName",
    lastNameInput: "#lastName",
    addressField: "#address",
    emailField: "#email",
    phoneField: "#phone",
    countrySelect: "#country",
    genderRadio: {
      Male: "input[value=\"male\"]",
      Female: "input[value=\"female\"]",
    } as const,
    hobbyCheckbox: (hobby: Hobbies) => `input.hobby[value=\"${hobby}\"]`,
    languageField: "#language",
    skillsField: "#skills",
    yearDropdown: "#year",
    monthDropdown: "#month",
    dayDropdown: "#day",
    passwordInput: "#password",
    confirmPasswordInput: "#password-confirm",
    submitButton: "button[type='submit']",
  },
  details: {
    fullName: "#fullName",
    gender: "#gender",
    birthDate: "#dateOfBirth",
    hobbies: "#hobbies",
    skills: "#skills",
  },
} as const;

const userData: IUserData = {
  firstName: "Sherlock",
  lastName: "Holmes",
  address: "221b, Baker Street, London, NW1 6XE, UK",
  email: "Sherlock.Holmes@gmail.com",
  phone: "+44 20 7946 0958",
  country: "UK",
  gender: "Male",
  hobbies: ["Travelling", "Sports", "Movies", "Gaming"],
  languages: ["English", "Spanish", "French", "German", "Russian", "Chinese"],
  skills: ["JavaScript", "Java"],
  birthDate: { day: 6, month: "January", year: 1984 },
  password: "Sherlock_BEST",
};

async function fillRegistrationForm(page: Page, data: IUserData) {
  const form = locators.form;

  await page.locator(form.firstNameInput).fill(data.firstName);
  await page.locator(form.lastNameInput).fill(data.lastName);
  await page.locator(form.addressField).fill(data.address);
  await page.locator(form.emailField).fill(data.email);
  await page.locator(form.phoneField).fill(data.phone);
  await page.locator(form.countrySelect).selectOption({ label: data.country });

  await page.locator(form.genderRadio[data.gender]).check();

  for (const hobby of data.hobbies) {
    await page.locator(form.hobbyCheckbox(hobby)).check();
  }

  await page.locator(form.languageField).fill(data.languages.join(", "));
  await page.locator(form.skillsField).selectOption(data.skills);
  await page.locator(form.yearDropdown).selectOption({ label: data.birthDate.year.toString() });
  await page.locator(form.monthDropdown).selectOption({ label: data.birthDate.month });
  await page.locator(form.dayDropdown).selectOption({ label: data.birthDate.day.toString() });
  await page.locator(form.passwordInput).fill(data.password);
  await page.locator(form.confirmPasswordInput).fill(data.password);
}

test.describe("Smoke tests for Demo Registration Form", () => {
  test("User can register with valid data", async ({ page }) => {
    await page.goto(DEMO_REGISTRATION_FORM_URL);
    const pageTitle = page.locator(locators.pageTitle);

    await expect(pageTitle).toHaveText(RegistrationMessages.FormTitle);
    await fillRegistrationForm(page, userData);
    await page.locator(locators.form.submitButton).click();

    await expect(pageTitle).toHaveText(RegistrationMessages.DetailsTitle);
    await expect(page.locator(locators.details.fullName)).toHaveText(
      `${userData.firstName} ${userData.lastName}`
    );
    await expect(page.locator(locators.form.addressField)).toHaveText(userData.address);
    await expect(page.locator(locators.form.emailField)).toHaveText(userData.email);
    await expect(page.locator(locators.form.phoneField)).toHaveText(userData.phone);
    await expect(page.locator(locators.form.countrySelect)).toHaveText(userData.country);
    await expect(page.locator(locators.details.gender)).toHaveText(userData.gender.toLowerCase());

    for (const hobby of userData.hobbies) {
      await expect(page.locator(locators.details.hobbies)).toContainText(hobby);
    }

    for (const skill of userData.skills) {
      await expect(page.locator(locators.details.skills)).toContainText(skill);
    }

    await expect(page.locator(locators.details.birthDate)).toHaveText(
      `${userData.birthDate.day} ${userData.birthDate.month} ${userData.birthDate.year}`
    );
  });
});
