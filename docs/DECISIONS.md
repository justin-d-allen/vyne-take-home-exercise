# Architecture Decisions

## TypeScript + Playwright for both UI and API

**Decision:** Use one Playwright Test runner, with `APIRequestContext` for HTTP tests.

**Reason:** The assessment needs both a web app and an API. One typed runner avoids a second framework, a second report, and extra glue.

**Trade-off:** API tests follow Playwright's request API instead of a dedicated HTTP client. That is enough for JSONPlaceholder.

## Page objects only for reusable workflows

**Decision:** Keep thin page objects for login, inventory, cart, and checkout. Do not add a BasePage or wrapper around Playwright APIs.

**Reason:** Those four pages are reused. A deeper object model would hide Playwright and add code without adding coverage.

**Trade-off:** Tests import page objects and still write some locator assertions. That is intentional.

## `data-test` via Playwright `getByTestId`

**Decision:** Set `testIdAttribute` to `data-test` and prefer test IDs over CSS, XPath, or `nth-child`.

**Reason:** SauceDemo exposes `data-test` on the controls this suite uses. Those attributes are more stable than layout CSS.

**Trade-off:** If SauceDemo renamed a test id, tests would need a locator update. That is still cheaper than chasing class names.

## Isolated tests instead of one large journey

**Decision:** Split login, inventory, cart, and checkout. Share only a login fixture for tests that start on inventory.

**Reason:** A single end-to-end purchase test would hide whether login, sort, cart, or checkout failed. Isolated tests can run alone.

**Trade-off:** Each logged-in test repeats UI login. That is slower than `storageState`, but clearer for six UI tests.

## Modest suite size

**Decision:** Six UI tests and seven API tests.

**Reason:** The assessment asks for quality and judgment, not volume. The selected cases cover login risk, catalog correctness, cart state, checkout completion, and the main JSONPlaceholder verbs.

**Trade-off:** Checkout validation, tax math, special SauceDemo users, and other JSONPlaceholder resources are untested.

## CI retries, no local retries

**Decision:** `retries: 0` locally and `retries: 2` in CI. CI also uses 2 workers.

**Reason:** Local failures should be visible. Public demo sites can flake in CI. Extra local retries would hide locator or assertion problems.

**Trade-off:** A real SauceDemo outage can still fail CI after retries.

## JSONPlaceholder writes are simulated

**Decision:** Assert POST, PATCH, and DELETE on the immediate response. Re-GET after DELETE only to show the original resource is still there.

**Reason:** The public guide states that writes are faked and not persisted. Treating them like a real API would produce false failures.

**Trade-off:** These tests do not prove a production write path.

## Chromium only, traces and screenshots, no video

**Decision:** Install and run Chromium. Collect traces on first retry and screenshots on failure. Leave video off.

**Reason:** Chromium is enough to demonstrate the framework. Video increases artifact size without much extra signal when traces exist.

**Trade-off:** Browser-specific issues in Firefox or WebKit will not be found.
