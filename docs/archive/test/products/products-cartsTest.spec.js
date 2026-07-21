import { test, expect } from "@playwright/test";
import { LoginPage, ProductsPage } from "../../../pom/pages/pages-export";
import {
  loginPageData,
  productPageData,
} from "../../../../test-data/static/static-data";

const data = { ...loginPageData, ...productPageData };

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

  test("verify_product_sorting_by_price_lohi @regression", async ({ page }) => {
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

    // check correct sorting is applied and dom is rendered
    await expect(productsPage.productSortLoc).toHaveValue("lohi");
    await expect(productsPage.productPriceLoc.first()).toHaveText(
      `$${expectedPrice[0].toFixed(2)}`,
    );

    // grab new products prices after sorting
    const actualPrice = await productsPage.productPrices();

    // Assert prices are equal
    expect(expectedPrice).toEqual(actualPrice);
  });

  test("verify_single_product_add_to_cart_and_remove_lifecycle", async ({
    page,
  }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);

    // Wait for navigation to products page and check heading isVisible
    await page.waitForURL(data.productsPageUrl);
    await expect(productsPage.pageHeadingTxtLoc).toHaveText(
      data.productsPageHeading,
    );

    // Search for product and Click on Add to Cart
    await productsPage.searchProductAddToCart(data.productNameForAddToCart);

    // Assert that the shopping cart badge increments to `1`.
    expect.soft(await productsPage.shoppingCartValue()).toEqual("1");

    // Assert that the button text changes from "Add to cart" to "Remove".
    const cartBtnText = await productsPage.cartButtonText(
      data.productNameForAddToCart,
    );

    expect(cartBtnText).toContain("Remove");

    // Click "Remove" and verify the badge disappears or decrements.
    await productsPage.removeProductFromCart(data.productNameForAddToCart);

    await expect(productsPage.shoppingCartBadgeLoc).not.toBeVisible();
  });

  test("verify_single_product_add_to_cart_and_remove_lifecycle_second_approach @regression", async ({
    page,
  }) => {
    await loginPage.validLogin(data.username, data.password);
    await page.waitForURL(data.productsPageUrl);

    // Single locator reference reused for both click and assertion — no text snapshots
    const cartButton = productsPage.getProductCartButton(
      data.addToCart.productName,
    );

    // Add to cart and assert full state: badge count + button label
    await cartButton.click();
    await expect(productsPage.shoppingCartBadgeLoc).toHaveText(
      data.addToCart.productCount,
    );
    await expect(cartButton).toHaveText(data.buttonLabels.remove);

    // Remove from cart and assert full revert: badge gone + button label restored
    await cartButton.click();
    await expect(productsPage.shoppingCartBadgeLoc).not.toBeVisible();
    await expect(cartButton).toHaveText(data.buttonLabels.addToCart);
  });
});
