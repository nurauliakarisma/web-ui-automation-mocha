const { until, By } = require("selenium-webdriver");
const LoginPageLocator = require("../locator/LoginPage.locator");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://belajar-bareng.onrender.com/";
        this.dashboardUrl = "https://belajar-bareng.onrender.com/users";
        this.timeout = 10000;
    }

    async open() {
        await this.driver.get(this.url);
        await this.driver.wait(
            until.elementLocated(LoginPageLocator.usernameInput),
            this.timeout
        );
    }

    async resetSession() {
        await this.driver.get(this.url);
        await this.driver.executeScript("localStorage.clear();");
        await this.driver.get(this.url);
        await this.driver.wait(
            until.elementLocated(LoginPageLocator.usernameInput),
            this.timeout
        );
    }

    async enterUsername(username) {
        const input = await this.driver.findElement(LoginPageLocator.usernameInput);
        await input.clear();
        await input.sendKeys(username);
    }

    async enterPassword(password) {
        const input = await this.driver.findElement(LoginPageLocator.passwordInput);
        await input.clear();
        await input.sendKeys(password);
    }

    async clickLogin() {
        const button = await this.driver.findElement(LoginPageLocator.loginButton);
        await button.click();
    }

    async submitLoginForm(username, password) {
        if (username !== undefined) {
            await this.enterUsername(username);
        }
        if (password !== undefined) {
            await this.enterPassword(password);
        }
        await this.clickLogin();
    }

    async waitForErrorToast() {
        return await this.driver.wait(
            until.elementLocated(By.xpath("//*[contains(@class, 'toast-error') or contains(@class, 'Toastify') or contains(text(), 'Invalid') or contains(text(), 'error')]")),
            this.timeout
        );
    }

    async getFormElement() {
        return await this.driver.findElement(LoginPageLocator.loginFormCard);
    }

    async getLoginButtonElement() {
        return await this.driver.findElement(LoginPageLocator.loginButton);
    }

    async getCurrentUrl() {
        return await this.driver.getCurrentUrl();
    }

    async isDashboardDisplayed() {
        await this.driver.wait(until.urlIs(this.dashboardUrl), this.timeout);
        const addButton = await this.driver.wait(
            until.elementLocated(LoginPageLocator.dashboardAddButton),
            this.timeout
        );
        return await addButton.isDisplayed();
    }
}

module.exports = LoginPage;
