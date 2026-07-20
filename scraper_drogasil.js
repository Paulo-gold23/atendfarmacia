/**
 * scraper_drogasil.js  —  Enriquecedor do medicines_database.js
 * 
 * Usa Playwright para abrir o Drogasil no Chromium headless e interceptar
 * as respostas da API interna (JSON) de cada categoria. Extrai nome, preço,
 * marca, princípio ativo, categoria, receita etc. e gera novos itens no
 * formato exato do medicines_database.js.
 *
 * Uso:
 *   node scraper_drogasil.js
 *
 * Saída:
 *   drogasil_scraped.js  — itens novos prontos para merge
 *   drogasil_merge.js   — medicines_database.js atualizado (backup do original criado)
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

// ─── Configuração ────────────────────────────────────────────────────────────
const HEADLESS        = true;           // false para ver o browser abrindo
const DELAY_MS        = 1800;           // ms entre páginas (evita ban)
const MAX_PAGES       = 5;             // páginas por categoria
const ITEMS_PER_PAGE  = 36;
const OUTPUT_FILE     = path.join(__dirname, 'drogasil_scraped.js');
const MERGED_FILE     = path.join(__dirname, 'drogasil_merged.js');
const DB_FILE         = path.join(__dirname, 'medicines_database.js');

// Categorias a percorrer na Drogasil
const CATEGORIES = [
  { slug: 'analgesicos-e-antipireticos',          label: 'MIP',             needsRecipe: false },
  { slug: 'antigripais-e-descongestionantes',     label: 'MIP',             needsRecipe: false },
  { slug: 'antiacidos-e-digestivos',              label: 'MIP',             needsRecipe: false },
  { slug: 'vitaminas-e-suplementos',              label: 'Suplemento',      needsRecipe: false },
  { slug: 'anti-inflamatorios',                   label: 'MIP',             needsRecipe: false },
  { slug: 'antialergicos',                        label: 'MIP',             needsRecipe: false },
  { slug: 'higiene-pessoal',                      label: 'Higiene',         needsRecipe: false },
  { slug: 'cuidados-com-a-pele',                  label: 'Dermocosmetico',  needsRecipe: false },
  { slug: 'dermocosmeticos',                      label: 'Dermocosmetico',  needsRecipe: false },
  { slug: 'primeiros-socorros',                   label: 'MIP',             needsRecipe: false },
  { slug: 'antifungicos',                         label: 'MIP',             needsRecipe: false },
  { slug: 'dor-e-febre',                          label: 'MIP',             needsRecipe: false },
  { slug: 'pressao-arterial',                     label: 'Tarja Vermelha',  needsRecipe: true  },
  { slug: 'diabetes',                             label: 'Tarja Vermelha',  needsRecipe: true  },
  { slug: 'colesterol',                           label: 'Tarja Vermelha',  needsRecipe: true  },
  { slug: 'bebe-e-crianca',                       label: 'Bebe',            needsRecipe: false },
  { slug: 'cabelos',                              label: 'Cosmetico',       needsRecipe: false },
  { slug: 'saude-sexual',                         label: 'Higiene',         needsRecipe: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function normalizeText(t) {
  return (t || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Gera aliases a partir do nome do produto
function buildAliases(name) {
  const norm = normalizeText(name);
  const aliases = [norm];

  // Remove apresentação entre parênteses: "Dorflex (caixa com 36 cp)" → "dorflex"
  const base = norm.replace(/\s*\(.*?\)\s*/g, '').replace(/\s+\d+(mg|ml|g|mcg|ui|ui\/ml).*$/i, '').trim();
  if (base && base !== norm) aliases.push(base);

  // Nome sem marca (últimas palavras são dosagem)
  const withoutDosage = norm.replace(/\s+\d+(mg|ml|g|mcg|ui)(\s|$)/gi, ' ').trim();
  if (withoutDosage && !aliases.includes(withoutDosage)) aliases.push(withoutDosage);

  return [...new Set(aliases)].filter(a => a.length >= 2);
}

// Detecta se precisa de receita pelo nome/categoria
function detectNeedsRecipe(name, categoryLabel) {
  const n = normalizeText(name);
  if (categoryLabel === 'Tarja Preta') return true;
  if (categoryLabel === 'Antibiótico' || categoryLabel === 'Antibiotico') return true;
  if (categoryLabel === 'Tarja Vermelha') return true;
  if (/antibiotico|amoxicilina|azitromicina|cefalexina/.test(n)) return true;
  return false;
}

// Detecta categoria a partir dos dados
function detectCategory(item, catLabel) {
  if (catLabel) return catLabel;
  const n = normalizeText(item.name || '');
  if (/shampoo|condicion|sabonete|desodor|absorvente|fralda|escova|creme dental/.test(n)) return 'Higiene';
  if (/vitamina|suplemento|omega|colagem|probiotico|whey/.test(n)) return 'Suplemento';
  if (/bebe|infant|pediatr/.test(n)) return 'Bebe';
  return 'MIP';
}

