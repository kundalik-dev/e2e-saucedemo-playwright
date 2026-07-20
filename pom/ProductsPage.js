class ProductsPage {
  constructor(page) {
    this.page = page;
    this.pageHeadingTxtLoc = page.getByText("Products");
  }
}

export default ProductsPage;
