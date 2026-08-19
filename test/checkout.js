const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

const login = require("./loginHelper");
const checkoutData = require("../data/checkout");

describe("Checkout", function () {

    it("Should checkout product successfully", async function () {

        this.timeout(20000);

        const driver = await new Builder()
            .forBrowser("chrome")
            .build();

        try {

            await login(driver);

            const shopButton = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="shop-button"]')
                ),
                10000
            );
            await shopButton.click();


            const addToCartButton = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="add-to-cart-5"]')
                ),
                10000
            );
            await addToCartButton.click();


            const cartButton = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="cart-button"]')
                ),
                10000
            );
            await cartButton.click();

            await driver.wait(
                until.urlIs(
                    "https://belajar-bareng.onrender.com/cart"
                ),
                10000
            );
            assert.strictEqual(
                await driver.getCurrentUrl(),
                "https://belajar-bareng.onrender.com/cart"
            );

            const cartProduct = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="cart-name-5"]')
                ),
                10000
            );

            const productName = await cartProduct.getText();
            assert.strictEqual(
                productName,
                "Iphone 17 Pro-Mag 2TB"
            );


            const checkoutButton = await driver.findElement(
                By.css('[data-testid="checkout-button"]')
            );

            await checkoutButton.click();

            const nameInput = await driver.wait(
                until.elementLocated(
                    By.css('[data-testid="checkout-name"]')
                ),
                10000
            );

            await nameInput.sendKeys(
                checkoutData.name
            );


            const emailInput = await driver.findElement(
                By.css('[data-testid="checkout-email"]')
            );

            await emailInput.sendKeys(
                checkoutData.email
            );


            const addressInput = await driver.findElement(
                By.css('[data-testid="checkout-address"]')
            );
            await addressInput.sendKeys(
                checkoutData.address
            );

            const captchaQuestion = await driver.findElement(
                By.css('[data-testid="captcha-question"]')
            );
            const question = await captchaQuestion.getText();

            console.log("Captcha:", question);

// ==========================================
            const match = question.match(
                /What is (\d+)\s*([+\-*/])\s*(\d+)\?/
            );

            if (!match) {
                throw new Error(
                    `Format CAPTCHA tidak dikenali: ${question}`
                );
            }

            const number1 = Number(match[1]);
            const operator = match[2];
            const number2 = Number(match[3]);

            let answer;

            switch (operator) {

                case "+":
                    answer = number1 + number2;
                    break;

                case "-":
                    answer = number1 - number2;
                    break;

                case "*":
                    answer = number1 * number2;
                    break;

                case "/":
                    answer = number1 / number2;
                    break;

                default:
                    throw new Error(
                        `Operator tidak dikenali: ${operator}`
                    );
            }

            console.log(
                `Captcha answer: ${number1} ${operator} ${number2} = ${answer}`
            );

            const captchaInput = await driver.findElement(
                By.css('[data-testid="checkout-captcha"]')
            );

            await captchaInput.sendKeys(
                String(answer)
            );

            const tncCheckbox = await driver.findElement(
                By.css('[data-testid="tnc-checkbox"]')
            );

            await tncCheckbox.click();

            const tncOkButton = await driver.findElement(
                By.css('[data-testid="tnc-ok-button"]')
            );

            await tncOkButton.click();

            const submitButton = await driver.findElement(
                By.css('[data-testid="submit-checkout"]')
            );
            await submitButton.click();


            const successMessage = await driver.wait(
                until.elementLocated(
                    By.xpath("//*[contains(text(), 'Checkout Successful!')]")
                ),
                10000
            );

            assert.strictEqual(
                await successMessage.getText(),
                "🎉 Checkout Successful!"
            );


            const pageText = await driver.findElement(
                By.css("body")
            ).getText();

            assert.ok(
                pageText.includes(`Name: ${checkoutData.name}`)
            );

            assert.ok(
                pageText.includes(`Email: ${checkoutData.email}`)
            );


            assert.ok(
                pageText.includes(`Address: ${checkoutData.address}`)
            );


            assert.ok(
                pageText.includes("Iphone 17 Pro-Mag 2TB")
            );


            assert.ok(
                pageText.includes("Total: Rp 23.500.000")
            );

        } finally {

            await driver.quit();

        }

    });

});