// Converte item da API Drogasil → formato medicines_database.js
function convertItem(item, catMeta) {
  const name = (item.name || '').replace(/\s+/g, ' ').trim();
  if (!name || name.length < 3) return null;

  // Preço
  const price = item.price?.sellingPrice
    || item.priceRange?.sellingPrice?.highValue
    || item.sellers?.[0]?.commertialOffer?.Price
    || null;

  if (!price || price <= 0) return null;

  const category    = detectCategory(item, catMeta?.label);
  const needsRecipe = detectNeedsRecipe(name, category) || catMeta?.needsRecipe || false;
  const isGeneric   = /gen[eé]rico/i.test(name);

  // Fabricante a partir de brand ou specificationGroups
  const manufacturer = item.brand
    || item.specificationGroups?.find(g => g.name === 'Identificação')?.specifications?.find(s => s.originalName === 'Fabricante')?.values?.[0]
    || '';

  // Princípio ativo
  const activeIngredient = item.specificationGroups
    ?.find(g => g.name === 'Informações Técnicas' || g.name === 'Identificação')
    ?.specifications?.find(s => /princ[ií]pio|substância|substancia|ativo/i.test(s.originalName))
    ?.values?.[0]
    || '';

  // Apresentação (caixa/frasco/bisnaga)
  const presentation = item.description?.match(/(caixa|frasco|bisnaga|envelope|ampola|tubo|blister)[^.]{0,60}/i)?.[0]?.trim()
    || name.match(/\([^)]+\)/)?.[0]?.replace(/[()]/g, '')
    || '';

  return {
    name,
    aliases:         buildAliases(name),
    price:           Math.round(price * 100) / 100,
    category,
    needsRecipe,
    allowsDelivery:  !needsRecipe || category !== 'Tarja Preta',
    presentation:    presentation || 'Verificar embalagem',
    unitName:        'unidade',
    activeIngredient,
    manufacturer,
    isGeneric,
    recipeType:      category === 'Antibiótico' ? 'retida' : (needsRecipe ? 'simples' : 'none'),
    tags:            [normalizeText(category)],
    safetyNote:      'Siga a orientação do seu médico ou farmacêutico. Consulte a bula.',
    source:          'drogasil',
  };
}

// ─── Scraper Principal ────────────────────────────────────────────────────────

async function scrapeDrogasil() {
  console.log('🚀 Iniciando scraper Drogasil...');
  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  });

  const allItems    = [];
  const seenNames   = new Set();

  // Intercepta respostas JSON da API interna
  async function interceptCategory(page, catMeta) {
    const captured = [];

    page.on('response', async (response) => {
      const url = response.url();
      // A Drogasil usa a Linx Impulse / GraphQL com essa URL base
      if (!url.includes('search') && !url.includes('product') && !url.includes('catalog')) return;
      const ct = response.headers()['content-type'] || '';
      if (!ct.includes('json')) return;

      try {
        const json = await response.json();
        // Extrai produtos de diferentes formatos de resposta
        const products =
          json?.results?.products ||
          json?.products ||
          json?.data?.products?.items ||
          json?.data?.searchResult?.products ||
          json?.hits ||
          [];

        if (Array.isArray(products) && products.length > 0) {
          products.forEach(p => {
            const converted = convertItem(p, catMeta);
            if (converted && !seenNames.has(normalizeText(converted.name))) {
              seenNames.add(normalizeText(converted.name));
              captured.push(converted);
            }
          });
          if (captured.length > 0) {
            process.stdout.write(` [${captured.length} itens capturados da API]`);
          }
        }
      } catch (_) {}
    });

    return captured;
  }

  for (const cat of CATEGORIES) {
    console.log(`\n📦 Categoria: ${cat.slug}`);

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = `https://www.drogasil.com.br/${cat.slug}?p=${page}&product_list_limit=${ITEMS_PER_PAGE}`;
      process.stdout.write(`  Página ${page}: ${url} ...`);

      const browserPage = await context.newPage();

      // Bloqueia recursos desnecessários para velocidade
      await browserPage.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf,mp4,webp}', r => r.abort());
      await browserPage.route('**/google-analytics**', r => r.abort());
      await browserPage.route('**/hotjar**', r => r.abort());
      await browserPage.route('**/facebook**', r => r.abort());

      const captured = await interceptCategory(browserPage, cat);

      try {
        await browserPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

        // Aguarda produtos carregarem
        await browserPage.waitForTimeout(3000);

        // Tenta extrair do DOM como fallback se não capturou da API
        if (captured.length === 0) {
          const domItems = await browserPage.evaluate(() => {
            const results = [];
            // Seletores comuns de produto na Drogasil
            document.querySelectorAll('[class*="product-item"], [data-testid="product-card"], [class*="ProductCard"]').forEach(el => {
              const name  = el.querySelector('[class*="name"], [class*="title"], h3, h2')?.textContent?.trim();
              const price = el.querySelector('[class*="price"], [class*="Price"]')?.textContent?.trim();
              if (name && price) {
                const priceNum = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
                if (name && priceNum > 0) results.push({ name, price: priceNum });
              }
            });
            return results;
          });

          if (domItems.length > 0) {
            process.stdout.write(` [${domItems.length} itens do DOM]`);
            domItems.forEach(({ name, price }) => {
              if (!seenNames.has(normalizeText(name))) {
                seenNames.add(normalizeText(name));
                captured.push({
                  name,
                  aliases:         buildAliases(name),
                  price,
                  category:        detectCategory({ name }, cat),
                  needsRecipe:     cat.needsRecipe || false,
                  allowsDelivery:  true,
                  presentation:    'Verificar embalagem',
                  unitName:        'unidade',
                  activeIngredient: '',
                  manufacturer:    '',
                  isGeneric:       /gen[eé]rico/i.test(name),
                  recipeType:      'none',
                  tags:            [normalizeText(cat.label)],
                  safetyNote:      'Siga a orientação do seu médico ou farmacêutico. Consulte a bula.',
                  source:          'drogasil-dom',
                });
              }
            });
          }
        }

        if (captured.length > 0) {
          allItems.push(...captured);
        } else {
          process.stdout.write(' [sem produtos — parando categoria]');
          await browserPage.close();
          break;
        }

      } catch (err) {
        process.stdout.write(` [ERRO: ${err.message.substring(0, 60)}]`);
      }

      await browserPage.close();
      await sleep(DELAY_MS);
    }
  }

  await browser.close();
  return allItems;
}

