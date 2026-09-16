import { expect, test } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { InventoryPage } from "../../pages/inventory.page";
import {
  lockedOutError,
  lockedOutUser,
  standardUser,
} from "../../test-data/users";

test.describe("SauceDemo login", () => {
  test("logs in a valid user and opens the inventory @smoke", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test("shows a locked-out error and stays on the login page", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.errorMessage).toContainText(lockedOutError);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
