const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const login = require("./loginHelper");
const users = require("../data/users");

describe("Add User", function () {

    it("Should add user successfully", async function () {

        this.timeout(15000);

        const driver = await new Builder()
            .forBrowser("chrome")
            .build();

        try {

            await login(driver);

            const addButton = await driver.findElement(
                By.css('[data-testid="add-button"]')
            );
            await addButton.click();

            const usernameInput = await driver.findElement(
                By.css('[data-testid="username-input"]')
            );
            await usernameInput.sendKeys(
                users.addUser.username
            );

            const ageInput = await driver.findElement(
                By.css('[data-testid="age-input"]')
            );
            await ageInput.sendKeys(
                users.addUser.age
            );

            const submitButton = await driver.findElement(
                By.css('[data-testid="submit-button"]')
            );

            await submitButton.click();

            const successMessage = await driver.wait(
                until.elementLocated(
                    By.xpath(
                        `//*[contains(text(), "User successfully added")]`
                    )
                ),
                10000
            );

            await driver.wait(
                until.elementTextContains(
                    successMessage,
                    "User successfully added"
                ),
                10000
            );

            const actualMessage = await successMessage.getText();

            const expectedMessage =
                `User successfully added, Hi ${users.addUser.username}!`;

            console.log("Username dari data:", users.addUser.username);
            console.log("Expected:", expectedMessage);
            console.log("Actual:", actualMessage);

            assert.strictEqual(
                actualMessage,
                expectedMessage
            );

        } finally {

            await driver.quit();

        }

    });

});