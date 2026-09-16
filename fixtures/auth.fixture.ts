import { test as base } from "@playwright/test";
import { InventoryPage } from "../pages/inventory.page";
import { LoginPage } from "../pages/login.page";
import { standardUser } from "../test-data/users";

type AuthFixtures = {
  inventoryPage: InventoryPage;
};

export const test = base.extend<AuthFixtures>({
  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },
});

export { expect } from "@playwright/test";
