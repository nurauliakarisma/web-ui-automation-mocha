const { By } = require("selenium-webdriver");

const LoginPageLocator = {
    usernameInput: By.css('[data-testid="username-input"]'),
    passwordInput: By.css('[data-testid="password-input"]'),
    loginButton: By.css('[data-testid="login-button"]'),
    loginFormCard: By.css(".container"),
    dashboardAddButton: By.css('[data-testid="add-button"]')
};

module.exports = LoginPageLocator;
