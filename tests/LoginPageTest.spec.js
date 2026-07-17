import { test, expect } from "@playwright/test";
import LoginPage from "../pom/LoginPage";

const appUrl = "https://qaplayground.com/bank/login";
let loginPage;

// valid login data
const username = "standard_user";
const password = "bank_sauce";
const dashboardPageHeadingTxt = "Welcome back, Alex";

// In-Valid login data
const wrongUsername = "wrong_user";
const wrongPassword = "wrong_password";
const errorMsgText = "The username or password you entered is incorrect.";

test.describe("login page", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.launchUrl(appUrl);
  });

  test("should login wiht valid credentials", async () => {
    await loginPage.validLogin(username, password);
    await expect(loginPage.dashboardPageHeadingLoc).toHaveText(
      dashboardPageHeadingTxt,
    );
  });

  test("should login wiht inValid credentials", async () => {
    await loginPage.inValidLogin(wrongUsername, wrongPassword);
    await expect(loginPage.errorMsgLoc).toHaveText(errorMsgText);
  });
});
