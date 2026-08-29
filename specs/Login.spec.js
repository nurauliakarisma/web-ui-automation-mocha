const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const LoginPage = require("../page/LoginPage");
const rawUserData = require("../data/user");
const userData = rawUserData.default || rawUserData;
const { takeFullScreenshot, takeElementScreenshot, clearScreenshotFolder } = require("../utilities/screenshot");

const SPEC_NAME = "Login.spec";

describe("Login Automation Specs with Page Object Model", function () {
    this.timeout(30000);

    let driver;
    let loginPage;

    before(async function () {
        console.log("[SETUP] Initializing Chrome WebDriver...");
        clearScreenshotFolder(SPEC_NAME);
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
        loginPage = new LoginPage(driver);
    });

    beforeEach(async function () {
        console.log("[SETUP] Resetting session and navigating to Login page...");
        await loginPage.resetSession();
    });

    afterEach(async function () {
        const testTitle = this.currentTest.title;
        const testStatus = this.currentTest.state || "passed";

        console.log(`[TEARDOWN] Finished test: "${testTitle}" | Status: ${testStatus}`);

        // 1. Ambil screenshot penuh (Full Page Screenshot) ke subfolder Login.spec
        await takeFullScreenshot(driver, testTitle, testStatus, SPEC_NAME);

        // 2. Ambil screenshot sebagian / elemen (Element Screenshot) ke subfolder Login.spec
        try {
            const formElement = await loginPage.getFormElement();
            await takeElementScreenshot(formElement, testTitle, "login_card", testStatus, SPEC_NAME);
        } catch (error) {
            try {
                const buttonElement = await loginPage.getLoginButtonElement();
                await takeElementScreenshot(buttonElement, testTitle, "login_button", testStatus, SPEC_NAME);
            } catch (innerError) {
                console.log("[SCREENSHOT] Element not found for partial screenshot, skipping element screenshot.");
            }
        }
    });

    after(async function () {
        console.log("[TEARDOWN] Closing browser instance...");
        if (driver) {
            await driver.quit();
        }
    });

    it("should login successfully with valid credentials", async function () {
        await loginPage.submitLoginForm(
            userData.validUser.username,
            userData.validUser.password
        );

        const isDisplayed = await loginPage.isDashboardDisplayed();
        assert.ok(isDisplayed);

        const currentUrl = await loginPage.getCurrentUrl();
        assert.strictEqual(currentUrl, loginPage.dashboardUrl);
    });

    it("should fail to login with an invalid password", async function () {
        await loginPage.submitLoginForm(
            userData.invalidPasswordUser.username,
            userData.invalidPasswordUser.password
        );

        // Explicit wait menunggu error toast muncul
        const errorToast = await loginPage.waitForErrorToast();
        assert.ok(await errorToast.isDisplayed());

        const currentUrl = await loginPage.getCurrentUrl();
        assert.strictEqual(currentUrl, loginPage.url);
    });

    it("should fail to login with an unregistered username", async function () {
        await loginPage.submitLoginForm(
            userData.unregisteredUser.username,
            userData.unregisteredUser.password
        );

        // Explicit wait menunggu error toast muncul
        const errorToast = await loginPage.waitForErrorToast();
        assert.ok(await errorToast.isDisplayed());

        const currentUrl = await loginPage.getCurrentUrl();
        assert.strictEqual(currentUrl, loginPage.url);
    });

    it("should prevent login when username and password fields are empty", async function () {
        await loginPage.submitLoginForm();

        const currentUrl = await loginPage.getCurrentUrl();
        assert.strictEqual(currentUrl, loginPage.url);
    });
});
