class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameLoc = page.getByRole("textbox", { name: "username" });
    this.passwordLoc = page.getByRole("textbox", { name: "password" });
    this.loginBtnLoc = page.getByRole("button", { name: "Sign In" });
    this.dashboardPageHeadingLoc = page.getByText("Welcome back, Alex");
    this.errorMsgLoc = page.getByText(
      "The username or password you entered is incorrect.",
      { exact: true },
    );
  }

  async launchUrl(url) {
    await this.page.goto("/bank/login");
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
