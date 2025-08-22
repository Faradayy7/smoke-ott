import { test, expect } from "@playwright/test";

// Pruebas de interacción y validación en la página de player de video

test.describe("player-page", () => {
  test.beforeEach(async ({ page }) => {
    // Login previo (asume sesión iniciada o usar flujo de login si es necesario)
    await page.goto("https://winplay.co/");
    await page.addStyleTag({
      content:
        ".cookies-alert, .cookies-container { display: none !important; }",
    });
    // Click en el primer botón "Ver ahora" visible
    const verAhora = page.getByRole("button", { name: /Ver ahora/i });
    await expect(verAhora.first()).toBeVisible();
    await verAhora.first().click();
    // Esperar que cargue el player
    await expect(page).toHaveURL(/\/watch\/media\//);
  });

  test("menú principal navega correctamente", async ({ page }) => {
    await page.getByRole("button", { name: "Inicio" }).click();
    await expect(page).toHaveURL("https://winplay.co/");
    await page.goBack();
    await page.getByRole("button", { name: "Programación" }).click();
    await expect(page).toHaveURL(/\/programacion/);
    await page.goBack();
    await page.getByRole("button", { name: "Videos" }).click();
    await expect(page).toHaveURL(/\/videos/);
    await page.goBack();
    await page.getByRole("button", { name: "Win Audio" }).click();
    await expect(page).toHaveURL(/\/audio/);
    await page.goBack();
    await page.getByRole("button", { name: "Zona de Pagos" }).click();
    await expect(page).toHaveURL(/\/pagos/);
  });

  test("player de video muestra controles y responde", async ({ page }) => {
    // Cambiar al iframe del player
    const playerFrame = page.frameLocator("iframe");
    // Play/Pause
    const pauseBtn = playerFrame.getByRole("button", { name: /Pause|Play/i });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();
    await pauseBtn.click();
    // Adelantar/retroceder
    await playerFrame
      .getByRole("button", { name: /Forward 10 seconds/i })
      .click();
    await playerFrame
      .getByRole("button", { name: /Backward 10 seconds/i })
      .click();
    // Mute/Unmute
    const muteBtn = playerFrame.getByRole("button", { name: /Mute/i });
    await muteBtn.click();
    await muteBtn.click();
    // Pantalla completa
    await playerFrame
      .getByRole("button", { name: /Enter fullscreen/i })
      .click();
    // Validar slider de tiempo y HD
    await expect(playerFrame.getByRole("slider")).toBeVisible();
    await expect(playerFrame.getByText("HD")).toBeVisible();
  });

  test("el título del video es visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
  });

  test("footer y enlaces externos funcionan", async ({ page }) => {
    // Facebook
    const [fb] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: /facebook/i }).click(),
    ]);
    expect(fb.url()).toContain("facebook.com");
    await fb.close();
    // Instagram
    const [ig] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: /instagram/i }).click(),
    ]);
    expect(ig.url()).toContain("instagram.com");
    await ig.close();
    // X
    const [x] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: /x.com|twitter/i }).click(),
    ]);
    expect(x.url()).toContain("x.com");
    await x.close();
    // YouTube
    const [yt] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: /youtube/i }).click(),
    ]);
    expect(yt.url()).toContain("youtube.com");
    await yt.close();
  });

  test("botón de ayuda está visible", async ({ page }) => {
    // Cambiar al iframe de ayuda
    const ayudaFrame = page.frameLocator("iframe");
    await expect(
      ayudaFrame.getByRole("button", { name: /Ayuda/i })
    ).toBeVisible();
  });
});

// SELECTORES CLAVE:
// - Menú: getByRole('button', { name: ... })
// - Player: frameLocator('iframe').getByRole('button', { name: ... })
// - Título: getByRole('heading', { level: 2 })
// - Footer: getByRole('link', { name: ... })
// - Ayuda: frameLocator('iframe').getByRole('button', { name: 'Ayuda' })
