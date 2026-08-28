const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const login = require("./loginHelper");
const rawUsersData = require("../data/users");
const usersData = rawUsersData.default || rawUsersData;

const SELECTORS = {
    addButton: By.css('[data-testid="add-button"]'),
    updateButton: By.css('[data-testid="update-button"]'),
    deleteNavButton: By.css('[data-testid="delete-button"]'),
    deleteSubmitButton: By.xpath('//div[contains(@class, "container")]//button[@data-testid="delete-button"]'),
    usernameInput: By.css('[data-testid="username-input"]'),
    ageInput: By.css('[data-testid="age-input"]'),
    submitButton: By.css('[data-testid="submit-button"]'),
    customSelectDisplay: By.css(".custom-select-display"),
    successAddToast: By.xpath('//*[contains(text(), "User successfully added")]')
};

const URLS = {
    usersDashboard: "https://belajar-bareng.onrender.com/users"
};

const TIMEOUT_MS = 10000;

describe("User Management Functionality Tests", function () {
    this.timeout(30000);

    let driver;

    before(async function () {
        console.log("[SETUP] Initializing Chrome WebDriver and performing initial login...");
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
        await login(driver);
    });

    beforeEach(async function () {
        console.log("[SETUP] Navigating back to users dashboard...");
        await driver.get(URLS.usersDashboard);
        await driver.wait(until.urlIs(URLS.usersDashboard), TIMEOUT_MS);
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

    it("should add a new user successfully", async function () {
        const addButton = await driver.wait(
            until.elementLocated(SELECTORS.addButton),
            TIMEOUT_MS
        );
        await addButton.click();

        const usernameInput = await driver.wait(
            until.elementLocated(SELECTORS.usernameInput),
            TIMEOUT_MS
        );
        await usernameInput.sendKeys(usersData.addUser.username);

        const ageInput = await driver.findElement(SELECTORS.ageInput);
        await ageInput.sendKeys(usersData.addUser.age);

        const submitButton = await driver.findElement(SELECTORS.submitButton);
        await submitButton.click();

        const successMessage = await driver.wait(
            until.elementLocated(SELECTORS.successAddToast),
            TIMEOUT_MS
        );
        await driver.wait(
            until.elementTextContains(successMessage, "User successfully added"),
            TIMEOUT_MS
        );

        const actualText = await successMessage.getText();
        const expectedText = `User successfully added, Hi ${usersData.addUser.username}!`;

        assert.strictEqual(actualText, expectedText);
    });

    it("should update user data successfully", async function () {
        const updateNavBtn = await driver.wait(
            until.elementLocated(SELECTORS.updateButton),
            TIMEOUT_MS
        );
        await updateNavBtn.click();

        const searchInput = await driver.wait(
            until.elementLocated(SELECTORS.customSelectDisplay),
            TIMEOUT_MS
        );
        await searchInput.click();
        await searchInput.sendKeys(usersData.addUser.username);

        const targetOption = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(@class, 'custom-options')]//div[contains(@class, 'option') and not(contains(@class, 'disabled')) and contains(text(), '${usersData.addUser.username}')]`)
            ),
            TIMEOUT_MS
        );
        await targetOption.click();
        await driver.sleep(500);

        const ageInput = await driver.findElement(SELECTORS.ageInput);
        await ageInput.clear();
        await ageInput.sendKeys("25");

        const submitButton = await driver.findElement(SELECTORS.submitButton);
        await submitButton.click();

        await driver.sleep(1000);
    });

    it("should delete a user successfully", async function () {
        const deleteNavBtn = await driver.wait(
            until.elementLocated(SELECTORS.deleteNavButton),
            TIMEOUT_MS
        );
        await deleteNavBtn.click();

        const searchInput = await driver.wait(
            until.elementLocated(SELECTORS.customSelectDisplay),
            TIMEOUT_MS
        );
        await searchInput.click();
        await searchInput.sendKeys(usersData.addUser.username);

        const targetOption = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(@class, 'custom-options')]//div[contains(@class, 'option') and not(contains(@class, 'disabled')) and contains(text(), '${usersData.addUser.username}')]`)
            ),
            TIMEOUT_MS
        );
        await targetOption.click();
        await driver.sleep(500);

        const confirmDeleteBtn = await driver.wait(
            until.elementLocated(SELECTORS.deleteSubmitButton),
            TIMEOUT_MS
        );
        await confirmDeleteBtn.click();

        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        await alert.accept();

        await driver.sleep(1500);
    });
});
