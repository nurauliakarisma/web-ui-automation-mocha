const { until } = require("selenium-webdriver");
const ManagementUserLocator = require("../locator/ManagementUser.locator");

class ManagementUserPage {
    constructor(driver) {
        this.driver = driver;
        this.dashboardUrl = "https://belajar-bareng.onrender.com/users";
        this.timeout = 10000;
    }

    async openDashboard() {
        await this.driver.get(this.dashboardUrl);
        await this.driver.wait(until.urlIs(this.dashboardUrl), this.timeout);
    }

    async navigateToAdd() {
        const button = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.addButton),
            this.timeout
        );
        await button.click();
    }

    async navigateToUpdate() {
        const button = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.updateButton),
            this.timeout
        );
        await button.click();
    }

    async navigateToDelete() {
        const button = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.deleteNavButton),
            this.timeout
        );
        await button.click();
    }

    async fillAddUserForm(username, age) {
        const usernameInput = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.usernameInput),
            this.timeout
        );
        await usernameInput.sendKeys(username);

        const ageInput = await this.driver.findElement(ManagementUserLocator.ageInput);
        await ageInput.sendKeys(age);

        const submitButton = await this.driver.findElement(ManagementUserLocator.submitButton);
        await submitButton.click();
    }

    async selectUserFromDropdown(username) {
        const searchInput = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.customSelectDisplay),
            this.timeout
        );
        await searchInput.click();
        await searchInput.sendKeys(username);

        const optionLocator = ManagementUserLocator.getOptionByUsername(username);
        const targetOption = await this.driver.wait(
            until.elementLocated(optionLocator),
            this.timeout
        );
        await targetOption.click();
        await this.driver.sleep(500);
    }

    async fillUpdateAge(newAge) {
        const ageInput = await this.driver.findElement(ManagementUserLocator.ageInput);
        await ageInput.clear();
        await ageInput.sendKeys(newAge);

        const submitButton = await this.driver.findElement(ManagementUserLocator.submitButton);
        await submitButton.click();
    }

    async clickDeleteUser() {
        const confirmDeleteBtn = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.deleteSubmitButton),
            this.timeout
        );
        await confirmDeleteBtn.click();
    }

    async handleBrowserConfirmAlert() {
        await this.driver.wait(until.alertIsPresent(), 5000);
        const alert = await this.driver.switchTo().alert();
        await alert.accept();
    }

    async getSuccessAddToastText() {
        const successMessage = await this.driver.wait(
            until.elementLocated(ManagementUserLocator.successAddToast),
            this.timeout
        );
        await this.driver.wait(
            until.elementTextContains(successMessage, "User successfully added"),
            this.timeout
        );
        return await successMessage.getText();
    }

    async getContainerElement() {
        return await this.driver.findElement(ManagementUserLocator.containerCard);
    }
}

module.exports = ManagementUserPage;
