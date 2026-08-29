const { By } = require("selenium-webdriver");

const ManagementUserLocator = {
    addButton: By.css('[data-testid="add-button"]'),
    updateButton: By.css('[data-testid="update-button"]'),
    deleteNavButton: By.css('[data-testid="delete-button"]'),
    listButton: By.css('[data-testid="list-button"]'),
    deleteSubmitButton: By.xpath('//div[contains(@class, "container")]//button[@data-testid="delete-button"]'),
    usernameInput: By.css('[data-testid="username-input"]'),
    ageInput: By.css('[data-testid="age-input"]'),
    submitButton: By.css('[data-testid="submit-button"]'),
    customSelectDisplay: By.css(".custom-select-display"),
    containerCard: By.css(".container"),
    successAddToast: By.xpath('//*[contains(text(), "User successfully added")]'),
    getOptionByUsername: (username) =>
        By.xpath(`//div[contains(@class, 'custom-options')]//div[contains(@class, 'option') and not(contains(@class, 'disabled')) and contains(text(), '${username}')]`)
};

module.exports = ManagementUserLocator;
