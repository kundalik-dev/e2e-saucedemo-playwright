import { test, expect } from "@playwright/test";

// pages imports
import LoginPage from "../../pages/login.page";
import InventoryPage from "../../pages/inventory.page";

// data imports
import { credentials, authData } from "../../test-data/auth-data";
import inventoryData from "../../test-data/inventory-data.json";

test.describe("Authentication Tests", () => {
  /** @type {LoginPage} */
  let loginPage;
  /** @type {InventoryPage} */
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.launchUrl(authData.appUrl);
  });

  test("should login with valid credentials", async ({ page }) => {
    // Arrange
    const { username, password } = credentials.valid.standard_user;

    // Act
    await loginPage.login(username, password);

    // Assert
    await expect(inventoryPage.getPageHeading()).toBeVisible();
    expect(await page.url()).toContain(inventoryData.pageUrl);
  });

  test("should show error for locked_out_user", async ({ page }) => {
    // arrange
    const { username, password, expectedError } =
      credentials.invalid.locked_out_user;

    // act
    await loginPage.login(username, password);

    // assert
    await expect(loginPage.getErrorMessage()).toHaveText(expectedError);
  });

  test("should handle invalid user", async ({ page }) => {
    // arrange
    const { username, password, expectedError } =
      credentials.invalid.invalid_user;

    // act
    await loginPage.login(username, password);

    // assert
    await expect(loginPage.getErrorMessage()).toHaveText(expectedError);
  });

  test("should clear error message when clicking X button", async ({
    page,
  }) => {
    // arrange
    const { username, password, expectedError } =
      credentials.invalid.locked_out_user;

    // act
    await loginPage.login(username, password);
    await loginPage.closeErrorMessage();

    // assert
    await expect(loginPage.getErrorMessageCard()).not.toBeVisible();
  });
});
// should handle locked out user
