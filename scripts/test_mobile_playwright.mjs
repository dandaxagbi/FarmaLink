import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runMobileAudit() {
  console.log('🚀 Iniciando Playwright con Google Chrome en macOS...');
  
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Emulación de iPhone 14 Pro / 15 Pro (393 x 852, DPR 3, touch enabled)
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Escuchar errores de consola
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('🔴 Console error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
    console.log('💥 Page error:', err.message);
  });

  page.on('dialog', async dialog => {
    console.log('🔔 Diálogo nativo detectado:', dialog.message());
    await dialog.accept();
  });

  const targetUrl = 'http://localhost:3000';
  console.log(`🌐 Navegando a ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  // Esperar hidratación completa de React en el cliente
  await page.waitForTimeout(2000);

  // 1. Captura de vista inicial de la receta en mobile
  console.log('📸 Tomando captura 1: Receta Móvil Inicial...');
  await page.screenshot({ path: 'mobile_1_receta_initial.png', fullPage: false });

  // 2. Verificar si hay desbordamiento horizontal en algún elemento
  const overflowElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const overflowing = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2) {
        overflowing.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          right: rect.right,
          docWidth
        });
      }
    });
    return overflowing.slice(0, 10);
  });

  console.log('🔍 Elementos con desbordamiento horizontal:', overflowElements);

  // 3. Probar apertura del selector CIE-11 en mobile
  console.log('🧪 Probando apertura del selector CIE-11...');
  const cie11Field = page.locator('#cie11-field-trigger');
  await cie11Field.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'mobile_2_cie11_modal.png', fullPage: false });

  // Buscar un código o enfermedad
  const cie11Input = page.locator('input[placeholder*="Buscar código"]').first();
  if (await cie11Input.isVisible()) {
    console.log('⌨️ Escribiendo "diabetes" en CIE-11...');
    await cie11Input.fill('diabetes');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'mobile_3_cie11_search.png', fullPage: false });

    // Seleccionar el primer resultado o cerrar
    const primerResultado = page.locator('button:has-text("Diabetes")').first();
    if (await primerResultado.isVisible()) {
      await primerResultado.click();
      console.log('✅ Diagnóstico seleccionado');
    }
  }

  // Asegurar cierre de CIE-11 si sigue abierto
  const cerrarCie11 = page.locator('button[aria-label*="Cerrar buscador"], button:has-text("Cerrar")').first();
  if (await cerrarCie11.isVisible()) {
    await cerrarCie11.click();
    await page.waitForTimeout(400);
  }

  await page.waitForTimeout(500);

  // 3.1 Probar nuevo Control Segmentado de Tratamiento (Hick's Law)
  console.log('🧪 Probando Control Segmentado de Tratamiento...');
  const tabNoFarm = page.locator('#tab-no-farmacologico');
  if (await tabNoFarm.isVisible()) {
    await tabNoFarm.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'mobile_3b_tab_no_farmacologico.png', fullPage: false });
  }

  // 3.2 Probar Quick-Chip de Duración (Fitts's Law)
  console.log('🧪 Probando Quick-Chip de Duración (7d)...');
  const chip7d = page.locator('button:has-text("7 d")').first();
  if (await chip7d.isVisible()) {
    await chip7d.click();
    console.log('✅ Chip 7 días clickeado');
  }

  // 3.3 Probar Apertura de Modal de Envío (Bottom Sheet)
  console.log('🧪 Probando Modal de Envío (Bottom Sheet)...');
  const btnEmitir = page.locator('button:has-text("Emitir y Despachar")').last();
  if (await btnEmitir.isVisible()) {
    await btnEmitir.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'mobile_3c_envio_modal.png', fullPage: false });
    // Cerrar modal
    const closeBtn = page.locator('button[aria-label="Cerrar ventana de envío"], button:has-text("Volver y Editar")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 4. Probar tab de navegación inferior: Pacientes
  console.log('🧪 Probando navegación a pestaña Pacientes...');
  await page.click('#mobile-nav-pacientes');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'mobile_4_pacientes.png', fullPage: false });

  // 5. Probar tab de navegación inferior: Farmacia
  console.log('🧪 Probando navegación a pestaña Farmacia...');
  await page.click('#mobile-nav-farmacia');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'mobile_5_farmacia.png', fullPage: false });

  // 6. Probar tab de navegación inferior: WhatsApp
  console.log('🧪 Probando navegación a pestaña WhatsApp...');
  await page.click('#mobile-nav-whatsapp');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'mobile_6_whatsapp.png', fullPage: false });

  // 7. Probar botón Menú (Sidebar)
  console.log('🧪 Probando botón Menú...');
  await page.click('#mobile-nav-menu');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'mobile_7_sidebar_menu.png', fullPage: false });

  // 8. Volver a Receta seleccionando el item del sidebar (cerrando el menú)
  console.log('🧪 Volviendo a Receta...');
  const closeMenu = page.locator('button[aria-label="Cerrar Menú"]').first();
  if (await closeMenu.isVisible()) {
    await closeMenu.click({ force: true });
    await page.waitForTimeout(400);
  }
  await page.click('#mobile-nav-receta');

  await page.waitForTimeout(600);
  await page.screenshot({ path: 'mobile_8_receta_full.png', fullPage: true });

  console.log('🎉 Auditoría Playwright finalizada con éxito.');
  await browser.close();

  return {
    consoleErrors,
    overflowElements
  };
}

runMobileAudit().then(res => {
  console.log('RESULTADO AUDITORÍA:', JSON.stringify(res, null, 2));
  process.exit(0);
}).catch(err => {
  console.error('Error durante la auditoría:', err);
  process.exit(1);
});
