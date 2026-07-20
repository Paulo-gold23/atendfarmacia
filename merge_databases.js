/**
 * merge_databases.js
 * Faz o merge do medicines_database.js com o enrichment
 * e gera um novo medicines_database.js atualizado
 */

const fs   = require('fs');
const path = require('path');

const DB_FILE         = path.join(__dirname, 'medicines_database.js');
const ENRICHMENT_FILE = path.join(__dirname, 'medicines_database_enrichment.js');
const BACKUP_FILE     = DB_FILE.replace('.js', `_backup_${Date.now()}.js`);

// Carrega bancos
const existingDB   = require(DB_FILE);
const enrichmentDB = require(ENRICHMENT_FILE);

function normalizeText(t) {
  return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

const existingNames = new Set(existingDB.map(i => normalizeText(i.name)));

// Filtra apenas novos
const toAdd = enrichmentDB.filter(item => {
  const norm = normalizeText(item.name);
  if (existingNames.has(norm)) return false;
  // Também verifica pelos aliases
  const alreadyByAlias = existingDB.some(e =>
    e.aliases?.some(a => normalizeText(a) === norm)
  );
  return !alreadyByAlias;
});

const merged = [...existingDB, ...toAdd];

// Estatísticas por categoria
const catStats = {};
toAdd.forEach(i => {
  catStats[i.category] = (catStats[i.category] || 0) + 1;
});

console.log('═══════════════════════════════════════════════════');
console.log('        MERGE — medicines_database.js              ');
console.log('═══════════════════════════════════════════════════');
console.log(`  Banco original:    ${existingDB.length} itens`);
console.log(`  Enrichment total:  ${enrichmentDB.length} itens`);
console.log(`  Adicionando:       ${toAdd.length} itens novos`);
console.log(`  Já existiam:       ${enrichmentDB.length - toAdd.length} duplicados ignorados`);
console.log(`  TOTAL FINAL:       ${merged.length} itens`);
console.log('\n  Novos por categoria:');
Object.entries(catStats).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  console.log(`    ${v.toString().padStart(3)} x ${k}`);
});

// Backup e escrita
fs.copyFileSync(DB_FILE, BACKUP_FILE);
console.log(`\n📦 Backup criado: ${path.basename(BACKUP_FILE)}`);

const header = `// medicines_database.js
// Gerado em: ${new Date().toLocaleString('pt-BR')}
// Original: ${existingDB.length} | Adicionados: ${toAdd.length} | Total: ${merged.length}
const MEDICINES_DB = `;

const footer = `;\nif (typeof module !== 'undefined') module.exports = MEDICINES_DB;`;

// Lê o arquivo original para preservar o formato de exportação original
const originalContent = fs.readFileSync(DB_FILE, 'utf8');
const hasVarDecl = originalContent.includes('const MEDICINES_DB') || originalContent.includes('var MEDICINES_DB');

let newContent;
if (hasVarDecl) {
  // Substitui o array mantendo a declaração original
  newContent = originalContent.replace(
    /const MEDICINES_DB\s*=\s*\[[\s\S]*?\];/,
    `const MEDICINES_DB = ${JSON.stringify(merged, null, 2)};`
  );
  if (!newContent.includes(JSON.stringify(merged[0]))) {
    // Fallback: reescreve inteiro
    newContent = header + JSON.stringify(merged, null, 2) + footer;
  }
} else {
  newContent = header + JSON.stringify(merged, null, 2) + footer;
}

fs.writeFileSync(DB_FILE, newContent, 'utf8');

// Copia automaticamente para a versão do frontend (cache bypass)
const DB_V2_FILE = path.join(__dirname, 'medicines_database_v2.js');
const APP_V8_FILE = path.join(__dirname, 'app_v8.js');
fs.copyFileSync(DB_FILE, DB_V2_FILE);
if (fs.existsSync(path.join(__dirname, 'app.js'))) {
  fs.copyFileSync(path.join(__dirname, 'app.js'), APP_V8_FILE);
}

const finalSize = (fs.statSync(DB_FILE).size / 1024).toFixed(1);
console.log(`\n✅ medicines_database.js atualizado! (${finalSize} KB)`);
console.log(`✅ medicines_database_v2.js sincronizado para o frontend!`);
console.log(`✅ app_v8.js sincronizado para o frontend!`);
console.log('\n  Novos itens adicionados:');
toAdd.forEach(i => console.log(`   + ${i.name} — R$ ${i.price.toFixed(2)}`));
console.log('\n═══════════════════════════════════════════════════');
