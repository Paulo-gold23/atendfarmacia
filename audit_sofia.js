/**
 * audit_sofia.js v2 — Auditoria completa da Sofia
 * Usa vm.createContext com localStorage mock e fluxo de estados correto
 */
'use strict';

const fs  = require('fs');
const vm  = require('vm');

// ─────────────────────────────────────────────────────────────────────────────
// SANDBOX
// ─────────────────────────────────────────────────────────────────────────────
const noop   = () => {};
const noopEl = () => ({
  scrollHeight: 999, scrollTop: 0, innerHTML: '', textContent: '',
  value: '', style: {}, offsetWidth: 100,
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  appendChild: noop, addEventListener: noop, setAttribute: noop,
  removeEventListener: noop,
  querySelector: () => null, querySelectorAll: () => [],
});

// localStorage mock
const _ls = {};
const localStorageMock = {
  getItem:    (k)    => _ls[k] ?? null,
  setItem:    (k, v) => { _ls[k] = String(v); },
  removeItem: (k)    => { delete _ls[k]; },
  clear:      ()     => { Object.keys(_ls).forEach(k => delete _ls[k]); },
};

const sandbox = {
  require, console,
  setTimeout:  (fn) => { try { fn(); } catch(_) {} return 0; },
  clearTimeout: noop,
  setInterval:  () => 0,
  clearInterval: noop,
  Promise, JSON, Date, Math,
  Array, Object, String, Number, Boolean, RegExp, Error,
  parseInt, parseFloat, isNaN, decodeURIComponent,

  localStorage: localStorageMock,

  document: {
    title:            'Sofia Farmácia',
    getElementById:   () => noopEl(),
    createElement:    () => noopEl(),
    querySelector:    () => null,
    querySelectorAll: () => [],
    body:             { appendChild: noop },
    addEventListener: (evt, fn) => {
      if (evt === 'DOMContentLoaded') sandbox._dcbs.push(fn);
    },
  },
  window: {
    AudioContext: class {
      createOscillator() { return { connect: noop, start: noop, stop: noop, frequency: { value: 0 } }; }
      createGain()       { return { connect: noop, gain: { setValueAtTime: noop, exponentialRampToValueAtTime: noop } }; }
      resume()           { return Promise.resolve(); }
      get destination()  { return {}; }
      get currentTime()  { return 0; }
      get state()        { return 'running'; }
    },
    webkitAudioContext: undefined,
    requestAnimationFrame: (fn) => { try { fn(); } catch(_) {} },
  },
  requestAnimationFrame: (fn) => { try { fn(); } catch(_) {} },
  navigator: { userAgent: 'Node/Test' },
  location:  { hostname: 'localhost', href: '/', search: '' },
  _dcbs: [],
};

// Carrega medicines_database.js
sandbox.MEDICINES_DB = require('./medicines_database.js');

// Executa app.js no sandbox — wrapping em IIFE para expor 'const' no escopo global do sandbox
const appSrc = fs.readFileSync('./app.js', 'utf8');
// 'const' no topo de um script vm fica no script scope, não no sandbox.
// Solução: transformar top-level const/let em assignments ao globalThis
const wrappedSrc = appSrc
  .replace(/^(const|let)\s+(state|dom|COLLOQUIAL_MAP|CONFIG)\s*=/gm, (m, kw, name) => `globalThis.${name} =`);

vm.createContext(sandbox);
try {
  new vm.Script(wrappedSrc, { filename: 'app.js' }).runInContext(sandbox);
} catch(e) {
  console.error('Erro ao executar app.js:', e.message);
  // Tenta executar sem wrapper como fallback
  try { new vm.Script(appSrc, { filename: 'app.js' }).runInContext(sandbox); } catch(_) {}
}
sandbox._dcbs.forEach(fn => { try { fn(); } catch(_) {} });

