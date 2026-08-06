/**
 * 🧪 AUDITORIA COMPLETA — Sofia Conversational Agent
 * Testa todos os fluxos conversacionais de forma automatizada.
 * Run: node test_audit.js
 */

// ═══════════════════════════════════════════════════════
// 1. MOCK ENVIRONMENT (Browser APIs)
// ═══════════════════════════════════════════════════════
const storage = {};
global.localStorage = {
  getItem: k => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: k => { delete storage[k]; },
};
global.document = {
  title: 'Sofia Test',
  getElementById: () => ({ textContent: '', style: {}, classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } }, addEventListener(){}, innerHTML: '', scrollTop: 0, scrollHeight: 0, value: '', focus(){}, appendChild(){}, querySelectorAll(){ return []; } }),
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => ({ style: {}, classList: { add(){}, remove(){} }, appendChild(){}, addEventListener(){}, innerHTML: '', textContent: '', dataset: {} }),
  body: { appendChild(){} },
};
global.window = { innerHeight: 800, addEventListener(){}, location: { reload(){} } };
global.navigator = { mediaDevices: { getUserMedia: async () => ({}) } };
global.Audio = class { play(){} };
global.AudioContext = class { createOscillator(){ return { connect(){}, start(){}, stop(){}, frequency: { setValueAtTime(){} } }; } createGain(){ return { connect(){}, gain: { setValueAtTime(){}, linearRampToValueAtTime(){} } }; } get destination(){ return {}; } };
global.setTimeout = (fn, ms) => { return 1; }; // Do NOT execute - DOM ops would crash
global.clearTimeout = () => {};
global.setInterval = () => 1;
global.clearInterval = () => {};
global.MutationObserver = class { observe(){} disconnect(){} };
global.MediaRecorder = class { start(){} stop(){} };
global.FileReader = class { readAsDataURL(){} };
global.fetch = async () => ({ ok: true, json: async () => ({}) });
global.Blob = class {};
global.URL = { createObjectURL: () => 'blob:test' };
global.HTMLElement = class {};
global.Event = class {};
global.requestAnimationFrame = (fn) => fn();

// Load medicines database via vm to make MEDICINES_DB global
const fs = require('fs');
const vm = require('vm');
let dbCode = fs.readFileSync('./medicines_database.js', 'utf-8');
dbCode = dbCode.replace(/^const /gm, 'var ');
vm.runInThisContext(dbCode, { filename: 'medicines_database.js' });

// Load app.js
let appCode = fs.readFileSync('./app.js', 'utf-8');
// Remove DOMContentLoaded to prevent init() call which needs real DOM
appCode = appCode.replace(`document.addEventListener('DOMContentLoaded', init);`, '// DOMContentLoaded removed for testing');
// Replace const/let at top level with var so they become global
appCode = appCode.replace(/^const /gm, 'var ');
appCode = appCode.replace(/^let /gm, 'var ');
// Mock scrollTo
global.document.addEventListener = () => {};
// Execute in global context
vm.runInThisContext(appCode, { filename: 'app.js' });

// ═══════════════════════════════════════════════════════
// 2. TEST HARNESS
// ═══════════════════════════════════════════════════════
let passed = 0, failed = 0, warnings = 0;
const failures = [];
const warningsList = [];

function resetConversation() {
  if (typeof resetSimState === 'function') resetSimState();
  state.hasGreeted = false;
  state.messages = [];
  state.botMessageCount = 0;
}

function send(msg) {
  return runSimulation(msg);
}

function sendImage(filename) {
  return _handleImageSimulation(filename);
}

