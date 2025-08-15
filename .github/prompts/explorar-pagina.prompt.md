mode: agent
description: 'Exploración y generación de pruebas Playwright MCP (crea *.spec.js)'
tools: ['changes','codebase','editFiles','fetch','findTestFiles','problems','runCommands','runTasks','runTests','search','searchResults','terminalLastCommand','terminalSelection','testFailure','playwright']
model: 'Claude Sonnet 4'
---

# Exploración + Generación de Pruebas (Playwright)

Objetivo: explorar el sitio y generar pruebas automatizadas listas para ejecutar como archivos `*.spec.ts`.

## Parámetros (editar si aplica)
- baseURL: <https://winplay.co/>
- outDir: tests/ui
- useTypeScript: true
- flowsObjetivo: 3-5 (login, búsqueda, checkout, etc.)
- naming: `FLUJO-kebab-case.spec.ts` (p.ej. `login-basico.spec.ts`)

## Pasos

1) **Acceso**
   - Abre `baseURL` con Playwright MCP (navegador headed si es útil).
   - Si requiere auth, solicita credenciales y realiza login.

2) **Exploración guiada**
   - Identifica 3–5 flujos críticos.
   - Para cada flujo, captura locators **robustos** (prioriza `getByRole`, `getByLabel`, `getByTestId`).
   - Registra: pasos, datos de entrada mínimos y resultado esperado.

3) **Generación de archivos**
   - Crea la carpeta `${outDir}` si no existe.
   - Por cada flujo detectado, crea un archivo: `${outDir}/{nombre-flujo}.spec.${useTypeScript ? 'ts' : 'js'}` usando el **template** de abajo.
   - Inserta al menos **1 caso happy path** por flujo, con aserciones claras (HTTP 200, visibilidad, URL, texto clave).
   - Añade comentarios `// TODO:` para variantes (edge/regresión).

4) **Template de prueba (usar)**
   - Reemplaza `{{NOMBRE_FLUJO}}`, `{{PASOS}}`, `{{ASSERTS}}`, `{{SELECTORES}}`.

```ts
import { test, expect } from '@playwright/test';

test.describe('{{NOMBRE_FLUJO}}', () => {
  test('happy path', async ({ page }) => {
    await page.goto(process.env.BASE_URL || '{{BASE_URL}}');

    // {{PASOS}} – ejemplo:
    // await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    // await page.getByLabel('Email').fill('user@example.com');
    // await page.getByLabel('Contraseña').fill('***');
    // await page.getByRole('button', { name: 'Entrar' }).click();

    // {{ASSERTS}} – ejemplo:
    // await expect(page).toHaveURL(/dashboard/);
    // await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeVisible();

    // {{SELECTORES}} – documenta aquí selectores clave para mantenimiento
    // getByRole('button', { name: 'Entrar' })
  });
});