// Fallback: se ainda não tiver state, injeta referência manual
if (!sandbox.state) {
  console.warn('⚠️  state não exposto — tentando eval alternativo');
}

const runSim   = sandbox.runSimulation;
const getState = () => sandbox.state;

if (typeof runSim !== 'function') {
  console.error('runSimulation não encontrada no sandbox');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE TESTE
// ─────────────────────────────────────────────────────────────────────────────
let passed = 0, failed = 0;
const failures = [];

function resetState() {
  // Força estado limpo sem chamar resetSimState (que usa DOM)
  if (!sandbox.state) {
    console.error('sandbox.state é undefined — app.js não inicializou corretamente');
    return;
  }
  const s = sandbox.state;
  s.simState            = 'idle';
  s.cart                = [];
  s.pendingItem         = null;
  s.pendingBrand        = null;
  s.pendingGeneric      = null;
  s.pendingItemsList    = [];
  s.cpf                 = null;
  s.discountPercent     = 0;
  s.deliveryMethod      = '';
  s.paymentMethod       = '';
  s.deliveryAddress     = '';
  s.upsellOffered       = false;
  s.pendingUpsell       = null;
  s.pendingCalculation  = null;
  s.pendingActionRawText = '';
  localStorageMock.clear();
  // Força recompile de aliases se necessário
  if ('_compiledAliases' in sandbox) sandbox._compiledAliases = null;
}

function send(msg) {
  try {
    const r = runSim(msg);
    return typeof r === 'string' ? r : String(r ?? '');
  } catch(e) {
    return `__ERR__: ${e.message}`;
  }
}

/** Envia sequência e retorna a última resposta */
function flow(...msgs) {
  let r = '';
  for (const m of msgs) r = send(m);
  return r;
}

function test(label, fn) {
  resetState();
  process.stdout.write(`  ${label} ... `);
  try {
    fn();
    console.log('✅');
    passed++;
  } catch(e) {
    const msg = e.message.replace(/\n/g, ' ').substring(0, 140);
    console.log(`❌  ${msg}`);
    failed++;
    failures.push({ label, msg });
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Falhou');
}
function assertContains(str, sub) {
  if (!str.toLowerCase().includes(sub.toLowerCase()))
    throw new Error(`Esperava "${sub}" em: "${str.substring(0, 120)}"`);
}
function assertNotContains(str, sub) {
  if (str.toLowerCase().includes(sub.toLowerCase()))
    throw new Error(`NÃO deveria conter "${sub}" em: "${str.substring(0, 120)}"`);
}
function assertClean(str) {
  if (str.includes('__ERR__'))   throw new Error(`Runtime error: ${str.substring(0, 140)}`);
  if (str.includes('undefined')) throw new Error(`"undefined" na resposta: ${str.substring(0, 120)}`);
  if (str.includes(' NaN'))      throw new Error(`"NaN" na resposta: ${str.substring(0, 120)}`);
  if (/R\$\s*NaN/.test(str))     throw new Error(`Preço NaN: ${str.substring(0, 120)}`);
}

// Fluxo rápido até o estado desired usando entradas padrão
// Produto: neosaldina (sem siblings/variantes) | Recusa CPF | Confirma
function gotoConfirmAddCart() {
  send('neosaldina');        // idle → waiting_cpf (sem variantes → direto)
  send('não');              // waiting_cpf → confirm_add_cart
}
function gotoMoreItems() {
  gotoConfirmAddCart();
  send('sim');              // confirm_add_cart → more_items
}
function gotoDelivery() {
  gotoMoreItems();
  send('finalizar');        // more_items → waiting_delivery_method
}
function gotoPayment() {
  gotoDelivery();
  send('retirada');         // waiting_delivery_method → waiting_payment
}
function gotoConfirm() {
  gotoPayment();
  send('pix');              // waiting_payment → waiting_confirm
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════');
console.log('       AUDITORIA COMPLETA — SOFIA FARMÁCIA v3.0       ');
console.log(`       ${new Date().toLocaleString('pt-BR')}`);
console.log('══════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════════════════
console.log('📋 BLOCO 1 — Estado Idle (entradas iniciais)');

test('Saudação gera resposta não vazia', () => {
  const r = send('oi');
  assertClean(r);
  assert(r.length > 10, 'Resposta muito curta');
});

test('Dorflex → pergunta CPF', () => {
  const r = send('dorflex');
  assertClean(r);
  assertContains(r, 'cpf');
});

test('Dipirona 500mg localizada', () => {
  const r = send('dipirona 500mg');
  assertClean(r);
  assertContains(r, 'cpf');          // produto encontrado → pergunta CPF
});

test('Busca case-insensitive "NOVALGINA"', () => {
  const r = send('NOVALGINA');
  assertClean(r);
  // Produto encontrado → pergunta CPF ou mostra genérico
  const ok = r.toLowerCase().includes('cpf') || r.toLowerCase().includes('genérico');
  assert(ok, `Resposta: ${r.substring(0, 120)}`);
});

test('Emergência → redireciona SAMU/pronto-socorro', () => {
  const r = send('dor no peito falta de ar');
  assertClean(r);
  assertContains(r, 'pronto-socorro');
});

test('Sintoma com typo "dor musular" → sugere relaxantes musculares', () => {
  const r = send('dor musular?');
  assertClean(r);
  assertContains(r, 'Dorflex');
  assertContains(r, 'Advil');
  assertContains(r, 'dor muscular');
});

test('Atendente humano → handoff', () => {
  const r = send('quero falar com atendente');
  assertClean(r);
  assertContains(r, 'atendente');
});

test('Produto inexistente → mensagem amigável', () => {
  const r = send('xyzabc999impossivel');
  assertClean(r);
  assert(r.length > 5, 'Resposta vazia');
  assertNotContains(r, 'undefined');
});

test('Respostas educadas de encerramento (não obrigado) em idle → resposta de despedida', () => {
  const r = send('nao obrigado');
  assertClean(r);
  assertContains(r, 'De nada');
  assertContains(r, 'dia');
});

test('Despedida "valeu obrigada" em idle → resposta de despedida', () => {
  const r = send('valeu obrigada');
  assertClean(r);
  assertContains(r, 'Sempre que precisar');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 2 — Salonpas / Salompas (produto novo)');

test('Salonpas (grafia correta) encontrado', () => {
  const r = send('salonpas');
  assertClean(r);
  assertContains(r, 'cpf');    // produto encontrado → pede CPF antes do preço
});

test('Salompas (typo) mapeado para Salonpas', () => {
  const r = send('salompas');
  assertClean(r);
  assertContains(r, 'cpf');
});

test('Salonpas → recusa CPF → mostra preço', () => {
  send('salonpas');
  const r = send('não');
  assertClean(r);
  assertContains(r, 'R$');
  assertContains(r, 'Salonpas');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 3 — Fluxo CPF');

test('"não" recusa CPF e exibe preço', () => {
  send('dorflex');
  const r = send('não');
  assertClean(r);
  assertContains(r, 'R$');
});

test('"nao precisa" também recusa CPF', () => {
  send('dorflex');
  const r = send('nao precisa');
  assertClean(r);
  assertContains(r, 'R$');
});

test('CPF válido aplicado com desconto', () => {
  send('dorflex');
  const r = send('12345678901');     // 11 dígitos
  assertClean(r);
  // Deve mencionar desconto ou CPF localizado
  const ok = r.toLowerCase().includes('desconto') || r.toLowerCase().includes('localizado') || r.includes('%');
  assert(ok, `CPF válido não aplicou desconto. Resp: ${r.substring(0, 120)}`);
});

test('CPF inválido (menos de 11 dígitos) → pede novamente', () => {
  send('dorflex');
  const r = send('1234');
  assertClean(r);
  assertContains(r, 'CPF');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 4 — Alternativa genérico');

test('Novalgina → exibe variantes de Dipirona Sódica', () => {
  const r = flow('novalgina', 'não');   // idle → waiting_cpf → choose_variant
  assertClean(r);
  const ok = r.toLowerCase().includes('dipirona') && r.toLowerCase().includes('novalgina');
  assert(ok, `Deveria listar variantes. Resp: ${r.substring(0, 120)}`);
});

test('choose_variant: "1" → seleciona primeira opção (Dipirona Gotas)', () => {
  send('novalgina');
  send('não');       // recusa CPF → mostra variantes
  const r = send('1');    // seleciona primeira variante
  assertClean(r);
  assertContains(r, 'Dipirona Gotas');
  assertContains(r, 'carrinho');
});

test('choose_variant: "novalgina" → seleciona Novalgina 1g', () => {
  send('novalgina');
  send('não');
  const r = send('novalgina');
  assertClean(r);
  assertContains(r, 'Novalgina 1g');
  assertContains(r, 'carrinho');
});

test('choose_variant: "generico" → seleciona variante genérica', () => {
  send('advil');
  send('não');
  const r = send('generico');
  assertClean(r);
  assertContains(r, 'Ibuprofeno');
  assertContains(r, 'carrinho');
});

test('choose_variant: "marca" → seleciona variante de marca', () => {
  send('advil');
  send('não');
  const r = send('marca');
  assertClean(r);
  assertContains(r, 'Advil');
  assertContains(r, 'carrinho');
});

test('choose_variant: "comprimido" → seleciona apresentação comprimido', () => {
  send('dipirona');
  send('não');
  const r = send('comprimido');
  assertClean(r);
  assertContains(r, 'comprimido');
  assertContains(r, 'carrinho');
});

test('choose_variant: "gotas" → seleciona apresentação gotas', () => {
  send('dipirona');
  send('não');
  const r = send('gotas');
  assertClean(r);
  assertContains(r, 'Gotas');
  assertContains(r, 'carrinho');
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 5 — Carrinho e confirmação');

test('"sim" adiciona ao carrinho → more_items', () => {
  gotoConfirmAddCart();
  const r = send('sim');
  assertClean(r);
  const ok = r.toLowerCase().includes('carrinho') || r.toLowerCase().includes('mais') || r.toLowerCase().includes('outro');
  assert(ok, `Resp: ${r.substring(0, 120)}`);
  assert(sandbox.state.cart.length > 0, 'Carrinho vazio após confirmação');
});

test('"pode" também confirma adição ao carrinho', () => {
  gotoConfirmAddCart();
  const r = send('pode');
  assertClean(r);
  assert(sandbox.state.cart.length > 0, 'Carrinho vazio após "pode"');
});

test('more_items: segundo produto buscado sem finalizar', () => {
  gotoMoreItems();
  const r = send('dipirona 500mg');
  assertClean(r);
  // Não deve ir para entrega imediatamente
  assert(sandbox.state.simState !== 'waiting_delivery_method', `Finalizou cedo! Estado: ${sandbox.state.simState}`);
});

test('more_items: "finalizar" vai para entrega', () => {
  gotoMoreItems();
  const r = send('finalizar');
  assertClean(r);
  const ok = r.toLowerCase().includes('entrega') || r.toLowerCase().includes('retirada');
  assert(ok, `Resp: ${r.substring(0, 120)}`);
  assert(sandbox.state.simState === 'waiting_delivery_method', `Estado: ${sandbox.state.simState}`);
});

test('more_items: "pedir mais" NÃO finaliza', () => {
  gotoMoreItems();
  const r = send('quero pedir mais um gelol');
  assertClean(r);
  assert(sandbox.state.simState !== 'waiting_delivery_method', `"pedir mais" ativou finalização indevidamente`);
});

test('Confirmar carrinho com "pode por favor" não avisa sobre "Por favor" no estoque', () => {
  gotoConfirmAddCart();
  const r = send('pode por favor');
  assertClean(r);
  assertNotContains(r, '⚠️ Não encontrei');
  assertNotContains(r, 'Por favor');
});

test('more_items: "ta otimo pode fechar" avança para entrega', () => {
  gotoMoreItems();
  const r = send('ta otimo pode fechar');
  assertClean(r);
  assertContains(r, 'entrega');
  assert(sandbox.state.simState === 'waiting_delivery_method', `Estado: ${sandbox.state.simState}`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 6 — Entrega');

test('"entrega" → pede endereço', () => {
  gotoDelivery();
  const r = send('entrega');
  assertClean(r);
  const ok = r.toLowerCase().includes('endereço') || r.toLowerCase().includes('rua') || r.toLowerCase().includes('cep');
  assert(ok, `Resp: ${r.substring(0, 120)}`);
  assert(sandbox.state.simState === 'waiting_address', `Estado: ${sandbox.state.simState}`);
});

test('"retirada" → pede pagamento', () => {
  gotoDelivery();
  const r = send('retirada');
  assertClean(r);
  const ok = r.toLowerCase().includes('pagamento') || r.toLowerCase().includes('pix') || r.toLowerCase().includes('crédito');
  assert(ok, `Resp: ${r.substring(0, 120)}`);
  assert(sandbox.state.simState === 'waiting_payment', `Estado: ${sandbox.state.simState}`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 7 — Pagamento e confirmação final');

test('"pix" aceito → waiting_confirm', () => {
  gotoPayment();
  const r = send('pix');
  assertClean(r);
  assert(sandbox.state.simState === 'waiting_confirm', `Estado: ${sandbox.state.simState}`);
});

test('"cartão de crédito" aceito', () => {
  gotoPayment();
  const r = send('cartão de crédito');
  assertClean(r);
  assert(sandbox.state.simState === 'waiting_confirm', `Estado: ${sandbox.state.simState}`);
});

test('"confirmar" fecha o pedido', () => {
  gotoConfirm();
  const r = send('confirmar');
  assertClean(r);
  const ok = r.toLowerCase().includes('confirmado') || r.toLowerCase().includes('pedido') || r.toLowerCase().includes('obrigad') || r.toLowerCase().includes('protocolo');
  assert(ok, `Resp: ${r.substring(0, 120)}`);
  // Após confirmação volta pra idle
  assert(sandbox.state.simState === 'idle', `Estado pós-confirmação: ${sandbox.state.simState}`);
});

test('"cancelar" cancela e volta para idle', () => {
  gotoConfirm();
  const r = send('cancelar');
  assertClean(r);
  assert(sandbox.state.simState === 'idle', `Estado após cancelar: ${sandbox.state.simState}`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 8 — Medicamentos controlados');

test('Rivotril (tarja preta) bloqueia delivery ou avisa receita', () => {
  const r = flow('rivotril', 'não');
  assertClean(r);
  const ok = r.toLowerCase().includes('controlad') || r.toLowerCase().includes('receita')
          || r.toLowerCase().includes('presencial') || r.toLowerCase().includes('anvisa')
          || r.toLowerCase().includes('não fazemos');
  assert(ok, `Rivotril não mencionou controle. Resp: ${r.substring(0, 120)}`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 9 — Stress & sanitização');

const stressInputs = [
  '',
  '   ',
  '!@#$%^',
  'select * from users',
  '<script>alert(1)</script>',
  'a'.repeat(300),
  '999999999999999',
  'null',
  'undefined',
  'NaN',
  '000.000.000-00',
];

stressInputs.forEach(inp => {
  test(`Stress "${inp.substring(0, 25).replace(/\s+/g, ' ')}" sem crash`, () => {
    const r = send(inp);
    if (r.includes('__ERR__')) throw new Error(r.substring(0, 140));
    // Verifica NaN/undefined apenas quando o input NÃO é literalmente essas palavras
    if (inp !== 'NaN' && inp !== 'undefined') {
      assertNotContains(r, 'NaN');
      assertNotContains(r, 'undefined');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 10 — Novos produtos enriquecidos');

// Formato: [query, palavra esperada na resposta pós-CPF]
const enrichedProds = [
  ['gelol',            'gelol',      'Gelol Creme'],
  ['bepantol loção',   'bepantol',   'Bepantol'],
  ['vitamina d',       'vitamina',   'Vitamina D3'],
  ['centrum',          'centrum',    'Centrum'],
  ['band aid',         'R$',         'Band-Aid'],
  ['alcool gel',       'R$',         'Álcool Gel'],
  ['sundown',          'R$',         'Sundown'],
  ['canesten',         'canesten',   'Canesten'],
  ['colágeno',         'R$',         'Colágeno'],
  ['hipoglós',         'R$',         'Hipoglós'],
  ['rexona',           'R$',         'Rexona'],
  ['preservativo jontex', 'R$',      'Jontex'],
];

enrichedProds.forEach(([query, expectAfterNao, productName]) => {
  test(`"${query}" (${productName}) encontrado no banco`, () => {
    send(`preciso de ${query}`);         // idle → waiting_cpf (produto encontrado)
    const state1 = sandbox.state.simState;
    assert(state1 === 'waiting_cpf', `Produto não encontrado! Estado: ${state1}. Resposta anterior: deveria estar em waiting_cpf`);
    
    const r = send('não');               // recusa CPF → mostra preço
    assertClean(r);
    const found = r.toLowerCase().includes(expectAfterNao.toLowerCase()) || r.includes('R$');
    assert(found, `Preço não mostrado para "${query}". Resp: ${r.substring(0, 120)}`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 11 — Integridade dos preços no banco');

test('Nenhum item tem preço NaN ou 0', () => {
  const bad = sandbox.MEDICINES_DB.filter(d => !d.price || isNaN(d.price) || d.price <= 0);
  assert(bad.length === 0, `${bad.length} itens com preço inválido: ${bad.map(d => d.name).slice(0,3).join(', ')}`);
});

test('Nenhum item tem name undefined/vazio', () => {
  const bad = sandbox.MEDICINES_DB.filter(d => !d.name || d.name.trim() === '');
  assert(bad.length === 0, `${bad.length} itens sem nome`);
});

test('Nenhum item sem aliases', () => {
  const bad = sandbox.MEDICINES_DB.filter(d => !d.aliases || !Array.isArray(d.aliases) || d.aliases.length === 0);
  assert(bad.length === 0, `${bad.length} itens sem aliases: ${bad.map(d => d.name).slice(0,3).join(', ')}`);
});

test('Total de itens no banco >= 420', () => {
  assert(sandbox.MEDICINES_DB.length >= 420, `Banco tem apenas ${sandbox.MEDICINES_DB.length} itens`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 12 — Quantidades & Numerais por extenso');

test('Numeral escrito "dois neosaldina" define quantidade = 2', () => {
  send('dois neosaldina');
  send('não');     // recusa CPF
  const r = send('sim');  // confirma adição
  assertClean(r);
  const item = sandbox.state.cart[0];
  assert(item && item.quantity === 2, `Quantidade esperada: 2, encontrada: ${item ? item.quantity : 'nenhuma'}`);
});

test('Número solto "3 neosaldina" define quantidade = 3', () => {
  send('3 neosaldina');
  send('não');     // recusa CPF
  const r = send('sim');  // confirma adição
  assertClean(r);
  const item = sandbox.state.cart[0];
  assert(item && item.quantity === 3, `Quantidade esperada: 3, encontrada: ${item ? item.quantity : 'nenhuma'}`);
});

test('Texto sem quantidade "neosaldina" define quantidade = 1', () => {
  send('neosaldina');
  send('não');     // recusa CPF
  const r = send('sim');  // confirma adição
  assertClean(r);
  const item = sandbox.state.cart[0];
  assert(item && item.quantity === 1, `Quantidade esperada: 1, encontrada: ${item ? item.quantity : 'nenhuma'}`);
});

test('Dosagem "neosaldina comprimido" não é confundida com quantidade', () => {
  send('neosaldina comprimido');
  send('não');     // recusa CPF
  const r = send('sim');  // confirma adição
  assertClean(r);
  const item = sandbox.state.cart[0];
  assert(item && item.quantity === 1, `Quantidade esperada: 1, encontrada: ${item ? item.quantity : 'nenhuma'}`);
});

// ═══════════════════════════════════════════════════════════════════════════
console.log('\n📋 BLOCO 13 — Conversacional e naturalidade');

test('confirm_add_cart: "Não. Quero levetiracetam" NÃO adiciona ao carrinho', () => {
  gotoConfirmAddCart();
  const cartBefore = sandbox.state.cart.length;
  const r = send('Não. Quero levetiracetam');
  assertClean(r);
  assert(sandbox.state.cart.length === cartBefore, 'Adicionou ao carrinho indevidamente!');
  assertNotContains(r, 'Adicionado');
});

test('confirm_add_cart: "não obrigado" recusa sem erro', () => {
  gotoConfirmAddCart();
  const r = send('não obrigado');
  assertClean(r);
  assertNotContains(r, 'Adicionado');
  assertNotContains(r, 'Não encontrei');
});

test('more_items: "ta certo o carrinho" NÃO trata como medicamento', () => {
  gotoMoreItems();
  const r = send('ta certo o carrinho');
  assertClean(r);
  assertNotContains(r, 'Não encontrei');
});

test('more_items: "beleza" responde naturalmente', () => {
  gotoMoreItems();
  const r = send('beleza');
  assertClean(r);
  assertNotContains(r, 'Não encontrei');
});

test('idle: "tudo certo" responde naturalmente', () => {
  const r = send('tudo certo');
  assertClean(r);
  assertNotContains(r, 'Não encontrei');
});

test('more_items: "obrigado" não gera busca de medicamento', () => {
  gotoMoreItems();
  const r = send('obrigado');
  assertClean(r);
  assertNotContains(r, 'Não encontrei');
});

// ═══════════════════════════════════════════════════════════════════════════
// RELATÓRIO FINAL
// ═══════════════════════════════════════════════════════════════════════════
const total = passed + failed;
const pct   = total > 0 ? ((passed / total) * 100).toFixed(0) : 0;

console.log('\n══════════════════════════════════════════════════════');
console.log('                RESULTADO DA AUDITORIA                ');
console.log('══════════════════════════════════════════════════════');
console.log(`  ✅ Aprovados:  ${String(passed).padStart(3)} / ${total}  (${pct}%)`);
console.log(`  ❌ Reprovados: ${String(failed).padStart(3)} / ${total}`);

if (failures.length > 0) {
  console.log('\n  ─── Falhas detalhadas ───────────────────────────');
  failures.forEach((f, i) => {
    console.log(`\n  ${i+1}. [${f.label}]`);
    console.log(`     ↳ ${f.msg}`);
  });
}

console.log('\n  ─── Diagnóstico ─────────────────────────────────');
if (failed === 0) {
  console.log('  🎉 SOFIA ESTÁVEL — todos os testes passaram!');
} else if (Number(pct) >= 90) {
  console.log(`  ✅ Sofia ESTÁVEL com pequenas ressalvas — ${failed} item(ns) para monitorar.`);
} else if (Number(pct) >= 75) {
  console.log(`  ⚠️  Sofia com FALHAS MENORES — ${failed} item(ns) a revisar.`);
} else {
  console.log(`  🔴 Sofia INSTÁVEL — ${failed} falha(s) crítica(s) a corrigir.`);
}
console.log('══════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
