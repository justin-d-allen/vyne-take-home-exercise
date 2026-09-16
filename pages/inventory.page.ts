import { expect, type Locator, type Page } from "@playwright/test";
import { parsePrice, toProductActionId } from "../test-data/products";

export class InventoryPage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly inventoryItems: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId("title");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.sortSelect = page.getByTestId("product-sort-container");
    this.itemNames = page.getByTestId("inventory-item-name");
    this.itemPrices = page.getByTestId("inventory-item-price");
    this.inventoryItems = page.getByTestId("inventory-item");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory\.html/);
    await expect(this.title).toHaveText("Products");
  }

  addToCartButton(productName: string): Locator {
    return this.page.getByTestId(toProductActionId("add-to-cart", productName));
  }

  removeButton(productName: string): Locator {
    return this.page.getByTestId(toProductActionId("remove", productName));
  }

  async addToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(parsePrice);
  }
}
