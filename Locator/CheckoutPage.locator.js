const { By } = require("selenium-webdriver");

const CheckoutPageLocator = {
    shopNavButton: By.css('[data-testid="shop-button"]'),
    addToCartButton: (id = 5) => By.css(`[data-testid="add-to-cart-${id}"]`),
    cartNavButton: By.css('[data-testid="cart-button"]'),
    cartItemName: (id = 5) => By.css(`[data-testid="cart-name-${id}"]`),
    checkoutButton: By.css('[data-testid="checkout-button"]'),
    checkoutModal: By.css('[data-testid*="checkout-form"]'),
    nameInput: By.css('[data-testid="checkout-name"]'),
    emailInput: By.css('[data-testid="checkout-email"]'),
    addressInput: By.css('[data-testid="checkout-address"]'),
    captchaQuestion: By.css('[data-testid="captcha-question"]'),
    captchaInput: By.css('[data-testid="checkout-captcha"]'),
    tncCheckbox: By.css('[data-testid="tnc-checkbox"]'),
    tncOkButton: By.css('[data-testid="tnc-ok-button"]'),
    submitCheckoutButton: By.css('[data-testid="submit-checkout"]'),
    cancelCheckoutButton: By.css('[data-testid="cancel-checkout"]'),
    successMessage: By.xpath("//*[contains(text(), 'Checkout Successful!')]"),
    captchaError: By.xpath("//*[contains(text(), 'Captcha incorrect')]"),
    tncError: By.xpath("//*[contains(text(), 'Terms & Conditions')]"),
    pageBody: By.css("body"),
    modalContainer: By.css('[data-testid*="checkout-form"]'),
    cartContainer: By.css(".cart-container, .container, body")
};

module.exports = CheckoutPageLocator;
