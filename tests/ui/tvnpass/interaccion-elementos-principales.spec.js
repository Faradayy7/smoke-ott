// tests/ui/tvnpass/interaccion-elementos-principales.spec.js
// Playwright test: Interacción con todos los elementos clave de https://tvnpass.com/

const { test, expect } = require("@playwright/test");

test.describe("TVN Pass - Interacción con elementos clave", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://tvnpass.com/");
    // Espera a que el banner de cookies sea visible y ciérralo si aparece
    const cookiesDiv = page.locator("div.cookies-container");
    if (await cookiesDiv.isVisible({ timeout: 4000 }).catch(() => false)) {
      const aceptarCookies = cookiesDiv.locator("button.action-button", {
        hasText: "Aceptar cookies",
      });
      if (
        await aceptarCookies.isVisible({ timeout: 2000 }).catch(() => false)
      ) {
        await aceptarCookies.click();
      } else {
        // Alternativamente, intenta rechazar si el botón de aceptar no está
        const rechazarCookies = cookiesDiv.locator("button.action-button", {
          hasText: "Rechazar cookies",
        });
        if (
          await rechazarCookies.isVisible({ timeout: 2000 }).catch(() => false)
        ) {
          await rechazarCookies.click();
        }
      }
    }
  });

  test("Menú principal navega correctamente", async ({ page }) => {
    await page.getByRole("button", { name: "Inicio" }).click();
    await expect(page).toHaveURL(/tvnpass\.com\/?$/);
    await page.getByRole("button", { name: "Radios" }).click();
    await expect(page).toHaveURL(/radios/);
    await page.getByRole("button", { name: "On Demand" }).click();
    await expect(page).toHaveURL(/discover/);
    await page.getByRole("button", { name: "Programación" }).click();
    await expect(page).toHaveURL(/epg/);
    await page.getByRole("button", { name: "TVN en Vivo" }).click();
    await expect(page).toHaveURL(/en-vivo/);
    await page.getByRole("button", { name: "Torneos" }).click();
    await expect(page).toHaveURL(/torneos/);
    await page.getByRole("button", { name: "Calendario" }).click();
    await expect(page).toHaveURL(/calendario/);
  });

  test("Banner de apps - enlaces funcionan", async ({ page, context }) => {
    const appLinks = [
      { name: "Google Play", href: "play.google.com" },
      { name: "AppStore", href: "apps.apple.com" },
      { name: "Samsung Store", href: "samsung.com" },
      { name: "Lg Store", href: "lgappstv.com" },
      { name: "Android TV", href: "play.google.com" },
    ];
    for (const { name, href } of appLinks) {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.locator(`a:has-text("${name}")`).first().click(),
      ]);
      await expect(newPage.url()).toContain(href);
      await newPage.close();
    }
  });

  test("Footer - enlaces funcionan", async ({ page, context }) => {
    const footerLinks = [
      { name: "Facebook", href: "facebook.com" },
      { name: "Instagram", href: "instagram.com" },
      { name: "Términos de Uso", href: "/terms" },
      { name: "Política de privacidad", href: "/privacy" },
      { name: "Centro de ayuda", href: "freshdesk.com" },
    ];
    for (const { name, href } of footerLinks) {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.locator(`a:has-text("${name}")`).first().click(),
      ]);
      await expect(newPage.url()).toContain(href.replace("/", ""));
      await newPage.close();
    }
  });

  test("Logo TVN Pass redirige a home", async ({ page }) => {
    await page.locator('a[href="/"] img').first().click();
    await expect(page).toHaveURL("https://tvnpass.com/");
  });

  test("Carruseles principales funcionan (prev/next)", async ({ page }) => {
    // Espera a que el carrusel principal esté visible
    const carrusel = page.locator(
      'button:has-text("prev"), button:has-text("next")'
    );
    await expect(carrusel.first()).toBeVisible();

    // Captura el primer título visible antes de navegar
    const primerTitulo = await page
      .locator("h1, h2, h3, h4, h5")
      .first()
      .textContent();

    // Click en next
    await page.locator('button:has-text("next")').first().click();
    // Espera a que cambie el contenido
    await page.waitForTimeout(1000);
    const nuevoTitulo = await page
      .locator("h1, h2, h3, h4, h5")
      .first()
      .textContent();
    expect(nuevoTitulo).not.toBe(primerTitulo);

    // Click en prev
    await page.locator('button:has-text("prev")').first().click();
    await page.waitForTimeout(1000);
    const tituloRestaurado = await page
      .locator("h1, h2, h3, h4, h5")
      .first()
      .textContent();
    expect(tituloRestaurado).toBe(primerTitulo);
  });

  test('Botones "Ver más" de secciones principales navegan correctamente', async ({
    page,
  }) => {
    // Selecciona todos los enlaces que contengan "Ver más" o "Ver todo"
    const verMasLinks = await page
      .locator('a:has-text("Ver más"), a:has-text("Ver todo")')
      .all();
    // Guarda las URLs de destino para evitar abrir la misma varias veces
    const visited = new Set();
    for (const link of verMasLinks) {
      const href = await link.getAttribute("href");
      if (!href || visited.has(href)) continue;
      visited.add(href);
      // Abrir en nueva pestaña para no perder el contexto
      const [newPage] = await Promise.all([
        page.context().waitForEvent("page"),
        link.click({ button: "middle" }), // click con botón central
      ]);
      // Espera a que cargue la nueva página
      await newPage.waitForLoadState("domcontentloaded");
      // Valida que la URL corresponde al destino esperado
      expect(newPage.url()).toContain(href.replace(/^[./]+/, ""));
      await newPage.close();
    }
  });
});
