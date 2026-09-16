import { expect, test } from "../../fixtures/auth.fixture";
import { CartPage } from "../../pages/cart.page";
import { backpack } from "../../test-data/products";

test.describe("SauceDemo cart", () => {
  test("adds a product to the cart and can remove it", async ({
    page,
    inventoryPage,
  }) => {
    const cartPage = new CartPage(page);

    await inventoryPage.addToCart(backpack.name);

    await expect(inventoryPage.cartBadge).toHaveText("1");
    await expect(inventoryPage.removeButton(backpack.name)).toBeVisible();

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([backpack.name]);
    await expect(cartPage.itemPrices).toHaveText([`$${backpack.price}`]);

    await cartPage.removeButton(backpack.name).click();
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
