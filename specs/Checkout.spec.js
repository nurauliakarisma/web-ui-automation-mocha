const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const CheckoutPage = require("../page/CheckoutPage");
const login = require("../test/loginHelper");
const rawCheckoutData = require("../data/checkout");
const checkoutData = rawCheckoutData.default || rawCheckoutData;
const { takeFullScreenshot, takeElementScreenshot, clearScreenshotFolder } = require("../utilities/screenshot");

const SPEC_NAME = "Checkout.spec";

describe("Checkout Flow Specs with Page Object Model", function () {
    this.timeout(40000);

    let driver;
    let checkoutPage;

    before(async function () {
        console.log("[SETUP] Initializing Chrome WebDriver and preparing initial cart...");
        clearScreenshotFolder(SPEC_NAME);
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();

        await login(driver);
        checkoutPage = new CheckoutPage(driver);
    });

    beforeEach(async function () {
        console.log("[SETUP] Ensuring cart contains item and navigating to /cart...");
        await checkoutPage.ensureModalClosed();
        await checkoutPage.navigateToShop();
        await checkoutPage.addProductToCart(5);
        await checkoutPage.navigateToCart();
    });

    afterEach(async function () {
        const testTitle = this.currentTest.title;
        const testStatus = this.currentTest.state || "passed";

        console.log(`[TEARDOWN] Finished test: "${testTitle}" | Status: ${testStatus}`);

        // 1. Full Page Screenshot ke subfolder Checkout.spec
        await takeFullScreenshot(driver, testTitle, testStatus, SPEC_NAME);

        // 2. Element Screenshot ke subfolder Checkout.spec
        try {
            const containerElement = await checkoutPage.getModalOrContainerElement();
            await takeElementScreenshot(containerElement, testTitle, "checkout_view", testStatus, SPEC_NAME);
        } catch (error) {
            console.log("[SCREENSHOT] Element not found for partial screenshot, skipping.");
        }

        // Pastikan modal tertutup setelah tiap skenario
        await checkoutPage.ensureModalClosed();
    });

    after(async function () {
        console.log("[TEARDOWN] Closing browser instance...");
        if (driver) {
            await driver.quit();
        }
    });

    it("should cancel checkout modal and remain on cart page", async function () {
        await checkoutPage.openCheckoutModal();
        await checkoutPage.fillCustomerDetails(checkoutData.name, checkoutData.email, checkoutData.address);
        await checkoutPage.clickCancelCheckout();

        const currentUrl = await checkoutPage.cartUrl;
        assert.strictEqual(await driver.getCurrentUrl(), currentUrl);
    });

    it("should display error message when captcha is answered incorrectly", async function () {
        await checkoutPage.openCheckoutModal();
        await checkoutPage.fillCustomerDetails(checkoutData.name, checkoutData.email, checkoutData.address);
        await checkoutPage.solveAndEnterCaptcha(999); // Wrong CAPTCHA answer
        await checkoutPage.acceptTermsAndConditions();
        await checkoutPage.clickSubmitCheckout();

        const captchaErrorElem = await checkoutPage.getCaptchaErrorElement();
        assert.ok(await captchaErrorElem.isDisplayed());
    });

    it("should complete checkout process successfully with valid data and correct captcha", async function () {
        const productName = await checkoutPage.getCartProductName(5);
        assert.strictEqual(productName, "Iphone 17 Pro-Mag 2TB");

        await checkoutPage.openCheckoutModal();
        await checkoutPage.fillCustomerDetails(checkoutData.name, checkoutData.email, checkoutData.address);
        await checkoutPage.solveAndEnterCaptcha();
        await checkoutPage.acceptTermsAndConditions();
        await checkoutPage.clickSubmitCheckout();

        const successText = await checkoutPage.getSuccessMessageText();
        assert.strictEqual(successText, "🎉 Checkout Successful!");

        const pageText = await driver.findElement(By.css("body")).getText();
        assert.ok(pageText.includes(`Name: ${checkoutData.name}`));
        assert.ok(pageText.includes(`Email: ${checkoutData.email}`));
        assert.ok(pageText.includes(`Address: ${checkoutData.address}`));
    });
});
