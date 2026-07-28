/**
 * process_drogasil_scrap.js
 * 
 * Processa o arquivo raspado docs/drogasil-2026-07-28.json,
 * converte os itens para o formato oficial MEDICINES_DB,
 * atualiza os itens existentes em medicines_database.js,
 * insere novos itens e sincroniza com os arquivos do frontend.
 */

const fs   = require('fs');
const path = require('path');

const SCRAP_FILE  = path.join(__dirname, 'docs', 'drogasil-2026-07-28.json');
const DB_FILE     = path.join(__dirname, 'medicines_database.js');
const DB_V2_FILE  = path.join(__dirname, 'medicines_database_v2.js');
const APP_V8_FILE = path.join(__dirname, 'app_v8.js');
const APP_FILE    = path.join(__dirname, 'app.js');

function normalizeText(t) {
  return (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Gera aliases inteligentes a partir do nome
function buildAliases(name) {
  const norm = normalizeText(name);
  const aliases = new Set([norm]);

  // Nome limpo sem apresentação entre parênteses
  const base = norm.replace(/\s*\(.*?\)\s*/g, '').replace(/\s+\d+(mg|ml|g|mcg|ui|ui\/ml|comprimidos|capsulas).*$/i, '').trim();
  if (base && base.length >= 3) aliases.add(base);

  // Primeira/segunda palavra do nome (ex: "Glifage XR 500mg" -> "glifage", "glifage xr")
  const parts = norm.split(' ');
  if (parts.length > 0 && parts[0].length >= 3) aliases.add(parts[0]);
  if (parts.length > 1 && parts[0].length >= 3 && parts[1].length >= 2) aliases.add(`${parts[0]} ${parts[1]}`);

  return Array.from(aliases).filter(a => a.length >= 2);
}

// Helper para parsear preço brasileiro R$ 1.234,56 -> 1234.56
function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') return null;
  const cleaned = priceStr.replace(/[^\d,.]/g, '');
  if (!cleaned) return null;

  // Se tem ponto e vírgula (ex: 1.234,56)
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const val = parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    return isNaN(val) ? null : val;
  }
  // Se tem apenas vírgula (ex: 12,50)
  if (cleaned.includes(',')) {
    const val = parseFloat(cleaned.replace(',', '.'));
    return isNaN(val) ? null : val;
  }
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

// Categorização e Regras de Receita
function categorizeItem(name, hasRecipeRequiredTag, rawManufacturer) {
  const n = normalizeText(name);

  // 1. Tarja Preta / Controlados
  if (/clonazepam|rivotril|sertralina|quetiapina|pregabalina|zolpidem|alprazolam|frontal|bromazepam|lexotan|diazepam|lorazepam|lorax|stilnox|ritalina|metilfenidato|venvanse|lisdexanfetamina|sibutramina|fenobarbital|gardenal|desvenlafaxina|venlafaxina|bupropiona|escitalopram|citalopram|paroxetina|amitrip|nortrip|risperidona|olanzapina|aripiprazol/i.test(n)) {
    return {
      category: 'Tarja Preta',
      needsRecipe: true,
      recipeType: 'especial',
      allowsDelivery: false
    };
  }

  // 2. Antibiótico (Receita Retida - 2 vias)
  if (/amoxicilina|azitromicina|cefalexina|ciprofloxacino|levofloxacino|claritromicina|clavulanato|doxiciclina|metronidazol|nitrofurantoina|bactrim|sulfametoxazol|zitromax|clavulin|flagyl/i.test(n)) {
    return {
      category: 'Antibiótico',
      needsRecipe: true,
      recipeType: 'retida',
      allowsDelivery: true
    };
  }

  // 3. Higiene Pessoal
  if (/shampoo|condicionador|sabonete|desodorante|absorvente|fralda|escova|creme dental|fio dental|enxaguante|toalha umedecida|higiene/i.test(n)) {
    return {
      category: 'Higiene',
      needsRecipe: false,
      recipeType: 'none',
      allowsDelivery: true
    };
  }

  // 4. Suplementos e Vitaminas
  if (/vitamina|suplemento|omega|colageno|probiotico|whey|creatina|magnesio|calcio|zinco|polivitam|lavitan|centrum|vitasay/i.test(n)) {
    return {
      category: 'Suplemento',
      needsRecipe: false,
      recipeType: 'none',
      allowsDelivery: true
    };
  }

  // 5. Dermocosméticos
  if (/protetor solar|fps\s*\d|hidrata|serum|anti-idade|la roche|vichy|cerave|epidrat|bioderma|nivea|creme facial|agua micelar|dermocosmetico/i.test(n)) {
    return {
      category: 'Dermocosmetico',
      needsRecipe: false,
      recipeType: 'none',
      allowsDelivery: true
    };
  }

  // 6. Bebê
  if (/bebe|bebê|infantil|pediatrico|pediátrico|chupeta|mamadeira|pampers|huggies|bepantol baby/i.test(n)) {
    return {
      category: 'Bebe',
      needsRecipe: false,
      recipeType: 'none',
      allowsDelivery: true
    };
  }

  // 7. Tarja Vermelha (Uso contínuo, anti-hipertensivos, anticoncepcionais, etc.)
  if (hasRecipeRequiredTag || /losartana|atenolol|anlodipino|enalapril|metformina|glifage|glibenclamida|sinvastatina|atorvastatina|puran|levotiroxina|diane|ciclo 21|selene|yasmin|cerazette|microvlar|gestinol|tamisa|elani|qlaira|yaz|nimesulida|meloxicam|cetoprofeno|diclofenaco|miosan|allegra|desalex|omeprazol|pantoprazol|esomeprazol|prednisolona|prednisona|dexametasona|aerolin|berotec|seretide/i.test(n)) {
    return {
      category: 'Tarja Vermelha',
      needsRecipe: true,
      recipeType: 'simples',
      allowsDelivery: true
    };
  }

  // 8. MIP (Venda livre)
  return {
    category: 'MIP',
    needsRecipe: false,
    recipeType: 'none',
    allowsDelivery: true
  };
}

// Tenta extrair princípio ativo do nome
function extractActiveIngredient(name) {
  const n = normalizeText(name);
  if (n.includes('dipirona')) return 'Dipirona Sódica';
  if (n.includes('paracetamol')) return 'Paracetamol';
  if (n.includes('ibuprofeno')) return 'Ibuprofeno';
  if (n.includes('losartana')) return 'Losartana Potássica';
  if (n.includes('metformina') || n.includes('glifage')) return 'Cloridrato de Metformina';
  if (n.includes('nimesulida')) return 'Nimesulida';
  if (n.includes('sertralina')) return 'Cloridrato de Sertralina';
  if (n.includes('pregabalina')) return 'Pregabalina';
  if (n.includes('quetiapina')) return 'Hemifumarato de Quetiapina';
  if (n.includes('clonazepam') || n.includes('rivotril')) return 'Clonazepam';
  if (n.includes('amoxicilina')) return 'Amoxicilina';
  if (n.includes('azitromicina')) return 'Azitromicina';
  if (n.includes('cefalexina')) return 'Cefalexina';
  if (n.includes('omeprazol')) return 'Omeprazol';
  if (n.includes('cloreto de sodio') || n.includes('soro fisiologico')) return 'Cloreto de Sódio 0,9%';
  if (n.includes('nafazolina') || n.includes('neosoro')) return 'Cloridrato de Nafazolina';
  if (n.includes('tirzepatida') || n.includes('mounjaro')) return 'Tirzepatida';

  // Fallback: extrai primeiras 2-3 palavras do nome se for remédio simples
  const words = name.split(' ');
  return words.slice(0, 2).join(' ');
}

// Extrai apresentação
function extractPresentation(name, rawPackage) {
  if (rawPackage && rawPackage.length > 2 && !rawPackage.includes('http')) {
    return rawPackage.trim();
  }
  const match = name.match(/\d+\s*(comprimidos|capsulas|cápsulas|ml|g|mg|unidades|envelopes|adesivos|canetas)[^,)()]*/i);
  if (match) return match[0].trim();
  return 'Conforme embalagem';
}

