const { until } = require("selenium-webdriver");
const CheckoutPageLocator = require("../locator/CheckoutPage.locator");

class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
        this.cartUrl = "https://belajar-bareng.onrender.com/cart";
        this.timeout = 10000;
    }

    async ensureModalClosed() {
        try {
            const cancelBtn = await this.driver.findElement(CheckoutPageLocator.cancelCheckoutButton);
            if (await cancelBtn.isDisplayed()) {
                await cancelBtn.click();
                await this.driver.sleep(500);
            }
        } catch (e) {
            // Modal is not open
        }
    }

    async navigateToShop() {
        await this.ensureModalClosed();
        const shopBtn = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.shopNavButton),
            this.timeout
        );
        await shopBtn.click();
    }

    async addProductToCart(productId = 5) {
        const addToCartBtn = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.addToCartButton(productId)),
            this.timeout
        );
        await addToCartBtn.click();
    }

    async navigateToCart() {
        const cartBtn = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.cartNavButton),
            this.timeout
        );
        await cartBtn.click();
        await this.driver.wait(until.urlIs(this.cartUrl), this.timeout);
    }

    async getCartProductName(productId = 5) {
        const cartItem = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.cartItemName(productId)),
            this.timeout
        );
        return await cartItem.getText();
    }

    async openCheckoutModal() {
        const checkoutBtn = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.checkoutButton),
            this.timeout
        );
        await checkoutBtn.click();
        await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.nameInput),
            this.timeout
        );
    }

    async fillCustomerDetails(name, email, address) {
        if (name) {
            const nameInput = await this.driver.findElement(CheckoutPageLocator.nameInput);
            await nameInput.clear();
            await nameInput.sendKeys(name);
        }
        if (email) {
            const emailInput = await this.driver.findElement(CheckoutPageLocator.emailInput);
            await emailInput.clear();
            await emailInput.sendKeys(email);
        }
        if (address) {
            const addressInput = await this.driver.findElement(CheckoutPageLocator.addressInput);
            await addressInput.clear();
            await addressInput.sendKeys(address);
        }
    }

    solveCaptchaEquation(questionText) {
        const match = questionText.match(/What is (\d+)\s*([+\-*/])\s*(\d+)\?/);
        if (!match) {
            throw new Error(`Format CAPTCHA tidak dikenali: ${questionText}`);
        }
        const num1 = Number(match[1]);
        const op = match[2];
        const num2 = Number(match[3]);

        switch (op) {
            case "+": return num1 + num2;
            case "-": return num1 - num2;
            case "*": return num1 * num2;
            case "/": return num1 / num2;
            default: throw new Error(`Operator tidak dikenali: ${op}`);
        }
    }

    async solveAndEnterCaptcha(overrideAnswer = null) {
        const captchaQuestionElem = await this.driver.findElement(CheckoutPageLocator.captchaQuestion);
        const questionText = await captchaQuestionElem.getText();

        let answer = overrideAnswer;
        if (answer === null) {
            answer = this.solveCaptchaEquation(questionText);
        }

        const captchaInput = await this.driver.findElement(CheckoutPageLocator.captchaInput);
        await captchaInput.clear();
        await captchaInput.sendKeys(String(answer));
    }

    async acceptTermsAndConditions() {
        const tncCheckbox = await this.driver.findElement(CheckoutPageLocator.tncCheckbox);
        await tncCheckbox.click();

        const tncOkButton = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.tncOkButton),
            this.timeout
        );
        await tncOkButton.click();
    }

    async clickSubmitCheckout() {
        const submitBtn = await this.driver.findElement(CheckoutPageLocator.submitCheckoutButton);
        await submitBtn.click();
    }

    async clickCancelCheckout() {
        const cancelBtn = await this.driver.findElement(CheckoutPageLocator.cancelCheckoutButton);
        await cancelBtn.click();
    }

    async getSuccessMessageText() {
        const successElem = await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.successMessage),
            this.timeout
        );
        return await successElem.getText();
    }

    async getCaptchaErrorElement() {
        return await this.driver.wait(
            until.elementLocated(CheckoutPageLocator.captchaError),
            5000
        );
    }

    async getModalOrContainerElement() {
        try {
            return await this.driver.findElement(CheckoutPageLocator.checkoutModal);
        } catch (e) {
            return await this.driver.findElement(CheckoutPageLocator.cartContainer);
        }
    }
}

module.exports = CheckoutPage;
