import { test, expect } from "@playwright/test";

test.describe("acceso-detalle-show", () => {
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
    // Click en el primer enlace "Ver más" de un show
    await page
      .getByRole("link", { name: /Ver más/i })
      .first()
      .click();

    // ASSERTS:
    // Se espera que la URL cambie a detalle de show
    await expect(page).toHaveURL(/\/show\//);
    // TODO: validar presencia de título o contenido del show

    // SELECTORES:
    // getByRole('link', { name: /Ver más/i })
  });
  // TODO: variantes edge (show inexistente, error de red, etc)
});
