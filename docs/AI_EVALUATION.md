# AI-Assisted Framework Evaluation

## What AI did well

- **Project scaffolding.** `package.json` scripts, `tsconfig.json`, `playwright.config.ts`, `.gitignore`, and the web/api project split were usable on the first pass.
- **Playwright configuration.** `testIdAttribute: "data-test"`, HTML report, trace on first retry, screenshot on failure, CI-only retries, and separate `baseURL`s matched the assessment constraints.
- **Page objects.** Login, inventory, cart, and checkout stayed thin. There was no BasePage and no wrapper around every Playwright method.
- **Scenario selection.** The first draft already targeted login, catalog, sort, cart, checkout, and the main JSONPlaceholder verbs instead of generating dozens of trivial tests.
- **API caution.** The first API tests did not assert that POST/PATCH/DELETE persist. That matched the JSONPlaceholder guide.
- **Documentation structure.** The required strategy, decision, AI-usage, and CI files were produced as named in the orchestration prompt.

## What required review or refinement

### Finding

The catalog test called `names.sort()` before pairing each name with `prices[index]`. `Array.sort()` mutates the original array.

### Risk

The test passed because SauceDemo's default order is already A-Z. If the default order changed, name/price pairing would use a reordered name list against the original price list and could fail for the wrong reason, or pass with a false pairing.

### Change

The assertion now sorts a copy: `[...names].sort()`. Price checks still use the original rendered order.

### Result

Catalog identity and price pairing no longer depend on default sort remaining alphabetical.

### Finding

The cart test used `expect(await cartPage.names())` and `expect(await cartPage.prices())`.

### Risk

Awaiting the text first throws away Playwright's locator retry. A slow cart render could fail even when the final UI was correct.

### Change

The test now uses `expect(cartPage.itemNames).toHaveText([backpack.name])` and `expect(cartPage.itemPrices).toHaveText(['$29.99'])`.

### Result

Cart assertions wait for the visible name and price instead of a one-shot snapshot.

### Finding

The price-sort test read all names and prices immediately after `selectOption`.

### Risk

`selectOption` waits for the control, not for SauceDemo's React list to re-render. A one-shot `allTextContents()` could still see the previous order.

### Change

The test now waits for `sortSelect` to have value `lohi` and for the first product name to be `Sauce Labs Onesie` before checking the full price sequence.

### Result

The sort assertion is tied to a unique cheapest product and uses Playwright auto-waiting.

### Finding

DELETE simulation and the 404 case lived in one test.

### Risk

A 404 change could look like a DELETE-persistence failure, and the two behaviors could not be run independently.

### Change

They are now two tests: one re-GETs `/posts/1` after DELETE, and one GETs `/posts/999`.

### Result

The suite still avoids persistence assumptions, and each failure maps to one behavior.

## Human judgment / engineering decisions

AI can generate page objects and tests quickly. The parts that still needed a QA decision were:

- Automating `standard_user` only. SauceDemo's special users are known to break sort, cart, or images.
- Keeping six UI tests instead of covering every menu item and validation message.
- Using page objects for workflows and leaving assertions in the specs.
- Treating JSONPlaceholder writes as simulated.
- Preferring `data-test` and business outcomes (badge, selected product, confirmation) over "element is visible".
- Running the generated suite instead of trusting the first draft.
- Fixing the sort and cart assertions after review, even though the first run had already passed.

## Limitations of AI-assisted development

- Generated tests still have to be executed. The first suite passed and still had a mutating sort and weaker cart assertions.
- External apps cannot be assumed from memory. SauceDemo locators and JSONPlaceholder status codes were checked against the live sites and public docs.
- AI will happily add BasePages, clients, and extra tests if the prompt is vague. The orchestration prompt had to forbid that.
- A green run is not the same as meaningful coverage. Twelve passing tests would not have been useful if they only checked that buttons exist.
- Risk priority, isolation, and what to leave out still need a person.

## What I would do next

- Add checkout-field validation and an order-total check if the exercise grew.
- Add Playwright accessibility snapshots on login and checkout.
- Add Firefox or a mobile viewport after Chromium is stable in CI.
- Use JSON Schema for JSONPlaceholder responses if contract testing became a goal.
- Switch logged-in tests to `storageState` if the UI suite grew large enough that repeated login became expensive.
