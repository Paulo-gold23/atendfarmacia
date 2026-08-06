
/**
 * Farmácia WhatsApp Frontend — app.js v3.0 (Refactored)
 *
 * FIXES in this version:
 *  #1  Implemented 8 missing state-machine handlers (was crashing with ReferenceError)
 *  #2  Race condition: state.isSending now released in finally{} after all rendering
 *  #3  AudioContext reused via singleton (was leaking one context per notification)
 *  #4  DOM reference in setTimeout uses dom.chatStatus (was raw getElementById)
 *  #5  state.pendingActionRawText declared in initial state object
 *  #6  Extracted processAndRenderResponse() — eliminates 4× duplicated block
 *  #7  resetSimState() shared by startNewConversation, clearChat & order confirm
 *  #8  parseMedicinesFromText uses pre-compiled RegExp objects (O(n) vs O(n²))
 *  #9  Recording vars moved from global scope into state object
 * #10  botMessageCount counter avoids .filter() on every bot message
 */

// ============ CONFIG ============
const CONFIG = {
  simulationMode: false,
  webhookUrl: 'https://n8n.srv1181762.hstgr.cloud/webhook/sofia/chat',
  sessionKey: 'farmacia_session_id',
  historyKey: 'farmacia_history',
  soundKey: 'farmacia_sound',
  cpfKey: 'sofia_cpf',
  discountKey: 'sofia_discount_percent',
  maxRetries: 2,
  retryDelay: 2000,

  // Timing constants (ms)
  greetingInitialDelay: 800,
  greetingSecondDelay: 1000,
  newChatGreetingDelay: 600,
  botName: 'Sofia',
  clinicName: 'Farmácia',
};

// ============ STATE ============
const state = {
  sessionId: null,
  messages: [],
  isTyping: false,
  isSending: false,
  soundEnabled: true,
  unreadCount: 0,
  isScrolledUp: false,
  pendingAction: null,
  originalTitle: document.title,
  botMessageCount: 0,         // FIX #10: replaces expensive .filter() in addBotMessage

  // Simulation state machine
  simState: 'idle',
  cart: [],
  deliveryAddress: '',
  paymentMethod: '',
  deliveryMethod: '',
  pendingItem: null,
  pendingCalculation: null,
  pendingItemsList: [],
  pendingBrand: null,
  pendingGeneric: null,
  pendingUpsell: null,
  upsellOffered: false,
  cpf: null,
  discountPercent: 0,
  pendingActionRawText: '',   // FIX #5: declared here, not added dynamically
  lastMentionedProduct: null, // Contextual: last product discussed (for "quanto custa?", "esse mesmo")
  lastImageContext: null,     // Contextual: result of last image analysis
  hasGreeted: false,          // Track if bot has already greeted user in active session

  // Recording (FIX #9: moved from global scope)
  mediaRecorder: null,
  audioChunks: [],
  isRecording: false,
};

// ============ DOM REFS ============
const dom = {};

function cacheDom() {
  dom.chatMessages   = document.getElementById('chatMessages');
  dom.messageInput   = document.getElementById('messageInput');
  dom.sendBtn        = document.getElementById('sendBtn');
  dom.typingIndicator= document.getElementById('typingIndicator');
  dom.chatStatus     = document.getElementById('chatStatus');
  dom.sidebarTime    = document.getElementById('sidebarTime');
  dom.sidebarLastMsg = document.getElementById('sidebarLastMsg');
  dom.sidebarBadge   = document.getElementById('sidebarBadge');
  dom.sidebar        = document.getElementById('sidebar');
  dom.backBtn        = document.getElementById('backBtn');
  dom.contactClinic  = document.getElementById('contactClinic');
  dom.scrollFab      = document.getElementById('scrollFab');
  dom.scrollFabBadge = document.getElementById('scrollFabBadge');
  dom.dialogOverlay  = document.getElementById('dialogOverlay');
  dom.dialogText     = document.getElementById('dialogText');
  dom.dialogSubtext  = document.getElementById('dialogSubtext');
  dom.dialogConfirm  = document.getElementById('dialogConfirm');
  dom.dialogCancel   = document.getElementById('dialogCancel');
  dom.toastContainer = document.getElementById('toastContainer');

  dom.btnNewChat       = document.getElementById('btnNewChat');
  dom.btnNewChatHeader = document.getElementById('btnNewChatHeader');
  dom.btnSidebarMenu   = document.getElementById('btnSidebarMenu');
  dom.btnChatMenu      = document.getElementById('btnChatMenu');
  dom.sidebarDropdown  = document.getElementById('sidebarDropdown');
  dom.chatDropdown     = document.getElementById('chatDropdown');

  dom.menuNewChat      = document.getElementById('menuNewChat');
  dom.menuClearChat    = document.getElementById('menuClearChat');
  dom.menuToggleSound  = document.getElementById('menuToggleSound');
  dom.menuNewChat2     = document.getElementById('menuNewChat2');
  dom.menuClearChat2   = document.getElementById('menuClearChat2');
  dom.menuExport       = document.getElementById('menuExport');
  dom.soundLabel       = document.getElementById('soundLabel');
  dom.btnAttach        = document.getElementById('attachBtn');
  dom.micBtn           = document.getElementById('micBtn');
  dom.imageFileInput   = document.getElementById('imageFileInput');
  dom.docFileInput     = document.getElementById('docFileInput');
}

// ============ INIT ============
function init() {
  cacheDom();
  state.sessionId    = loadOrCreateSession();
  state.soundEnabled = localStorage.getItem(CONFIG.soundKey) !== 'false';
  updateSoundLabel();
  loadHistory();
  setupEventListeners();
  renderSavedMessages();
  handleResize();

  if (dom.micBtn)  dom.micBtn.style.display  = 'flex';
  if (dom.sendBtn) dom.sendBtn.style.display = 'none';

  if (state.messages.length === 0) {
    greetUser(CONFIG.greetingInitialDelay);
  }
}

// ============ GREETING ============
function greetUser(initialDelay = CONFIG.greetingInitialDelay) {
  state.hasGreeted = true;
  setTimeout(() => {
    addBotMessage(`Oi! Tudo bem? Sou a ${CONFIG.botName} da ${CONFIG.clinicName}.`);
    setTimeout(() => {
      addBotMessage('No que posso te ajudar hoje?');
    }, CONFIG.greetingSecondDelay);
  }, initialDelay);
}

// ============ RESPONSIVE ============
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  dom.sidebar.classList.toggle('sidebar-closed', isMobile);
}

// ============ SESSION ============
function loadOrCreateSession() {
  let id = localStorage.getItem(CONFIG.sessionKey);
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    localStorage.setItem(CONFIG.sessionKey, id);
  }
  return id;
}

// ============ HISTORY ============
function loadHistory() {
  try {
    const saved = localStorage.getItem(CONFIG.historyKey);
    if (saved) {
      state.messages = JSON.parse(saved);
      state.hasGreeted = state.messages.some(m => m.sender === 'bot');
    }
  } catch { state.messages = []; }
}

function saveHistory() {
  try {
    localStorage.setItem(CONFIG.historyKey, JSON.stringify(state.messages.slice(-100)));
  } catch { /* ignore quota errors */ }
}

// ============ RECORDING ============
// FIX #9: use state.mediaRecorder / state.audioChunks / state.isRecording
async function toggleRecording() {
  if (!state.isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaRecorder = new MediaRecorder(stream);
      state.audioChunks   = [];

      state.mediaRecorder.addEventListener('dataavailable', e => {
        state.audioChunks.push(e.data);
      });

      state.mediaRecorder.addEventListener('stop', async () => {
        const blob   = new Blob(state.audioChunks, { type: 'audio/ogg' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          addUserMessage('🎙️ *Mensagem de Áudio* (Áudio enviado)');
          showTyping();
          try {
            const response = await sendToWebhook(reader.result, 'audio');
            hideTyping();
            await processAndRenderResponse(response);
          } catch (err) {
            hideTyping();
            addBotMessage('Desculpe, ocorreu um erro na comunicação.');
            console.error('[ClinicAI] Webhook error:', err);
          }
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      });

      state.mediaRecorder.start();
      state.isRecording = true;
      dom.micBtn.classList.add('recording');
      showToast('🎙️ Gravando áudio... Clique no microfone novamente para enviar.');
    } catch (err) {
      console.error('Error starting recording:', err);
      showToast('⚠️ Não foi possível acessar o microfone. Enviando áudio simulado...');
      sendSimulatedAudio();
    }
  } else {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
    }
    state.isRecording = false;
    dom.micBtn.classList.remove('recording');
  }
}

async function sendSimulatedAudio() {
  addUserMessage('🎙️ *Mensagem de Áudio* (Simulado)');
  showTyping();
  try {
    const dummy   = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAA+AAAAAAAAAAAAAAABaGVhZAAAAAA=';
    const response = await sendToWebhook(dummy, 'audio');
    hideTyping();
    await processAndRenderResponse(response);
  } catch (err) {
    hideTyping();
    addBotMessage('Desculpe, ocorreu um erro na comunicação.');
    console.error('[ClinicAI] Webhook error:', err);
  }
}

// ============ EVENTS ============
function setupEventListeners() {
  dom.sendBtn.addEventListener('click', handleSend);

  dom.messageInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  dom.messageInput.addEventListener('input', () => {
    dom.messageInput.style.height = 'auto';
    dom.messageInput.style.height = Math.min(dom.messageInput.scrollHeight, 120) + 'px';
    const hasText = dom.messageInput.value.trim().length > 0;
    dom.sendBtn.style.display = hasText ? 'flex' : 'none';
    dom.micBtn.style.display  = hasText ? 'none' : 'flex';
    dom.sendBtn.classList.toggle('active', hasText);
  });

  dom.micBtn.addEventListener('click', toggleRecording);

  dom.backBtn.addEventListener('click', () => dom.sidebar.classList.remove('sidebar-closed'));

  dom.contactClinic.addEventListener('click', () => {
    if (window.innerWidth <= 768) dom.sidebar.classList.add('sidebar-closed');
    dom.sidebarBadge.style.display = 'none';
  });

  dom.chatMessages.addEventListener('scroll', handleScroll);

  dom.scrollFab.addEventListener('click', () => {
    scrollToBottom();
    state.unreadCount = 0;
    dom.scrollFabBadge.classList.remove('show');
    dom.scrollFabBadge.textContent = '';
  });

  dom.btnNewChat.addEventListener('click', showNewChatDialog);
  dom.btnNewChatHeader.addEventListener('click', showNewChatDialog);

  dom.btnAttach.addEventListener('click', () => dom.imageFileInput.click());

  dom.imageFileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('Processando imagem...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      addUserMessage(`📷 *Imagem enviada:* ${file.name}`);
      showTyping();
      try {
        const response = await sendToWebhook(reader.result, 'image', file.name);
        hideTyping();
        await processAndRenderResponse(response);
      } catch (err) {
        hideTyping();
        addBotMessage('Desculpe, ocorreu um erro ao processar a imagem.');
        console.error('[ClinicAI] Webhook error:', err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  dom.btnSidebarMenu.addEventListener('click', e => {
    e.stopPropagation();
    toggleDropdown(dom.sidebarDropdown, dom.btnSidebarMenu);
  });
  dom.btnChatMenu.addEventListener('click', e => {
    e.stopPropagation();
    toggleDropdown(dom.chatDropdown, dom.btnChatMenu);
  });

  dom.menuNewChat.addEventListener('click',    () => { closeAllDropdowns(); showNewChatDialog(); });
  dom.menuClearChat.addEventListener('click',  () => { closeAllDropdowns(); showClearChatDialog(); });
  dom.menuToggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem(CONFIG.soundKey, state.soundEnabled);
    updateSoundLabel();
    showToast(state.soundEnabled ? 'Som de notificação ativado' : 'Som de notificação desativado');
  });
  dom.menuNewChat2.addEventListener('click',   () => { closeAllDropdowns(); showNewChatDialog(); });
  dom.menuClearChat2.addEventListener('click', () => { closeAllDropdowns(); showClearChatDialog(); });
  dom.menuExport.addEventListener('click',     () => { closeAllDropdowns(); exportConversation(); });

  dom.dialogCancel.addEventListener('click', closeDialog);
  dom.dialogOverlay.addEventListener('click', e => { if (e.target === dom.dialogOverlay) closeDialog(); });
  dom.dialogConfirm.addEventListener('click', () => { if (state.pendingAction) state.pendingAction(); closeDialog(); });

  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) document.title = state.originalTitle; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDialog(); closeAllDropdowns(); } });

  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(handleResize, 150); });
}

// ============ SEND MESSAGE ============
async function handleSend() {
  const text = dom.messageInput.value.trim();
  if (!text || state.isSending) return;

  state.isSending = true;
  dom.messageInput.value = '';
  dom.messageInput.style.height = 'auto';
  dom.sendBtn.classList.remove('active');
  dom.sendBtn.style.display = 'none';
  dom.micBtn.style.display  = 'flex';

  addUserMessage(text);
  showTyping();

  try {
    const response = await sendToWebhook(text);
    hideTyping();
    await processAndRenderResponse(response);  // FIX #6: single shared renderer
  } catch (err) {
    hideTyping();
    addBotMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente em alguns instantes.');
    console.error('[ClinicAI] Webhook error:', err);
  } finally {
    // FIX #2: released AFTER rendering loop, not before
    state.isSending = false;
    dom.messageInput.focus();
  }
}

// ============ RESPONSE RENDERER (FIX #6 — replaces 4× duplicated block) ============
/**
 * Splits response on '||' and renders each part with a typing delay.
 * Single source of truth for all bot reply rendering.
 */
async function processAndRenderResponse(response) {
  const text     = typeof response === 'string' ? response : JSON.stringify(response);
  const messages = text.split('||');
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i].trim();
    if (!msg) continue;
    if (i > 0) {
      showTyping();
      await delay(Math.min(msg.length * 30 + 500, 2000));
      hideTyping();
    }
    addBotMessage(msg);
  }
}

// ============ SIMULATION ENGINE ============
// MEDICINES_DB is loaded from medicines_database.js

