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
  productsNamesList,
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

    await loginPage.launchUrl(data.appUrl);
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

  test("verify_product_sorting_by_name_direction_AZ @regression", async ({
    page,
  }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);

    // wait for navigate to products page & product card toBeVisible
    await page.waitForURL(data.productsPageUrl);
    await expect.soft(productsPage.productNameLoc.first()).toBeVisible();

    // sort all products in A-Z order
    await productsPage.productSortLoc.selectOption({ value: "az" });

    // expected sort order from UI Z-A
    const expectedSortAZ = [...productsNamesList].sort((a, b) =>
      a.localeCompare(b),
    );

    // actual sort order from UI A-Z
    const actualSortAZ = await productsPage.productNameLoc.allTextContents();

    expect(expectedSortAZ).toEqual(actualSortAZ);
  });

  test("verify_product_sorting_by_name_direction_ZA @regression", async ({
    page,
  }) => {
    // login to app
    await loginPage.validLogin(data.username, data.password);

    // wait for navigate to products page
    await page.waitForURL(data.productsPageUrl);
    await expect.soft(productsPage.productNameLoc.first()).toBeVisible();

    // sort all products in Z-A
    await productsPage.productSortLoc.selectOption({ value: "za" });

    // actual sort order from UI
    const actualSortZA = await productsPage.productNameLoc.allTextContents();

    // expected sort order from json files Z-A
    const expectedSortZA = [...productsNamesList].sort((a, b) =>
      b.localeCompare(a),
    );

    // Assert sorted products list match with UI A-Z sorting
    expect(expectedSortZA).toEqual(actualSortZA);
  });

  // 🎭 sorting lohi or hilo with data driven approach
  for (const sortOrder of data.sortOrders) {
    test(`verify_product_sorting_by_price_${sortOrder}`, async ({ page }) => {
      // login to app
      await loginPage.validLogin(data.username, data.password);

      // wait for navigate to products page
      await page.waitForURL(data.productsPageUrl);
      await expect.soft(productsPage.productNameLoc.first()).toBeVisible();

      // grab all products prices text
      const productPricesText =
        await productsPage.productPriceLoc.allTextContents();

      const originalProductsPrice = productPricesText.map((productPrice) => {
        return parseFloat(productPrice.replace("$", ""));
      });

      // sort product in lohi or hilo
      await productsPage.productSortLoc.selectOption({
        value: `${sortOrder}`,
      });

      // check products cards are visible after sorting
      await expect(productsPage.productPriceLoc.first()).toBeVisible();

      // actual sorted prodcuts price form UI
      const actualProductsPriceText =
        await productsPage.productPriceLoc.allTextContents();
      const actualProductsPrice = actualProductsPriceText.map((actPrice) => {
        return parseFloat(actPrice.replace("$", ""));
      });

      // expected sorted products price
      let expectedProductPrice;

      if (sortOrder === "lohi") {
        console.log("original array before sort", originalProductsPrice);
        expectedProductPrice = originalProductsPrice.sort((a, b) => a - b);
        console.log("sorted array is", expectedProductPrice);
        console.log("original array after sort", originalProductsPrice);
      } else if (sortOrder === "hilo") {
        expectedProductPrice = originalProductsPrice.sort((a, b) => b - a);
      } else {
        console.log("provide valide sort order");
      }

      expect(actualProductsPrice).toEqual(expectedProductPrice);
    });
  }

  // Optimised version of above
  for (const sortOrder of data.sortOrders) {
    test(`verify product sorting by price: ${sortOrder}`, async ({ page }) => {
      await test.step("Login and navigate to products page", async () => {
        await loginPage.validLogin(data.username, data.password);
        await page.waitForURL(data.productsPageUrl);
        await expect.soft(productsPage.productNameLoc.first()).toBeVisible();
      });

      // Helper function to extract and parse numeric prices from locators
      const getParsedPrices = async () => {
        const texts = await productsPage.productPriceLoc.allTextContents();
        return texts.map((text) => parseFloat(text.replace(/[^0-9.]/g, "")));
      };

      const originalPrices = await getParsedPrices();

      await test.step(`Sort products by ${sortOrder} via UI`, async () => {
        await productsPage.productSortLoc.selectOption({ value: sortOrder });
        // Ensure the UI updates by checking the first locator attachment state
        await productsPage.productPriceLoc
          .first()
          .waitFor({ state: "visible" });
      });

      const actualPrices = await getParsedPrices();

      // Generate expected array using non-mutating .toSorted()
      const expectedPrices =
        sortOrder === "lohi"
          ? originalPrices.toSorted((a, b) => a - b)
          : originalPrices.toSorted((a, b) => b - a);

      expect(actualPrices).toEqual(expectedPrices);
    });
  }
});
