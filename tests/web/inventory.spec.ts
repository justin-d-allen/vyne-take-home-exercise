import { expect, test } from "../../fixtures/auth.fixture";
import { catalog } from "../../test-data/products";

test.describe("SauceDemo inventory", () => {
  test("lists the catalog with matching product names and prices", async ({
    inventoryPage,
  }) => {
    const names = await inventoryPage.names();
    const prices = await inventoryPage.prices();

    expect(names).toHaveLength(catalog.length);
    expect(prices).toHaveLength(catalog.length);
    expect([...names].sort()).toEqual(
      [...catalog.map((item) => item.name)].sort(),
    );

    const priceByName = new Map(catalog.map((item) => [item.name, item.price]));
    for (const [index, name] of names.entries()) {
      expect(prices[index], `price for ${name}`).toBe(priceByName.get(name));
    }
  });

  test("sorts products by price from low to high", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");
    await expect(inventoryPage.sortSelect).toHaveValue("lohi");
    await expect(inventoryPage.itemNames.first()).toHaveText(
      "Sauce Labs Onesie",
    );

    const prices = await inventoryPage.prices();
    const catalogPrices = catalog.map((item) => item.price);

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(prices[0]).toBe(Math.min(...catalogPrices));
    expect(prices[prices.length - 1]).toBe(Math.max(...catalogPrices));
    await expect(inventoryPage.itemNames.last()).toHaveText(
      "Sauce Labs Fleece Jacket",
    );
  });
});
