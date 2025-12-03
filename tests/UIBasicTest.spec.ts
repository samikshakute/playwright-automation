import { test, expect } from '@playwright/test';

test('Browser context playwright test', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.route('**/*.{jpg,png,jpeg}', route => route.abort());
  await page.goto('https://playwright.dev');
  console.log(await page.title());
});

test('Valid login test', async ({ page }) => {
  await page.goto('https://google.com');
  await expect(page).toHaveTitle('Google');
  const userName = page.locator('#username');
  const password = page.locator('[id="password"]');
  const submitButton = page.locator('.btn.btn-info.btn-md');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await userName.fill('kjdhfksd');
  await userName.fill('');
  await userName.fill("rahulshettyacademy");
  await password.fill("learning");
  await submitButton.click();
  console.log(await page.locator(".card-body a").first().textContent());
  console.log(await page.locator(".card-body a").nth(1).textContent());
  console.log(await page.locator("card-body a").allTextContents());
});

test('failed login shows error message', async ({ page }) => {
  const userName = page.locator('#username');
  const password = page.locator('[id="password"]');
  const submitButton = page.locator('.btn.btn-info.btn-md');
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await userName.fill('kjdhfksd');
  await password.fill("learning");
  await submitButton.click();
  console.log(await page.locator('[style*="block"]').textContent());
  await expect(page.locator('[style*="block"]')).toContainText("Incorrect");
});

test.only('Assignment', async ({ page }) => {
  page.on('request', request => console.log(request.url()));
  page.on('response', response => console.log(response.url(), response.status()));
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
  const userName = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const loginButton = page.locator("#login");
  const productText = page.locator(".card-body b");

  await userName.fill("samikshak@gmail.com");
  await password.fill("Sam@12345");
  await loginButton.click();
  await page.waitForLoadState('networkidle'); // This can be flaky
  // Best Option - wait for the locator itself
  await page.locator(".card-body b").first().waitFor();

  console.log(await productText.first().textContent());
  console.log(await productText.allTextContents());

});

test('UI Controls', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await page.locator(".radiotextsty ").last().click();
  await page.locator(".radiotextsty ").last().isChecked();
  await expect(page.locator(".radiotextsty ").last()).toBeChecked();
  await page.locator("#okayBtn").click();
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("teach");
  await page.locator("#terms").check();
  await page.locator("#terms").isChecked();
  await page.locator("#terms").uncheck();
  expect(await page.locator("#terms").isChecked()).toBeFalsy();

  const documentText = page.locator("[href*='documents-request']");
  await expect(documentText).toHaveAttribute("class", "blinkingText");
  // await page.pause();
});

test('Child window handling', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    documentLink.click()
  ])
  const text = await newPage.locator('.red').textContent();
  if (!text) {
    throw new Error('Failed to retrieve text from the new page (expected non-empty .red text)');
  }
  console.log(text);
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);

  await page.locator("#username").fill(domain);
  // await page.pause();
  console.log(await page.locator("#username").inputValue());
});