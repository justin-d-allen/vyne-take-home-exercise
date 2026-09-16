# Senior QA AI Automation Assessment

Playwright UI and API tests for the senior QA take-home exercise. The suite covers the public [SauceDemo](https://www.saucedemo.com/) store and the public [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.

The framework was designed and implemented with AI-assisted development, then reviewed, executed, and refined in this repository.

## Tech stack

- **TypeScript** for typed locators, fixtures, and API payloads
- **Node.js** and **npm**
- **Playwright Test** for both browser automation and HTTP tests via `APIRequestContext`

One runner covers both targets. Playwright already provides assertions, fixtures, traces, screenshots, HTML reports, retries, and parallel execution, so no extra UI or HTTP client libraries were added.

## Project structure

```text
pages/                 Page objects for repeated SauceDemo workflows
fixtures/              Logged-in inventory fixture
test-data/             Users, catalog, checkout, and API fixtures
tests/web/             SauceDemo UI specs
tests/api/             JSONPlaceholder specs
docs/                  Strategy, decisions, and AI usage notes
.github/workflows/     CI
```

## Setup

Requires Node.js 20 or later.

```bash
npm ci
npx playwright install chromium
```

`npm install` also works for a local checkout that does not yet have `node_modules`.

Optional URL overrides are listed in `.env.example`. Playwright reads `WEB_BASE_URL` and `API_BASE_URL` from the environment; a dotenv library is not used.

## Running tests

```bash
npm test
npm run test:web
npm run test:api
npm run test:smoke
npm run test:headed
npm run typecheck
```

`npm run test:headed` runs only the web project.

## Reports

```bash
npm run test:report
```

That opens the Playwright HTML report from the last run. The report is written to `playwright-report/` and is gitignored.

Traces are collected on the first retry. Screenshots are collected on failure. Video is off.

## Automated coverage

### Web — SauceDemo

| Test | What it verifies |
| --- | --- |
| Valid login | `standard_user` reaches `/inventory.html` and sees 6 products |
| Locked-out login | `locked_out_user` stays on login and sees the locked-out error |
| Catalog | Product names and prices match the published catalog |
| Price sort | Low-to-high sort is non-decreasing and starts/ends on the cheapest/most expensive items |
| Cart add and remove | Badge, selected product, price, then an empty cart after remove |
| Checkout | One-item purchase ends on the confirmation page |

### API — JSONPlaceholder

| Test | What it verifies |
| --- | --- |
| GET `/posts` | 100 posts, JSON content type, and post shape |
| GET `/posts/1` | Known seed id, user, and title |
| GET `/posts?userId=1` | Filter keeps the user relationship |
| POST `/posts` | Simulated create returns the payload and `id` 101 |
| PATCH `/posts/1` | Simulated patch echoes the new title |
| DELETE `/posts/1` | Success response, then GET still returns the original post |
| GET `/posts/999` | 404 and an empty JSON object |

## Design decisions

- Page objects cover login, inventory, cart, and checkout workflows only. Tests keep the business assertions.
- Playwright `getByTestId` is used after setting `testIdAttribute` to `data-test`.
- Logged-in UI tests use a fixture instead of one shared end-to-end flow.
- JSONPlaceholder writes are asserted on the immediate response. Follow-up GETs are used only to show that DELETE is not persisted.
- The suite stays small on purpose. Coverage is risk-based, not count-based.

See [docs/DECISIONS.md](docs/DECISIONS.md) and [docs/TEST_STRATEGY.md](docs/TEST_STRATEGY.md).

## Reliability

- Each test uses a fresh browser context or request context.
- Playwright auto-waiting is used instead of `waitForTimeout`.
- Local retries are 0. CI retries twice because the targets are public shared services.
- CI uses 2 workers to limit load on SauceDemo.
- `standard_user` is the only happy-path web user. SauceDemo special users have known broken behavior.

## CI

[`.github/workflows/tests.yml`](.github/workflows/tests.yml) runs on push and pull request: Node 22, `npm ci`, Playwright Chromium, typecheck, then `npm test`. The HTML report is uploaded as an artifact.

## AI-assisted development

- [docs/AI_USAGE.md](docs/AI_USAGE.md) — tool, prompts, and inputs
- [docs/AI_EVALUATION.md](docs/AI_EVALUATION.md) — what worked, what was changed, and limitations

## Limitations / next steps

These are realistic follow-ups, not work that belonged in a four-hour exercise:

- Firefox, WebKit, and mobile viewports
- Accessibility checks on login and checkout
- Checkout validation and order-total math
- JSON schema / contract tests
- Visual regression
- A local JSON Server if persistence testing were required
