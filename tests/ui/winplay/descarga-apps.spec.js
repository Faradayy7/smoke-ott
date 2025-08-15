import { test, expect } from "@playwright/test";

test.describe("descarga-apps", () => {
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
    // Verificar visibilidad de enlaces a tiendas
    await expect(page.getByRole("link", { name: "Google Play" })).toBeVisible();
    await expect(page.getByRole("link", { name: "AppStore" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Samsung Store" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Lg Store" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Fire TV" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Android TV" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Roku TV" })).toBeVisible();

    // TODO: hacer click y validar redirección en cada enlace

    // SELECTORES:
    // getByRole('link', { name: 'Google Play' })
    // getByRole('link', { name: 'AppStore' })
    // getByRole('link', { name: 'Samsung Store' })
    // getByRole('link', { name: 'Lg Store' })
    // getByRole('link', { name: 'Fire TV' })
    // getByRole('link', { name: 'Android TV' })
    // getByRole('link', { name: 'Roku TV' })
  });
  // TODO: variantes edge (enlace roto, tienda no disponible, etc)
});
