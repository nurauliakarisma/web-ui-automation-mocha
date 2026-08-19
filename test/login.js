const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe("Login", function () {

    it("Should login successfully", async function () {

        this.timeout(15000);

        const driver = await new Builder()
            .forBrowser("chrome")
            .build();

        try {

            await driver.get(
                "https://belajar-bareng.onrender.com/"
            );

            const usernameInput = await driver.findElement(
                By.css('[data-testid="username-input"]')
            );
            await usernameInput.sendKeys("admin");

            const passwordInput = await driver.findElement(
                By.css('[data-testid="password-input"]')
            );
            await passwordInput.sendKeys("admin");

            const loginButton = await driver.findElement(
                By.css('[data-testid="login-button"]')
            );

            await loginButton.click();

            await driver.wait(
                until.urlIs(
                    "https://belajar-bareng.onrender.com/users"
                ),
                10000
            );

            assert.strictEqual(
                await driver.getCurrentUrl(),
                "https://belajar-bareng.onrender.com/users"
            );

            const feedbackButton = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="feedback-button"]')
                ),
                10000
            );

            const feedbackText = await feedbackButton.getText();
            assert.strictEqual(
                feedbackText,
                "💌 Send Feedback : mrdhwnkml@gmail.com"
            );

        } finally {
            await driver.quit();
        }

    });

});