// Extrai tipo de unidade (caixa, frasco, bisnaga, etc.)
function extractUnitName(name, presentation) {
  const full = `${name} ${presentation}`.toLowerCase();
  if (full.includes('frasco') || full.includes('ml') || full.includes('gotas')) return 'frasco';
  if (full.includes('bisnaga') || full.includes('pomada') || full.includes('creme') || full.includes('gel')) return 'bisnaga';
  if (full.includes('envelope') || full.includes('sachê') || full.includes('sache')) return 'envelope';
  if (full.includes('adesivo')) return 'caixa';
  return 'caixa';
}

// Parse do arquivo raspado da Drogasil
function parseScrapFile() {
  console.log('📂 Lendo arquivo de raspagem Drogasil...');
  const rawData = fs.readFileSync(SCRAP_FILE, 'utf8');
  const items = JSON.parse(rawData);
  console.log(`📊 Total de registros brutos lidos: ${items.length}`);

  const parsedItems = [];
  const seenNames = new Set();

  for (const item of items) {
    // Localiza a chave do título encontrando a chave "href"
    let titleKey = null;
    for (const key of Object.keys(item)) {
      if (key.endsWith(' href') && !key.includes('src')) {
        const baseKey = key.slice(0, -5);
        if (item[baseKey]) {
          titleKey = baseKey;
          break;
        }
      }
    }

    const title = titleKey ? item[titleKey] : null;
    if (!title || typeof title !== 'string' || title.length < 3) continue;

    // Coleta preços
    const prices = [];
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === 'string' && v.includes('R$')) {
        // Ignora ofertas por quantidade tipo "1 por R$ 10,50"
        if (v.toLowerCase().includes('por r$') && !k.startsWith('sc-24575961')) continue;
        const p = parsePrice(v);
        if (p && p > 0 && p < 10000) prices.push(p);
      }
    }

    if (prices.length === 0) continue;

    // Pega o menor valor positivo como preço promocional/venda
    const finalPrice = Math.min(...prices);

    // Verifica tags de receita
    const hasRecipeTag = Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes('receita obrigatória'));

    // Verifica genérico
    const isGeneric = Object.values(item).some(v => typeof v === 'string' && /gen[eé]rico/i.test(v)) || /gen[eé]rico/i.test(title);

    // Fabricante / Marca
    let manufacturer = '';
    for (const v of Object.values(item)) {
      if (typeof v === 'string') {
        if (v.startsWith('Lab. ')) manufacturer = v.replace('Lab. ', '').trim();
        else if (v === 'Needs' || v === 'Eurofarma' || v === 'Medley' || v === 'EMS' || v === 'Sanofi') {
          manufacturer = v;
        }
      }
    }
    if (!manufacturer) {
      if (title.includes('Medley')) manufacturer = 'Medley';
      else if (title.includes('EMS')) manufacturer = 'EMS Genéricos';
      else if (title.includes('Eurofarma')) manufacturer = 'Eurofarma';
      else if (title.includes('Needs')) manufacturer = 'Needs';
      else if (title.includes('Sanofi')) manufacturer = 'Sanofi';
      else manufacturer = 'Laboratório Farma';
    }

    // Apresentação
    let rawPackage = '';
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === 'string' && (v.includes('Comprimido') || v.includes('Cápsula') || v.includes('Solução') || v.includes('ml') || v.includes('un'))) {
        if (!v.includes('R$') && !v.includes('http') && v !== title) {
          rawPackage = v;
          break;
        }
      }
    }
    const presentation = extractPresentation(title, rawPackage);
    const unitName = extractUnitName(title, presentation);
    const catRules = categorizeItem(title, hasRecipeTag, manufacturer);
    const activeIngredient = extractActiveIngredient(title);

    const normTitle = normalizeText(title);
    if (seenNames.has(normTitle)) continue;
    seenNames.add(normTitle);

    const newItem = {
      name: title.trim(),
      aliases: buildAliases(title),
      price: Math.round(finalPrice * 100) / 100,
      category: catRules.category,
      needsRecipe: catRules.needsRecipe,
      allowsDelivery: catRules.allowsDelivery,
      presentation,
      unitName,
      activeIngredient,
      manufacturer,
      isGeneric,
      recipeType: catRules.recipeType,
      tags: [
        normalizeText(catRules.category),
        ...normalizeText(title).split(' ').filter(w => w.length >= 4)
      ],
      safetyNote: 'Siga a orientação do seu médico ou farmacêutico. Consulte a bula.',
      source: 'drogasil_scraped'
    };

    parsedItems.push(newItem);
  }

  console.log(`✅ Registros válidos convertidos: ${parsedItems.length}`);
  return parsedItems;
}

