class ProductsPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // headings
    this.appLogoLoc = page.locator("div.app_logo");
    this.hamburgerIconLoc = page.getByRole("button", { name: "Open Menu" });

    //message locators
    this.pageHeadingTxtLoc = page.getByText("Products");

    // Carts locator
    this.cartIcon = page.locator(".shopping_cart_link");
    this.shoppingCartBadgeLoc = page.locator(".shopping_cart_badge");

    // products sorting locators
    this.productSortLoc = page.getByRole("combobox");
    this.productSortLoc2 = page.getByTestId("product-sort-container");

    //prodcuts locators
    this.productsLoc = page.locator(".inventory_item");
    this.productNameLoc = page.getByTestId("inventory-item-name");
    this.productPriceLoc = page.getByTestId("inventory-item-price");
    this.productDescLoc = page.getByTestId("inventory-item-desc");
    this.addToCartBtnLoc = page.getByRole("button", { name: "Add to cart" });
    this.removeFromCartBtnLoc = page.getByRole("button", { name: "Remove" });

    // footer
    this.socialIcons = page.locator("ul.social li");
    this.footerCopyRightLoc = page.locator("div.footer_copy");
  }

  async productsPageHeading() {
    return this.productsPageHeading;
  }

  parsedProductPrice = (priceText) =>
    priceText.map((price) => parseFloat(price.replace("$", "")));

  async productPrices() {
    const priceTexts = await this.productPriceLoc.allTextContents();
    return this.parsedProductPrice(priceTexts);
  }

  async sortProducts(sortOption) {
    await this.productSortLoc.selectOption(sortOption);
  }

  // not complete yet
  async productSearch(productName) {
    const allProductNames = await this.productNameLoc.allTextContents();
    // const allProducts = await this.productsLoc;
    this.productsLoc.fil;
    const product = allProductNames.map((name) => {
      allProductNames.filter((value) => {
        if (value === productName) return;
      });
    });
  }

  async searchProductAddToCart(productName) {
    await this.productsLoc
      .filter({ hasText: productName })
      .filter({ has: this.addToCartBtnLoc })
      .locator("button")
      .click();
  }

  async cartButtonText(productName) {
    return await this.productsLoc
      .filter({ hasText: productName })
      .filter({ has: this.removeFromCartBtnLoc })
      .locator("button")
      .textContent();
  }

  async removeProductFromCart(productName) {
    const allProducts = await this.productsLoc;
    await allProducts
      .filter({ hasText: productName })
      .filter({ has: this.removeFromCartBtnLoc })
      .locator("button")
      .click();
  }

  async shoppingCartValue() {
    return await this.shoppingCartBadgeLoc.textContent();
  }

  // Returns the Add-to-cart / Remove button locator for a product — reusable for click and assertion
  getProductCartButton(productName) {
    return this.productsLoc.filter({ hasText: productName }).locator("button");
  }
}

export default ProductsPage;
