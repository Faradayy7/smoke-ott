import { test, expect } from "@playwright/test";

test.describe("ver-contenido-destacado", () => {
  test("happy path", async ({ page }) => {
    await page.goto(process.env.BASE_URL || "https://winplay.co/");

    // PASOS:
    // Aceptar cookies si el banner está presente
    const aceptarCookies = page.getByRole("button", {
      name: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) {
      await aceptarCookies.click();
    }
    // Click en el primer botón "Ver ahora" destacado
    await page
      .getByRole("button", { name: /Ver ahora/i })
      .first()
      .click();

    // ASSERTS:
    // Se espera que la URL cambie o se muestre contenido
    // TODO: validar URL destino o contenido visible tras click
    await expect(page).not.toHaveURL("https://winplay.co/");

    // SELECTORES:
    // getByRole('button', { name: /Ver ahora/i })
  });
  // TODO: variantes edge (sin contenido, error de red, etc)
});
