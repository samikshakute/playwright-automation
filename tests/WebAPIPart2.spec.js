import { test, expect, request } from '@playwright/test'
import {APIUtils} from './utils/APIUtils.spec'

const loginPayload = { userEmail: "samikshak@gmail.com", userPassword: "Sam@12345" }; // 2. Define Payload
const orderPayload = {orders: [{country: "Bahrain", productOrderedId: "68a961459320a140fe1ca57a"}]};

let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});

test("Login Bypass Test", async ({ page }) => {
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = page.locator("tbody tr");
    const ordersCount = await rows.count();
    for (let i = 0; i < ordersCount; i++) {
        const text = (await rows.nth(i).locator("th").textContent())?.trim() || '';
        if (response.orderId.includes(text)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = (await page.locator(".col-text").textContent())?.trim() || '';
    await page.pause();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});