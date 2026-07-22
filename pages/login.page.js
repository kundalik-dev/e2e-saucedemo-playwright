class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // headings
    this.pageHeadingLoc = page.locator(".login_logo");

    // Login Form Inputs Locators
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });

    // Login Form Message Locators
    this.errorMessageCard = page.getByTestId("error");
    this.errorMessageLoc = page.getByRole("heading", { level: 3 });
    this.xCloseButton = page.locator(".error-button");
  }

  async launchUrl(appUrl) {
    await this.page.goto(appUrl);
  }

  // Login method
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // get heading text and return a locator
  getPageHeading() {
    return this.pageHeadingLoc;
  }

  // get error message retrns locator
  getErrorMessage() {
    return this.errorMessageLoc;
  }

  // get error message returns locator
  getErrorMessageCard() {
    return this.errorMessageCard;
  }

  // close error message dialog
  async closeErrorMessage() {
    await this.xCloseButton.click();
  }
}

export default LoginPage;
