import { test, expect } from "@playwright/test";

test.describe("navegacion-principal", () => {
  test("happy path", async ({ page }) => {
    await page.goto(process.env.BASE_URL || "https://winplay.co/");
    await page.addStyleTag({
      content:
        ".cookies-alert, .cookies-container { display: none !important; }",
    });
    // Navegar por los botones principales
    await page.getByRole("button", { name: "Inicio" }).click();
    await expect(page).toHaveURL(/\/?$/);
    await page.getByRole("button", { name: "Programación" }).click();
    // TODO: validar URL destino de Programación
    await page.getByRole("button", { name: "Videos" }).click();
    // TODO: validar URL destino de Videos
    await page.getByRole("button", { name: "Win Audio" }).click();
    // TODO: validar URL destino de Win Audio
    await page.getByRole("button", { name: "Zona de Pagos" }).click();
    // TODO: validar URL destino de Zona de Pagos

    // ASSERTS:
    // Se espera que los botones sean visibles y navegables
    await expect(page.getByRole("button", { name: "Inicio" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Programación" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Videos" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Win Audio" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Zona de Pagos" })
    ).toBeVisible();

    // SELECTORES:
    // getByRole('button', { name: 'Inicio' })
    // getByRole('button', { name: 'Programación' })
    // getByRole('button', { name: 'Videos' })
    // getByRole('button', { name: 'Win Audio' })
    // getByRole('button', { name: 'Zona de Pagos' })
  });
  // TODO: variantes edge (menú colapsado, sin cookies, etc)
});
