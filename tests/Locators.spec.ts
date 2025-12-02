import { test } from '@playwright/test'

test('Playwright special locators', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Student").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByLabel("Password").fill("sam123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText(" The Form has been submitted successfully!").isVisible();
    await page.getByRole("link", {name: "Shop"}).click();
    await page.locator("app-card").filter({hasText: "Samsung Note 8"}).getByRole("button").click();
});