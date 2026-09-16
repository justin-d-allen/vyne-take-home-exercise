# AI Usage

## 1. AI tool

Cursor Agent / AI-assisted IDE (Cursor Grok 4.6), working in this local workspace.

## 2. How AI was used

The agent used one orchestration prompt to:

- inspect the two public targets
- choose a compact TypeScript + Playwright structure
- generate configuration, page objects, fixtures, and tests
- review the generated suite and apply refinements
- install dependencies, run the documented validation commands, and fix failures
- add CI and assessment documentation

No separate human-written starter framework was imported. Public SauceDemo and JSONPlaceholder documentation were referenced.

## 3. Actual prompts used

Only one user prompt was used: the orchestration prompt that started this session. No later user prompts were added.

The text below is that prompt, lightly formatted for reading. It is not a reconstructed or invented conversation.

### Orchestration prompt

You are acting as a senior QA automation engineer completing a take-home assessment from scratch.

Your job is to create the entire repository, implementation, tests, documentation, validation, and submission-support material autonomously.

Do not ask me implementation questions unless something is literally impossible to determine. Make sensible senior-level engineering decisions yourself.

IMPORTANT:

- This repository must be created from scratch for this assessment.
- Do not clone, copy, fork, or repurpose an existing testing framework.
- Public documentation and package documentation may be referenced.
- Keep the solution appropriate for an approximately 4-hour take-home exercise.
- Prefer a clean, maintainable, production-minded solution over a huge number of tests.
- Do not overengineer.
- Everything written in the documentation must accurately reflect what exists in the repository.
- Never invent test results, files, commands, defects, or implementation details.
- Before finishing, actually run the tests and validation commands and fix failures where reasonably possible.

Assessment: Senior QA Engineer Take-Home Exercise. Create an automated testing framework using AI-assisted development.

Test targets:

- Web: https://www.saucedemo.com/
- API: https://jsonplaceholder.typicode.com/

Objective: Demonstrate how AI was used to design and generate a test automation framework covering both the web application and API.

The candidate is responsible for determining language and tools, framework structure, scenarios, execution, validation, and improvements after reviewing AI-generated output.

Required deliverables:

- repository link
- working automation framework covering both targets
- all prompts used during development
- requirements, notes, documentation, and other inputs used to create/refine the prompts
- evaluation of the AI-generated framework (what worked, what did not, what was changed)
- repository created from scratch
- intended time limit approximately four hours

Technology decision unless a compelling reason appears:

- TypeScript, Node.js, Playwright Test
- Playwright for browser automation and API testing via APIRequestContext
- npm unless the environment already requires another package manager
- Do not add libraries merely to look sophisticated

Working process: complete the work in phases and do not stop after generating files.

- Phase 1: Inspect both targets and write `docs/TEST_STRATEGY.md`.
- Phase 2: Bootstrap a Node/TypeScript/Playwright repository with the listed scripts and sensible Playwright config.
- Phase 3: Build a simple maintainable structure with page objects only where they help. Do not build a huge BasePage, wrappers, or a custom assertion framework.
- Phase 4: About 4–6 meaningful isolated UI tests for login, inventory, sort, cart, and checkout, using robust locators and business assertions.
- Phase 5: About 4–6 JSONPlaceholder API tests. Do not assert that writes persist.
- Phase 6: Second-pass senior review and genuine improvements. Record real findings.
- Phase 7: Install dependencies, install Chromium, run typecheck and the test scripts, and fix implementation failures.
- Phase 8: Add `.github/workflows/tests.yml`.
- Phase 9: Write a reviewer-facing README.
- Phase 10: Write `docs/AI_USAGE.md` with the actual prompts. Do not fabricate prompt history.
- Phase 11: Write `docs/AI_EVALUATION.md` from real findings.
- Phase 12: Write `docs/DECISIONS.md`.
- Phase 13: Write `HANDOFF.md` with factual validation results.
- Phase 14: Repository hygiene for generated artifacts and secrets.
- Phase 15: Fresh git history and, if GitHub CLI is authenticated, publish a new repository named `senior-qa-ai-automation-assessment`.

The prompt also required a final completion report with counts, validation results, documentation files, unresolved issues, and a repository URL or publish commands.

## 4. Logical development phases contained within the orchestration prompt

These are stages inside the single orchestration prompt. They are **not** separate prompts that were sent.

1. Select the stack and a small framework structure.
2. Inspect SauceDemo and JSONPlaceholder and choose scenarios.
3. Bootstrap the Playwright project.
4. Implement web tests.
5. Implement API tests.
6. Review the generated framework.
7. Run tests and debug failures.
8. Add CI.
9. Produce documentation.
10. Evaluate the AI-generated output.

## 5. Inputs / context supplied to AI

- The assessment text in the orchestration prompt
- SauceDemo URL: https://www.saucedemo.com/
- JSONPlaceholder URL: https://jsonplaceholder.typicode.com/
- Repository-from-scratch constraint
- Approximately four-hour constraint
- Required deliverables listed above
- Stack preference: TypeScript, Node.js, Playwright, npm
- Instruction not to invent results or prompt history

Additional public inputs the agent fetched while implementing:

- Live SauceDemo login page: published users, shared password, and `data-test` attributes
- [JSONPlaceholder guide](https://jsonplaceholder.typicode.com/guide/), including the note that writes are faked
- Live `GET /posts/1` and `GET /posts/999` responses
- Public SauceDemo sample-app source for catalog data, routes, and test ids

A browser login into inventory/cart/checkout was blocked in this environment (the browser tool refused to enter the published demo password). Those pages were confirmed later by executed Playwright tests.
