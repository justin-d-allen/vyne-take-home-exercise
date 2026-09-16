import { test } from "../../fixtures/auth.fixture";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { customer } from "../../test-data/checkout";
import { backpack } from "../../test-data/products";

test.describe("SauceDemo checkout", () => {
  test("completes a single-item checkout", async ({ page, inventoryPage }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart(backpack.name);
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.checkout();

    await checkoutPage.expectInformationStep();
    await checkoutPage.fillCustomer(customer);
    await checkoutPage.expectOverviewContains(backpack.name);
    await checkoutPage.finish();
    await checkoutPage.expectComplete();
  });
});
