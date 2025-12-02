import {test, expect} from '@playwright/test'
test('Pop Up Validations', async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("https://google.com");
    await page.goBack();
    await page.goForward();
    await page.goBack();
    expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    expect(page.locator("#displayed-text")).toBeHidden();
    page.pause();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();
    const framePage = page.frameLocator("#courses-iframe");
    await framePage.locator(".hidden a[href*='paths']").click();
    const text = await framePage.locator("h1 .text-primary").textContent();
    console.log(text);
});