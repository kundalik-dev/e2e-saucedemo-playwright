import { test, expect } from "@playwright/test";

test.describe("Authentication UI testcases", () => {
  test("should show username, password, login", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act

    // Assert
  });
});
