import { test, expect } from "@playwright/test";
// Pages Imports simplified
// import LoginPage from "../../../pom/pages/LoginPage";
// import ProductsPage from "../../../pom/pages/ProductsPage";

// Data simplified imports
// import productsListData from "../../../test-data/static/productsList-data.json";
// import productsListData from "../../../test-data/static/productsList-data.json";
// import productsListData from "../../../test-data/static/productsList-data.json";

import { LoginPage, ProductsPage } from "../../../pom/pages/pages-export.js";

import {
  loginPageData,
  productPageData,
  productsListData,
} from "../../../test-data/static/static-data";

const data = { ...loginPageData, ...productPageData };

/** @type {LoginPage} */
let loginPage;
/** @type {ProductsPage} */
let productsPage;

test.describe("handling Products ", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    loginPage.launchUrl(data.appUrl);
  });

  test("verify product page elements load successfully @products @smoke @regression", async ({
    page,
  }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);

    // assert user is navigated to products page
    await page.waitForURL(data.productsPageUrl);

    // assert applogo text presents
    await expect.soft(productsPage.appLogoLoc).toHaveText(data.appLogoText);

    // assert cart icon isVisible
    await expect.soft(productsPage.cartIcon).toBeVisible();

    // assert sorting dropdown isVisible
    await expect.soft(productsPage.productSortLoc).toBeVisible();

    // assert 6 products cards presents
    await expect(productsPage.productsLoc).toHaveCount(6);

    // assert footer text matches
    await expect
      .soft(productsPage.footerCopyRightLoc)
      .toHaveText(data.footerCopyRightText);

    // Assert 3 social icons present
    await expect(productsPage.socialIcons).toHaveCount(3);
    const socialIconsTexts = await productsPage.socialIcons.allTextContents();

    expect(socialIconsTexts).toEqual(data.socialIconNames);
  });

  test(
    "verify_total_product_count_matches_expected_data",
    { tag: ["@smoke", "@regression"] },
    async ({ page }) => {
      // login to app
      await loginPage.validLogin(data.username, data.password);

      // wait for login and navigate to products apge
      await page.waitForURL(data.productsPageUrl);

      await expect(productsPage.productsLoc).toHaveCount(6);
    },
  );

  test(`verify_individual_product_details_against_data_source`, async ({
    page,
  }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);

    // wait for login and navigate to products apge
    await page.waitForURL(data.productsPageUrl);

    // get all products names, price, descriptions
    const allProductsNames =
      await productsPage.productNameLoc.allTextContents();
    const allProductsDesc = await productsPage.productDescLoc.allTextContents();
    const allProductsPrices =
      await productsPage.productPriceLoc.allTextContents();

    //approach 01 - assert products details
    for (let i = 0; i < productsListData.length; i++) {
      expect(allProductsNames[i]).toEqual(productsListData[i].productName);
      expect(allProductsPrices[i]).toEqual(productsListData[i].prodcutPrice);
      expect(allProductsDesc[i]).toEqual(
        productsListData[i].productsDescription,
      );
    }

    //approach 02 - assert products details
    const actualProducts = allProductsNames.map((name, i) => ({
      productName: name,
      prodcutPrice: allProductsPrices[i],
      productsDescription: allProductsDesc[i],
    }));

    expect(actualProducts).toEqual(productsListData);
  });
});
