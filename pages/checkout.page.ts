import { expect, type Locator, type Page } from "@playwright/test";
import { checkoutCompleteHeader } from "../test-data/checkout";

export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly overviewItemNames: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId("title");
    this.firstName = page.getByTestId("firstName");
    this.lastName = page.getByTestId("lastName");
    this.postalCode = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.finishButton = page.getByTestId("finish");
    this.overviewItemNames = page.getByTestId("inventory-item-name");
    this.completeHeader = page.getByTestId("complete-header");
    this.completeText = page.getByTestId("complete-text");
  }

  async expectInformationStep(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(this.title).toHaveText("Checkout: Your Information");
  }

  async fillCustomer(customer: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async expectOverviewContains(productName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html/);
    await expect(this.title).toHaveText("Checkout: Overview");
    await expect(this.overviewItemNames).toHaveText([productName]);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html/);
    await expect(this.title).toHaveText("Checkout: Complete!");
    await expect(this.completeHeader).toHaveText(checkoutCompleteHeader);
    await expect(this.completeText).toContainText("dispatched");
  }
}