// Executa a mesclagem e atualização da base da Sofia
function executeMerge() {
  const scrapedItems = parseScrapFile();
  const existingDB = require(DB_FILE);

  console.log(`\n📦 Banco de dados atual: ${existingDB.length} itens`);

  const existingMap = new Map();
  existingDB.forEach((item, idx) => {
    existingMap.set(normalizeText(item.name), { item, idx });
  });

  let updatedCount = 0;
  let addedCount = 0;

  const mergedList = [...existingDB];

  for (const newItem of scrapedItems) {
    const normName = normalizeText(newItem.name);
    if (existingMap.has(normName)) {
      // Atualiza existente com preço mais recente e dados novos
      const { idx } = existingMap.get(normName);
      mergedList[idx] = {
        ...mergedList[idx],
        price: newItem.price,
        presentation: newItem.presentation || mergedList[idx].presentation,
        manufacturer: newItem.manufacturer || mergedList[idx].manufacturer,
        isGeneric: newItem.isGeneric ?? mergedList[idx].isGeneric,
        needsRecipe: newItem.needsRecipe ?? mergedList[idx].needsRecipe,
        recipeType: newItem.recipeType || mergedList[idx].recipeType,
        source: 'drogasil_updated'
      };
      updatedCount++;
    } else {
      // Verifica se existe por algum dos aliases
      const matchByAlias = mergedList.find(e => 
        e.aliases?.some(a => normalizeText(a) === normName)
      );

      if (matchByAlias) {
        matchByAlias.price = newItem.price;
        updatedCount++;
      } else {
        mergedList.push(newItem);
        addedCount++;
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('        RESULTADO DO PROCESSAMENTO DROGASIL        ');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Banco Original:     ${existingDB.length} itens`);
  console.log(`  Itens Atualizados:  ${updatedCount}`);
  console.log(`  Novos Adicionados:  ${addedCount}`);
  console.log(`  TOTAL FINAL BANCO:  ${mergedList.length} itens`);
  console.log('═══════════════════════════════════════════════════\n');

  // Backup do arquivo original
  const backupPath = path.join(__dirname, `medicines_database_backup_${Date.now()}.js`);
  fs.copyFileSync(DB_FILE, backupPath);
  console.log(`💾 Backup criado: ${path.basename(backupPath)}`);

  // Monta o novo conteúdo JS
  const fileContent = `// medicines_database.js
// Gerado automaticamente via process_drogasil_scrap.js em: ${new Date().toLocaleString('pt-BR')}
// Original: ${existingDB.length} | Atualizados: ${updatedCount} | Adicionados: ${addedCount} | Total: ${mergedList.length}

const MEDICINES_DB = ${JSON.stringify(mergedList, null, 2)};

if (typeof module !== 'undefined') {
  module.exports = MEDICINES_DB;
}
`;

  fs.writeFileSync(DB_FILE, fileContent, 'utf8');
  console.log(`✅ medicines_database.js atualizado!`);

  // Copia para medicines_database_v2.js
  fs.copyFileSync(DB_FILE, DB_V2_FILE);
  console.log(`✅ medicines_database_v2.js sincronizado!`);

  if (fs.existsSync(APP_FILE)) {
    fs.copyFileSync(APP_FILE, APP_V8_FILE);
    console.log(`✅ app_v8.js sincronizado!`);
  }
}

executeMerge();
