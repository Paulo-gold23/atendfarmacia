/**
 * debug_drogasil_stealth.js — Descobre API do Drogasil com bypass anti-bot
 */
const { chromium } = require('playwright-extra');
const StealthPlugin = require('playwright-extra-plugin-stealth');
chromium.use(StealthPlugin());

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'pt-BR',
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8',
    },
  });

  const page = await context.newPage();
  const captured = [];

  page.on('response', async (response) => {
    const url = response.url();
    const ct  = response.headers()['content-type'] || '';
    if (/\.(js|css|png|jpg|jpeg|gif|svg|woff|ico|webp|ttf)(\?|$)/i.test(url)) return;

    if (ct.includes('json')) {
      try {
        const body = await response.text();
        if (body.length < 20) return;
        const preview = body.substring(0, 600).replace(/\s+/g, ' ');
        captured.push({ url, preview });
        console.log(`\n[JSON] ${url}`);
        console.log(`  >> ${preview}`);
      } catch (_) {}
    }
  });

  console.log('Abrindo Drogasil busca...');
  try {
    await page.goto('https://www.drogasil.com.br/search?q=dorflex', {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForTimeout(8000);
  } catch(e) {
    console.log('Erro na navegação:', e.message.substring(0, 100));
  }

  console.log('\nTítulo:', await page.title());
  console.log('URL final:', page.url());

  // Tenta também via GraphQL direto
  console.log('\n\nTestando GraphQL endpoint...');
  const gqlUrl = 'https://www.drogasil.com.br/api/graphql';
  const gqlBody = JSON.stringify({
    query: `{ products(search: "dorflex", pageSize: 5) { items { name sku price { regularPrice { amount { value } } } } } }`
  });

  const gqlResult = await page.evaluate(async (url, body) => {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body
      });
      return { status: r.status, text: (await r.text()).substring(0, 500) };
    } catch(e) { return { error: e.message }; }
  }, gqlUrl, gqlBody);

  console.log('GraphQL result:', JSON.stringify(gqlResult));

  // Tenta via fetch de busca interno que o site usa
  const searchApis = [
    `https://www.drogasil.com.br/search?q=dorflex&format=json`,
    `https://www.drogasil.com.br/api/search?term=dorflex`,
    `https://www.drogasil.com.br/busca/api/search?q=dorflex`,
  ];

  for (const apiUrl of searchApis) {
    const result = await page.evaluate(async (url) => {
      try {
        const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
        return { status: r.status, ct: r.headers.get('content-type'), text: (await r.text()).substring(0, 400) };
      } catch(e) { return { error: e.message }; }
    }, apiUrl);
    console.log(`\nFetch ${apiUrl}:`, JSON.stringify(result));
  }

  await browser.close();
  console.log('\n=== Total JSON responses capturadas:', captured.length);
})();
