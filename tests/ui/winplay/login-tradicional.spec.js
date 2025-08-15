import { test, expect } from "@playwright/test";

test.describe("login-tradicional", () => {
  test("happy path", async ({ page }) => {
    await page.goto("https://winplay.co/login");

    // Cerrar banner de cookies si está visible
    const aceptarCookies = page.locator("button.action-button", {
      hasText: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) {
      await aceptarCookies.click();
    }

    // Ingresar usuario y contraseña
    const user = process.env.LOGIN_USER;
    const pass = process.env.LOGIN_PASS;
    if (!user || !pass)
      throw new Error("Faltan variables LOGIN_USER o LOGIN_PASS");
    await page.locator("#username").fill(user);
    await page.locator("#password").fill(pass);

    // Hacer login
    await page.locator('button.action-button[type="submit"]').click();

    // Validar acceso exitoso
    await expect(page).not.toHaveURL(/\/login$/);
    // Esperar a que cargue el home/dashboard
    await page.waitForLoadState("networkidle");

    // Seleccionar un video destacado (primer botón "Ver ahora")
    const verAhora = page.getByRole("button", { name: /Ver ahora/i });
    await expect(verAhora.first()).toBeVisible();
    await verAhora.first().click();

    // Validar que se accede al contenido (la URL cambia o aparece el player)
    await expect(page).not.toHaveURL(/\/login$/);
    // TODO: puedes agregar aquí validaciones de player, título, etc.
    // SELECTORES: #username, #password, button.action-button, button[role="button"][name*="Ver ahora"]
  });
  // TODO: variantes edge (login inválido, usuario bloqueado, etc)
});
