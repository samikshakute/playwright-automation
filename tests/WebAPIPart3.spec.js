import { expect, test } from '@playwright/test'
let webContext;

// beforeAll logs in once and saves storage state for reuse across tests
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const email = "samikshak@gmail.com";
    const password = "Sam@12345";

    // Perform login flow to capture authenticated storage state
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill(password);
    await page.getByRole("button", { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    // Save storage state to a file and create a new context using that state
    await context.storageState({ path: 'state.json' });
    webContext = await browser.newContext({ storageState: 'state.json' });
});

test("Client App Login Test", async () => {
    const email = "samikshak@gmail.com";
    const page = await webContext.newPage();

    // Open app (using auth state so user is logged in)
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    // Wait for products to appear and add the target product to cart
    await page.waitForSelector('.card-body b');
    await page.locator('.card-body').filter({ hasText: "ADIDAS ORIGINAL" }).getByRole("button", { name: 'Add To Cart' }).click();

    // Open cart and wait for cart items to render
    await page.getByRole("listitem").getByRole('button', { name: "Cart" }).click();
    await page.locator("div li").first().waitFor();

    // Verify product is visible in the cart
    await expect(page.getByText("ADIDAS ORIGINAL")).toBeVisible();

    // Proceed to checkout
    await page.getByRole("button", { name: 'Checkout' }).click();
    await page.getByPlaceholder('Country').pressSequentially("ind");

    // Wait for country dropdown and select India
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    await page.getByRole("button", { name: 'India' }).nth(1).click();

    // Verify the email displayed on checkout matches the logged-in user
    await expect(page.locator(".user__name label")).toHaveText(email);

    // Place order and confirm success message
    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText('Thankyou for the order.')).toBeVisible();

    // Capture and log the order id
    const orderId = (await page.locator(".em-spacer-1 .ng-star-inserted").textContent())?.trim() || '';
    console.log(orderId);

    // Navigate to My Orders and verify the saved order appears
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

test('Test Case 2 to print all product names', async () => {
    const page = await webContext.newPage();
    const productText = page.locator(".card-body b");

    // Navigate and wait for product list, then print product names for debugging
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.waitForSelector('.card-body b');
    console.log(await productText.first().textContent());
    console.log(await productText.allTextContents());
});