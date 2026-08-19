const { By, until } = require("selenium-webdriver");
const assert = require("assert");
const users = require("../data/user");

async function login(driver) {

    await driver.get("https://belajar-bareng.onrender.com/");

    const usernameInput = await driver.findElement(
        By.css('[data-testid="username-input"]')
    );
    await usernameInput.sendKeys(users.login.username);

    const passwordInput = await driver.findElement(
        By.css('[data-testid="password-input"]')
    );
    await passwordInput.sendKeys(users.login.password);

    const loginButton = await driver.findElement(
        By.css('[data-testid="login-button"]')
    );

    await loginButton.click();

    await driver.wait(
        until.urlIs("https://belajar-bareng.onrender.com/users"),
        10000
    );

    assert.strictEqual(
        await driver.getCurrentUrl(),
        "https://belajar-bareng.onrender.com/users"
    );


}

module.exports = login;