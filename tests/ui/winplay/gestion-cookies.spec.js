import { test, expect } from "@playwright/test";

test.describe("gestion-cookies", () => {
  test("happy path", async ({ page }) => {
    await page.goto(process.env.BASE_URL || "https://winplay.co/");

    // PASOS:
    // Aceptar cookies
    const aceptarCookies = page.getByRole("button", {
      name: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) {
      await aceptarCookies.click();
      // ASSERTS:
      // El banner de cookies ya no debe estar visible
      await expect(aceptarCookies).not.toBeVisible();
    }
    // TODO: probar rechazar cookies
    // const rechazarCookies = page.getByRole('button', { name: 'Rechazar cookies' });
    // if (await rechazarCookies.isVisible()) {
    //   await rechazarCookies.click();
    //   await expect(rechazarCookies).not.toBeVisible();
    // }

    // SELECTORES:
    // getByRole('button', { name: 'Aceptar cookies' })
    // getByRole('button', { name: 'Rechazar cookies' })
  });
  // TODO: variantes edge (sin cookies, error de red, etc)
});
