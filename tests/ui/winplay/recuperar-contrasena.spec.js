import { test, expect } from "@playwright/test";

test.describe("recuperar-contrasena", () => {
  test("flujo de recuperación", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    // Cerrar banner de cookies si está visible (selector robusto)
    const btnAceptarCookies = page.getByRole("button", {
      name: "Aceptar cookies",
    });
    if (await btnAceptarCookies.isVisible()) {
      await btnAceptarCookies.click();
      // Esperar a que el banner desaparezca
      await expect(btnAceptarCookies).toBeHidden();
    }
    await page.locator('a[href="/retrieve-password"]').click();
    await expect(page).toHaveURL(/\/retrieve-password$/);
    // Validar presencia de formulario de recuperación
    const emailInput = page.getByRole("textbox", { name: "Email" });
    await expect(emailInput).toBeVisible();
    // Llenar el email desde variable de entorno
    const email = process.env.LOGIN_USER;
    await emailInput.fill(email);
    // Click en Recuperar Contraseña
    await page.getByRole("button", { name: "Recuperar Contraseña" }).click();
    // Validar mensaje de éxito y elementos de confirmación
    await expect(page.getByRole("heading", { name: "¡Listo!" })).toBeVisible();
    await expect(
      page.getByText(
        "Hemos enviado a tu correo un link para que puedas recuperar tu contraseña"
      )
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Volver al inicio de sesión" })
    ).toBeVisible();
  });
});
