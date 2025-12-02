import { test, expect, request } from '@playwright/test'

let apiContext;
let token: string;
let orderId: string;
const loginPayload = { userEmail: "samikshak@gmail.com", userPassword: "Sam@12345" }; // 2. Define Payload
const orderPayload = {orders: [{country: "Bahrain", productOrderedId: "68a961459320a140fe1ca57a"}]};

test.beforeAll(async () => {
    // 1. Create API Context
    apiContext = await request.newContext();

    // 3. Make the POST call
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", { data: loginPayload });

    // 4. Validate Success (Status 200)
    expect(loginResponse.ok()).toBeTruthy();

    // 5. Extract Token from JSON
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {data: orderPayload, 
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        } } );
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];
    console.log(orderId);
});

test("Login Bypass Test", async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

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
    await page.pause();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
});