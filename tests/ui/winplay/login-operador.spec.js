import { test, expect } from "@playwright/test";

test.describe("login-operador", () => {
  test("abrir menú de operadores", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    await page.addStyleTag({
      content:
        ".cookies-alert, .cookies-container { display: none !important; }",
    });
    await page
      .locator(
        'button:has-text("Operadores Tigo Colombia Etb Colombia Claro Colombia")'
      )
      .click();
    // TODO: validar que se desplieguen los botones de operadores
    // SELECTOR: button:has-text("Operadores Tigo Colombia Etb Colombia Claro Colombia")
  });
  test("login con Tigo", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    await page.addStyleTag({
      content: ".cookies-alert, .cookies-container { display: none !important; }",
    });
    await page.locator('button:has-text("Tigo Colombia")').click();
    // TODO: validar redirección o modal de Tigo
    // SELECTOR: button:has-text("Tigo Colombia")
  });
  test("login con Etb", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    await page.addStyleTag({
      content: ".cookies-alert, .cookies-container { display: none !important; }",
    });
    await page.locator('button:has-text("Etb Colombia")').click();
    // TODO: validar redirección o modal de Etb
    // SELECTOR: button:has-text("Etb Colombia")
  });
  test("login con Claro", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    await page.addStyleTag({
      content: ".cookies-alert, .cookies-container { display: none !important; }",
    });
    await page.locator('button:has-text("Claro Colombia")').click();
    // TODO: validar redirección o modal de Claro
    // SELECTOR: button:has-text("Claro Colombia")
  });
});