function normalizeText(text) {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function runSimulation(message) {
  // Null safety guard
  if (!message || typeof message !== 'string') {
    return 'Oi! Me diz o que você precisa. 😊';
  }
  const norm = normalizeText(message);

  // 1. Human transfer lock — but allow escape commands
  if (state.simState === 'human') {
    if (norm.match(/(cancelar|voltar|sair|bot|sofia|resetar)/i)) {
      state.simState = 'idle';
      setTimeout(() => { dom.chatStatus.textContent = 'online'; }, 100);
      return 'Voltei! 😊 Sou a Sofia novamente. Como posso te ajudar?';
    }
    return 'O atendimento humano está ativo. Um atendente entrará em contato em instantes por este canal.\n\n_(Digite *voltar* para retornar ao atendimento automático)_';
  }

  // 2. Global overrides — always active regardless of simState
  if (norm.match(/(morrendo|infarto|dor no peito|falta de ar|desmaiou|urgente|grave|emergencia)/i)) {
    return 'Isso parece urgente! 🚨 O melhor é ir direto pro pronto-socorro ou ligar pro SAMU no 192. Cuida-se!';
  }

  if (norm.match(/(humano|atendente|falar com alguem|suporte|reclamacao)/i)) {
    state.simState = 'human';
    // FIX #4: use cached dom.chatStatus instead of getElementById inside timeout
    setTimeout(() => { dom.chatStatus.textContent = 'atendente humano'; }, 100);
    return 'Vou te passar pra um atendente que vai conseguir te ajudar melhor. Só um momento! 👤||[Sistema: Chat transferido para atendimento humano. O bot foi desativado.]';
  }

  if (norm.match(/(cancelar|cancelar pedido|desistir|limpar tudo)/i)) {
    resetSimState();
    return 'Sem problemas! Cancelei o pedido e limpei o carrinho. Se precisar de outra coisa, é só me chamar.';
  }

  // 3. Conversational state machine
  switch (state.simState) {
    case 'idle':                   return handleIdleState(norm, message);
    case 'waiting_cpf':            return handleWaitingCpf(norm, message);
    case 'confirm_brand_or_generic': return handleConfirmBrandOrGeneric(norm);
    case 'confirm_upsell':         return handleConfirmUpsell(norm);
    case 'confirm_add_cart':       return handleConfirmAddCartState(norm, message);
    case 'waiting_dosage_selection': return handleWaitingDosageSelection(norm, message);
    case 'choose_variant':         return handleChooseVariant(norm, message);
    case 'waiting_calculation_days': return handleWaitingCalculationDays(norm, message);
    case 'more_items':             return handleMoreItemsState(norm, message);
    case 'waiting_delivery_method': return handleWaitingDeliveryMethod(norm, message);
    case 'waiting_address':        return handleWaitingAddressState(message);
    case 'waiting_payment':        return handleWaitingPaymentState(norm);
    case 'waiting_confirm':        return handleWaitingConfirmState(norm, message);
    default:
      state.simState = 'idle';
      return 'Oi! Desculpa, me perdi um pouco no fluxo. No que posso te ajudar? Digite o nome do remédio ou faça sua pergunta.';
  }
}

// ============ MEDICINES SEARCH ============
const COLLOQUIAL_MAP = {
  'remedio de pressao':        ['pressão', 'hipertensão'],
  'remedio de pressao alta':   ['pressão', 'hipertensão'],
  'remedio para pressao':      ['pressão', 'hipertensão'],
  'remedio pra pressao':       ['pressão', 'hipertensão'],
  'remedio de acucar':         ['diabetes'],
  'remedio de diabetes':       ['diabetes'],
  'remedio para diabetes':     ['diabetes'],
  'remedio pra diabetes':      ['diabetes'],
  'remedio pra dormir':        ['sono', 'insônia'],
  'remedio para dormir':       ['sono', 'insônia'],
  'remedio de dor':            ['dor'],
  'remedio para dor':          ['dor'],
  'remedio pra dor':           ['dor'],
  'remedio de dor de cabeca':  ['cabeça', 'dor'],
  'remedio para dor de cabeca':['cabeça', 'dor'],
  'remedio pra dor de cabeca': ['cabeça', 'dor'],
  'bombinha':                  ['bombinha', 'asma', 'falta de ar'],
  'spray para asma':           ['bombinha', 'asma', 'falta de ar'],
  'remedio de colesterol':     ['colesterol'],
  'remedio para colesterol':   ['colesterol'],
  'remedio pra colesterol':    ['colesterol'],
  'remedio de tireoide':       ['tireoide'],
  'remedio para tireoide':     ['tireoide'],
  'remedio pra tireoide':      ['tireoide'],
  // Recovered from old prompt
  'remedio de barriga':        ['barriga', 'diarreia', 'intestinal'],
  'remedio para barriga':      ['barriga', 'diarreia', 'intestinal'],
  'remedio pra barriga':       ['barriga', 'diarreia', 'intestinal'],
  'remedio de enjoo':          ['enjoo', 'náusea'],
  'remedio para enjoo':        ['enjoo', 'náusea'],
  'remedio pra enjoo':         ['enjoo', 'náusea'],
  'remedio de estomago':       ['azia', 'estômago'],
  'remedio para estomago':     ['azia', 'estômago'],
  'remedio pra estomago':      ['azia', 'estômago'],
  'remedio de azia':           ['azia', 'estômago'],
  'remedio para azia':         ['azia', 'estômago'],
  'remedio para garganta':     ['garganta'],
  'remedio pra garganta':      ['garganta'],
  'remedio para tosse':        ['tosse'],
  'remedio pra tosse':         ['tosse'],
  'remedio para alergia':      ['alergia', 'rinite'],
  'remedio pra alergia':       ['alergia', 'rinite'],
  'remedio para micose':       ['micose'],
  'remedio pra micose':        ['micose'],
  'remedio para gripe':        ['gripe'],
  'remedio pra gripe':         ['gripe'],
  'laxante':                   ['laxante'],
  'vitamina c':                ['vitamina'],
  'complexo b':                ['vitamina'],
};

function escapeRegex(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// FIX #8: Pre-compile alias patterns once at startup (lazy singleton)
let _compiledAliases = null;
function getCompiledAliases() {
  if (_compiledAliases) return _compiledAliases;
  _compiledAliases = MEDICINES_DB.map(drug => ({
    drug,
    patterns: drug.aliases.map(alias => ({
      alias,
      len: alias.length,
      re:  new RegExp('\\b' + escapeRegex(alias) + '\\b', 'i'),
    })),
  }));
  return _compiledAliases;
}

function _parseQuantityAndCleanText(text) {
  const clean = text.toLowerCase().trim();
  
  const wordNumbers = {
    'um': 1, 'uma': 1,
    'dois': 2, 'duas': 2,
    'tres': 3,
    'quatro': 4,
    'cinco': 5,
    'seis': 6,
    'sete': 7,
    'oito': 8,
    'nove': 9,
    'dez': 10
  };

  let quantity = 1;
  let remains = clean;

  const qtyUnitMatch = clean.match(/(\d+)\s*(caixas?|frascos?|unidades?|un|cps?|comprimidos?|envelopes?|bisnagas?)(?:\s+de)?/i);
  if (qtyUnitMatch) {
    quantity = Math.max(1, parseInt(qtyUnitMatch[1]));
    remains = clean.replace(qtyUnitMatch[0], '');
    return { quantity, text: remains.trim() };
  }

  const wordUnitMatch = clean.match(/\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+(caixas?|frascos?|unidades?|un|cps?|comprimidos?|envelopes?|bisnagas?)(?:\s+de)?/i);
  if (wordUnitMatch) {
    quantity = wordNumbers[wordUnitMatch[1]];
    remains = clean.replace(wordUnitMatch[0], '');
    return { quantity, text: remains.trim() };
  }

  const numberPrefixMatch = clean.match(/^(?:quero|preciso|me\s+ve|tem|comprar)?\s*(\d+)\s+([a-zA-Z])/i);
  if (numberPrefixMatch) {
    const num = parseInt(numberPrefixMatch[1]);
    if (num > 0 && num <= 20) {
      quantity = num;
      remains = clean.replace(new RegExp('\\b' + numberPrefixMatch[1] + '\\b\\s*'), '');
      return { quantity, text: remains.trim() };
    }
  }

  const wordPrefixMatch = clean.match(/^(?:quero|preciso|me\s+ve|tem|comprar)?\s*(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+([a-zA-Z])/i);
  if (wordPrefixMatch) {
    quantity = wordNumbers[wordPrefixMatch[1]];
    remains = clean.replace(new RegExp('\\b' + wordPrefixMatch[1] + '\\b\\s*'), '');
    return { quantity, text: remains.trim() };
  }

  return { quantity, text: clean };
}

function parseMedicinesFromText(text) {
  const compiled   = getCompiledAliases();
  const itemsFound = [];
  const parts      = text.split(/\s+e\s+|\s*,\s*|\s+mais\s+|\s*\+\s*/i);

  for (const part of parts) {
    let normPart = normalizeText(part);
    if (!normPart) continue;

    // Limpa expressões de cortesia comuns do início ou fim do termo
    normPart = normPart
      .replace(/^(por\s+favor|obrigado|obrigada|pfv?|valeu)\s+/i, '')
      .replace(/\s+(por\s+favor|obrigado|obrigada|pfv?|valeu)$/i, '')
      .trim();

    const { quantity, text: cleanPart } = _parseQuantityAndCleanText(normPart);

    let searchText = cleanPart
      .replace(/^(de|da|do|para|com|comprar|tem|vcs\s+tem|gostaria\s+de|gostaria|quero|preciso\s+de|preciso|me\s+ve)\s+/i, '')
      .trim()
      .replace(/[^\w\s-]/g, '')
      .trim();

    if (searchText.length < 3) continue;

    let matchedDrug    = null;
    let longestMatchLen = 0;

    // Exact word-boundary match using pre-compiled regexps
    for (const { drug, patterns } of compiled) {
      for (const { alias, len, re } of patterns) {
        if (re.test(searchText) && len > longestMatchLen) {
          matchedDrug    = drug;
          longestMatchLen = len;
        }
      }
    }

    // Fallback: substring match (CONSERVATIVE — avoid false positives)
    if (!matchedDrug && searchText.length >= 5) {
      // Skip substring matching if the text looks like a generic intent, not a product name
      const isGenericPhrase = /^(fazer|pedido|comprar|compra|pedir|ajuda|ajudar|funciona|quanto|preco|valor|quero|preciso|gostaria|favor|bom|boa|dia|tarde|noite|oi|ola|sim|nao|obrigad|tchau|ate|beleza|legal|certo|isso|pode|entrega|pagamento|endereco|horario)\b/i.test(searchText);
      if (!isGenericPhrase) {
        outer: for (const { drug, patterns } of compiled) {
          for (const { alias } of patterns) {
            const normAlias = normalizeText(alias);
            // Only match if alias is long enough (5+ chars) AND alias is INSIDE the search text
            // Removed dangerous reverse match (searchText inside alias) that caused false positives
            if (normAlias.length >= 5 && searchText.includes(normAlias)) {
              matchedDrug = drug;
              break outer;
            }
          }
        }
      }
    }

    if (matchedDrug) itemsFound.push({ drug: matchedDrug, quantity });
  }

  return itemsFound;
}

/**
 * Extrai o termo de busca de um produto na mensagem quando parseMedicinesFromText
 * não encontrou nada no banco — útil para dar feedback "não encontrei X".
 * Retorna string com o nome provável ou null.
 */
function _extractMedicineRequest(rawMsg) {
  const norm = normalizeText(rawMsg);
  
  // Se a mensagem contém anúncios/ações de foto, áudio ou conversa (ex: "mais um remedio irei enviar a foto") -> NÃO é produto!
  if (norm.match(/(foto|imagem|enviar|mandar|mandei|vou|tirar|olha|ve|ver|passar|audio)/i)) {
    return null;
  }

  // Expressões funcionais, de cortesia ou status do carrinho que não representam produtos
  const ignorePhrases = [
    'por favor', 'porfavor', 'pf', 'pfv', 'obrigado', 'obrigada', 'valeu', 'grato', 'ok', 'okay',
    'ta certo', 'tá certo', 'esta certo', 'tudo certo', 'tudo ok', 'certo', 'isso mesmo', 'isso',
    'pode ser', 'pode', 'sim', 'nao', 'não', 'quero', 'preciso', 'gostaria', 'carrinho', 'pedido',
    'fechar', 'finalizar', 'cancelar', 'por enquanto', 'por agora',
    'beleza', 'legal', 'massa', 'top', 'boa', 'perfeito', 'otimo', 'entendi', 'entendo',
    'brigadao', 'vlw', 'hmm', 'hm', 'ah', 'ah ta', 'ahh', 'ta', 'uhum', 'aham',
    'ta bom', 'ta otimo', 'ta certo', 'blz', 'show', 'maravilha', 'combinado',
    'tranquilo', 'de boa', 'suave', 'firmeza', 'fechou', 'mais um remedio', 'outro remedio'
  ];

  let stripped = norm
    .replace(/^(pode|sim|ok|claro|vai|bora|manda|confirma|isso)[.!,]?\s*/i, '')
    .replace(/^(tambem|tb|alem disso|e|mais)\s+(preciso|quero|gostaria|tem|vcs tem|voces tem)\s+(de|da|do|um|uma|mais)?\s*/i, '')
    .replace(/^(preciso|quero|gostaria|tem|voce tem|vcs tem)\s+(de|da|do|um|uma)?\s*/i, '')
    .replace(/^(de|da|do|um|uma)\s+/i, '')
    .trim();

  // Limpa pontuações comuns
  stripped = stripped.replace(/[.!,?]/g, '').trim();

  // Se a frase tem mais de 3 palavras -> é uma frase conversacional, não um nome limpo de remédio!
  const wordCount = stripped.split(/\s+/).filter(Boolean).length;
  if (wordCount > 3) {
    return null;
  }

  if (ignorePhrases.includes(stripped) || stripped.length < 3) {
    return null;
  }

  // Verifica se a palavra resultante bate em palavras isoladas de controle
  const skipWords = /^(mais|sim|nao|ok|claro|isso|bora|vai|pode|ja|aqui|la|tudo|nada|so|e|ou|por|favor|obrigado|obrigada|ta|certo|carrinho|carrinhos|beleza|legal|massa|top|boa|perfeito|otimo|entendi|show|blz|hmm|uhum|aham|tranquilo|suave|firmeza|fechou|combinado|maravilha|remedio|remedios|produto|produtos)$/i;
  if (skipWords.test(stripped)) {
    return null;
  }

  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function getGenericAlternative(drug) {
  if (!drug.activeIngredient || drug.isGeneric) return null;

  const byIngredient = MEDICINES_DB.find(d =>
    d.activeIngredient === drug.activeIngredient && d.isGeneric === true
  );
  if (byIngredient) return byIngredient;

  const n = drug.name.toLowerCase();
  const find = s => MEDICINES_DB.find(d => d.name.toLowerCase().includes(s));
  if (n.includes('tylenol'))          return find('paracetamol');
  if (n.includes('novalgina'))        return find('dipirona');
  if (n.includes('buscopan composto')) return find('butilbrometo') || null;
  if (n.includes('glifage'))          return find('metformina');
  if (n.includes('rivotril'))         return find('clonazepam');
  if (n.includes('ritalina'))         return find('metilfenidato');
  if (n.includes('lexotan'))          return find('bromazepam');
  if (n.includes('frontal'))          return find('alprazolam');
  return null;
}

// ============ VARIANT SELECTION ============
function _findSiblingProducts(drug) {
  if (!drug.activeIngredient) return [drug];
  return MEDICINES_DB.filter(d =>
    d.activeIngredient === drug.activeIngredient && d.allowsDelivery !== false
  );
}

function _offerVariants(siblings, quantity) {
  state.pendingVariants    = siblings;
  state.pendingVariantQty  = quantity;
  state.simState           = 'choose_variant';

  const ingredient = siblings[0].activeIngredient;
  const list = siblings.map((d, i) => {
    const { price, notice } = _applyDiscount(d);
    const genericLabel = d.isGeneric ? ' *(Genérico)*' : '';
    return `${i + 1}. ${d.name}${genericLabel} (${d.presentation}) - R$ ${price.toFixed(2)}${notice}`;
  }).join('\n');

  return `Temos essas opções de *${ingredient}*:\n${list}\n\nQual você prefere? Pode me dizer o número ou o nome. 😊`;
}

function _selectVariant(drug, quantity) {
  state.pendingVariants   = null;
  state.pendingVariantQty = null;

  const { price, notice } = _applyDiscount(drug);
  state.pendingItem = { drug, quantity, finalPrice: price };
  state.simState    = 'confirm_add_cart';

  const priceText = quantity > 1
    ? `${quantity} unidades ficam R$ ${(quantity * price).toFixed(2)}`
    : `tá R$ ${price.toFixed(2)}`;

  return `O *${drug.name}* (${drug.presentation}) ${priceText}${notice}.${_recipeMsg(drug)}${_infoMsg(drug)}||Posso colocar no carrinho?`;
}

function handleChooseVariant(norm, rawMsg) {
  const variants = state.pendingVariants || [];
  const qty      = state.pendingVariantQty || 1;

  if (variants.length === 0) {
    state.simState = 'idle';
    return 'Ocorreu um erro. No que posso ajudar?';
  }

  // Rejection
  if (isUserRejecting(norm, rawMsg)) {
    state.pendingVariants = null;
    state.pendingVariantQty = null;
    state.simState = state.cart.length > 0 ? 'more_items' : 'idle';
    return state.cart.length > 0
      ? 'Ok! Quer adicionar outro medicamento ou *finalizar* o pedido?'
      : 'Sem problemas! Se precisar de algum remédio, é só me chamar. 😊';
  }

  // ── 1. Match por número direto ou "opção N" / "a N" / "o N" ──
  const numPatterns = [
    /^\s*(\d+)\s*$/,                                          // "3"
    /(?:opc[aã]o|opcao|numero|num|item|a|o)\s+(\d+)/i,       // "opção 3", "a 3", "o 3"
    /(\d+)\s*(?:por\s+favor|pfv|pf)?$/i                       // "3 por favor"
  ];
  for (const pat of numPatterns) {
    const m = rawMsg.match(pat);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      if (idx >= 0 && idx < variants.length) {
        return _selectVariant(variants[idx], qty);
      }
    }
  }

  // ── 2. Match por dosagem explícita (com unidade): "20mg", "5 mg" ──
  const doseMatch = rawMsg.match(/(\d+([.,]\d+)?)\s*(mg|g|ml)/i);
  if (doseMatch) {
    const targetDose = doseMatch[0].toLowerCase().replace(/\s+/g, '');
    const found = variants.find(v => {
      const vName = (v.name + ' ' + (v.presentation || '')).toLowerCase().replace(/\s+/g, '');
      return vName.includes(targetDose);
    });
    if (found) return _selectVariant(found, qty);
  }

  // ── 3. Match por número solto como dose: "de 20", "a de 20", "quero 5" ──
  const bareNumMatch = rawMsg.match(/(?:de|o\s+de|a\s+de|quero|preciso)\s+(\d+([.,]\d+)?)\b/i)
                    || rawMsg.match(/\b(\d+([.,]\d+)?)\s*$/);
  if (bareNumMatch && !doseMatch) {
    const num = bareNumMatch[1];
    const numNorm = num.replace(',', '.');
    // Try as dose (append mg, g, ml)
    for (const unit of ['mg', 'g', 'ml']) {
      const tryDose = numNorm + unit;
      const found = variants.find(v => {
        const vName = (v.name + ' ' + (v.presentation || '')).toLowerCase().replace(/\s+/g, '').replace(',', '.');
        return vName.includes(tryDose);
      });
      if (found) return _selectVariant(found, qty);
    }
    // Fallback: try as option index
    const idx = parseInt(num, 10) - 1;
    if (idx >= 0 && idx < variants.length) {
      return _selectVariant(variants[idx], qty);
    }
  }

  // ── 4. Match por ordinal ──
  const ordinals = {
    'primeiro': 0, 'primeira': 0,
    'segundo': 1, 'segunda': 1,
    'terceiro': 2, 'terceira': 2,
    'quarto': 3, 'quarta': 3,
    'quinto': 4, 'quinta': 4
  };
  for (const [word, idx] of Object.entries(ordinals)) {
    if (norm.includes(word) && idx < variants.length) {
      return _selectVariant(variants[idx], qty);
    }
  }

  // ── 5. Match por nome, alias ou fabricante ──
  for (const v of variants) {
    const nameNorm = normalizeText(v.name);
    if (norm.includes(nameNorm) || nameNorm.includes(norm)) {
      return _selectVariant(v, qty);
    }
    // Match por fabricante: "da aché", "da ems", "da medley"
    if (v.manufacturer) {
      const mfNorm = normalizeText(v.manufacturer);
      if (norm.includes(mfNorm) || rawMsg.toLowerCase().includes(mfNorm)) {
        return _selectVariant(v, qty);
      }
    }
    for (const alias of (v.aliases || [])) {
      const aliasNorm = normalizeText(alias);
      if (aliasNorm.length >= 4 && norm.includes(aliasNorm)) {
        return _selectVariant(v, qty);
      }
    }
  }

  // ── 6. Match por tipo de apresentação ──
  if (norm.match(/gota|liquido|liquida|frasco|xarope/i)) {
    const gotas = variants.find(v => v.presentation.match(/ml|gota|frasco|xarope/i) || v.name.toLowerCase().includes('gotas'));
    if (gotas) return _selectVariant(gotas, qty);
  }
  if (norm.match(/comprimido|cp|caixa|pilula|capsula/i)) {
    const comp = variants.find(v => v.presentation.match(/comprimido|capsula/i));
    if (comp) return _selectVariant(comp, qty);
  }
  if (norm.match(/generico|mais\s*barato|economizar|barato/i)) {
    const gen = variants.find(v => v.isGeneric);
    if (gen) return _selectVariant(gen, qty);
  }
  if (norm.match(/marca|referencia|original/i)) {
    const brand = variants.find(v => !v.isGeneric);
    if (brand) return _selectVariant(brand, qty);
  }

  // ── 7. Tenta parsear como novo medicamento ──
  const newItems = parseMedicinesFromText(rawMsg);
  if (newItems.length > 0) {
    state.pendingVariants   = null;
    state.pendingVariantQty = null;
    state.pendingItemsList  = newItems;
    return proceedToQuoteAfterCpf();
  }

  // Fallback amigável
  const listNames = variants.map((d, i) => `${i + 1}. ${d.name}`).join(', ');
  return `Não entendi qual você prefere. As opções são: ${listNames}. Me diz o número ou o nome que fica mais fácil! 😊`;
}

// ============ CART HELPERS ============
function cartSummary() {
  if (state.cart.length === 0) return '(vazio)';
  return state.cart
    .map(i => `• ${i.quantity}x ${i.drug.name} — R$ ${(i.finalPrice * i.quantity).toFixed(2)}`)
    .join('\n');
}

function cartTotal() {
  return state.cart.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
}

// ============ CPF / DISCOUNT ============
function formatCPF(digits) {
  return digits.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function handleWaitingCpf(norm, rawMsg) {
  if (norm.match(/(nao|no|na|pular|continuar|sem)/i)) {
    state.cpf             = 'não';
    state.discountPercent = 0;
    localStorage.setItem(CONFIG.cpfKey,      'não');
    localStorage.setItem(CONFIG.discountKey, '0');
    return proceedToQuoteAfterCpf();
  }

  const digits = rawMsg.replace(/\D/g, '');
  if (digits.length >= 11) {
    const cpfFormatted    = formatCPF(digits);
    const discount        = 10 + Math.floor(Math.random() * 21);
    state.cpf             = cpfFormatted;
    state.discountPercent = discount;
    localStorage.setItem(CONFIG.cpfKey,      cpfFormatted);
    localStorage.setItem(CONFIG.discountKey, discount.toString());
    return `CPF *${cpfFormatted}* localizado! 🎉\nVocê ganhou um desconto de *${discount}%* fidelidade nos medicamentos de marca para este pedido.||` + proceedToQuoteAfterCpf();
  }

  return 'Por favor, digite um CPF válido (11 números) ou digite *não* para prosseguir sem desconto fidelidade.';
}

// ============ QUOTE BUILDER ============
function proceedToQuoteAfterCpf() {
  const parsedItems      = state.pendingItemsList || [];
  state.pendingItemsList = [];

  if (parsedItems.length === 0) {
    // If cart has items, we came from checkout → proceed to delivery method
    if (state.cart.length > 0) {
      const total    = cartTotal();
      state.simState = 'waiting_delivery_method';
      return `Resumo do pedido:\n${cartSummary()}\n\n*Subtotal: R$ ${total.toFixed(2)}*\n*(+ R$ 5,00 taxa de entrega se delivery)*\n\nComo prefere receber: *entrega* no seu endereço ou *retirada* aqui na farmácia?`;
    }
    state.simState = 'idle';
    return 'No que posso ajudar? Digite o nome do medicamento.';
  }

  if (parsedItems.length === 1) {
    // Verifica se há variantes (mesmo princípio ativo, apresentações diferentes)
    const siblings = _findSiblingProducts(parsedItems[0].drug);
    if (siblings.length > 1) {
      return _offerVariants(siblings, parsedItems[0].quantity);
    }
    return _quoteSingleItem(parsedItems[0]);
  }

  return _quoteMultipleItems(parsedItems);
}

function _applyDiscount(drug) {
  if (state.discountPercent > 0 && !drug.isGeneric) {
    const discounted = drug.price * (1 - state.discountPercent / 100);
    const notice     = ` (de R$ ${drug.price.toFixed(2)} por *R$ ${discounted.toFixed(2)}* com ${state.discountPercent}% desc. fidelidade)`;
    return { price: discounted, notice };
  }
  return { price: drug.price, notice: '' };
}

function _recipeMsg(drug) {
  if (drug.recipeType === 'retida') return '||Como é antibiótico, o entregador vai precisar recolher a receita física (duas vias) na hora da entrega. Você tem ela aí?';
  if (drug.needsRecipe)             return '||Esse precisa de receita simples.';
  return '';
}

function _infoMsg(drug) {
  if (!drug.activeIngredient) return '';
  return `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n⚠️ *Nota de Segurança:* ${drug.safetyNote}`;
}

function _quoteSingleItem({ drug, quantity }) {
  if (!drug.allowsDelivery) {
    state.simState = 'idle';
    if (drug.recipeType === 'especial' || drug.name.toLowerCase().includes('roacutan')) {
      return `${drug.name} tem controle especial e exige termo de consentimento. Precisa vir presencialmente com receita e documentação. Não fazemos delivery desse. 🚫||Quer ver outro remédio?`;
    }
    return `${drug.name} é controlado e precisa de receita especial que fica retida. Por regras da Anvisa, só vendemos presencialmente na farmácia - não dá pra entregar. 🚫||Quer ver outro remédio?`;
  }

  const { price, notice } = _applyDiscount(drug);
  const genericAlt        = getGenericAlternative(drug);

  if (genericAlt) {
    state.pendingBrand   = { drug, quantity, finalPrice: price };
    state.pendingGeneric = { drug: genericAlt, quantity, finalPrice: genericAlt.price };
    state.simState       = 'confirm_brand_or_generic';

    const brandText   = quantity > 1
      ? `tá R$ ${drug.price.toFixed(2)} cada${notice} (total R$ ${(price * quantity).toFixed(2)})`
      : `tá R$ ${drug.price.toFixed(2)}${notice}`;
    const genericText = quantity > 1
      ? `R$ ${genericAlt.price.toFixed(2)} cada (total R$ ${(genericAlt.price * quantity).toFixed(2)})`
      : `R$ ${genericAlt.price.toFixed(2)}`;
    const cleanName   = genericAlt.name.replace(' (Genérico)', '').replace(' 500mg', '').replace(' Gotas', '');

    return `Temos o de referência *${drug.name}* que ${brandText}.${_infoMsg(drug)}||Mas ó, temos o genérico (${cleanName}) por ${genericText}.||Quer levar o genérico pra economizar?`;
  }

  state.pendingItem = { drug, quantity, finalPrice: price };
  state.simState    = 'confirm_add_cart';

  const priceText = quantity > 1
    ? `${quantity} unidades ficam R$ ${(quantity * price).toFixed(2)}`
    : `tá R$ ${price.toFixed(2)}`;

  return `O *${drug.name}* (${drug.presentation}) ${priceText}${notice}.${_recipeMsg(drug)}${_infoMsg(drug)}||Posso colocar no carrinho?`;
}

function _quoteMultipleItems(parsedItems) {
  let responseText  = '';
  let subtotal      = 0;
  let hasControlled = false;
  let hasAntibiotic = false;
  const pendingList = [];

  parsedItems.forEach(({ drug, quantity: qty }) => {
    const { price, notice: discountLabel } = _applyDiscount(drug);
    const totalItem = price * qty;
    subtotal       += totalItem;
    pendingList.push({ drug, quantity: qty, finalPrice: price });

    if (!drug.allowsDelivery)        hasControlled = true;
    if (drug.recipeType === 'retida') hasAntibiotic = true;

    const recipeNote = drug.needsRecipe
      ? (drug.recipeType === 'retida' ? ' (antibiótico)' : ' (precisa de receita)')
      : '';
    responseText += `• ${qty}x ${drug.name} - R$ ${totalItem.toFixed(2)}${discountLabel}${recipeNote}\n`;
  });

  if (hasControlled) {
    state.simState = 'idle';
    return 'Olha, vi que você incluiu medicamentos controlados (tarja preta/amarela). Por regras da Anvisa, a gente não pode entregar esses.||Nesse caso, você precisaria vir buscar aqui na loja física com a receita original em mãos. Quer que eu tire eles do carrinho e continue com os outros?';
  }

  state.pendingItemsList = pendingList;
  state.simState         = 'confirm_add_cart';

  const warnings = hasAntibiotic
    ? '||E lembrando que a receita do antibiótico precisa ser física em duas vias (uma fica com a gente na entrega), beleza?'
    : '';

  return `Achei os itens por aqui! Olha os preços:\n${responseText}\n*Total:* R$ ${subtotal.toFixed(2)}.${warnings}||Posso colocar todos eles no carrinho?`;
}
// ============ INTENT CLASSIFICATION (KEYWORD-BASED) ============
/**
 * Classifica a intenção do usuário ANTES de executar qualquer busca.
 * Usa análise por TOKENS (palavras-chave), não frases exatas.
 * Isso garante que qualquer variação natural de conversa seja compreendida.
 */

// Conjuntos de palavras-chave por categoria semântica
const INTENT_KEYWORDS = {
  greeting:   new Set(['oi','ola','hey','eai','salve','opa']),
  greetTime:  new Set(['bom','boa','dia','tarde','noite']),
  farewell:   new Set(['tchau','adeus','bye','flw','falou','ate']),
  thanks:     new Set(['obrigado','obrigada','brigado','brigada','brigadao','valeu','vlw','agradeco','grato','grata','obg']),
  negative:   new Set(['nao','n','nada','nope','nunca','nem']),
  purchase:   new Set(['comprar','compra','pedir','pedido','encomendar','encomenda']),
  wantVerb:   new Set(['quero','preciso','gostaria','pretendo','vim','vou','to','estou','precisando','querendo','desejo']),
  makeVerb:   new Set(['fazer','montar','fechar','realizar','efetuar']),
  help:       new Set(['ajuda','ajudar','auxilio','socorro','duvida','informacao','informacoes','info']),
  price:      new Set(['preco','valor','custa','custo','quanto','barato','caro','desconto','promocao']),
  avail:      new Set(['disponivel','estoque','tem','existe','encontra','acha']),
  pronRef:    new Set(['esse','essa','isso','este','esta','isto','aquele','aquela','aquilo','dele','dela','mesmo','mesma','ele','ela']),
  hours:      new Set(['horario','horarios','funcionamento','aberto','abre','fecha','horas']),
  location:   new Set(['endereco','localizacao','onde','localiza','fica','enderecos']),
  delivery:   new Set(['entrega','delivery','entregar','frete','taxa','trazer','levar']),
  payment:    new Set(['pagamento','pagar','pix','cartao','dinheiro','debito','credito','boleto','transferencia']),
  recipe:     new Set(['receita','prescricao','medica','medico','controlado','tarja','roacutan','antibiotico']),
  recipeImg:  new Set(['foto','imagem','enviar','mandar','mandei','escaneando','escanear']),
  ack:        new Set(['sim','s','ok','certo','beleza','legal','massa','top','perfeito','otimo','entendi','entendo','blz','show','maravilha','combinado','tranquilo','suave','firmeza','fechou','claro','certeza','positivo','exato','exatamente','verdade','aham','uhum','hmm','hm','ah','ta','ne','kk','kkk','kkkkk','rs','rsrs','haha','hahaha','obg','tmj']),
  howWorks:   new Set(['como','funciona','funcionam','faz','fazem','uso','usar','serve']),
  generic:    new Set(['algo','alguma','algumas','coisa','coisas','umas','uns','la','ai','aqui','tipo']),
  catalog:    new Set(['vende','vendem','vender','catalogo','cardapio','oferece','oferecem','trabalha','trabalham','disponibiliza']),
};

// Palavras-chave que indicam "quero saber de" / "tudo bem?" sem ser produto
const SMALL_TALK = new Set(['tudo','bem','bom','certo','vai','voce','vc','vcs','beleza','firmeza','suave','boa','bora','vamos','pode','ta']);

function classifyIntent(norm, rawMsg) {
  // Tokeniza em palavras
  const tokens = norm.replace(/[?.!,;:]/g, '').split(/\s+/).filter(Boolean);
  const tokenSet = new Set(tokens);
  const wordCount = tokens.length;

  // Helpers: verifica se algum token pertence a um conjunto
  const has = (set) => tokens.some(t => set.has(t));
  const hasAll = (...sets) => sets.every(s => has(s));
  const count = (set) => tokens.filter(t => set.has(t)).length;

  // ──── 0. ANÚNCIO DE ENVIO DE FOTO OU RECEITA (Prioridade máxima sobre conversa) ────
  const isPhotoAnnounce = (has(INTENT_KEYWORDS.recipeImg) || /foto|imagem/.test(norm)) && /(enviar|mandar|mandei|vou|tirar|olha|ve|ver|passar)/.test(norm);
  if (isPhotoAnnounce) {
    return { type: 'PHOTO_ANNOUNCEMENT' };
  }

  // ──── 1. MENSAGEM MUITO CURTA (1-2 palavras) ────
  if (wordCount <= 2) {
    // Saudação pura
    if (has(INTENT_KEYWORDS.greeting)) return { type: 'GREETING' };
    // "Bom dia" / "Boa tarde" / "Boa noite"
    if (has(INTENT_KEYWORDS.greetTime) && wordCount <= 2) {
      const hasTimeWord = tokenSet.has('dia') || tokenSet.has('tarde') || tokenSet.has('noite');
      if (hasTimeWord) return { type: 'GREETING' };
    }
    // Despedida
    if (has(INTENT_KEYWORDS.farewell)) return { type: 'FAREWELL' };
    // Agradecimento / "não obrigado"
    if (has(INTENT_KEYWORDS.thanks)) return { type: 'FAREWELL' };
    // Negação pura: "não", "nada"
    if (has(INTENT_KEYWORDS.negative) && wordCount === 1) return { type: 'FAREWELL' };
    // "só isso" / "nao quero"
    if (tokenSet.has('so') && (tokenSet.has('isso') || tokenSet.has('esse'))) return { type: 'FAREWELL' };
    // Acknowledgment puro: "ok", "beleza", "sim", "kk"
    if (count(INTENT_KEYWORDS.ack) >= wordCount) return { type: 'CONVERSATIONAL' };
    // Small talk puro: "tudo bem", "tudo certo" — se já saudou, é conversa, não saudação
    if (count(SMALL_TALK) >= wordCount) return { type: state.hasGreeted ? 'CONVERSATIONAL' : 'GREETING' };
  }

  // ──── 2. DESPEDIDA COMPOSTA ────
  if (has(INTENT_KEYWORDS.negative) && has(INTENT_KEYWORDS.thanks)) return { type: 'FAREWELL' };
  if (has(INTENT_KEYWORDS.farewell) && wordCount <= 4) return { type: 'FAREWELL' };
  if (has(INTENT_KEYWORDS.thanks) && !has(INTENT_KEYWORDS.purchase) && !has(INTENT_KEYWORDS.wantVerb)) return { type: 'FAREWELL' };
  // "só isso" / "é só" / "por enquanto não" / "por agora não"
  if (norm.match(/(so\s+isso|e\s+so|por\s+(enquanto|agora)\s+nao|mais\s+nada|era\s+so\s+isso)/i)) return { type: 'FAREWELL' };

  // ──── 3. SAUDAÇÃO COMPOSTA ────
  // "fala" sozinho ou com saudação OK, mas "me fala" / "fala pra mim" é pedido, não saudação
  const hasFala = tokenSet.has('fala');
  const isFalaAsGreeting = hasFala && wordCount <= 2 && !norm.match(/(me\s+fala|fala\s+(pra|sobre|qual|quais|o\s+que))/i);
  const hasRealGreeting = has(INTENT_KEYWORDS.greeting) || isFalaAsGreeting;
  const hasGenericObj = has(INTENT_KEYWORDS.generic) || norm.match(/(remedios?|medicamentos?|produtos?|coisas?|itens?)/i);
  const hasRequestIntent = has(INTENT_KEYWORDS.wantVerb) || has(INTENT_KEYWORDS.help) || hasGenericObj || has(INTENT_KEYWORDS.purchase);
  if (hasRealGreeting && wordCount <= 5 && !hasRequestIntent) return { type: 'GREETING' };
  // Saudação COM intenção de compra/ajuda: "oi, preciso de remedio", "ola, quero comprar"
  if (hasRealGreeting && hasRequestIntent) return { type: 'GREETING_WITH_INTENT' };
  // "tudo bem?", "como vai?", "e ai?" — se já saudou, é conversa
  if (norm.match(/(tudo\s+(bem|bom|certo|ok|tranquilo|beleza)|como\s+(vai|voce\s+ta|ce\s+ta|vc\s+ta)|e\s+ai)/i) && wordCount <= 4) return { type: state.hasGreeted ? 'CONVERSATIONAL' : 'GREETING' };

  // ──── 4. INTENÇÃO GENÉRICA DE COMPRA (sem produto mencionado) ────
  // Detecta QUALQUER combinação de verbo de vontade + verbo/substantivo de compra
  const hasPurchaseWords = has(INTENT_KEYWORDS.purchase) || has(INTENT_KEYWORDS.makeVerb);
  const hasWantWords = has(INTENT_KEYWORDS.wantVerb);

  if (hasPurchaseWords && (hasWantWords || hasGenericObj)) {
    // Antes de classificar como purchase_intent, verificar se NÃO tem um nome de produto real
    const parsedCheck = parseMedicinesFromText(rawMsg);
    if (parsedCheck.length === 0) {
      return { type: 'PURCHASE_INTENT' };
    }
    // Se tem produto, cai pro PRODUCT_SEARCH abaixo
  }

  // "quero pedir" / "vim comprar" / "vou precisar" sem objeto específico
  if (hasWantWords && hasPurchaseWords && wordCount <= 6) {
    return { type: 'PURCHASE_INTENT' };
  }

  // ──── 4b. CATÁLOGO / "o que vocês vendem?" ────
  if (has(INTENT_KEYWORDS.catalog) || norm.match(/(o\s+que\s+(voces|vcs|vc)\s+(vende|vendem|tem|oferece|trabalha)|me\s+fala\s+(o\s+que|das|dos|sobre)|quais?\s+(produtos?|remedios?|medicamentos?)\s+(voces|vcs)\s+(tem|vende|oferece)|o\s+que\s+tem\s+(na|pra|de|aqui)|o\s+que\s+(essa|essa|a)\s+farmacia\s+(vende|tem|oferece))/i)) {
    return { type: 'CATALOG_QUERY' };
  }

  // ──── 5. PEDIDO DE AJUDA ────
  if (has(INTENT_KEYWORDS.help)) {
    // "me ajuda", "preciso de ajuda", "tem como me ajudar", "pode me ajudar?"
    if (!has(INTENT_KEYWORDS.purchase)) return { type: 'HELP_REQUEST' };
  }
  // "como funciona?" / "o que vocês fazem?" / "como uso?"
  if (has(INTENT_KEYWORDS.howWorks) && !has(INTENT_KEYWORDS.recipe) && wordCount <= 5) {
    // Só se NÃO é pergunta sobre receita ou delivery
    if (!has(INTENT_KEYWORDS.delivery) && !has(INTENT_KEYWORDS.payment)) {
      return { type: 'HELP_REQUEST' };
    }
  }

  // ──── 6. PERGUNTAS DE PREÇO ────
  if (has(INTENT_KEYWORDS.price) || norm.match(/(quanto\s+(e|ta|fica|sai|custa)|sai\s+quanto|ta\s+quanto)/i)) {
    // Se menciona um produto específico junto, tratamos como busca COM preço (não como price query genérica)
    const parsedCheck = parseMedicinesFromText(rawMsg);
    if (parsedCheck.length > 0) {
      return { type: 'PRODUCT_SEARCH', data: parsedCheck };
    }
    return { type: 'PRICE_QUERY' };
  }

  // ──── 7. PERGUNTAS DE DISPONIBILIDADE ────
  if (has(INTENT_KEYWORDS.avail) && has(INTENT_KEYWORDS.pronRef)) {
    return { type: 'AVAILABILITY_QUERY' };
  }
  if (norm.match(/(voces\s+tem|vcs\s+tem|ta\s+disponivel|tem\s+em\s+estoque|tem\s+(esse|essa|isso|aqui|ai))/i)) {
    // Pode ter produto junto
    const parsedCheck = parseMedicinesFromText(rawMsg);
    if (parsedCheck.length > 0) {
      return { type: 'PRODUCT_SEARCH', data: parsedCheck };
    }
    return { type: 'AVAILABILITY_QUERY' };
  }

  // ──── 8. FAQ ────
  if (has(INTENT_KEYWORDS.hours) || norm.match(/que\s+horas/i))
    return { type: 'FAQ', subtype: 'hours' };
  if (has(INTENT_KEYWORDS.location))
    return { type: 'FAQ', subtype: 'address' };
  if (has(INTENT_KEYWORDS.delivery) && (has(INTENT_KEYWORDS.howWorks) || has(INTENT_KEYWORDS.price) || norm.match(/(como|quanto|qual|taxa|frete|custo)/i)))
    return { type: 'FAQ', subtype: 'delivery' };
  if (has(INTENT_KEYWORDS.payment) && (has(INTENT_KEYWORDS.howWorks) || norm.match(/(forma|aceita|meios?|quais)/i)))
    return { type: 'FAQ', subtype: 'payment' };

  // ──── 9. RECEITA MÉDICA (menção textual) ────
  if (has(INTENT_KEYWORDS.recipeImg) && has(INTENT_KEYWORDS.recipe)) {
    return { type: 'RECIPE_MENTION' };
  }
  // "precisa de receita?", "medicamento controlado", "tarja preta"
  if (has(INTENT_KEYWORDS.recipe) && (has(INTENT_KEYWORDS.howWorks) || norm.match(/(precisa|necessita|tarja|controlado|preta)/i))) {
    return { type: 'FAQ', subtype: 'prescription' };
  }

  // ──── 10. SINTOMAS ────
  const symptoms = [
    { pattern: /cabe(c|ç)a|enxaqueca|cefaleia/i, tag: 'cabeça', label: 'dor de cabeça' },
    { pattern: /azia|queima(c|ç)ao|refluxo|gastrite|est(o|ô)mago/i, tag: 'azia', label: 'dor de estômago ou azia' },
    { pattern: /gripe|resfriad|coriza|espirro/i, tag: 'gripe', label: 'sintomas de gripe' },
    { pattern: /garganta/i, tag: 'garganta', label: 'dor de garganta' },
    { pattern: /tosse/i, tag: 'tosse', label: 'tosse' },
    { pattern: /barriga|diarreia|intestino/i, tag: 'diarreia', label: 'dor de barriga ou diarreia' },
    { pattern: /enjoo|nausea|v(o|ô)mito/i, tag: 'enjoo', label: 'enjoo ou náusea' },
    { pattern: /c(o|ó)lica/i, tag: 'colica', label: 'cólica' },
    { pattern: /febre|quente/i, tag: 'febre', label: 'febre' },
    { pattern: /mus(c)?ul(a|o)/i, tag: 'muscular', label: 'dor muscular' },
    { pattern: /costas/i, tag: 'muscular', label: 'dor nas costas' },
    { pattern: /corpo/i, tag: 'dor', label: 'dor no corpo' },
    { pattern: /alergia|rinite/i, tag: 'alergia', label: 'alergia' },
    { pattern: /micose|frieira/i, tag: 'micose', label: 'micose' },
    { pattern: /laxante|pris(a|ã)o\s+de\s+ventre/i, tag: 'laxante', label: 'prisão de ventre' }
  ];

  for (const s of symptoms) {
    if (s.pattern.test(norm)) {
      return { type: 'SYMPTOM', data: s };
    }
  }

  // ──── 11. MAPA COLOQUIAL ────
  for (const [colKey, tags] of Object.entries(COLLOQUIAL_MAP)) {
    if (norm.includes(colKey)) {
      return { type: 'COLLOQUIAL', data: { key: colKey, tags } };
    }
  }

  // ──── 12. BUSCA DE PRODUTO (última prioridade — só se nada acima matchou) ────
  const parsedItems = parseMedicinesFromText(rawMsg);
  if (parsedItems.length > 0) {
    return { type: 'PRODUCT_SEARCH', data: parsedItems };
  }

  // ──── 13. FAQ catch-all ────
  if (has(INTENT_KEYWORDS.delivery))
    return { type: 'FAQ', subtype: 'delivery' };
  if (has(INTENT_KEYWORDS.payment))
    return { type: 'FAQ', subtype: 'payment' };
  if (has(INTENT_KEYWORDS.recipe))
    return { type: 'FAQ', subtype: 'prescription' };

  // ──── 14. CONVERSACIONAL / ACKNOWLEDGMENT ────
  // Mensagens que são puro ack, gíria, riso, ou small talk
  if (has(INTENT_KEYWORDS.ack)) return { type: 'CONVERSATIONAL' };
  if (count(SMALL_TALK) >= Math.ceil(wordCount * 0.6)) return { type: 'CONVERSATIONAL' };

  // Frases curtas sem substantivo de produto = conversacional
  if (wordCount <= 3) return { type: 'CONVERSATIONAL' };

  // ──── 15. AMBÍGUO — NUNCA diz "não encontrei" ────
  return { type: 'AMBIGUOUS' };
}

// ============ SEMANTIC MATCHERS FOR CONVERSATION ============
/**
 * Detecta se a mensagem do usuário é uma AFIRMAÇÃO / CONFIRMAÇÃO de adição ao carrinho.
 * Cobre centenas de variações naturais de conversa de WhatsApp em português.
 */
function isUserConfirming(norm, rawMsg) {
  const isNegative = norm.match(/^n[aã]o\b/i) || norm.match(/(nao\s+quero|outro|mudei\s+de\s+ideia|deixa\s+pra\s+la|cancela)/i);
  if (isNegative) return false;

  // Dosage qualification: "sim mas não nessa dosagem" is NOT a pure confirmation
  const hasDosageQualification = /\b(n[ãa]o\s+(nessa|nesta|nesse|neste|essa|esta|esse|este)\s+(dosagem|dose|concentra[cç][aã]o|mg))|outra\s+(dosagem|dose|concentra[cç][aã]o)|dosagem\s+(diferente|errada|outra)|mas\s+(n[ãa]o\s+)?(nessa|nesta|nesse|neste|essa|esta|outra)\s+(dosagem|dose)/i.test(rawMsg || '');
  if (hasDosageQualification) return false;

  const confirmPatterns = [
    /\b(sim|s|pode|podera|coloca|coloque|colocar|bota|botar|poe|põem|põe|inclui|incluir|adicione|adiciona|adicionar|carrinho|pedido|manda|mandar|levar|levo|quero|querer|pretendo|comprar|compra|reserva|reservar|separa|separar|garantir)\b/i,
    /\b(e\s+esse|e\s+essa|e\s+isso|isso\s+mesmo|exato|exatamente|perfeito|otimo|ótimo|show|massa|top|beleza|blz|fechado|combinado|bora|partiu|dale)\b/i,
    /(por\s+favor|por\s+gentileza|pode\s+ser|pode\s+sim|pode\s+mandar|pode\s+colocar|pode\s+adicionar|pode\s+botar|pode\s+enviar|pode\s+incluir|pode\s+separar|pode\s+reservar|vou\s+querer|vou\s+levar|me\s+ve|me\s+vê)/i,
    /(no\s+carrinho|pro\s+carrinho|ao\s+carrinho|no\s+pedido|pro\s+pedido)/i
  ];

  return confirmPatterns.some(p => p.test(norm));
}

/**
 * Detecta se a mensagem do usuário é uma NEGAÇÃO ou RECUSA do item oferecido.
 */
function isUserRejecting(norm, rawMsg) {
  const startsWithNo = norm.match(/^n[aã]o\b/i) || norm.match(/^(n|nope)$/i);
  const isExplicitNo = norm.match(/(nao\s+quero|outro|mudei\s+de\s+ideia|deixa\s+pra\s+la|cancela|desisto|prefiro|estou\s+so\s+olhando)/i);
  return startsWithNo || isExplicitNo;
}

// ============ IDLE STATE (REFACTORED — intent-based routing) ============
function handleIdleState(norm, rawMsg) {
  // ── GUARDA CONTEXTUAL DE CONFIRMAÇÃO ──
  // Se o usuário confirma em linguagem natural e existe produto no contexto
  if (isUserConfirming(norm, rawMsg) && (state.pendingItem || state.lastMentionedProduct)) {
    const drug = state.pendingItem ? state.pendingItem.drug : state.lastMentionedProduct;
    const price = state.pendingItem ? (state.pendingItem.finalPrice || drug.price) : _applyDiscount(drug).price;
    state.cart.push({ drug, quantity: state.pendingItem ? state.pendingItem.quantity : 1, finalPrice: price });
    state.pendingItem = null;
    state.pendingItemsList = [];
    state.simState = 'more_items';
    const total = cartTotal();
    return `Adicionado! ✅\n\n*Carrinho atual:*\n${cartSummary()}\n*Subtotal: R$ ${total.toFixed(2)}*\n\nQuer adicionar mais algum medicamento? Me diga o nome ou escreva *finalizar* para fechar o pedido. 🛒`;
  }

  const intent = classifyIntent(norm, rawMsg);

  switch (intent.type) {
    case 'PHOTO_ANNOUNCEMENT':
      return 'Com certeza! Pode enviar a foto do remédio ou da receita que eu analiso para você e verifico a disponibilidade no estoque! 📷';

    case 'FAREWELL':
      return 'De nada! Sempre que precisar de algum medicamento ou tiver alguma dúvida, é só me chamar por aqui. Tenha um ótimo dia! 😊';

    case 'GREETING': {
      const lower = rawMsg.toLowerCase();
      let timeGreeting = '';
      if (lower.includes('boa tarde')) timeGreeting = 'Boa tarde!';
      else if (lower.includes('bom dia')) timeGreeting = 'Bom dia!';
      else if (lower.includes('boa noite')) timeGreeting = 'Boa noite!';

      const asksHowAreYou = lower.match(/(tudo\s+(bem|bom|certo|joia|tranquilo|beleza)|como\s+(vai|voce\s+ta|vc\s+ta|esta))/i);

      if (state.hasGreeted) {
        if (asksHowAreYou) {
          const responses = [
            `${timeGreeting ? timeGreeting + ' ' : ''}Tudo bem por aqui, e com você? 😊 Como posso te ajudar?`,
            `${timeGreeting ? timeGreeting + ' ' : ''}Tudo ótimo, graças a Deus! E você, como está? 😊 Em que posso te ajudar?`,
            `${timeGreeting ? timeGreeting + ' ' : ''}Tudo joia por aqui! 😊 O que você precisa no momento?`
          ];
          return responses[Math.floor(Math.random() * responses.length)];
        } else {
          const responses = [
            `${timeGreeting ? timeGreeting + ' ' : 'Oi! '}Como posso te ajudar hoje? 😊`,
            `${timeGreeting ? timeGreeting + ' ' : 'Oi! '}Em que posso te ajudar? 😊`,
            `${timeGreeting ? timeGreeting + ' ' : 'Oi! '}O que você precisa no momento? Tô à disposição! 😊`
          ];
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }

      state.hasGreeted = true;
      if (asksHowAreYou) {
        const responses = [
          `${timeGreeting ? timeGreeting + ' ' : ''}Tudo ótimo por aqui, e com você? 😊 Sou a Sofia da Farmácia. Como posso te ajudar hoje?`,
          `${timeGreeting ? timeGreeting + ' ' : ''}Tudo bem, graças a Deus! 😊 Sou a Sofia da Farmácia. Em que posso te ajudar hoje?`,
          `${timeGreeting ? timeGreeting + ' ' : ''}Tudo joia por aqui! 😊 Sou a Sofia da Farmácia. O que você precisa hoje?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      } else {
        const prefix = timeGreeting ? `${timeGreeting} ` : 'Oi! ';
        const responses = [
          `${prefix}Tudo bem? 😊 Sou a Sofia da Farmácia. Como posso te ajudar hoje?`,
          `${prefix}Seja bem-vindo(a)! 😊 Sou a Sofia da Farmácia. Em que posso te ajudar hoje?`,
          `${prefix}Tudo bem com você? 😊 Sou a Sofia da Farmácia. O que você precisa hoje?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    case 'GREETING_WITH_INTENT': {
      // Saudação com intenção de compra/ajuda — saúda E já responde
      const alreadyGreeted = state.hasGreeted;
      state.hasGreeted = true;
      const lower = rawMsg.toLowerCase();
      let timeGreeting = '';
      if (lower.includes('boa tarde')) timeGreeting = 'Boa tarde!';
      else if (lower.includes('bom dia')) timeGreeting = 'Bom dia!';
      else if (lower.includes('boa noite')) timeGreeting = 'Boa noite!';
      const prefix = alreadyGreeted ? '' : (timeGreeting ? `${timeGreeting} ` : 'Oi! ');

      // Tenta extrair produto específico da mensagem
      const parsedProducts = parseMedicinesFromText(rawMsg);
      if (parsedProducts.length > 0) {
        // Tem produto mencionado — já apresenta o produto!
        state.pendingItemsList = parsedProducts;
        return (alreadyGreeted ? '' : `${prefix}Tudo bem? 😊||`) + proceedToQuoteAfterCpf();
      }

      // Sem produto específico — saúda e pede detalhes
      if (alreadyGreeted) {
        const responses = [
          'Claro, posso te ajudar! Qual medicamento você está procurando?',
          'Show, vamos lá! Me diz o nome do remédio que você precisa.',
          'Com certeza! Me conta o nome do medicamento ou manda uma foto da receita.'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }

      const responses = [
        `${prefix}Tudo bem? 😊 Me diz o nome do medicamento que você precisa, ou me manda uma foto que eu identifico pra você!`,
        `${prefix}Tudo bem com você? 😊 Me conta o que você precisa — pode ser o nome do remédio, uma foto, ou até o que tá sentindo!`,
        `${prefix}Que bom que veio! 😊 Me diz o que você precisa que eu busco aqui pra você.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    case 'PURCHASE_INTENT': {
      // Intenção genérica de compra — NÃO busca produto, pede detalhes
      const responses = [
        'Claro! 😊 Me diz o que você precisa que eu busco aqui.',
        'Com certeza! O que você gostaria de pedir?',
        'Pode falar! Me diz o nome do medicamento ou produto que eu te ajudo.',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    case 'HELP_REQUEST':
      return 'Claro, tô aqui pra isso! 😊 Posso te ajudar com medicamentos, produtos, preços, ou tirar dúvidas. Me conta o que você precisa!';

    case 'PRICE_QUERY': {
      // Se tem um produto mencionado recentemente, referencia ele
      if (state.lastMentionedProduct) {
        const drug = state.lastMentionedProduct;
        const { price } = _applyDiscount(drug);
        state.lastMentionedProduct = drug;
        return `O ${drug.name} (${drug.presentation}) tá R$ ${price.toFixed(2)}. Quer que eu coloque no carrinho?`;
      }
      return 'De qual medicamento ou produto você quer saber o preço? Me diz o nome que eu busco aqui. 😊';
    }

    case 'AVAILABILITY_QUERY': {
      if (state.lastMentionedProduct) {
        const drug = state.lastMentionedProduct;
        return `Sim, temos o ${drug.name} disponível! Quer que eu passe o preço?`;
      }
      return 'Qual medicamento ou produto você quer verificar? Me diz o nome que eu checo no estoque!';
    }

    case 'FAQ':
      switch (intent.subtype) {
        case 'hours':
          return 'Funcionamos de segunda a sábado das 7h às 22h, e aos domingos das 8h às 18h. ⏰';
        case 'address':
          return 'Ficamos na Rua da Saúde, 500 - Centro. Quer dar uma passada aqui ou prefere que a gente entregue?';
        case 'delivery':
          return 'Nosso delivery funciona de segunda a sábado das 8h às 21h30. A taxa é R$ 5,00 pra qualquer bairro. Quer pedir algo?';
        case 'payment':
          return 'Aceitamos Pix, cartão de crédito/débito e dinheiro na entrega. 💳';
        case 'prescription':
          return 'Medicamento comum precisa de receita simples. Antibiótico precisa de 2 vias (uma retida, entregamos no delivery). Tarja Preta e Roacutan só presencialmente na farmácia. 🚫';
      }
      break;

    case 'RECIPE_MENTION': {
      // Menção textual a receita — simula OCR com dados variados
      return _handleRecipeOCR();
    }

    case 'SYMPTOM': {
      const s = intent.data;
      const suggestions = MEDICINES_DB.filter(d => d.tags.includes(s.tag)).slice(0, 3);
      if (suggestions.length > 0) {
        suggestions.forEach(d => state.lastMentionedProduct = d);
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Pra ${s.label} temos estas opções:||${list}||Qual delas você prefere?`;
      }
      return `Pra ${s.label}, o ideal é consultar um médico ou farmacêutico. Posso te ajudar com outra coisa?`;
    }

    case 'COLLOQUIAL': {
      const { key, tags } = intent.data;
      const suggestions = MEDICINES_DB.filter(d => tags.some(t => d.tags.includes(t))).slice(0, 3);
      if (suggestions.length > 0) {
        suggestions.forEach(d => state.lastMentionedProduct = d);
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Temos estas opções pra ${key}:||${list}||Qual você costuma usar?`;
      }
      return `Infelizmente não achei opções de ${key} no momento. Posso te ajudar com outra coisa?`;
    }

    case 'CATALOG_QUERY': {
      // Resposta sobre o catálogo da farmácia — mostra categorias e exemplos
      const categories = {};
      MEDICINES_DB.forEach(d => {
        const cat = d.category || 'Diversos';
        if (!categories[cat]) categories[cat] = 0;
        categories[cat]++;
      });
      const topCats = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([cat, count]) => `• *${cat}* (${count} produtos)`);
      const examples = MEDICINES_DB.slice(0, 5).map(d => d.name);
      return `Trabalhamos com uma variedade enorme de produtos! 😊 Temos mais de ${MEDICINES_DB.length} itens, incluindo:\n\n${topCats.join('\n')}\n\nAlguns exemplos: ${examples.join(', ')}...\n\nMe diz o que você precisa — pode ser o nome do remédio, ou me conta o que você tá sentindo que eu busco as melhores opções! 💊`;
    }

    case 'PRODUCT_SEARCH': {
      const parsedItems = intent.data;
      // Salva último produto mencionado para referências contextuais
      if (parsedItems.length > 0) {
        state.lastMentionedProduct = parsedItems[parsedItems.length - 1].drug;
      }
      state.pendingActionRawText = rawMsg;
      // CPF movido para o checkout — vai direto para cotação
      state.pendingItemsList = parsedItems;
      return proceedToQuoteAfterCpf();
    }

    case 'CONVERSATIONAL': {
      if (state.cart.length > 0) {
        return `Seu carrinho atual tem ${state.cart.length} item(ns) (R$ ${cartTotal().toFixed(2)}).\n\nQuer adicionar mais algum medicamento ou prefere escrever *finalizar* para fechar o pedido? 🛒`;
      }
      if (state.lastMentionedProduct) {
        const drug = state.lastMentionedProduct;
        return `Você gostaria de adicionar o *${drug.name}* (R$ ${drug.price.toFixed(2)}) ao carrinho? Se sim, é só me confirmar! 😊`;
      }
      return 'Tô aqui pra te ajudar! 😊 Me diz o nome do medicamento que você precisa, ou me conta o que tá sentindo que eu busco as opções.';
    }

    case 'AMBIGUOUS': {
      if (state.cart.length > 0) {
        return `Seu carrinho tem ${state.cart.length} item(ns). Quer incluir outro produto ou prefere escrever *finalizar* para fechar o pedido? 🛒`;
      }
      if (state.lastMentionedProduct) {
        const drug = state.lastMentionedProduct;
        return `Posso colocar o *${drug.name}* no seu carrinho por R$ ${drug.price.toFixed(2)}? 😊`;
      }
      const trimmed = rawMsg.trim();
      if (trimmed.length < 3) {
        return 'Oi! Me diz o nome do medicamento ou o que você tá sentindo que eu te ajudo. 😊';
      }
      // Respostas variadas para evitar repetição robotica
      const ambiguousResponses = [
        'Posso te ajudar com medicamentos, consultar preços, verificar estoque, ou tirar dúvidas. Me conta o que você precisa! 😊',
        'Tô aqui pra ajudar! Você pode me dizer o nome de um remédio, me contar um sintoma, ou perguntar sobre nossos produtos. 💊',
        'Me diz o que você precisa — pode ser o nome de um remédio, um sintoma, ou qualquer dúvida sobre nossos produtos! 😊',
      ];
      return ambiguousResponses[Math.floor(Math.random() * ambiguousResponses.length)];
    }
  }

  return 'Tô aqui pra te ajudar! Me diz o que você precisa. 😊';
}

// Helper: Simula OCR de receita com dados variados (não hardcoded)
function _handleRecipeOCR() {
  // Seleciona medicamentos variados do banco para simular OCR realista
  let candidates = MEDICINES_DB.filter(d => d.needsRecipe && d.allowsDelivery !== false);

  // Fallback: se não tem medicamentos com receita, usa qualquer um
  if (candidates.length < 2) {
    candidates = MEDICINES_DB.filter(d => d.allowsDelivery !== false && d.price > 0);
  }

  // Garante pelo menos 1 medicamento
  if (candidates.length === 0) {
    return '📋 Recebi a receita! Me diz o nome do medicamento que está nela que eu busco aqui pra você.';
  }

  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(2, shuffled.length));
  const list = selected.map(d => ({ drug: d, quantity: 1 }));

  // Salva contexto
  state.lastMentionedProduct = selected[selected.length - 1];

  // CPF movido para o checkout — vai direto para cotação
  state.pendingItemsList = list;
  return `🔎 *Escaneando receita médica...*\n\nIdentifiquei na receita:\n${selected.map(d => `• 1x ${d.name}`).join('\n')}\n\n` + proceedToQuoteAfterCpf();
}

// ============ FUZZY MEDICINE FINDER ============
function _levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function _findDrugVariantWithDose(baseDrug, targetDoseStr) {
  if (!baseDrug || !targetDoseStr) return null;
  const targetDose = targetDoseStr.toLowerCase().replace(/\s+/g, '');
  const baseNameClean = normalizeText(baseDrug.name || '').replace(/[\d\.,\s]+(mg|g|ml)/gi, '').trim();
  const activeClean = normalizeText(baseDrug.activeIngredient || baseDrug.principleActive || baseDrug.activePrinciple || '').replace(/[\d\.,\s]+(mg|g|ml)/gi, '').trim();

  for (const d of MEDICINES_DB) {
    if (d === baseDrug) continue;
    const dName = normalizeText(d.name || '');
    const dPres = normalizeText(d.presentation || '');
    const dActive = normalizeText(d.activeIngredient || d.principleActive || d.activePrinciple || '');
    const full = (dName + ' ' + dPres + ' ' + dActive).toLowerCase().replace(/\s+/g, '');

    if (!full.includes(targetDose)) continue;

    if ((baseNameClean.length >= 3 && dName.includes(baseNameClean)) ||
        (activeClean.length >= 3 && dActive.includes(activeClean))) {
      return d;
    }
  }
  return null;
}

/**
 * Finds all dosage variants of a medicine by matching on activeIngredient or base name.
 */
function _findAllDosageVariants(drug) {
  if (!drug) return [];
  const baseActive = normalizeText(drug.activeIngredient || drug.activePrinciple || drug.principleActive || '').replace(/[\d\.,\s]+(mg|g|ml)/gi, '').trim();
  const baseName = normalizeText(drug.name || '').replace(/[\d\.,\s]+(mg|g|ml)/gi, '').replace(/\s+(generico|generica|ache|ems|medley|eurofarma|germed|neo\s+quimica|pharlab|prati).*$/i, '').trim();
  if (!baseActive && !baseName) return [];

  const variants = [];
  const seenDoses = new Set();

  for (const d of MEDICINES_DB) {
    const dActive = normalizeText(d.activeIngredient || d.activePrinciple || d.principleActive || '').replace(/[\d\.,\s]+(mg|g|ml)/gi, '').trim();
    const dName = normalizeText(d.name || '');
    const isMatch = (baseActive.length >= 3 && dActive === baseActive) ||
                    (baseName.length >= 3 && dName.includes(baseName));
    if (!isMatch) continue;

    // Extract dose from name
    const doseMatch = d.name.match(/(\d+([\.,]\d+)?\s*(mg|g|ml))/i);
    const doseKey = doseMatch ? doseMatch[1].toLowerCase().replace(/\s+/g, '') : d.name;
    if (seenDoses.has(doseKey)) continue;
    seenDoses.add(doseKey);
    variants.push(d);
  }

  return variants;
}

function fuzzyFindMedicine(term) {
  if (!term || typeof term !== 'string') return null;
  const clean = term.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9áéíóúâêôãõç]/g, ' ').trim();
  const norm = normalizeText(clean).replace(/[^a-z0-9]/g, '');
  if (norm.length < 3) return null;

  const direct = parseMedicinesFromText(clean);
  if (direct.length > 0) return direct[0].drug;

  const doseMatch = clean.match(/(\d+([\.,]\d+)?)\s*(mg|g|ml)/i);
  const targetDose = doseMatch ? doseMatch[0].toLowerCase().replace(/\s+/g, '') : null;

  let bestMatch = null;
  let minDistance = 999;
  let matchesWithoutDose = [];

  for (const drug of MEDICINES_DB) {
    const targets = [drug.name, ...(drug.aliases || [])];
    for (const t of targets) {
      const normT = normalizeText(t).replace(/[^a-z0-9]/g, '');
      if (!normT || normT.length < 3) continue;

      if (normT.includes(norm) || norm.includes(normT)) {
        if (targetDose && normT.includes(targetDose)) {
          return drug; // Match exato com dosagem!
        }
        matchesWithoutDose.push(drug);
      }

      if (Math.abs(normT.length - norm.length) <= 3) {
        let dist = _levenshtein(norm, normT);
        if (dist < minDistance && dist <= 2) {
          minDistance = dist;
          bestMatch = drug;
        }
      }
    }
  }

  if (targetDose) {
    const doseMatchItem = matchesWithoutDose.find(d => 
      normalizeText(d.name + ' ' + d.presentation).toLowerCase().replace(/\s+/g, '').includes(targetDose)
    );
    if (doseMatchItem) return doseMatchItem;
  }

  return matchesWithoutDose.length > 0 ? matchesWithoutDose[0] : bestMatch;
}

// ============ INTELLIGENT IMAGE SIMULATION ============
/**
 * Processa imagens de forma inteligente em modo simulação.
 * REGRA DE OURO: Se identificação confiável → apresenta produto.
 * Se ilegível/desconhecido → declara que não identificou. NUNCA INVENTA E NUNCA REPETE ITEM JÁ NO CARRINHO.
 */
function _handleImageSimulation(fileName) {
  // Análise contextual: verifica as últimas mensagens para pistas
  const recentMsgs = state.messages || [];
  const recentUserMsgs = recentMsgs
    .filter(m => m.sender === 'user')
    .slice(-5)
    .map(m => (m.text || '').toLowerCase())
    .join(' ');

  const fn = (fileName || '').toLowerCase();

  // ── CENÁRIO 1: Contexto claro de RECEITA MÉDICA ──
  const isRecipeContext = /receita|prescri|medico|consulta|exame|rx|crm/.test(recentUserMsgs)
    || /receita|prescri|rx|crm/.test(fn);

  if (isRecipeContext) {
    return `📋 *Analisando imagem da receita...*||${_handleRecipeOCR()}`;
  }

  // ── CENÁRIO 2: Análise do nome/pistas do arquivo ──
  const matchedFromFileName = fuzzyFindMedicine(fileName);
  if (matchedFromFileName) {
    const drug = matchedFromFileName;
    const variants = _findAllDosageVariants(drug);

    // Se há múltiplas dosagens, mostra as opções ao invés de assumir uma
    if (variants.length > 1) {
      state.lastMentionedProduct = drug;
      state.pendingDosageVariants = variants;
      state.simState = 'waiting_dosage_selection';
      const variantList = variants.map((v, i) => {
        const { price } = _applyDiscount(v);
        const doseMatch = v.name.match(/(\d+([\.,]\d+)?\s*(mg|g|ml))/i);
        const doseLabel = doseMatch ? doseMatch[1] : v.name;
        return `${i + 1}. *${v.name}* — R$ ${price.toFixed(2)}`;
      }).join('\n');
      const needsRecipeNote = drug.needsRecipe ? '\n\n⚠️ Este medicamento necessita de receita médica.' : '';
      return `📷 *Analisando imagem...*||Identifiquei *${normalizeText(drug.activeIngredient || drug.name).replace(/[\d\.,\s]+(mg|g|ml)/gi, '').trim()}*! Temos em mais de uma dosagem:\n\n${variantList}${needsRecipeNote}||Qual dosagem você precisa? Me diz o número ou a dosagem (ex: *2mg*).`;
    }

    // Dosagem única — fluxo normal
    const { price } = _applyDiscount(drug);
    state.lastMentionedProduct = drug;
    state.pendingItem = { drug, quantity: 1, finalPrice: price };
    state.simState = 'confirm_add_cart';
    const needsRecipeNote = drug.needsRecipe ? '\n⚠️ Este medicamento necessita de receita médica.' : '';
    return `📷 *Analisando imagem...*||Identifiquei: *${drug.name}*\n📦 ${drug.presentation}\n💰 R$ ${price.toFixed(2)}${needsRecipeNote}||Esse é o medicamento que você precisa? Se sim, posso adicionar ao carrinho!`;
  }

  // ── CENÁRIO 3: Se a foto é genérica (sem nome no arquivo), usa produto recente DESDE QUE AINDA NÃO ESTEJA NO CARRINHO ──
  const isAlreadyInCart = state.lastMentionedProduct && state.cart.some(c => (c.drug ? c.drug.id : c.id) === state.lastMentionedProduct.id);
  if (state.lastMentionedProduct && !isAlreadyInCart) {
    const drug = state.lastMentionedProduct;
    const { price } = _applyDiscount(drug);
    state.pendingItem = { drug, quantity: 1, finalPrice: price };
    state.simState = 'confirm_add_cart';
    return `📷 *Analisando imagem...*||Identifiquei: *${drug.name}* (${drug.presentation}).||Temos disponível por R$ ${drug.price.toFixed(2)}. Quer que eu adicione ao carrinho? 🛒`;
  }

  // ── CENÁRIO 4: Sem correspondência confiável → DECLARA QUE NÃO IDENTIFICOU (NUNCA REPETE PRODUTO ANTIGO) ──
  return '📷 *Analisando imagem...*||Não consegui identificar com clareza o nome do medicamento na foto. 🤔\n\nPoderia digitar o nome do produto ou enviar uma imagem com o rótulo bem visível? Assim consigo te ajudar certinho! 😊';
}

/**
 * Processa áudio de forma inteligente em modo simulação.
 * Seleciona medicamentos variados do banco ao invés de hardcoded.
 */
function _handleAudioSimulation() {
  // Seleciona medicamentos variados e comuns para simular reconhecimento
  const commonDrugs = MEDICINES_DB.filter(d => !d.isGeneric && d.allowsDelivery !== false);
  const pick = commonDrugs.length > 0
    ? commonDrugs[Math.floor(Math.random() * commonDrugs.length)]
    : MEDICINES_DB[0];

  if (pick) {
    state.lastMentionedProduct = pick;
    const parsedItems = [{ drug: pick, quantity: 1 }];
    state.pendingItemsList = parsedItems;
    // CPF movido para o checkout — vai direto para cotação
    return `🎤 *Processando áudio...*||Entendi que você precisa de *${pick.name}*.||${proceedToQuoteAfterCpf()}`;
  }

  return '🎤 Recebi seu áudio, mas não consegui entender claramente. Pode digitar o que você precisa?';
}

// ============ CALCULATION ============
function performCalculationAndOffer(drug, dose, frequency, days, type) {
  let quantityNeeded;
  if (type === 'gotas') {
    const mlNeeded  = (dose * frequency * days) / 20;
    const mlMatch   = drug.presentation.match(/(\d+)\s*ml/i);
    const bottleSize = mlMatch ? parseInt(mlMatch[1]) : 20;
    quantityNeeded  = Math.ceil(mlNeeded / bottleSize);
  } else {
    const totalPills = dose * frequency * days;
    const cpMatch    = drug.presentation.match(/(\d+)\s*(comprimidos|capsulas|cps|envelopes|pastilhas)/i);
    const pillsPerBox = cpMatch ? parseInt(cpMatch[1]) : 20;
    quantityNeeded   = Math.ceil(totalPills / pillsPerBox);
  }

  const { price, notice } = _applyDiscount(drug);
  state.pendingItem       = { drug, quantity: quantityNeeded, finalPrice: price };
  state.simState          = 'confirm_add_cart';

  const container = quantityNeeded > 1
    ? (type === 'gotas' ? 'frascos' : 'caixas')
    : (type === 'gotas' ? 'frasco'  : 'caixa');

  return `Pro tratamento completo de ${days} dias, você vai precisar de ${quantityNeeded} ${container} de ${drug.name}.||Fica R$ ${(quantityNeeded * price).toFixed(2)} no total${notice}.${_recipeMsg(drug)}${_infoMsg(drug)}||Quer que eu adicione ao pedido?`;
}

// ============ STATE HANDLERS ============

/** State: confirm_brand_or_generic — "Quer o genérico ou referência?" */
function handleConfirmBrandOrGeneric(norm) {
  const pG = state.pendingGeneric;
  const pB = state.pendingBrand;
  if (!pG || !pB) { state.simState = 'idle'; return 'Ocorreu um erro no fluxo do pedido. No que posso ajudar?'; }

  const hasNo = norm.match(/\b(nao|no|n|nem|prefiro\s+(o\s+)?(de\s+)?marca|original|referencia)\b/i);
  const hasYes = norm.match(/\b(sim|s|quero|pode|manda|economizar|barato|generico)\b/i);
  
  let wantsGeneric = false;

  if (hasNo) {
    wantsGeneric = false;
    // Exceção: "não quero o de marca" ou "prefiro o genérico"
    if (norm.match(/nao\s+quero\s+(o\s+)?(de\s+)?marca/i) || norm.match(/prefiro\s+(o\s+)?generico/i) || norm.includes('generico')) {
      if (!norm.match(/nao\s+quero\s+(o\s+)?generico/i) && !norm.match(/generico\s+nao/i)) {
        wantsGeneric = true;
      }
    }
  } else if (hasYes) {
    wantsGeneric = true;
  } else {
    // Ambíguo — pede clarificação ao invés de assumir
    return `Não entendi qual você prefere. 🤔\n\n• *Genérico* (${pG.drug.name}) — R$ ${(pG.finalPrice || pG.drug.price).toFixed(2)}\n• *Referência* (${pB.drug.name}) — R$ ${(pB.finalPrice || pB.drug.price).toFixed(2)}\n\nDigite *genérico* ou *referência*!`;
  }

  const chosen = wantsGeneric ? pG : pB;

  state.pendingItem   = chosen;
  state.pendingGeneric = null;
  state.pendingBrand  = null;
  state.simState      = 'confirm_add_cart';

  const price     = chosen.finalPrice || chosen.drug.price;
  const totalText = chosen.quantity > 1
    ? ` R$ ${(price * chosen.quantity).toFixed(2)} no total`
    : ` R$ ${price.toFixed(2)}`;
  const label     = wantsGeneric ? `Genérico (${chosen.drug.name})` : `referência (${chosen.drug.name})`;

  return `Combinado, vamos levar o ${label}. Fica${totalText}.${_recipeMsg(chosen.drug)}||Posso colocar no carrinho?`;
}

/**
 * State: confirm_add_cart — "Posso colocar no carrinho?"  (FIX #1)
 */
function handleConfirmAddCartState(norm, rawMsg) {
  const currentPending = state.pendingItem || (state.lastMentionedProduct ? { drug: state.lastMentionedProduct, quantity: 1 } : null);

  // ── PASSO 1: Detecta QUALQUER menção a dosagem na resposta ──
  const doseMatch = rawMsg.match(/(\d+([\.,]\d+)?)\s*(mg|g|ml)/i);
  const userDose = doseMatch ? doseMatch[0] : null;

  // ── PASSO 2: Detecta frases de CORREÇÃO DE DOSAGEM (sem dose explícita) ──
  // Ex: "é este mas nao nesta dosagem", "sim mas nao nessa dosagem", "sim mas outra dosagem"
  const hasDosageCorrection = /\b(n[ãa]o\s+(nessa|nesta|nesse|neste|essa|esta|esse|este)\s+(dosagem|dose|concentra[cç][aã]o|mg))|\b(outra\s+(dosagem|dose|concentra[cç][aã]o))|\b(dosagem\s+(diferente|errada|outra))|\b(mas\s+(n[ãa]o\s+)?(nessa|nesta|nesse|neste|essa|esta|outra)\s+(dosagem|dose))/i.test(rawMsg);

  // ── PASSO 3: Se tem dose explícita DIFERENTE da pendente → corrige direto ──
  if (userDose && currentPending && currentPending.drug) {
    const currentPres = (currentPending.drug.name + ' ' + (currentPending.drug.presentation || '')).toLowerCase().replace(/\s+/g, '');
    const userDoseNorm = userDose.toLowerCase().replace(/\s+/g, '');
    if (!currentPres.includes(userDoseNorm)) {
      const correctedDrug = _findDrugVariantWithDose(currentPending.drug, userDose) || fuzzyFindMedicine(`${currentPending.drug.name} ${userDose}`);
      if (correctedDrug) {
        const { price } = _applyDiscount(correctedDrug);
        state.pendingItem = { drug: correctedDrug, quantity: currentPending.quantity || 1, finalPrice: price };
        state.lastMentionedProduct = correctedDrug;
        state.simState = 'confirm_add_cart';
        const needsRecipeNote = correctedDrug.needsRecipe ? '\n⚠️ Este medicamento necessita de receita médica.' : '';
        return `Entendi! Encontrei *${correctedDrug.name}* (${correctedDrug.presentation}) por R$ ${price.toFixed(2)}.${needsRecipeNote}||Posso colocar esse no carrinho? 😊`;
      }
    }
  }

  // ── PASSO 4: Se pede dosagem diferente SEM especificar qual → mostra opções ──
  if (hasDosageCorrection && currentPending && currentPending.drug) {
    const variants = _findAllDosageVariants(currentPending.drug);
    if (variants.length > 1) {
      state.pendingDosageVariants = variants;
      state.simState = 'waiting_dosage_selection';
      const variantList = variants.map((v, i) => {
        const { price } = _applyDiscount(v);
        return `${i + 1}. *${v.name}* — R$ ${price.toFixed(2)}`;
      }).join('\n');
      return `Sem problema! Temos essas dosagens disponíveis:\n\n${variantList}\n\nQual você precisa? Me diz o número ou a dosagem (ex: *2mg*). 😊`;
    } else {
      return `Infelizmente só temos *${currentPending.drug.name}* nessa dosagem. Quer que eu adicione ao carrinho mesmo assim, ou prefere outro medicamento?`;
    }
  }

  // ── PASSO 5: Negação pura ──
  if (isUserRejecting(norm, rawMsg)) {
    state.pendingItem      = null;
    state.pendingItemsList = [];

    const afterNo = rawMsg.replace(/^[Nn][ãa]o\.?\s*/i, '').trim();
    if (afterNo.length >= 3) {
      const newItems = parseMedicinesFromText(afterNo);
      if (newItems.length > 0) {
        state.pendingItemsList = newItems;
        return proceedToQuoteAfterCpf();
      }
    }

    state.simState = state.cart.length > 0 ? 'more_items' : 'idle';
    return state.cart.length > 0
      ? 'Ok, não adicionei. Quer adicionar outro medicamento ou *finalizar* o pedido?'
      : 'Sem problemas! Se quiser ver outro remédio, é só me chamar. 😊';
  }

  // ── PASSO 6: Confirmação pura ──
  if (isUserConfirming(norm, rawMsg)) {
    if (!state.pendingItem && state.lastMentionedProduct) {
      const drug = state.lastMentionedProduct;
      const { price } = _applyDiscount(drug);
      state.pendingItem = { drug, quantity: 1, finalPrice: price };
    }
    if (state.pendingItem) {
      state.cart.push(state.pendingItem);
      state.pendingItem = null;
    } else if (state.pendingItemsList.length > 0) {
      state.pendingItemsList.forEach(i => state.cart.push(i));
      state.pendingItemsList = [];
    }
    state.simState = 'more_items';
    const total = cartTotal();
    const addedMsg = `Adicionado! ✅\n\n*Carrinho atual:*\n${cartSummary()}\n*Subtotal: R$ ${total.toFixed(2)}*`;

    return `${addedMsg}\n\nQuer adicionar mais algum medicamento? Me diga o nome ou escreva *finalizar* para fechar o pedido. 🛒`;
  }

  const fallbacks = [
    'Posso colocar no carrinho? Responde *sim* ou *não*! 😊',
    'Então, coloco no carrinho? 🛒',
    'Quer levar esse? Me diz *sim* ou *não*!'
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

/**
 * State: waiting_dosage_selection — user must choose a dosage from variants list.
 * Accepts: number (1, 2, 3...), dosage string ("2mg", "0.5mg"), or name fragment.
 */
function handleWaitingDosageSelection(norm, rawMsg) {
  const variants = state.pendingDosageVariants || [];
  if (variants.length === 0) {
    state.simState = 'idle';
    return 'Desculpe, me perdi. Me diga o nome do medicamento que você precisa!';
  }

  // Rejection/cancel
  if (isUserRejecting(norm, rawMsg)) {
    state.pendingDosageVariants = [];
    state.simState = state.cart.length > 0 ? 'more_items' : 'idle';
    return state.cart.length > 0
      ? 'Ok! Quer adicionar outro medicamento ou *finalizar* o pedido?'
      : 'Sem problemas! Se precisar de algum remédio, é só me chamar. 😊';
  }

  let selectedDrug = null;

  // Match by number (1, 2, 3...)
  const numMatch = rawMsg.match(/^\s*(\d+)\s*$/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (idx >= 0 && idx < variants.length) {
      selectedDrug = variants[idx];
    }
  }

  // Match by dosage string ("2mg", "0.5 mg", etc.)
  if (!selectedDrug) {
    const doseMatch = rawMsg.match(/(\d+([.,]\d+)?)\s*(mg|g|ml)/i);
    if (doseMatch) {
      const targetDose = doseMatch[0].toLowerCase().replace(/\s+/g, '');
      selectedDrug = variants.find(v => {
        const vName = (v.name + ' ' + (v.presentation || '')).toLowerCase().replace(/\s+/g, '');
        return vName.includes(targetDose);
      });
    }
  }

  // Match by bare number as dose: "de 2", "o de 2", "quero 2", "a 2" → try 2mg, 2g, 2ml
  if (!selectedDrug) {
    const bareNumMatch = rawMsg.match(/(?:^|\s)(\d+([.,]\d+)?)\s*$/i) || rawMsg.match(/\b(?:de|o|a|quero|preciso)\s+(\d+([.,]\d+)?)\b/i);
    if (bareNumMatch) {
      const num = bareNumMatch[1] || bareNumMatch[3];
      if (num) {
        const numNorm = num.replace(',', '.');
        // Try matching as dose (append mg, g, ml)
        for (const unit of ['mg', 'g', 'ml']) {
          const tryDose = numNorm + unit;
          const found = variants.find(v => {
            const vName = (v.name + ' ' + (v.presentation || '')).toLowerCase().replace(/\s+/g, '').replace(',', '.');
            return vName.includes(tryDose);
          });
          if (found) { selectedDrug = found; break; }
        }
        // Also try as option number if still no match
        if (!selectedDrug) {
          const idx = parseInt(num, 10) - 1;
          if (idx >= 0 && idx < variants.length) {
            selectedDrug = variants[idx];
          }
        }
      }
    }
  }

  // Match by name fragment
  if (!selectedDrug) {
    const words = norm.split(/\s+/).filter(w => w.length >= 3);
    if (words.length > 0) {
      selectedDrug = variants.find(v => {
        const vName = normalizeText(v.name).toLowerCase();
        return words.some(w => vName.includes(w));
      });
    }
  }

  if (selectedDrug) {
    const { price } = _applyDiscount(selectedDrug);
    state.pendingItem = { drug: selectedDrug, quantity: 1, finalPrice: price };
    state.lastMentionedProduct = selectedDrug;
    state.pendingDosageVariants = [];
    state.simState = 'confirm_add_cart';
    const needsRecipeNote = selectedDrug.needsRecipe ? '\n⚠️ Este medicamento necessita de receita médica.' : '';
    return `Boa escolha! *${selectedDrug.name}* (${selectedDrug.presentation}) por R$ ${price.toFixed(2)}.${needsRecipeNote}\n\nPosso colocar no carrinho? 😊`;
  }

  // Fallback: re-prompt
  const variantList = variants.map((v, i) => {
    const { price } = _applyDiscount(v);
    return `${i + 1}. *${v.name}* — R$ ${price.toFixed(2)}`;
  }).join('\n');
  return `Não entendi qual dosagem você quer. Pode me dizer o número ou a dosagem?\n\n${variantList}`;
}

/**
 * State: more_items — "Quer adicionar mais alguma coisa?"  (FIX #1)
 */
function handleMoreItemsState(norm, rawMsg) {
  const wantsToFinish = norm.match(/(^finalizar$|^fechar$|^pronto$|^chega$|^encerrar$|^nao$|^n$|^so\s+isso$|mais\s+nao|nao\s+quero\s+mais|e\s+so\s+isso|so\s+esses|so\s+isso\s+mesmo|ta\s+certo|esta\s+certo|tudo\s+certo|fechar\s+pedido|pode\s+fechar|tudo\s+ok|isso\s+mesmo|ta\s+otimo|esta\s+otimo|ta\s+bom|esta\s+bom|fecha\s+ai|pode\s+encerrar|concluir|concluido)/i);

  if (wantsToFinish) {
    if (state.cart.length === 0) {
      state.simState = 'idle';
      return 'Seu carrinho está vazio. Se precisar de algo, é só me falar!';
    }
    // CPF é pedido aqui no checkout, antes de fechar
    if (!state.cpf) {
      state.simState = 'waiting_cpf';
      return `Perfeito! Vamos fechar seu pedido! 🛒\n\nResumo:\n${cartSummary()}\n\n*Subtotal: R$ ${cartTotal().toFixed(2)}*\n\nAntes de prosseguir, você tem cadastro de fidelidade com CPF? 🏷️\nDescontos de *10% a 30%* em medicamentos de marca!\n\nDigite seu CPF ou *não* para continuar sem desconto.`;
    }
    const total    = cartTotal();
    state.simState = 'waiting_delivery_method';
    return `Perfeito! Resumo do pedido:\n${cartSummary()}\n\n*Subtotal: R$ ${total.toFixed(2)}*\n*(+ R$ 5,00 taxa de entrega se delivery)*\n\nComo prefere receber: *entrega* no seu endereço ou *retirada* aqui na farmácia?`;
  }

  // Detectar sintomas (igual ao idle — permite busca por sintoma dentro do carrinho)
  const symptoms = [
    { pattern: /cabe(c|ç)a|enxaqueca|cefaleia/i, tag: 'cabeça', label: 'dor de cabeça' },
    { pattern: /azia|queima(c|ç)ao|refluxo|gastrite|est(o|ô)mago/i, tag: 'azia', label: 'dor de estômago ou azia' },
    { pattern: /gripe|resfriad|coriza|espirro/i, tag: 'gripe', label: 'sintomas de gripe' },
    { pattern: /garganta/i, tag: 'garganta', label: 'dor de garganta' },
    { pattern: /tosse/i, tag: 'tosse', label: 'tosse' },
    { pattern: /barriga|diarreia|intestino/i, tag: 'diarreia', label: 'dor de barriga ou diarreia' },
    { pattern: /enjoo|nausea|v(o|ô)mito/i, tag: 'enjoo', label: 'enjoo ou náusea' },
    { pattern: /febre/i, tag: 'febre', label: 'febre' },
    { pattern: /alergia|rinite/i, tag: 'alergia', label: 'alergia' }
  ];

  for (const s of symptoms) {
    if (s.pattern.test(norm)) {
      const suggestions = MEDICINES_DB.filter(d => d.tags.includes(s.tag)).slice(0, 3);
      if (suggestions.length > 0) {
        suggestions.forEach(d => state.lastMentionedProduct = d);
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Pra ${s.label} temos:\n${list}\n\nQual delas quer adicionar ao pedido?`;
      }
    }
  }

  // Coloquial no carrinho
  for (const [colKey, tags] of Object.entries(COLLOQUIAL_MAP)) {
    if (norm.includes(colKey)) {
      const suggestions = MEDICINES_DB.filter(d => tags.some(t => d.tags.includes(t))).slice(0, 3);
      if (suggestions.length > 0) {
        suggestions.forEach(d => state.lastMentionedProduct = d);
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Pra ${colKey} temos:\n${list}\n\nQual quer adicionar?`;
      }
    }
  }

  // Tenta encontrar mais medicamentos na mensagem
  const parsedItems = parseMedicinesFromText(rawMsg);
  if (parsedItems.length > 0) {
    state.pendingActionRawText = rawMsg;
    state.pendingItemsList     = parsedItems;
    parsedItems.forEach(p => state.lastMentionedProduct = p.drug);
    // CPF já está definido — vai direto para cotação
    return proceedToQuoteAfterCpf();
  }

  // ── DETECÇÃO DE ANÚNCIO DE ENVIO DE FOTO OU ÁUDIO NO CARRINHO ──
  const isPhotoAnnounce = (norm.match(/(foto|imagem)/i) && norm.match(/(enviar|mandar|mandei|vou|tirar|olha|ve|ver|passar|mais|outro)/i))
    || norm.match(/(mais\s+um\s+remedio\s+irei\s+enviar|vou\s+enviar\s+(a\s+)?foto|vou\s+mandar\s+(a\s+)?foto|espera\s+vou\s+tirar|tirar\s+foto)/i);

  if (isPhotoAnnounce) {
    return 'Com certeza! Pode enviar a foto do próximo remédio ou produto que eu analiso para você e verifico no estoque! 📷';
  }

  // Detecção expandida de mensagens conversacionais
  const isConversational = norm.match(/(^(sim|s|ok|certo|beleza|legal|massa|top|boa|perfeito|otimo|entendi|hmm|uhum|aham|ta|blz|show|maravilha|combinado|tranquilo|suave|firmeza|fechou|de\s*boa|pode\s*ser|claro|com\s*certeza|isso\s*mesmo|exato|vlw|obg|tmj)$|obrigad[oa]|valeu|brigadao|vlw)/i);
  if (isConversational) {
    return 'Quer adicionar mais algum medicamento? Me diz o nome ou escreva *finalizar* pra fechar o pedido. 🛒';
  }

  // Intenção genérica de compra no contexto do carrinho
  if (norm.match(/(quero\s+(mais|outro|outra)|preciso\s+de\s+mais|tem\s+mais\s+coisa|mais\s+alguma\s+coisa|mais\s+um\s+remedio|mais\s+um\s+medicamento|mais\s+um)/i)) {
    return 'Pode falar! Me diz o nome do próximo medicamento ou pode mandar a foto dele que eu busco pra você! 😊';
  }

  // O usuário pode ter digitado um nome de produto que não está no banco
  const productRequested = _extractMedicineRequest(rawMsg);
  if (productRequested) {
    return `Não encontrei *${productRequested}* no nosso estoque no momento. 🤔\n\nQuer tentar pesquisar por outro nome, marca de referência ou enviar a foto dele? (Ou escreva *finalizar* se quiser concluir o pedido com os itens atuais). 🛒`;
  }

  return 'Pode me dizer o nome do próximo medicamento ou mandar a foto dele? Se quiser concluir o pedido com os itens atuais, é só escrever *finalizar*. 🛒';
}

/**
 * State: waiting_delivery_method — "Entrega ou retirada?"  (FIX #1)
 */
function handleWaitingDeliveryMethod(norm, rawMsg) {
  const wantsDelivery = norm.match(/(entrega|delivery|entregar|meu\s+endereco|trazer|levar|mandar)/i);
  const wantsPickup   = norm.match(/(retirada|retirar|buscar|busco|pegar|loja|farmacia|presencial|vou\s+buscar|vou\s+la)/i);

  if (wantsDelivery) {
    state.deliveryMethod = 'delivery';
    
    // Tenta extrair o endereço se o cliente já digitou junto com a indicação de entrega
    const extractedAddr = rawMsg
      .replace(/^(entrega\s+em|entrega\s+na|entrega\s+no|entrega|delivery|entregar|manda\s+entregar)\s*/i, '')
      .trim();

    if (extractedAddr.length >= 6) {
      state.deliveryAddress = extractedAddr;
      state.simState        = 'waiting_payment';
      const total           = cartTotal();
      const grandTotal      = total + 5.00;
      return `Ótimo! 🛵 Delivery para *${state.deliveryAddress}* anotado com sucesso! ✅\n\n*Medicamentos:* R$ ${total.toFixed(2)}\n*Taxa de entrega:* R$ 5,00\n*Total geral: R$ ${grandTotal.toFixed(2)}*\n\nQual forma de pagamento prefere?\n• *Pix* — 5% de desconto no total\n• *Cartão* de débito/crédito\n• *Dinheiro*`;
    }

    state.simState = 'waiting_address';
    return 'Ótimo! 🛵 Delivery confirmado.\n\nQual é o seu endereço completo? (Rua, número, bairro)';
  }

  if (wantsPickup) {
    state.deliveryMethod = 'retirada';
    state.simState       = 'waiting_payment';
    const total          = cartTotal();
    return `Ótimo! 🏪 Pode vir retirar aqui na Rua da Saúde, 500 - Centro.\n\n*Total: R$ ${total.toFixed(2)}*\n\nQual forma de pagamento prefere?\n• *Pix* — 5% de desconto no total\n• *Cartão* de débito/crédito\n• *Dinheiro*`;
  }

  return 'Só preciso saber: quer *entrega* no seu endereço ou *retirada* aqui na farmácia? 🏪';
}

/**
 * State: waiting_address — bot aguarda endereço de entrega  (FIX #1)
 */
function handleWaitingAddressState(rawMsg) {
  const addr = (rawMsg || '').trim();
  if (addr.length < 5) {
    return 'Preciso do endereço completo pra entregar certinho! Me manda: Rua, número e bairro. 📍';
  }
  state.deliveryAddress = rawMsg.trim();
  state.simState        = 'waiting_payment';
  const total           = cartTotal();
  const grandTotal      = total + 5;

  return `Endereço anotado: *${state.deliveryAddress}* ✅\n\n*Medicamentos:* R$ ${total.toFixed(2)}\n*Taxa de entrega:* R$ 5,00\n*Total geral: R$ ${grandTotal.toFixed(2)}*\n\nQual forma de pagamento prefere?\n• *Pix* — 5% de desconto no total\n• *Cartão* de débito/crédito\n• *Dinheiro*`;
}

/**
 * State: waiting_payment — bot aguarda forma de pagamento  (FIX #1)
 */
function handleWaitingPaymentState(norm) {
  let paymentLabel  = null;
  let pixDiscount   = false;

  if (norm.match(/(pix|transferencia)/i)) {
    paymentLabel = 'Pix';
    pixDiscount  = true;
  } else if (norm.match(/(cartao|credito|debito|card)/i)) {
    paymentLabel = 'Cartão';
  } else if (norm.match(/(dinheiro|especie|cash)/i)) {
    paymentLabel = 'Dinheiro';
  }

  if (!paymentLabel) {
    return 'Não entendi! Qual forma de pagamento você prefere?\n• *Pix* (5% de desconto)\n• *Cartão* de débito/crédito\n• *Dinheiro*';
  }

  state.paymentMethod = paymentLabel;
  state.simState      = 'waiting_confirm';

  let total             = cartTotal();
  if (pixDiscount) total = total * 0.95;
  const deliveryFee     = state.deliveryMethod === 'delivery' ? 5 : 0;
  const grandTotal      = total + deliveryFee;
  const deliveryLine    = state.deliveryMethod === 'delivery'
    ? `📦 *Entrega:* ${state.deliveryAddress}\n*Taxa:* R$ 5,00\n`
    : '🏪 *Retirada* na loja\n';
  const pixNote         = pixDiscount ? ' *(5% desc. Pix aplicado)*' : '';

  return `Perfeito! Confirme seu pedido:\n\n*Itens:*\n${cartSummary()}\n\n${deliveryLine}💳 *Pagamento:* ${paymentLabel}${pixNote}\n\n*Total: R$ ${grandTotal.toFixed(2)}*\n\nTudo certinho com o resumo do seu pedido? Posso confirmar e fechar por aqui?`;
}

/**
 * State: waiting_confirm — confirmação final do pedido  (FIX #1)
 */
function handleWaitingConfirmState(norm, rawMsg) {
  const isConfirm = isUserConfirming(norm, rawMsg)
    || norm.match(/(confirmar|confirmo|fecha|fechar|pode\s+fechar|pode\s+confirmar|tudo\s+certo|manda\s+ver|pode\s+manda|concluir|concluido)/i);
  const isCancel  = norm.match(/(cancelar|^nao$|^n$|desistir|cancela)/i);

  if (isConfirm) {
    const total       = cartTotal();
    const deliveryFee = state.deliveryMethod === 'delivery' ? 5 : 0;
    const grandTotal  = total + deliveryFee;
    const deliveryInfo = state.deliveryMethod === 'delivery'
      ? `Seu pedido será entregue em: *${state.deliveryAddress}*`
      : 'Pode vir retirar aqui na *Rua da Saúde, 500 - Centro*.';
    const payment = state.paymentMethod || 'forma selecionada';

    resetSimState();

    return `✅ *Pedido confirmado com sucesso!* 🎉\n\n${deliveryInfo}\n\nTotal cobrado: *R$ ${grandTotal.toFixed(2)}* via ${payment}.\n\nSeu pedido já está em separação na farmácia e você receberá atualizações sobre a entrega. Muito obrigada pela preferência! 💊||Tem mais alguma coisa em que eu possa te ajudar?`;
  }

  if (isCancel) {
    resetSimState();
    return 'Pedido cancelado. Se mudar de ideia ou precisar de outra coisa, é só me chamar! 😊';
  }

  return 'Podemos fechar e confirmar o seu pedido com os itens atuais? É só me dizer *sim* ou *pode fechar*! 😊';
}

/**
 * State: waiting_calculation_days — bot aguarda número de dias de tratamento  (FIX #1)
 */
function handleWaitingCalculationDays(norm, rawMsg) {
  const src      = rawMsg || norm || '';
  const dayMatch = src.match(/(\d+)\s*(dias?|semanas?|m[eê]ses?)/i);

  if (!dayMatch) {
    return 'Quantos dias dura o tratamento? Ex: *7 dias*, *2 semanas*, *1 mês*...';
  }

  let days   = parseInt(dayMatch[1]);
  const unit = dayMatch[2].toLowerCase();
  if (unit.startsWith('semana')) days *= 7;
  if (unit.startsWith('m'))      days *= 30;

  const calc = state.pendingCalculation;
  if (!calc || !calc.drug) {
    state.simState = 'idle';
    return 'Ocorreu um erro no cálculo. Pode me dizer o medicamento novamente?';
  }

  state.pendingCalculation = null;
  return performCalculationAndOffer(calc.drug, calc.dose, calc.frequency, days, calc.type);
}

/**
 * State: confirm_upsell — bot ofereceu um produto complementar  (FIX #1)
 */
function handleConfirmUpsell(norm) {
  const isYes = norm.match(/(^sim$|^s$|pode|quero|ok|claro|adiciona|bora)/i);

  if (isYes && state.pendingUpsell) {
    state.cart.push(state.pendingUpsell);
  }

  state.pendingUpsell = null;
  state.upsellOffered = true;
  state.simState      = 'more_items';

  if (isYes) {
    const total = cartTotal();
    return `Adicionado! 🛒\n\n*Carrinho atualizado:*\n${cartSummary()}\n*Subtotal: R$ ${total.toFixed(2)}*\n\nQuer mais alguma coisa? Me diga o nome do remédio ou escreva *finalizar*.`;
  }

  return 'Sem problemas! Quer adicionar mais algum medicamento? Ou escreva *finalizar* para fechar o pedido.';
}

// ============ WEBHOOK ============
async function sendToWebhook(message, mediaType = 'text', fileName = '', attempt = 0) {
  if (CONFIG.simulationMode) {
    await delay(600 + Math.random() * 400);
    if (mediaType === 'image') return _handleImageSimulation(fileName);
    if (mediaType === 'audio') return _handleAudioSimulation();
    return runSimulation(message);
  }

  const timestamp    = Math.floor(Date.now() / 1000);
  const messageId    = 'WEB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
  const remoteJid    = '5500000000000@s.whatsapp.net';
  const INSTANCE_NAME = 'minha-empresa-d4bdb5';

  let messageContent = {};
  let msgType        = 'conversation';

  if (mediaType === 'audio') {
    msgType = 'audioMessage';
    messageContent = { audioMessage: { url: message, mimetype: 'audio/ogg' } };
  } else if (mediaType === 'image') {
    msgType = 'imageMessage';
    messageContent = { imageMessage: { url: message, caption: '', mimetype: 'image/jpeg' } };
  } else if (mediaType === 'document') {
    msgType = 'documentMessage';
    messageContent = { documentMessage: { url: message, fileName: fileName || 'documento.pdf', mimetype: 'application/pdf' } };
  } else {
    messageContent = { conversation: message };
  }

  const payload = {
    event: 'messages.upsert',
    instance: INSTANCE_NAME,
    data: {
      key: { remoteJid, fromMe: false, id: messageId },
      pushName: 'Cliente Web',
      status: 'DELIVERY_ACK',
      message: messageContent,
      messageType: msgType,
      messageTimestamp: timestamp,
      source: 'web',
      conversationId: state.sessionId,
    },
    sender: remoteJid,
    server_url: window.location.origin,
    apikey: 'web-client',
    conversationId: state.sessionId,
  };

  const controller = new AbortController();
  const timeout    = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const rawText = await res.text();
    let data;
    try { data = JSON.parse(rawText); }
    catch { throw new Error('Resposta inválida do servidor'); }

    // Tolerant extraction across n8n / Evolution API response shapes
    let extracted = null;
    if (Array.isArray(data)) {
      const f = data[0];
      extracted = f?.message || f?.output || f?.text || f?.response || f?.data?.message || f?.content;
    } else if (typeof data === 'object' && data !== null) {
      extracted = data.message || data.output || data.text || data.response ||
                  data.data?.message || data.content ||
                  data.data?.data?.message?.conversation || data.body?.message;
    } else if (typeof data === 'string') {
      extracted = data;
    }

    if (!extracted || typeof extracted !== 'string' || !extracted.trim()) {
      console.warn('[Sofia] Resposta inesperada do webhook:', JSON.stringify(data).slice(0, 200));
      throw new Error('Sem resposta da Sofia');
    }

    return extracted.trim();
  } catch (err) {
    if (attempt < CONFIG.maxRetries) {
      await delay(CONFIG.retryDelay);
      return sendToWebhook(message, mediaType, fileName, attempt + 1);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ============ MESSAGE RENDERING ============
function addUserMessage(text) {
  const msg = { role: 'user', content: text, time: now() };
  state.messages.push(msg);
  saveHistory();
  renderMessage(msg);
  updateSidebar(text);
  scrollToBottom();
}

function addBotMessage(text) {
  state.botMessageCount++;  // FIX #10: increment counter instead of filtering
  const msg = { role: 'assistant', content: text, time: now() };
  state.messages.push(msg);
  saveHistory();
  renderMessage(msg);
  updateSidebar(text);

  if (state.soundEnabled) playNotificationSound();

  if (state.isScrolledUp) {
    state.unreadCount++;
    dom.scrollFabBadge.textContent = state.unreadCount;
    dom.scrollFabBadge.classList.add('show');
  } else {
    scrollToBottom();
  }

  if (document.hidden) {
    document.title = `(${state.botMessageCount}) ${state.originalTitle}`;
  }

  dom.sidebarBadge.textContent   = state.unreadCount > 0 ? state.unreadCount : '1';
  dom.sidebarBadge.style.display = 'flex';
}

function renderMessage(msg) {
  const isUser  = msg.role === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `message ${isUser ? 'outgoing' : 'incoming'}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const textEl = document.createElement('span');
  textEl.className = 'message-text';
  textEl.innerHTML = linkify(msg.content);

  const meta   = document.createElement('span');
  meta.className = 'message-meta';

  const timeEl = document.createElement('span');
  timeEl.className   = 'message-time';
  timeEl.textContent = msg.time;
  meta.appendChild(timeEl);

  if (isUser) {
    const status = document.createElement('span');
    status.className = 'message-status read';
    status.innerHTML = '<svg viewBox="0 0 16 11"><path d="M11.07.66L5.4 7.18 3.55 5.06l-.98.84 2.87 3.33 6.64-7.58z"/><path d="M7.6.66L1.93 7.18.08 5.06l-.98.84 2.87 3.33L8.58 1.5z" opacity=".4"/></svg>';
    meta.appendChild(status);
  }

  bubble.appendChild(textEl);
  bubble.appendChild(meta);
  wrapper.appendChild(bubble);

  bubble.addEventListener('click', () => copyMessage(bubble, msg.content));
  dom.chatMessages.insertBefore(wrapper, dom.typingIndicator);
}

function renderSavedMessages() {
  state.messages.forEach(msg => renderMessage(msg));
  // Restore counter from loaded history
  state.botMessageCount = state.messages.filter(m => m.role === 'assistant').length;
  scrollToBottom(false);
}

// ============ TYPING INDICATOR ============
function showTyping() {
  state.isTyping = true;
  dom.typingIndicator.classList.add('active');
  dom.chatStatus.textContent = 'digitando...';
  scrollToBottom();
}

function hideTyping() {
  state.isTyping = false;
  dom.typingIndicator.classList.remove('active');
  dom.chatStatus.textContent = 'online';
}

// ============ SIDEBAR ============
function updateSidebar(text) {
  dom.sidebarLastMsg.textContent = text.length > 40 ? text.slice(0, 40) + '...' : text;
  dom.sidebarTime.textContent    = now();
}

// ============ SCROLL MANAGEMENT ============
function handleScroll() {
  const el            = dom.chatMessages;
  const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  state.isScrolledUp  = distFromBottom > 150;

  if (state.isScrolledUp) {
    dom.scrollFab.classList.add('show');
  } else {
    dom.scrollFab.classList.remove('show');
    state.unreadCount = 0;
    dom.scrollFabBadge.classList.remove('show');
    dom.scrollFabBadge.textContent = '';
  }
}

// ============ DROPDOWN MENUS ============
function toggleDropdown(menu, triggerBtn) {
  const wasOpen = menu.classList.contains('show');
  closeAllDropdowns();
  if (!wasOpen) {
    const rect    = triggerBtn.getBoundingClientRect();
    menu.style.top   = (rect.bottom + 4) + 'px';
    menu.style.left  = 'auto';
    menu.style.right = 'auto';
    if (rect.right > window.innerWidth / 2) {
      menu.style.right = Math.max(16, window.innerWidth - rect.right) + 'px';
    } else {
      menu.style.left  = Math.max(16, rect.left) + 'px';
    }
    menu.classList.add('show');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
}

// ============ DIALOGS ============
function showDialog(text, subtext, onConfirm) {
  dom.dialogText.textContent    = text;
  dom.dialogSubtext.textContent = subtext;
  state.pendingAction           = onConfirm;
  dom.dialogOverlay.classList.add('show');
}

function closeDialog() {
  dom.dialogOverlay.classList.remove('show');
  state.pendingAction = null;
}

function showNewChatDialog() {
  showDialog('Iniciar nova conversa?', 'Uma nova sessão será criada. O histórico anterior será apagado do navegador.', startNewConversation);
}

function showClearChatDialog() {
  showDialog('Limpar conversa?', 'Todas as mensagens serão removidas da tela. A sessão continuará ativa.', clearChat);
}

// ============ ACTIONS ============

/** FIX #7: single source of truth for all state resets */
function resetSimState() {
  state.simState            = 'idle';
  state.cart                = [];
  state.deliveryAddress     = '';
  state.paymentMethod       = '';
  state.deliveryMethod      = '';
  state.pendingItem         = null;
  state.pendingCalculation  = null;
  state.pendingItemsList    = [];
  state.pendingBrand        = null;
  state.pendingGeneric      = null;
  state.pendingUpsell       = null;
  state.upsellOffered       = false;
  state.pendingActionRawText = '';
  state.pendingVariants     = null;
  state.pendingVariantQty   = null;
  state.cpf                 = null;
  state.discountPercent     = 0;
  state.lastMentionedProduct = null;
  state.lastImageContext     = null;
  state.pendingDosageVariants = [];
}

function startNewConversation() {
  state.messages      = [];
  state.unreadCount   = 0;
  state.botMessageCount = 0;
  resetSimState();

  dom.chatStatus.textContent = 'online';
  localStorage.removeItem(CONFIG.sessionKey);
  localStorage.removeItem(CONFIG.historyKey);
  localStorage.removeItem(CONFIG.cpfKey);
  localStorage.removeItem(CONFIG.discountKey);

  state.sessionId = loadOrCreateSession();
  clearChatDom();

  dom.sidebarLastMsg.textContent  = 'Toque para iniciar conversa';
  dom.sidebarTime.textContent     = 'agora';
  dom.sidebarBadge.style.display  = 'none';
  document.title                  = state.originalTitle;

  greetUser(CONFIG.newChatGreetingDelay);
  showToast('Nova conversa iniciada');
}

function clearChat() {
  state.messages        = [];
  state.botMessageCount = 0;
  resetSimState();

  dom.chatStatus.textContent     = 'online';
  localStorage.removeItem(CONFIG.historyKey);
  clearChatDom();

  dom.sidebarLastMsg.textContent = 'Conversa limpa';
  dom.sidebarBadge.style.display = 'none';
  showToast('Conversa limpa');
}

function clearChatDom() {
  dom.chatMessages.querySelectorAll('.message').forEach(m => m.remove());
}

function exportConversation() {
  if (state.messages.length === 0) { showToast('Nenhuma mensagem para exportar'); return; }

  let text = `Conversa — Farmácia\n`;
  text    += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
  text    += `Sessão: ${state.sessionId}\n`;
  text    += '—'.repeat(40) + '\n\n';

  state.messages.forEach(msg => {
    const sender = msg.role === 'user' ? 'Você' : `${CONFIG.botName} (Bot)`;
    text += `[${msg.time}] ${sender}:\n${msg.content}\n\n`;
  });

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `conversa-farmacia-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Conversa exportada com sucesso');
}

function copyMessage(bubble, text) {
  navigator.clipboard.writeText(text).then(() => {
    bubble.classList.add('copied');
    setTimeout(() => bubble.classList.remove('copied'), 1500);
  }).catch(() => {
    const ta         = document.createElement('textarea');
    ta.value         = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    bubble.classList.add('copied');
    setTimeout(() => bubble.classList.remove('copied'), 1500);
  });
}

// ============ TOAST ============
function showToast(message) {
  const toast     = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>${message}`;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}

// ============ SOUND ============
// FIX #3: singleton AudioContext — no more one-per-sound leak
let _audioCtx = null;
function getAudioContext() {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playNotificationSound() {
  try {
    const ctx  = getAudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch { /* Audio not supported */ }
}

function updateSoundLabel() {
  if (dom.soundLabel) dom.soundLabel.textContent = state.soundEnabled ? 'Som: Ligado' : 'Som: Desligado';
}

// ============ UTILS ============
function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function linkify(text) {
  let safe = escapeHtml(text);
  safe = safe.replace(/```(.*?)```/gs,            '<code>$1</code>');
  safe = safe.replace(/\*\*(.*?)\*\*/g,           '<strong>$1</strong>');
  safe = safe.replace(/\*([^\s\*](?:[^\*]*[^\s\*])?)\*/g, '<strong>$1</strong>');
  safe = safe.replace(/_([^\s_](?:[^_]*[^\s_])?)_/g,      '<em>$1</em>');
  safe = safe.replace(/~([^\s~](?:[^~]*[^\s~])?)~/g,      '<del>$1</del>');
  return safe.replace(/(https?:\/\/[^\s<]+)/g, url => {
    const display = url.length > 45 ? url.slice(0, 42) + '...' : url;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="message-link">${display}</a>`;
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function scrollToBottom(smooth = true) {
  requestAnimationFrame(() => {
    dom.chatMessages.scrollTo({ top: dom.chatMessages.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  });
}

// ============ START ============
document.addEventListener('DOMContentLoaded', init);
