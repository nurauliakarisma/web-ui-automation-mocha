const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const rawUserData = require("../data/user");
const userData = rawUserData.default || rawUserData;

const SELECTORS = {
    usernameInput: By.css('[data-testid="username-input"]'),
    passwordInput: By.css('[data-testid="password-input"]'),
    loginButton: By.css('[data-testid="login-button"]'),
    addButton: By.css('[data-testid="add-button"]')
};

const URLS = {
    loginPage: "https://belajar-bareng.onrender.com/",
    usersDashboard: "https://belajar-bareng.onrender.com/users"
};

const WAIT_TIMEOUT_MS = 10000;

describe("Login Functionality Tests", function () {
    this.timeout(30000);

    let driver;

    before(async function () {
        console.log("[SETUP] Initializing Chrome WebDriver...");
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
    });

    beforeEach(async function () {
        console.log("[SETUP] Resetting session and navigating to login page...");
        await driver.get(URLS.loginPage);
        await driver.executeScript("localStorage.clear();");
        await driver.get(URLS.loginPage);
        await driver.wait(until.elementLocated(SELECTORS.usernameInput), WAIT_TIMEOUT_MS);
    });

    afterEach(function () {
        const testTitle = this.currentTest.title;
        const testStatus = this.currentTest.state;
        console.log(`[TEARDOWN] Finished test: "${testTitle}" | Status: ${testStatus}`);
    });

    after(async function () {
        console.log("[TEARDOWN] Closing browser instance...");
        if (driver) {
            await driver.quit();
        }
    });

    async function submitCredentials(username, password) {
        if (username !== undefined) {
            const usernameInput = await driver.findElement(SELECTORS.usernameInput);
            await usernameInput.sendKeys(username);
        }

        if (password !== undefined) {
            const passwordInput = await driver.findElement(SELECTORS.passwordInput);
            await passwordInput.sendKeys(password);
        }

        const loginButton = await driver.findElement(SELECTORS.loginButton);
        await loginButton.click();
    }

    it("should login successfully with valid credentials", async function () {
        await submitCredentials(
            userData.validUser.username,
            userData.validUser.password
        );

        await driver.wait(until.urlIs(URLS.usersDashboard), WAIT_TIMEOUT_MS);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, URLS.usersDashboard);

        const dashboardElement = await driver.wait(
            until.elementLocated(SELECTORS.addButton),
            WAIT_TIMEOUT_MS
        );
        assert.ok(await dashboardElement.isDisplayed());
    });

    it("should fail to login with an invalid password", async function () {
        await submitCredentials(
            userData.invalidPasswordUser.username,
            userData.invalidPasswordUser.password
        );

        await driver.sleep(1500);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, URLS.loginPage);
    });

    it("should fail to login with an unregistered username", async function () {
        await submitCredentials(
            userData.unregisteredUser.username,
            userData.unregisteredUser.password
        );

        await driver.sleep(1500);
        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, URLS.loginPage);
    });

    it("should prevent login when username and password fields are empty", async function () {
        await submitCredentials();

        const currentUrl = await driver.getCurrentUrl();
        assert.strictEqual(currentUrl, URLS.loginPage);
    });
});