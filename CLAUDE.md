# E2E Sauce Demo Automation

## Project goal

An end-to-end UI test automation framework in JavaScript using Playwright Test, targeting **saucedemo.com**. The framework is built around the Page Object Model (POM) and `JSON`, `CSV`, `.js` driven test data. Playwright fixtures to wire up page objects automatically, and a stored authenticated `storageState` ("login state") to skip the UI login step in tests that don't need to test login itself.

## Table of Contents

- [E2E Sauce Demo Automation](#e2e-sauce-demo-automation)
  - [Project goal](#project-goal)
  - [Table of Contents](#table-of-contents)
  - [Commands](#commands)
  - [Architecture](#architecture)
    - [pages](#pages)
    - [tests](#tests)
    - [test-data](#test-data)
    - [docs/test-cases](#docstest-cases)
    - [CI/CD Pipeline](#cicd-pipeline)
    - [playwright.config.js](#playwrightconfigjs)
  - [Test cases naming](#test-cases-naming)
  - [Naming Conventions to follow](#naming-conventions-to-follow)

## Commands

Package manager is **pnpm** (see `packageManager` in `package.json`).

```bash
# install dependencies
pnpm install

# install/update Playwright browsers
pnpm exec playwright install --with-deps

# run the full suite (chromium only; other browsers are commented out in playwright.config.js)
pnpm run test

# run a single spec file
pnpm run test tests/LoginPageTest.spec.js

# run a single test by name
pnpm run test -g "should login with valid credentials"

# run tests by tag (tags are embedded in test titles or via the `tag` option)
pnpm run test --grep @smoke

# run headed/debug
pnpm run test --debug

# open the last HTML report
pnpm run report
```

## Architecture

**Flow: `tests/*.spec.js` → `pom/*.js` (Page Objects) → `test-data/*.json` (fixtures data)**

### pages

- one class per page, named `<pagename.page>.js` exporting a default class `<PageName>` (e.g. `login.page.js` → `class LoginPage`).
- Each class:
  - takes a Playwright `page` in its constructor and stores it as `this.page`
  - defines all locators as constructor properties, grouped with `//` comments by UI region (e.g. "Login Form Inputs Locators", "Carts locator", "footer")
  - exposes action methods (`validLogin`, `launchUrl`, etc.) that operate on those locators
  - Tests never call `page.locator(...)` directly — they go through the page object's named locator properties and methods.

### tests

- one spec file per feature/page, instantiates the relevant page object(s) in `test.beforeEach`, then drives the flow and asserts with `expect`/`expect.soft`.
- Multiple page objects are commonly instantiated together (e.g. `LoginPage` + `ProductsPage`) since most flows start with a login.
- tests are divided into
  - `tests/ui` => all ui related test cases
  - `tests/e2e` => all end to end flow test
  - `tests/api` => all api related test cases

### test-data

- JSON files named `<pageName>-data.json` (single object of expected strings/URLs per page, e.g. `login-data.json`, `inventory-data.json`) or `<pageName>List-data.json` (array of row objects for per-item data-driven assertions, e.g. `productsList-data.json`).

### docs/test-cases

- automation test cases stored here.

### CI/CD Pipeline

- Jenkins and github actions will be used for CI CD along with github
- Yet to setup

### playwright.config.js

- `playwright.config.js` will hold all global settings.
- `baseURL` is `https://www.saucedemo.com/`,
- `testIdAttribute` is `data-test` (matches saucedemo's DOM),
- reporter is `html` and `allure-report` yet to setup.
- Only the `chromium` project is enabled; `firefox/webkit/mobile/branded-browser` projects are present but commented out.

## Test cases naming

test cases name should always follow the below pattern:

- `should <expected behavior> with <data>`
- `should <expected behavior> when <action>`
- `should <expected behavior> when <action> with <data>`
- `should <expected behavior>`

```js
// example of test case name
// pattern 01: `should <expected behavior> with <data>`
should login with valid credentials
should not login with invalid credentials
should fill checkout form with valid data

// pattern 02: `should <expected behavior> when <action>`
should display error message when submitting empty form
should complete checkout when filling all required fields
should sort products by price when clicking on sort dropdown
should add to cart when clicking on add to cart button

// pattern 03: `should <expected behavior> when <action> with <data>`
should display error message when submitting form with invalid data
should add product to cart when clicking on add to cart button
should remove product from cart when clicking on remove button
should complete checkout when filling all required fields with valid data

// pattern 04: `should <expected behavior>`
should display products list
should sort products by price
should logout successfully

```

## Naming Conventions to follow

- always follow camelcase convention
- Locator properties are suffixed `Loc` (e.g. `usernameLoc`, `productSortLoc`)
