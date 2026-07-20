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
    this.productNameLoc = page.getByTestId("inventory-item-name");
    this.productPriceLoc = page.getByTestId("inventory-item-price");
    this.productDescLoc = page.getByTestId("inventory-item-desc");

    //prodcuts locators
    this.productsLoc = page.locator(".inventory_item");

    // footer
    this.socialIcons = page.locator("ul.social li");
    this.socialIcons2 = page.locator("ul.social li a");
    this.footerCopyRightLoc = page.locator("div.footer_copy");
  }

  async productsPageHeading() {
    return this.productsPageHeading;
  }

  async compareProdcutsDetaisl(productName, productPrice, productDescription) {}
}

export default ProductsPage;