function assert(testName, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✅ ${testName}`);
  } else {
    failed++;
    const msg = `  ❌ ${testName}${details ? ' — ' + details : ''}`;
    console.log(msg);
    failures.push(msg);
  }
}

function warn(testName, condition, details = '') {
  if (!condition) {
    warnings++;
    const msg = `  ⚠️  ${testName}${details ? ' — ' + details : ''}`;
    console.log(msg);
    warningsList.push(msg);
  }
}

function assertContains(testName, response, ...keywords) {
  const lower = (response || '').toLowerCase();
  const found = keywords.every(k => lower.includes(k.toLowerCase()));
  assert(testName, found, found ? '' : `Response: "${(response || '').substring(0, 120)}..." | Missing: ${keywords.filter(k => !lower.includes(k.toLowerCase())).join(', ')}`);
}

function assertNotContains(testName, response, ...keywords) {
  const lower = (response || '').toLowerCase();
  const notFound = keywords.every(k => !lower.includes(k.toLowerCase()));
  assert(testName, notFound, notFound ? '' : `Should NOT contain: ${keywords.filter(k => lower.includes(k.toLowerCase())).join(', ')}`);
}

// ═══════════════════════════════════════════════════════
// 3. TEST SUITES
// ═══════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(60));
console.log('🧪 AUDITORIA COMPLETA — SOFIA CONVERSATIONAL AGENT');
console.log('═'.repeat(60));

// ─── SUITE 1: SAUDAÇÕES ───
console.log('\n📋 SUITE 1: Saudações');
console.log('─'.repeat(40));

resetConversation();
let r = send('oi');
assertContains('Saudação simples "oi"', r, 'sofia');
assert('Saudação simples marca hasGreeted', state.hasGreeted === true);

resetConversation();
r = send('boa tarde');
assertContains('Saudação "boa tarde"', r, 'boa tarde');

resetConversation();
r = send('bom dia');
assertContains('Saudação "bom dia"', r, 'bom dia');

resetConversation();
r = send('ola');
assertContains('Saudação "ola"', r, 'sofia');

resetConversation();
r = send('eai');
assertContains('Saudação "eai"', r, 'sofia');

// Segunda saudação — não repete apresentação
resetConversation();
send('oi');
r = send('oi');
assertNotContains('Segunda saudação não repete "Sou a Sofia"', r, 'sou a sofia');

// ─── SUITE 2: SAUDAÇÃO COM INTENÇÃO ───
console.log('\n📋 SUITE 2: Saudação + Intenção (não repetir)');
console.log('─'.repeat(40));

resetConversation();
r = send('oi sofia preciso de remedio');
assertContains('Greeting+intent: não repete saudação vazia', r, 'me diz');
assertNotContains('Greeting+intent: não pede "em que posso ajudar"', r, 'em que posso te ajudar hoje');

resetConversation();
r = send('ola preciso de ajuda com medicamento');
assertContains('Greeting+intent "ola preciso ajuda"', r, 'me');
assert('Greeting+intent marca hasGreeted', state.hasGreeted === true);

resetConversation();
r = send('oi quero comprar remedio');
assertContains('Greeting+intent "oi quero comprar"', r, 'me');

// ─── SUITE 3: BUSCA POR TEXTO ───
console.log('\n📋 SUITE 3: Busca por texto');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = send('dipirona');
assertContains('Busca "dipirona" retorna resultado', r, 'dipirona');
assertContains('Busca "dipirona" mostra preço', r, 'r$');

resetConversation();
state.hasGreeted = true;
r = send('paracetamol');
assertContains('Busca "paracetamol"', r, 'paracetamol');

resetConversation();
state.hasGreeted = true;
r = send('me fala o que voce vende');
assertNotContains('"me fala o que vende" não é saudação', r, 'sou a sofia');

// ─── SUITE 4: IMAGEM COM MÚLTIPLAS DOSAGENS ───
console.log('\n📋 SUITE 4: Imagem com múltiplas dosagens');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = sendImage('alpraz.jpeg');
assertContains('Imagem alpraz: identifica alprazolam', r, 'alprazolam');
assertContains('Imagem alpraz: mostra múltiplas dosagens', r, '1.', '2.');
assertContains('Imagem alpraz: pergunta dosagem', r, 'dosagem');
assert('Imagem alpraz: estado = waiting_dosage_selection', state.simState === 'waiting_dosage_selection');

// Seleção por número puro
r = send('5');
assertContains('Seleciona opção 5 (Alprazolam 2mg)', r, '2mg');
assert('Após seleção: estado = confirm_add_cart', state.simState === 'confirm_add_cart');

// ─── SUITE 5: SELEÇÃO DE DOSAGEM (variações de input) ───
console.log('\n📋 SUITE 5: Seleção de dosagem (waiting_dosage_selection)');
console.log('─'.repeat(40));

// "de 2"
resetConversation();
state.hasGreeted = true;
sendImage('alpraz.jpeg');
r = send('de 2');
assertContains('"de 2" seleciona 2mg', r, '2mg');

// "2mg"
resetConversation();
state.hasGreeted = true;
sendImage('alpraz.jpeg');
r = send('2mg');
assertContains('"2mg" seleciona 2mg', r, '2mg');

// "0.5mg"
resetConversation();
state.hasGreeted = true;
sendImage('alpraz.jpeg');
r = send('0.5mg');
assertContains('"0.5mg" seleciona 0.5mg', r, '0.5mg', 'frontal');

// "o de 2 mg"
resetConversation();
state.hasGreeted = true;
sendImage('alpraz.jpeg');
r = send('o de 2 mg');
assertContains('"o de 2 mg" seleciona 2mg', r, '2mg');

// Rejeição
resetConversation();
state.hasGreeted = true;
sendImage('alpraz.jpeg');
r = send('nao quero');
assertContains('Rejeição na seleção de dosagem', r, 'sem problemas');
assert('Rejeição volta ao idle', state.simState === 'idle');

// ─── SUITE 6: IMAGEM COM DOSAGEM ÚNICA ───
console.log('\n📋 SUITE 6: Imagem com dosagem única');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = sendImage('bromoprida.png');
assertContains('Imagem bromoprida: identifica', r, 'bromoprida');
assert('Imagem bromoprida: estado = confirm_add_cart', state.simState === 'confirm_add_cart');

// ─── SUITE 7: CONFIRMAÇÃO DE ADIÇÃO AO CARRINHO ───
console.log('\n📋 SUITE 7: Confirmação de adição ao carrinho');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
r = send('sim');
assertContains('Confirma "sim": adiciona ao carrinho', r, 'adicionado');
assert('Carrinho tem 1 item', state.cart.length === 1);
assert('Estado = more_items', state.simState === 'more_items');

// Negação
resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
r = send('nao');
assertContains('Nega "nao"', r, 'sem problemas');
assert('Carrinho vazio após negação', state.cart.length === 0);

// "pode" como confirmação
resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
r = send('pode');
assertContains('"pode" confirma', r, 'adicionado');

// "quero" como confirmação
resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
r = send('quero');
assertContains('"quero" confirma', r, 'adicionado');

// ─── SUITE 8: CORREÇÃO DE DOSAGEM ───
console.log('\n📋 SUITE 8: Correção de dosagem (confirm_add_cart)');
console.log('─'.repeat(40));

// "sim mas outra dosagem"
resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
// Force pendingItem to Frontal 0.5mg for testing dosage correction
const frontalDrug = MEDICINES_DB.find(d => d.name === 'Frontal 0.5mg');
state.pendingItem = { drug: frontalDrug, quantity: 1, finalPrice: frontalDrug.price };
state.lastMentionedProduct = frontalDrug;
state.simState = 'confirm_add_cart';

r = send('sim mas outra dosagem');
assertContains('"sim mas outra dosagem": mostra variantes', r, 'dosagem');
assertNotContains('"sim mas outra dosagem": NÃO adiciona ao carrinho', r, 'adicionado');
assert('Estado = waiting_dosage_selection', state.simState === 'waiting_dosage_selection');

// "é este mas nao nesta dosagem"
resetConversation();
state.pendingItem = { drug: frontalDrug, quantity: 1, finalPrice: frontalDrug.price };
state.lastMentionedProduct = frontalDrug;
state.simState = 'confirm_add_cart';

r = send('é este mas nao nesta dosagem');
assertContains('"é este mas nao nesta dosagem": mostra variantes', r, 'dosagem');
assertNotContains('Não adiciona ao carrinho', r, 'adicionado');

// "sim, mas 2mg" — dose explícita
resetConversation();
state.pendingItem = { drug: frontalDrug, quantity: 1, finalPrice: frontalDrug.price };
state.lastMentionedProduct = frontalDrug;
state.simState = 'confirm_add_cart';

r = send('sim, mas 2mg');
assertContains('"sim, mas 2mg": encontra 2mg', r, '2mg');
assertNotContains('Não adiciona automaticamente, pede confirmação', r, 'adicionado');
assert('Estado permanece confirm_add_cart', state.simState === 'confirm_add_cart');

// "sim, mas com outra dosagem" (variação com "com")
resetConversation();
state.pendingItem = { drug: frontalDrug, quantity: 1, finalPrice: frontalDrug.price };
state.lastMentionedProduct = frontalDrug;
state.simState = 'confirm_add_cart';

r = send('sim , mas com outra dosagem');
assertContains('"sim, mas com outra dosagem": mostra opções', r, 'dosagem');

// ─── SUITE 9: CHOOSE VARIANT (busca por texto com múltiplos resultados) ───
console.log('\n📋 SUITE 9: Seleção de variante (choose_variant)');
console.log('─'.repeat(40));

// Setup: simula state com variantes pendentes
const tadalafila5 = { name: 'Tadalafila 5mg', presentation: 'caixa com 30 comprimidos', price: 29.90, isGeneric: true, aliases: ['tadalafila 5mg'], manufacturer: 'EMS' };
const tadalafila5ems = { name: 'Tadalafila 5mg 30 comprimidos EMS Genérico', presentation: '30 Comprimidos revestidos', price: 12.48, isGeneric: true, aliases: ['tadalafila 5mg ems'], manufacturer: 'EMS' };
const tadalafila20 = { name: 'Tadalafila 20mg 8 comprimidos Legrand Genérico', presentation: '8 Comprimidos revestidos', price: 14.10, isGeneric: true, aliases: ['tadalafila 20mg legrand'], manufacturer: 'Legrand' };

function setupVariants() {
  resetConversation();
  state.pendingVariants = [tadalafila5, tadalafila5ems, tadalafila20];
  state.pendingVariantQty = 1;
  state.simState = 'choose_variant';
}

// "3"
setupVariants();
r = send('3');
assertContains('"3" seleciona opção 3', r, 'tadalafila 20mg');

// "opção 3"
setupVariants();
r = send('opção 3');
assertContains('"opção 3" seleciona opção 3', r, 'tadalafila 20mg');

// "opcao 3"
setupVariants();
r = send('opcao 3');
assertContains('"opcao 3" seleciona opção 3', r, 'tadalafila 20mg');

// "a de 20"
setupVariants();
r = send('a de 20');
assertContains('"a de 20" seleciona 20mg', r, '20mg');

// "de 20"
setupVariants();
r = send('de 20');
assertContains('"de 20" seleciona 20mg', r, '20mg');

// "20mg"
setupVariants();
r = send('20mg');
assertContains('"20mg" seleciona 20mg', r, '20mg');

// "primeiro"
setupVariants();
r = send('primeiro');
assertContains('"primeiro" seleciona opção 1', r, 'tadalafila 5mg');

// "o mais barato" / "genérico"
setupVariants();
r = send('o mais barato');
assertContains('"o mais barato" seleciona genérico', r, 'tadalafila');

// "terceira"
setupVariants();
r = send('terceira');
assertContains('"terceira" seleciona opção 3', r, '20mg');

// Rejeição
setupVariants();
r = send('nao quero nenhum');
assertContains('Rejeição sai do choose_variant', r, 'sem problemas');

// ─── SUITE 10: FLUXO COMPLETO DE COMPRA ───
console.log('\n📋 SUITE 10: Fluxo completo de compra');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;

// 1. Busca produto
r = send('dipirona 500mg');
assertContains('Busca dipirona 500mg', r, 'dipirona');

// Se entrou em confirm_add_cart, confirma
if (state.simState === 'confirm_add_cart') {
  r = send('sim');
  assertContains('Confirma dipirona no carrinho', r, 'adicionado');
} else if (state.simState === 'choose_variant') {
  r = send('1');
  // Pode ir direto pra confirm
  if (state.simState === 'confirm_add_cart') {
    r = send('sim');
  }
}

// 2. Adiciona mais
r = send('ibuprofeno');
if (state.simState === 'confirm_add_cart' || state.simState === 'choose_variant') {
  if (state.simState === 'choose_variant') {
    r = send('1');
  }
  if (state.simState === 'confirm_add_cart') {
    r = send('sim');
  }
}

// 3. Finalizar
r = send('finalizar');
assertContains('Finalizar mostra resumo', r, 'subtotal');

// ─── SUITE 11: PERGUNTAS FREQUENTES ───
console.log('\n📋 SUITE 11: Perguntas frequentes');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = send('qual o horario de funcionamento');
assertContains('Horário de funcionamento', r, 'segunda');

resetConversation();
state.hasGreeted = true;
r = send('voces fazem entrega');
assertContains('Pergunta sobre entrega', r, 'delivery');

resetConversation();
state.hasGreeted = true;
r = send('quais formas de pagamento');
assert('Formas de pagamento responde algo', r && r.length > 20);

resetConversation();
state.hasGreeted = true;
r = send('qual o endereço da farmacia');
assert('Endereço responde algo', r && r.length > 20);

// ─── SUITE 12: EDGE CASES ───
console.log('\n📋 SUITE 12: Edge cases');
console.log('─'.repeat(40));

// Mensagem vazia
resetConversation();
r = send('');
assert('Mensagem vazia não quebra', r && r.length > 0);

// Mensagem undefined
resetConversation();
r = send(undefined);
assert('Undefined não quebra', r && r.length > 0);

// Mensagem muito longa
resetConversation();
state.hasGreeted = true;
r = send('a'.repeat(500));
assert('Mensagem longa não quebra', r && r.length > 0);

// Emojis
resetConversation();
state.hasGreeted = true;
r = send('👍');
assert('Emoji não quebra', r && r.length > 0);

// Cancelar pedido
resetConversation();
state.hasGreeted = true;
sendImage('bromoprida.png');
send('sim');
r = send('cancelar pedido');
assert('Cancelar limpa carrinho', r && (r.toLowerCase().includes('cancel') || r.toLowerCase().includes('limpo') || r.toLowerCase().includes('zerado') || state.cart.length === 0));
assert('Carrinho vazio após cancelar', state.cart.length === 0);

// ─── SUITE 13: DESPEDIDAS ───
console.log('\n📋 SUITE 13: Despedidas');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = send('tchau');
assertContains('Despedida "tchau"', r, 'dia');

resetConversation();
state.hasGreeted = true;
r = send('obrigado');
assertContains('Agradecimento', r, 'precisar');

resetConversation();
state.hasGreeted = true;
r = send('valeu');
assertContains('Agradecimento "valeu"', r, 'dia');

// ─── SUITE 14: CONVERSAS NATURAIS ───
console.log('\n📋 SUITE 14: Conversas naturais (fluência)');
console.log('─'.repeat(40));

resetConversation();
r = send('oi tudo bom');
warn('Saudação "oi tudo bom" é natural', !r.includes('não entendi'));

resetConversation();
state.hasGreeted = true;
r = send('fala sofia boa tarde preciso de um remedio');
assertNotContains('"fala sofia boa tarde preciso de remedio" não é saudação vazia', r, 'em que posso te ajudar hoje');

resetConversation();
state.hasGreeted = true;
r = send('voce tem dipirona?');
assertContains('"voce tem dipirona?" busca produto', r, 'dipirona');

// ─── SUITE 15: TRANSFERÊNCIA HUMANA ───
console.log('\n📋 SUITE 15: Transferência humana');
console.log('─'.repeat(40));

resetConversation();
state.hasGreeted = true;
r = send('quero falar com atendente');
assertContains('Transferência para atendente', r, 'atendente');

// ─── SUITE 16: isUserConfirming GUARD ───
console.log('\n📋 SUITE 16: isUserConfirming dosage guard');
console.log('─'.repeat(40));

const guardTests = [
  ['sim mas nao nessa dosagem', false],
  ['sim , mas com outra dosagem', false],
  ['é este mas nao nesta dosagem', false],
  ['dosagem diferente', false],
  ['outra dose', false],
  ['sim', true],
  ['pode', true],
  ['quero', true],
  ['sim quero esse mesmo', true],
  ['pode colocar no carrinho', true],
];

for (const [phrase, expected] of guardTests) {
  const norm = normalizeText(phrase);
  const result = isUserConfirming(norm, phrase);
  assert(`isUserConfirming("${phrase}") = ${expected}`, result === expected, `Got: ${result}`);
}

// ═══════════════════════════════════════════════════════
// 4. RESULTS
// ═══════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(60));
console.log('📊 RESULTADO DA AUDITORIA');
console.log('═'.repeat(60));
console.log(`  ✅ Passou:    ${passed}`);
console.log(`  ❌ Falhou:    ${failed}`);
console.log(`  ⚠️  Warnings: ${warnings}`);
console.log(`  📝 Total:     ${passed + failed}`);
console.log('─'.repeat(60));

if (failures.length > 0) {
  console.log('\n🔴 FALHAS:');
  failures.forEach(f => console.log(f));
}

if (warningsList.length > 0) {
  console.log('\n🟡 WARNINGS:');
  warningsList.forEach(w => console.log(w));
}

const pct = ((passed / (passed + failed)) * 100).toFixed(1);
console.log(`\n${pct >= 90 ? '🟢' : pct >= 70 ? '🟡' : '🔴'} Taxa de aprovação: ${pct}%\n`);

process.exit(failed > 0 ? 1 : 0);
