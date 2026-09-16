import { expect, type Locator, type Page } from "@playwright/test";
import { toProductActionId } from "../test-data/products";

export class CartPage {
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId("title");
    this.itemNames = page.getByTestId("inventory-item-name");
    this.itemPrices = page.getByTestId("inventory-item-price");
    this.cartItems = page.getByTestId("inventory-item");
    this.checkoutButton = page.getByTestId("checkout");
  }

  removeButton(productName: string): Locator {
    return this.page.getByTestId(toProductActionId("remove", productName));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html/);
    await expect(this.title).toHaveText("Your Cart");
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
