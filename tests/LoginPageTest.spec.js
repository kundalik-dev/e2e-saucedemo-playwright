import { test, expect } from "@playwright/test";
import LoginPage from "../pom/LoginPage";
import ProductsPage from "../pom/ProductsPage";
import data from "../test-data/loginPage-data.json";

let loginPage;
let productsPage;

test.describe("login page", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.launchUrl(data.appUrl);
  });

  test("should login wiht valid credentials", async () => {
    await loginPage.validLogin(data.username, data.password);
    await expect(productsPage.pageHeadingTxtLoc).toHaveText(
      data.productsPageHeading,
    );
  });

  test("should login wiht inValid credentials", async () => {
    await loginPage.inValidLogin(data.invaliUsername, data.invalidPassword);
    await expect(loginPage.errorMsgLoc).toHaveText(data.errorMsgText);
  });
});
