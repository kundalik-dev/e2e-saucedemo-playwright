class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Login Form Inputs Locators
    this.usernameLoc = page.getByRole("textbox", { name: "Username" });
    this.passwordLoc = page.getByRole("textbox", { name: "Password" });
    this.loginBtnLoc = page.getByRole("button", { name: "Login" });

    // Login Form Message Locators

    this.errorMsgLoc = page.getByRole("heading", { level: 3 });
  }

  async launchUrl(url) {
    await this.page.goto("/");
  }

  async validLogin(username, password) {
    await this.usernameLoc.fill(username);
    await this.passwordLoc.fill(password);
    await this.loginBtnLoc.click();
  }

  async inValidLogin(username, password) {
    await this.usernameLoc.fill(username);
    await this.passwordLoc.fill(password);
    await this.loginBtnLoc.click();
  }
}

export default LoginPage;
