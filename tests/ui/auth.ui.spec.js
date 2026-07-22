import { test, expect } from "@playwright/test";
import LoginPage from "../../pages/login.page";
import { credentials, authData } from "../../test-data/auth-data";

test.describe("Authentication UI tests", () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.launchUrl(authData.appUrl);
  });

  test("should display all essential login elements when the login page loads", async ({
    page,
  }) => {
    // Assert username, password, login button is visible
    await expect(loginPage.pageHeadingLoc).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    await expect(page).toHaveScreenshot("login-page.png");
  });
});
