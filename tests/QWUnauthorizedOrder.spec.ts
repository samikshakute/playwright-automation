import { test, expect } from '@playwright/test'

test('QW Security Test Request Intercept', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    const userName = page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const loginButton = page.locator("#login");

    await userName.fill("samikshak@gmail.com");
    await password.fill("Sam@12345");
    await loginButton.click();
    await page.waitForLoadState('networkidle'); // This can be flaky
    await page.waitForSelector('.card-body b');
    await page.locator("button[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    route => route.continue({url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=692d89ee5008f6a90976416b"}))
    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});