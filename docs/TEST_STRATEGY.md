# Test Strategy

## Scope

This suite covers two public assessment targets:

- Web: [SauceDemo](https://www.saucedemo.com/)
- API: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)

The suite is sized for an approximately four-hour take-home exercise. It demonstrates a maintainable Playwright framework, not exhaustive coverage of either application.

## Objectives

- Automate a small set of high-value UI flows: login, catalog, cart, and checkout.
- Automate representative JSONPlaceholder reads and simulated writes.
- Keep tests isolated, readable, and executable independently.
- Produce diagnostics that are useful when a public demo site fails.

## Tools

- TypeScript and Node.js
- Playwright Test for both browser and API tests
- Playwright `APIRequestContext` for HTTP assertions
- GitHub Actions for CI

No extra UI or HTTP client libraries are used.

## Test levels

- UI end-to-end tests against the hosted SauceDemo app.
- API tests against the hosted JSONPlaceholder service.

There are no unit tests, component tests, or contract-schema tests in this repository.

## Selected scenarios

### Web

1. Valid login with `standard_user` reaches the inventory.
2. `locked_out_user` stays on the login page with the locked-out error.
3. Inventory lists the expected catalog names and prices.
4. Price sort (low to high) produces a non-decreasing price order.
5. Adding a product updates the cart badge and cart contents; removing it clears the cart.
6. Completing checkout for one product shows the confirmation page.

### API

1. `GET /posts` returns 100 posts with a consistent body shape.
2. `GET /posts/1` returns the known seed resource.
3. `GET /posts?userId=1` keeps the user relationship.
4. `POST /posts` returns a created representation (`id` 101) without later persistence checks.
5. `PATCH /posts/1` echoes the updated title.
6. `DELETE /posts/1` is treated as simulated; a follow-up GET still returns the original post.
7. `GET /posts/999` returns 404.

## Intentionally excluded scenarios

- `problem_user`, `error_user`, `visual_user`, and `performance_glitch_user` behavior.
- Checkout field validation, tax math, and multi-item totals.
- Product detail pages, logout, and hamburger menu.
- Visual, accessibility, mobile, and multi-browser coverage.
- JSONPlaceholder albums, photos, todos, and users beyond post relationships.
- Persistence after writes, because JSONPlaceholder fakes mutations.

## Risks

- SauceDemo and JSONPlaceholder are shared public services and can be slow or unavailable.
- SauceDemo special users have known broken behavior; using them would make happy-path tests flaky.
- Catalog and seed data can change without notice.
- Two products share the same price ($15.99), so price-sort tests must not assume a unique name order for ties.

## Assumptions

- `standard_user` / `secret_sauce` remains a working demo account published on the login page.
- SauceDemo continues to expose `data-test` attributes.
- JSONPlaceholder continues to return 100 posts, simulate writes, and return 404 for missing posts.
- Chromium is sufficient for this assessment.

## Test data approach

- Web credentials live in `test-data/users.ts` and are documented as public demo data.
- Product names and prices live in `test-data/products.ts`.
- Checkout customer data is obvious fixture data, not production PII.
- API payloads in `test-data/api.ts` make intent visible (`Assessment post`, `Assessment title update`).

## Locator strategy

1. Playwright `getByTestId` after setting `testIdAttribute` to `data-test`.
2. URL and visible business text for outcomes (page title, cart badge, confirmation).
3. No XPath, no `nth-child` CSS, and no `waitForTimeout`.

Page objects exist only for repeated user workflows. Tests still make the business assertion.

## API validation approach

Each API test checks more than the status code:

- Status
- JSON content type
- Body shape and field types
- Known IDs and relationship filters
- Request-to-response field consistency for POST/PATCH

Write tests assert the immediate response only. A DELETE test then re-GETs the same resource to document that the mutation was not persisted.

## Reliability considerations

- Each test starts from a clean browser context or a dedicated API request context.
- Logged-in UI tests share a fixture that logs in as `standard_user`; they do not depend on another test's cart state.
- Playwright auto-waiting is used instead of sleeps.
- Local runs have 0 retries so flakes are visible. CI retries twice because the targets are public.
- CI uses 2 workers to limit load on SauceDemo.
- Traces are collected on first retry; screenshots are collected on failure. Video is off.

## CI approach

`.github/workflows/tests.yml` runs on push and pull request:

1. Node 22
2. `npm ci`
3. Playwright Chromium with OS dependencies
4. `npm run typecheck`
5. `npm test`
6. Upload the HTML report

## What would be expanded with more time

- Cross-browser and viewport coverage
- Accessibility checks on login and checkout
- Checkout validation and order-total assertions
- JSON schema / contract tests
- A local JSON Server if persistence testing were required
- Test management or richer reporting integration
