# E2E Sauce Demo Automation

## Project goal

An end-to-end UI test automation framework in JavaScript using Playwright Test, targeting **saucedemo.com**. The framework is built around the Page Object Model (POM) and JSON-driven test data. Planned additions (not yet implemented): Playwright fixtures to wire up page objects automatically, and a stored authenticated `storageState` ("login state") to skip the UI login step in tests that don't need to test login itself.

## Commands

Package manager is **pnpm** (see `packageManager` in `package.json`). There is no `test` script defined yet — use the Playwright CLI directly via `pnpm exec`.

```bash
# install dependencies
pnpm install

# install/update Playwright browsers
pnpm exec playwright install --with-deps

# run the full suite (chromium only; other browsers are commented out in playwright.config.js)
pnpm exec playwright test

# run a single spec file
pnpm exec playwright test tests/LoginPageTest.spec.js

# run a single test by name
pnpm exec playwright test -g "should login wiht valid credentials"

# run tests by tag (tags are embedded in test titles or via the `tag` option)
pnpm exec playwright test --grep @smoke

# run headed/debug
pnpm exec playwright test --debug

# open the last HTML report
pnpm run report
```

`playwright.config.js` currently sets `headless: false` globally — tests run head-full by default, not just in debug.

## Architecture

**Flow: `tests/*.spec.js` → `pom/*.js` (Page Objects) → `test-data/*.json` (fixtures data)**

- **`pom/`** — one class per page, named `<PageName>.js` exporting a default class `<PageName>` (e.g. `LoginPage.js` → `class LoginPage`). Each class:
  - takes a Playwright `page` in its constructor and stores it as `this.page`
  - defines all locators as constructor properties, grouped with `//` comments by UI region (e.g. "Login Form Inputs Locators", "Carts locator", "footer")
  - exposes action methods (`validLogin`, `launchUrl`, etc.) that operate on those locators
  - Tests never call `page.locator(...)` directly — they go through the page object's named locator properties and methods.

- **`tests/`** — one spec file per feature/page, instantiates the relevant page object(s) in `test.beforeEach`, then drives the flow and asserts with `expect`/`expect.soft`. Multiple page objects are commonly instantiated together (e.g. `LoginPage` + `ProductsPage`) since most flows start with a login.

- **`test-data/`** — JSON files named `<pageName>-data.json` (single object of expected strings/URLs per page, e.g. `loginPage-data.json`, `productsPage-data.json`) or `<pageName>List-data.json` (array of row objects for per-item data-driven assertions, e.g. `productsList-data.json`). Specs import the JSON directly and, when a test needs data from more than one page's file, merge them: `const data = { ...loginData, ...productsData }`. Keep this merge pattern rather than importing three separately-named variables per test file.

- **`docs/test-cases/`** — numbered markdown files (`01-...`, `02-...`) per page, each listing planned/implemented test case names (snake*case, prefixed `verify*...`) with objective, data variations, and steps. Check here before adding a new test to see if it's already scoped, and mirror the naming convention (`verify*<what>*<condition>`) for new test case names.

- **`playwright.config.js`** — `baseURL` is `https://www.saucedemo.com/`, `testIdAttribute` is `data-test` (matches saucedemo's DOM), reporter is `html`. Only the `chromium` project is enabled; firefox/webkit/mobile/branded-browser projects are present but commented out.

### CI/CD Pipeline

- Will be using jenkins

## Conventions to follow

- Locator properties are suffixed `Loc` (e.g. `usernameLoc`, `productSortLoc`)
