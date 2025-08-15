import { test, expect } from "@playwright/test";
// 1. Acceso al formulario de registro

test.describe("registro-usuario", () => {
  test("acceso al formulario", async ({ page }) => {
    await page.goto("https://winplay.co/login");
    const aceptarCookies = page.locator("button.action-button", {
      hasText: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) await aceptarCookies.click();
    await page.locator('a[href="/signup"]').click();
    await expect(page).toHaveURL(/\/signup$/);
    // SELECTOR: a[href="/signup"]
    // Esperado: formulario visible
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
  });

  // 2. Validación de campos obligatorios
  test("validación de campos obligatorios", async ({ page }) => {
    await page.goto("https://winplay.co/signup");
    const aceptarCookies = page.locator("button.action-button", {
      hasText: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) await aceptarCookies.click();
    await page.locator('button:has-text("Regístrate")').click();
    // Esperado: mensajes de error en campos requeridos
    // SELECTOR: button:has-text("Regístrate")
    await expect(page.locator("text=obligatorio")).toBeVisible(); // Ajustar texto según validación real
  });

  // 3. Registro exitoso (datos dummy)
  test("registro exitoso", async ({ page }) => {
    await page.goto("https://winplay.co/signup");
    const aceptarCookies = page.locator("button.action-button", {
      hasText: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) await aceptarCookies.click();
    // Completar campos
    await page
      .locator('input[placeholder="Email"]')
      .fill(`test${Date.now()}@mail.com`);
    await page.locator('input[placeholder="Password"]').fill("Test1234!");
    await page.locator('input[placeholder="Nombre"]').fill("TestNombre");
    await page.locator('input[placeholder="Apellido"]').fill("TestApellido");
    await page
      .locator('input[placeholder="Número de Teléfono"]')
      .fill("3001234567");
    await page.locator('input[type="text"]').nth(1).fill("1990-01-01"); // Fecha de nacimiento
    await page
      .locator('input[placeholder="País de Residencia"]')
      .fill("Colombia");
    await page.locator('input[placeholder="Género"]').fill("Otro");
    await page.locator('input[placeholder="Equipo Favorito"]').fill("Ninguno");
    // Checkbox mayor de 18 años (puede requerir ajuste)
    await page.getByText("Declaro que soy mayor de 18 años").click();
    await page.locator('button:has-text("Regístrate")').click();
    // Esperado: redirección o mensaje de éxito
    // TODO: ajustar aserción según resultado real
    await expect(page).not.toHaveURL(/\/signup$/);
  });

  // 4. Registro con email ya registrado
  test("email ya registrado", async ({ page }) => {
    await page.goto("https://winplay.co/signup");
    const aceptarCookies = page.locator("button.action-button", {
      hasText: "Aceptar cookies",
    });
    if (await aceptarCookies.isVisible()) await aceptarCookies.click();
    // Completar campos con email fijo
    await page
      .locator('input[placeholder="Email"]')
      .fill("ya-registrado@mail.com");
    await page.locator('input[placeholder="Password"]').fill("Test1234!");
    await page.locator('input[placeholder="Nombre"]').fill("TestNombre");
    await page.locator('input[placeholder="Apellido"]').fill("TestApellido");
    await page
      .locator('input[placeholder="Número de Teléfono"]')
      .fill("3001234567");
    await page.locator('input[type="text"]').nth(1).fill("1990-01-01");
    await page
      .locator('input[placeholder="País de Residencia"]')
      .fill("Colombia");
    await page.locator('input[placeholder="Género"]').fill("Otro");
    await page.locator('input[placeholder="Equipo Favorito"]').fill("Ninguno");
    await page.getByText("Declaro que soy mayor de 18 años").click();
    await page.locator('button:has-text("Regístrate")').click();
    // Esperado: mensaje de error de email duplicado
    await expect(page.locator("text=ya está registrado")).toBeVisible(); // Ajustar texto según validación real
  });
  // ...fin de archivo...
});
