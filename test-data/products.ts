export type CatalogProduct = {
  name: string;
  price: number;
};

/**
 * SauceDemo catalog as shown to standard_user.
 * Used to assert names and prices without depending on default sort order.
 */
export const catalog: readonly CatalogProduct[] = [
  { name: "Sauce Labs Backpack", price: 29.99 },
  { name: "Sauce Labs Bike Light", price: 9.99 },
  { name: "Sauce Labs Bolt T-Shirt", price: 15.99 },
  { name: "Sauce Labs Fleece Jacket", price: 49.99 },
  { name: "Sauce Labs Onesie", price: 7.99 },
  { name: "Test.allTheThings() T-Shirt (Red)", price: 15.99 },
];

export const backpack = catalog[0];

export function toProductActionId(
  action: "add-to-cart" | "remove",
  productName: string,
): string {
  return `${action}-${productName}`.replace(/\s+/g, "-").toLowerCase();
}

export function parsePrice(text: string): number {
  return Number(text.replace("$", "").trim());
}