// ─── Merge com medicines_database.js ─────────────────────────────────────────

function mergeDatabases(newItems) {
  console.log('\n\n🔀 Fazendo merge com medicines_database.js...');

  // Carrega banco atual
  delete require.cache[require.resolve(DB_FILE)];
  const existingDB = require(DB_FILE);
  const existingNames = new Set(existingDB.map(i => normalizeText(i.name)));

  // Filtra apenas itens genuinamente novos
  const toAdd = newItems.filter(item => !existingNames.has(normalizeText(item.name)));

  console.log(`  Total existente:  ${existingDB.length} itens`);
  console.log(`  Novos extraídos:  ${newItems.length} itens`);
  console.log(`  Adicionando:      ${toAdd.length} itens novos`);
  console.log(`  Já existiam:      ${newItems.length - toAdd.length} duplicados ignorados`);

  const merged = [...existingDB, ...toAdd];

  // Salva scraped separado
  const scrapedContent = `// Gerado por scraper_drogasil.js em ${new Date().toISOString()}
// ${toAdd.length} produtos novos do catálogo Drogasil
const DROGASIL_SCRAPED = ${JSON.stringify(toAdd, null, 2)};
if (typeof module !== 'undefined') module.exports = DROGASIL_SCRAPED;
`;
  fs.writeFileSync(OUTPUT_FILE, scrapedContent, 'utf8');
  console.log(`\n✅ ${OUTPUT_FILE} salvo (${toAdd.length} novos itens)`);

  // Salva banco mergeado
  // Faz backup do original
  const backupFile = DB_FILE.replace('.js', `_backup_${Date.now()}.js`);
  fs.copyFileSync(DB_FILE, backupFile);
  console.log(`📦 Backup do original: ${backupFile}`);

  const mergedContent = `// medicines_database.js — atualizado com dados Drogasil em ${new Date().toISOString()}
// Original: ${existingDB.length} itens | Adicionados: ${toAdd.length} | Total: ${merged.length}
const MEDICINES_DB = ${JSON.stringify(merged, null, 2)};
if (typeof module !== 'undefined') module.exports = MEDICINES_DB;
`;
  fs.writeFileSync(MERGED_FILE, mergedContent, 'utf8');
  console.log(`✅ ${MERGED_FILE} salvo (${merged.length} itens totais)`);

  return { toAdd, merged };
}

// ─── Execução ─────────────────────────────────────────────────────────────────

(async () => {
  try {
    const scrapedItems = await scrapeDrogasil();

    if (scrapedItems.length === 0) {
      console.log('\n⚠️  Nenhum item capturado. O site pode ter mudado a estrutura.');
      console.log('   Tente rodar com HEADLESS = false para inspecionar manualmente.');
      process.exit(1);
    }

    console.log(`\n🎉 Total de itens únicos extraídos: ${scrapedItems.length}`);
    const { toAdd, merged } = mergeDatabases(scrapedItems);

    console.log('\n─── Resumo final ───────────────────────────────────────────');
    console.log(`  Itens no banco original:    ${merged.length - toAdd.length}`);
    console.log(`  Itens novos do Drogasil:    ${toAdd.length}`);
    console.log(`  Total final:                ${merged.length}`);
    console.log('────────────────────────────────────────────────────────────');
    console.log('\nPróximo passo:');
    console.log('  Verifique o arquivo drogasil_merged.js e, se OK, renomeie para medicines_database.js');
    console.log('  mv drogasil_merged.js medicines_database.js');

  } catch (err) {
    console.error('\n❌ Erro fatal:', err);
    process.exit(1);
  }
})();
