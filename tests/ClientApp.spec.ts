import { expect, test } from '@playwright/test'

// Simple smoke test that logs product names after login
test('Client App Test', async ({ page }) => {
    // Navigate to the client login page
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    // Element locators
    const userName = page.locator("#userEmail");
    const password = page.locator("#userPassword");
    const loginButton = page.locator("#login");
    const productText = page.locator(".card-body b");

    // Fill credentials and login
    await userName.fill("samikshak@gmail.com");
    await password.fill("Sam@12345");
    await loginButton.click();

    // Wait for network idle and for the product list to be available
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.card-body b');

    // Print the first product and all product names (for debugging/verification)
    console.log(await productText.first().textContent());
    console.log(await productText.allTextContents());
});

test("Client App Login Test", async ({ page }) => {
    // Credentials and product to add to cart
    const email = "samikshak@gmail.com";
    const password = "Sam@12345";
    const products = page.locator(".card-body");
    const productName = "ADIDAS ORIGINAL";

    // Go to login page and authenticate
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.getByRole("button", { name: 'Login' }).click();

    await page.waitForLoadState('networkidle'); 
    
    // Collect product names (useful for debugging)
    const productNames = await page.locator(".card-body b").allTextContents();
    console.log(productNames);

    // Iterate products and add the matching product to cart
    const count = await products.count();
    for (let i = 0; i < count; i++) {
        if ((await products.nth(i).locator("b").textContent()) === productName) {
            await products.nth(i).locator("text=Add To Cart").click();
            break;
        }
    }

    // Navigate to cart
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();

    // Verify the product in cart
    const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    expect(bool).toBeTruthy();

    // Proceed to checkout
    await page.locator('text="Checkout"').click();

    // Type country fragment to trigger suggestions
    await page.locator("[placeholder*='Country']").pressSequentially("ind");

    // Wait for country suggestions and select 'India'
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const countryCount = await dropdown.locator("button").count();
    for (let i = 0; i < countryCount; i++) {
        if (await dropdown.locator("button").nth(i).textContent() === ' India') {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    // Verify logged user email shown on checkout page
    await expect(page.locator(".user__name label")).toHaveText(email);

    // Place the order
    await page.locator(".action__submit").click();

    // Confirm order success message
    await expect(page.locator('.hero-primary')).toHaveText(" Thankyou for the order. ");

    // Capture order id for later verification
    const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())?.trim() || '';
    console.log(orderId);

    // Go to orders page and verify the order appears in the list
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