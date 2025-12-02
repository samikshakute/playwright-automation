import { expect, test } from '@playwright/test'

test('Client App Test', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    const userName = page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const loginButton = page.locator("#login");
    const productText = page.locator(".card-body b");

    await userName.fill("samikshak@gmail.com");
    await password.fill("Sam@12345");
    await loginButton.click();
    await page.waitForLoadState('networkidle'); // This can be flaky
    await page.waitForSelector('.card-body b');
    console.log(await productText.first().textContent());
    console.log(await productText.allTextContents());
});

test("Client App Login Test", async ({ page }) => {
    const email = "samikshak@gmail.com";
    const password = "Sam@12345";

    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    // await page.locator("#userEmail").fill(email); 
    await page.getByPlaceholder("email@example.com").fill(email);

    // await page.locator("#userPassword").fill(password);
    await page.getByPlaceholder("enter your passsword").fill(password);

    await page.getByRole("button", { name: 'Login' }).click();
    // await page.locator('text=Login').click();

    await page.waitForLoadState('networkidle');

    await page.waitForSelector('.card-body b');
    // const productNames = await page.locator(".card-body b").allTextContents();
    // console.log(productNames);
    // const count = await products.count();
    // for (let i = 0; i < count; i++) {
    //     if ((await products.nth(i).locator("b").textContent()) === productName) {
    //         await products.nth(i).locator("text=Add to Cart").click();
    //         break;
    //     }
    // }
    await page.locator('.card-body').filter({ hasText: "ADIDAS ORIGINAL" }).getByRole("button", { name: 'Add To Cart' }).click();

    await page.getByRole("listitem").getByRole('button', { name: "Cart" }).click();
    // await page.locator("[routerlink*='cart']").click();

    await page.locator("div li").first().waitFor();

    // const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    // expect(bool).toBeTruthy();
    await expect(page.getByText("ADIDAS ORIGINAL")).toBeVisible();

    // await page.locator('text="Checkout"').click();
    await page.getByRole("button", { name: 'Checkout' }).click();

    // await page.locator("[placeholder*='Country']").pressSequentially("ind");
    await page.getByPlaceholder('Country').pressSequentially("ind");

    // await page.waitForSelector('.ta-results');
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    // const countryCount = await dropdown.locator("button").count();
    // for (let i = 0; i < countryCount; i++) {
    //     if (await dropdown.locator("button").nth(i).textContent() === ' India') {
    //         await dropdown.locator("button").nth(i).click();
    //         break;
    //     }
    // }
    await page.getByRole("button", { name: 'India' }).nth(1).click();

    await expect(page.locator(".user__name label")).toHaveText(email);

    // await page.locator(".action__submit").click();
    await page.getByText("PLACE ORDER").click();

    // await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ");
    await expect(page.getByText('Thankyou for the order.')).toBeVisible();

    const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())?.trim() || '';
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");
    const ordersCount = await rows.count();
    for (let i = 0; i < ordersCount; i++) {
        const text = (await rows.nth(i).locator("th").textContent())?.trim() || '';
        if (orderId.includes(text)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = (await page.locator(".col-text").textContent())?.trim() || '';
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
});