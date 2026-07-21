import { test, expect } from "@playwright/test";
import { LoginPage, ProductsPage } from "../../../pom/pages/pages-export";
import {
  loginPageData,
  productPageData,
} from "../../../test-data/static/static-data";

const data = { ...loginPageData, productPageData };

/** @type {LoginPage} */
let loginPage;
/** @type {ProductsPage} */
let productsPage;

test.describe("products add to cart @products", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.launchUrl(data.appUrl);
  });

  test("sort product lohi @regression", async ({ page }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);
    await page.waitForURL(data.productsPageUrl);

    // check products page heading isVisible
    await expect(productsPage.pageHeadingTxtLoc).toHaveText(
      data.productsPageHeading,
    );

    // Grab all products original prices
    const originalPrice = await productsPage.productPrices();
    const expectedPrice = [...originalPrice].toSorted((a, b) => a - b);

    // Apply sorting on products
    await productsPage.sortProducts({ value: "lohi" });

    // check dom loaded
    await productsPage.productNameLoc.first().waitFor({ state: "visible" });

    // grab new products prices after sorting
    const actualPrice = await productsPage.productPrices();

    // Assert prices are equal
    expect(expectedPrice).toEqual(actualPrice);
  });
});
