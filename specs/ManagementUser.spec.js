const { Builder } = require("selenium-webdriver");
const assert = require("assert");

const ManagementUserPage = require("../page/ManagementUserPage");
const login = require("../test/loginHelper");
const rawUsersData = require("../data/users");
const usersData = rawUsersData.default || rawUsersData;
const { takeFullScreenshot, takeElementScreenshot, clearScreenshotFolder } = require("../utilities/screenshot");

const SPEC_NAME = "ManagementUser.spec";

describe("User Management Specs with Page Object Model", function () {
    this.timeout(30000);

    let driver;
    let managementPage;

    before(async function () {
        console.log("[SETUP] Initializing Chrome WebDriver and performing initial login...");
        clearScreenshotFolder(SPEC_NAME);
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().window().maximize();
        await login(driver);
        managementPage = new ManagementUserPage(driver);
    });

    beforeEach(async function () {
        console.log("[SETUP] Navigating back to users dashboard...");
        await managementPage.openDashboard();
    });

    afterEach(async function () {
        const testTitle = this.currentTest.title;
        const testStatus = this.currentTest.state || "passed";

        console.log(`[TEARDOWN] Finished test: "${testTitle}" | Status: ${testStatus}`);

        // 1. Ambil screenshot penuh (Full Page Screenshot) ke subfolder ManagementUser.spec
        await takeFullScreenshot(driver, testTitle, testStatus, SPEC_NAME);

        // 2. Ambil screenshot sebagian / elemen (Element Screenshot) ke subfolder ManagementUser.spec
        try {
            const containerElement = await managementPage.getContainerElement();
            await takeElementScreenshot(containerElement, testTitle, "form_container", testStatus, SPEC_NAME);
        } catch (error) {
            console.log("[SCREENSHOT] Container element not found for partial screenshot, skipping.");
        }
    });

    after(async function () {
        console.log("[TEARDOWN] Closing browser instance...");
        if (driver) {
            await driver.quit();
        }
    });

    it("should add a new user successfully", async function () {
        await managementPage.navigateToAdd();
        await managementPage.fillAddUserForm(usersData.addUser.username, usersData.addUser.age);

        const actualToastText = await managementPage.getSuccessAddToastText();
        const expectedText = `User successfully added, Hi ${usersData.addUser.username}!`;
        assert.strictEqual(actualToastText, expectedText);
    });

    it("should update user data successfully", async function () {
        await managementPage.navigateToUpdate();
        await managementPage.selectUserFromDropdown(usersData.addUser.username);
        await managementPage.fillUpdateAge("25");
    });

    it("should delete a user successfully", async function () {
        await managementPage.navigateToDelete();
        await managementPage.selectUserFromDropdown(usersData.addUser.username);
        await managementPage.clickDeleteUser();
        await managementPage.handleBrowserConfirmAlert();
    });
});
