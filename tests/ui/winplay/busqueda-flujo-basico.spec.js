const { test, expect } = require("@playwright/test");
require("dotenv").config();

test.describe("Búsqueda Winplay - flujo básico", () => {
  test("Hace clic en el botón de búsqueda (lupa)", async ({ page }) => {
    // Ir a la página principal y cerrar cookies si aparece
    await page.goto("https://winplay.co/");
    // Función robusta para cerrar banner de cookies
    const cerrarCookies = async () => {
      const cookiesBtn = page.locator('button:has-text("Aceptar cookies")');
      const cookiesBtn2 = page.locator('button:has-text("Aceptar")');
      const cookiesBtn3 = page.locator('button:has-text("ACEPTAR")');
      if (await cookiesBtn.isVisible()) {
        await cookiesBtn.click();
      } else if (await cookiesBtn2.isVisible()) {
        await cookiesBtn2.click();
      } else if (await cookiesBtn3.isVisible()) {
        await cookiesBtn3.click();
      }
    };
    await cerrarCookies();

    // Ir directamente a la página de login
    await page.goto("https://winplay.co/login");
    await cerrarCookies();
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
    // Esperar a que cargue la barra de navegación
    await expect(page.locator("nav")).toBeVisible();

    // Intentar cerrar cookies antes de interactuar con la búsqueda
    await cerrarCookies();
    // Buscar el botón de búsqueda por role="button" y que contenga un svg con data-icon="search"
    const searchBtn = page.locator(
      'li[role="button"]:has(svg[data-icon="search"])'
    );
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // Esperar y validar la aparición del input dentro de la clase específica
    const searchInput = page.locator("div.sc-bYoCmx.iazfkw input");
    await expect(searchInput).toBeVisible();
    // Validar que el input está vacío
    await expect(searchInput).toHaveValue("");

    // Escribir "santa fe" en el input de búsqueda
    await searchInput.fill("santa fe");

    // Esperar a que aparezcan resultados relacionados
    // (Ajusta el selector según cómo se muestren los resultados)
    const result = page.locator('div:has-text("santa fe")');
    await expect(result).toBeVisible({ timeout: 5000 });

    // Validar que aparece el título de resultados de búsqueda
    const resultadosTitulo = page.locator("h2.title", {
      hasText: "Resultados de búsqueda",
    });
    await expect(resultadosTitulo).toBeVisible({ timeout: 5000 });

    // Validar que hay al menos un resultado cuyo título contenga "santa fe"
    const resultados = page.locator(
      "section.sc-eicnZh.dnzlpv.content-grid-with-modal h5.title"
    );
    // Esperar que haya al menos uno visible
    await expect(resultados.first()).toBeVisible({ timeout: 5000 });
    // Validar que al menos uno contiene "santa fe" (case-insensitive)
    const count = await resultados.count();
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await resultados.nth(i).innerText();
      if (text.toLowerCase().includes("santa fe")) {
        found = true;
        break;
      }
    }
    expect(found).toBeTruthy();
  });
});
