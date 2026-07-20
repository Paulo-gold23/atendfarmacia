/**
 * debug_drogasil_manual.js — Bypass manual do bot detection Drogasil
 * Usa Playwright puro com configurações avançadas de evasão
 */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--lang=pt-BR',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'pt-BR',
    viewport: { width: 1366, height: 768 },
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
    javaScriptEnabled: true,
  });

  // Remove webdriver flag
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    Object.defineProperty(navigator, 'languages', { get: () => ['pt-BR', 'pt', 'en-US'] });
    window.chrome = { runtime: {} };
  });

  const page = await context.newPage();
  const captured = [];

  page.on('response', async (response) => {
    const url = response.url();
    const ct  = response.headers()['content-type'] || '';
    if (/\.(js|css|png|jpg|jpeg|gif|svg|woff|ico|webp|ttf)(\?|$)/i.test(url)) return;
    if (url.includes('google') || url.includes('facebook') || url.includes('hotjar') || url.includes('criteo')) return;

    if (ct.includes('json')) {
      try {
        const body = await response.text();
        if (body.length < 30 || body.startsWith('<!')) return;
        captured.push({ url, body: body.substring(0, 800) });
        console.log(`\n✅ [JSON ${response.status()}] ${url}`);
        console.log(`   ${body.substring(0, 300)}`);
      } catch (_) {}
    }
  });

  console.log('📡 Navegando para Drogasil...\n');
  try {
    await page.goto('https://www.drogasil.com.br/search?q=dorflex', {
      waitUntil: 'networkidle',
      timeout: 45000,
    });
  } catch(e) {
    console.log('Timeout na navegação (normal para networkidle)');
  }

  await page.waitForTimeout(5000);

  const title = await page.title();
  const url   = page.url();
  console.log('\n📄 Título:', title);
  console.log('🔗 URL:', url);

  if (title.includes('Access Denied')) {
    console.log('\n⛔ BLOQUEADO. Tentando abordagem alternativa via fetch interno...');

    // Tenta fetch de dentro do browser (cookies já presentes)
    const apis = [
      'https://www.drogasil.com.br/search?q=dorflex&_q=dorflex&map=ft',
      'https://www.drogasil.com.br/api/io/_v/api/intelligent-search/product_search/ft?query=dorflex&page=1&count=10&sort=score_desc',
      'https://www.drogasil.com.br/search?q=dorflex&map=ft&_q=dorflex',
    ];

    for (const apiUrl of apis) {
      const result = await page.evaluate(async (u) => {
        try {
          const r = await fetch(u, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'include',
          });
          const ct = r.headers.get('content-type') || '';
          const text = await r.text();
          return { status: r.status, ct, text: text.substring(0, 400) };
        } catch(e) { return { error: e.message }; }
      }, apiUrl);
      console.log(`\nFetch ${apiUrl}:`, JSON.stringify(result, null, 2));
    }
  }

  console.log('\n\n=== JSON capturado:', captured.length, 'respostas ===');
  captured.forEach(c => console.log(' -', c.url));

  await browser.close();
})();
