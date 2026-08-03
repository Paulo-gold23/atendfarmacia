/**
 * scraper_easy_automated.js
 * 
 * Scraper autônomo usando Playwright com plugin Stealth.
 * Simula a navegação e a extração do Easy Scraper, gerando
 * o arquivo docs/drogasil-latest.json para processamento automático.
 */

const { chromium } = require('playwright-extra');
const StealthPlugin = require('playwright-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

chromium.use(StealthPlugin());

// Configurações do Scraper
const HEADLESS = true;
const OUTPUT_FILE = path.join(__dirname, 'docs', 'drogasil-latest.json');

// Termos e Categorias para raspagem
const TARGET_SEARCHES = [
  'dorflex',
  'dipirona',
  'glifage',
  'losartana',
  'soro fisiologico',
  'paracetamol',
  'ibuprofeno',
  'omeprazol',
  'amoxicilina',
  'azitromicina',
  'vitamina c',
  'protetor solar',
  'fralda'
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('🚀 Iniciando Scraper Autônomo (Chromium + Stealth)...');

  const browser = await chromium.launch({
    headless: HEADLESS,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1366, height: 768 },
    locale: 'pt-BR',
    extraHTTPHeaders: {
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8'
    }
  });

  const page = await context.newPage();
  const allScrapedProducts = [];

  for (const query of TARGET_SEARCHES) {
    console.log(`\n🔎 Pesquisando por: "${query}"...`);
    const searchUrl = `https://www.drogasil.com.br/search?q=${encodeURIComponent(query)}`;

    try {
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await sleep(2500);

      // Scroll suave para carregar todas as imagens e produtos
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight || totalHeight > 3000) {
              clearInterval(timer);
              resolve();
            }
          }, 150);
        });
      });

      await sleep(1000);

      // Extrai produtos do DOM no formato compatível com o Easy Scraper
      const items = await page.evaluate(() => {
        const results = [];
        const cards = document.querySelectorAll('article, [data-qa=product_card], div[class*="product"], div[class*="Card"]');

        cards.forEach((card) => {
          const text = card.innerText || '';
          if (!text.includes('R$')) return;

          const linkEl = card.querySelector('a[href*=".html"]') || card.querySelector('a');
          const imgEl = card.querySelector('img');

          const href = linkEl ? linkEl.href : '';
          const imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';
          
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
          const title = lines.find(l => !l.includes('R$') && l.length > 8 && !l.includes('Comprar') && !l.includes('opções')) || lines[0] || '';

          if (!title) return;

          const obj = {
            "sc-b98174b6-2 href": href,
            "sc-b98174b6-2": title,
            "sc-7a9aef00-9 src": imgSrc
          };

          let priceCount = 0;
          lines.forEach(line => {
            if (line.includes('R$')) {
              priceCount++;
              const key = priceCount === 1 ? 'sc-24575961-0' : `sc-24575961-0 (${priceCount})`;
              obj[key] = line;
            }
          });

          if (priceCount > 0 && title.length >= 3) {
            results.push(obj);
          }
        });

        return results;
      });

      console.log(`  ✅ Encontrados ${items.length} produtos para "${query}"`);
      allScrapedProducts.push(...items);

    } catch (err) {
      console.error(`  ❌ Erro ao raspar "${query}":`, err.message);
    }

    await sleep(2000);
  }

  await browser.close();

  // Remove duplicados baseado no título
  const uniqueItems = [];
  const seenTitles = new Set();
  for (const item of allScrapedProducts) {
    const title = Object.values(item).find(v => typeof v === 'string' && v.length > 5 && !v.includes('R$') && !v.includes('http'));
    if (title && !seenTitles.has(title)) {
      seenTitles.add(title);
      uniqueItems.push(item);
    }
  }

  console.log(`\n🎉 Raspagem finalizada! Total de produtos únicos extraídos: ${uniqueItems.length}`);

  const docsDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueItems, null, 2), 'utf8');
  console.log(`💾 Salvo em: ${OUTPUT_FILE}`);
})();
