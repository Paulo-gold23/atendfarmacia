/**
 * debug_drogasil.js — Descobre quais URLs a API do Drogasil usa
 * Abre a página de busca e loga TODAS as requisições de rede
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    locale: 'pt-BR',
  });

  const page = await context.newPage();

  // Log de TODAS as respostas de rede
  page.on('response', async (response) => {
    const url    = response.url();
    const status = response.status();
    const ct     = response.headers()['content-type'] || '';

    // Ignora assets estáticos
    if (/\.(js|css|png|jpg|jpeg|gif|svg|woff|ico|webp)(\?|$)/i.test(url)) return;
    if (url.includes('google') || url.includes('hotjar') || url.includes('facebook')) return;

    // Prioriza JSON
    if (ct.includes('json')) {
      try {
        const body = await response.text();
        const preview = body.substring(0, 300).replace(/\s+/g, ' ');
        console.log(`\n[JSON ${status}] ${url}`);
        console.log(`  Preview: ${preview}`);
      } catch (_) {
        console.log(`[JSON ${status}] ${url} (body read error)`);
      }
    } else if (status < 400) {
      console.log(`[${ct.split(';')[0]} ${status}] ${url}`);
    }
  });

  console.log('=== Testando URL de busca: /search?q=dorflex ===');
  await page.goto('https://www.drogasil.com.br/search?q=dorflex', {
    waitUntil: 'networkidle',
    timeout: 40000,
  });

  await page.waitForTimeout(5000);
  console.log('\n=== Página carregada, verificando DOM ===');

  // Verifica se há produtos no DOM
  const domCount = await page.evaluate(() => {
    const selectors = [
      '[data-testid="product-card"]',
      '[class*="ProductCard"]',
      '[class*="product-item"]',
      '[class*="shelf-item"]',
      'article',
      'li[class*="product"]',
    ];
    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      if (els.length > 0) return { selector: sel, count: els.length, sample: els[0]?.textContent?.substring(0, 100) };
    }
    return null;
  });

  console.log('DOM produtos:', domCount);

  // Também verifica o title
  const title = await page.title();
  console.log('Título da página:', title);

  // Tenta extrair o __NEXT_DATA__ (dados SSR)
  const nextData = await page.evaluate(() => {
    const el = document.getElementById('__NEXT_DATA__');
    if (!el) return null;
    try { return JSON.stringify(JSON.parse(el.textContent), null, 2).substring(0, 2000); }
    catch(_) { return el?.textContent?.substring(0, 500); }
  });

  if (nextData) {
    console.log('\n=== __NEXT_DATA__ SSR ===');
    console.log(nextData);
  }

  await browser.close();
})();
