
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
  simulationMode: true,
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
    if (saved) state.messages = JSON.parse(saved);
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
  const norm = normalizeText(message);

  // 1. Human transfer lock
  if (state.simState === 'human') {
    return 'O atendimento humano está ativo. Um atendente entrará em contato em instantes por este canal.';
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
    case 'choose_variant':         return handleChooseVariant(norm, message);
    case 'waiting_calculation_days': return handleWaitingCalculationDays(norm, message);
    case 'more_items':             return handleMoreItemsState(norm, message);
    case 'waiting_delivery_method': return handleWaitingDeliveryMethod(norm);
    case 'waiting_address':        return handleWaitingAddressState(message);
    case 'waiting_payment':        return handleWaitingPaymentState(norm);
    case 'waiting_confirm':        return handleWaitingConfirmState(norm);
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
  'remedio de acucar':         ['diabetes'],
  'remedio de diabetes':       ['diabetes'],
  'remedio para diabetes':     ['diabetes'],
  'remedio pra dormir':        ['sono', 'insônia'],
  'remedio para dormir':       ['sono', 'insônia'],
  'remedio de dor':            ['dor'],
  'remedio para dor':          ['dor'],
  'remedio de dor de cabeca':  ['cabeça', 'dor'],
  'remedio para dor de cabeca':['cabeça', 'dor'],
  'bombinha':                  ['bombinha', 'asma', 'falta de ar'],
  'remedio de colesterol':     ['colesterol'],
  'remedio para colesterol':   ['colesterol'],
  'remedio de tireoide':       ['tireoide'],
  'remedio para tireoide':     ['tireoide'],
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
    quantity = parseInt(qtyUnitMatch[1]);
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

    // Fallback: substring match
    if (!matchedDrug && searchText.length >= 4) {
      outer: for (const { drug, patterns } of compiled) {
        for (const { alias } of patterns) {
          const normAlias = normalizeText(alias);
          const isReverseMatch = normAlias.length >= 3 && searchText.includes(normAlias);
          if (normAlias.includes(searchText) || isReverseMatch) {
            matchedDrug = drug;
            break outer;
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
  
  // Expressões funcionais, de cortesia ou status do carrinho que não representam produtos
  const ignorePhrases = [
    'por favor', 'porfavor', 'pf', 'pfv', 'obrigado', 'obrigada', 'valeu', 'grato', 'ok', 'okay',
    'ta certo', 'tá certo', 'esta certo', 'tudo certo', 'tudo ok', 'certo', 'isso mesmo', 'isso',
    'pode ser', 'pode', 'sim', 'nao', 'não', 'quero', 'preciso', 'gostaria', 'carrinho', 'pedido',
    'fechar', 'finalizar', 'cancelar', 'por enquanto', 'por agora',
    'beleza', 'legal', 'massa', 'top', 'boa', 'perfeito', 'otimo', 'entendi', 'entendo',
    'brigadao', 'vlw', 'hmm', 'hm', 'ah', 'ah ta', 'ahh', 'ta', 'uhum', 'aham',
    'ta bom', 'ta otimo', 'ta certo', 'blz', 'show', 'maravilha', 'combinado',
    'tranquilo', 'de boa', 'suave', 'firmeza', 'fechou'
  ];

  let stripped = norm
    .replace(/^(pode|sim|ok|claro|vai|bora|manda|confirma|isso)[.!,]?\s*/i, '')
    .replace(/^(tambem|tb|alem disso|e|mais)\s+(preciso|quero|gostaria|tem|vcs tem|voces tem)\s+(de|da|do|um|uma|mais)?\s*/i, '')
    .replace(/^(preciso|quero|gostaria|tem|voce tem|vcs tem)\s+(de|da|do|um|uma)?\s*/i, '')
    .replace(/^(de|da|do|um|uma)\s+/i, '')
    .trim();

  // Limpa pontuações comuns
  stripped = stripped.replace(/[.!,?]/g, '').trim();

  if (ignorePhrases.includes(stripped) || stripped.length < 3) {
    return null;
  }

  // Verifica se a palavra resultante bate em palavras isoladas de controle
  const skipWords = /^(mais|sim|nao|ok|claro|isso|bora|vai|pode|ja|aqui|la|tudo|nada|so|e|ou|por|favor|obrigado|obrigada|ta|certo|carrinho|carrinhos|beleza|legal|massa|top|boa|perfeito|otimo|entendi|show|blz|hmm|uhum|aham|tranquilo|suave|firmeza|fechou|combinado|maravilha)$/i;
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

  // Match por número
  const numMatch = norm.match(/^(\d+)$/);
  if (numMatch) {
    const idx = parseInt(numMatch[1]) - 1;
    if (idx >= 0 && idx < variants.length) {
      return _selectVariant(variants[idx], qty);
    }
  }

  // Match por ordinal
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

  // Match por nome ou alias do produto
  for (const v of variants) {
    const nameNorm = normalizeText(v.name);
    if (norm.includes(nameNorm) || nameNorm.includes(norm)) {
      return _selectVariant(v, qty);
    }
    for (const alias of v.aliases) {
      const aliasNorm = normalizeText(alias);
      if (aliasNorm.length >= 4 && norm.includes(aliasNorm)) {
        return _selectVariant(v, qty);
      }
    }
  }

  // Match por tipo de apresentação
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

  // Tenta parsear como novo medicamento (o usuário mudou de ideia)
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

// ============ IDLE STATE ============
function handleIdleState(norm, rawMsg) {
  // 1. Interceptação de despedidas/conclusões educadas para evitar buscas desnecessárias
  if (norm.match(/(^nao$|^nao\s+obrigad[oa]$|^nada$|^tchau$|^ate\s+logo$|^so\s+isso$|^por\s+enquanto\s+nao$|^por\s+agora\s+nao$|valeu|obrigad[oa])/i)) {
    return 'De nada! Sempre que precisar de algum medicamento ou tiver alguma dúvida, é só me chamar por aqui. Tenha um ótimo dia! 😊';
  }

  // 2. Receita OCR
  if (norm.match(/(foto\s+da\s+receita|minha\s+receita|enviar\s+receita|receita\s+medica|foto_receita_simulada)/i)) {
    const amox  = MEDICINES_DB.find(d => d.name.toLowerCase().includes('amoxicilina'));
    const advil = MEDICINES_DB.find(d => d.name.toLowerCase().includes('advil'));
    if (amox && advil) {
      const list = [{ drug: amox, quantity: 1 }, { drug: advil, quantity: 1 }];
      if (!state.cpf) {
        state.pendingItemsList = list;
        state.simState         = 'waiting_cpf';
        return `🔎 *Escaneando receita médica...*\n\nIdentifiquei na receita:\n• 1x ${amox.name}\n• 1x ${advil.name}\n\nAntes de passar a cotação, você tem CPF cadastrado para descontos de fidelidade? 🏷️\nDigite o CPF ou *não* para prosseguir.`;
      }
      state.pendingItemsList = list;
      return proceedToQuoteAfterCpf();
    }
  }

  // 2. Busca direta de medicamento
  const parsedItems = parseMedicinesFromText(rawMsg);
  if (parsedItems.length > 0) {
    state.pendingActionRawText = rawMsg;
    if (!state.cpf) {
      state.pendingItemsList = parsedItems;
      state.simState         = 'waiting_cpf';
      return 'Localizei o(s) medicamento(s) no estoque! 🔎\nAntes de passar o valor, você tem cadastro na nossa fidelidade com CPF? 🏷️\n\nDigite o seu CPF para consultar descontos de 10% a 30% (ou *não* para continuar sem desconto).';
    }
    state.pendingItemsList = parsedItems;
    return proceedToQuoteAfterCpf();
  }

  // 3. Sintomas dinâmicos (RegExp tolerante a typos para maior naturalidade)
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
      const suggestions = MEDICINES_DB.filter(d => d.tags.includes(s.tag)).slice(0, 3);
      if (suggestions.length > 0) {
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Nossa, ${s.label} é bem incômodo. Melhoras!||Temos estas opções para ajudar:\n${list}\n\nQual delas você prefere?`;
      }
    }
  }

  // 4. Mapa coloquial (Mapeamento genérico, roda depois dos sintomas específicos)
  for (const [colKey, tags] of Object.entries(COLLOQUIAL_MAP)) {
    if (norm.includes(colKey)) {
      const suggestions = MEDICINES_DB.filter(d => tags.some(t => d.tags.includes(t))).slice(0, 3);
      if (suggestions.length > 0) {
        const list = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Temos estas opções para ${colKey}:\n${list}\n\nQual você costuma tomar?`;
      }
    }
  }

  // 5. Perguntas gerais
  if (norm.match(/(horario|aberto|funcionamento|que horas)/i))
    return 'Funcionamos de segunda a sábado das 7h às 22h, e aos domingos das 8h às 18h. ⏰';
  if (norm.match(/(endereco|onde fica|localizacao|onde vcs)/i))
    return 'Ficamos na Rua da Saúde, 500 - Centro. Quer dar uma passada aqui ou prefere que a gente entregue?';
  if (norm.match(/(delivery|entrega|entregam|taxa|frete)/i))
    return 'Nosso delivery funciona de segunda a sábado das 8h às 21h30. A taxa é R$ 5,00 pra qualquer bairro. Quer pedir algo?';
  if (norm.match(/(pagamento|forma|pagar|cartao|pix|dinheiro)/i))
    return 'Aceitamos Pix, cartão de crédito/débito e dinheiro na entrega. 💳';
  if (norm.match(/(oi|ola|bom dia|boa tarde|boa noite|tudo bem)/i))
    return 'Oi! Tudo bem? Sou a Sofia, assistente virtual da Farmácia. No que posso te ajudar?';
  if (norm.match(/(receita|controlado|antibiotico|tarja preta)/i))
    return 'Medicamento comum precisa de receita simples. Antibiótico precisa de 2 vias (uma retida, entregamos no delivery). Tarja Preta e Roacutan só presencialmente na farmácia. 🚫';

  // 6. Detecção de mensagens conversacionais (evitar tratar tudo como busca de medicamento)
  const conversational = norm.match(/(^(sim|s|ok|certo|beleza|legal|massa|top|boa|perfeito|otimo|entendi|entendo|hmm|hm|ah|uhum|aham|ta|blz|show|maravilha|combinado|tranquilo|suave|firmeza|fechou|de\s*boa)$|tudo\s+certo|ta\s+bom|ta\s+otimo|ta\s+certo|tudo\s+ok|como\s+funciona|quanto\s+custa|qual\s+o\s+preco|o\s+que\s+e|quando|tudo\s+bem|como\s+vai)/i);
  if (conversational) {
    return 'Tô aqui pra te ajudar! 😊 Me diz o nome do medicamento que você precisa, ou me conta o que tá sentindo que eu busco as opções pra você.';
  }

  // 7. Fallback genérico (sem assumir que é busca de medicamento)
  const trimmed = rawMsg.trim();
  if (trimmed.length < 3) {
    return 'Oi! Me diz o nome do medicamento ou o que você tá sentindo que eu te ajudo. 😊';
  }
  return `Hmm, não encontrei nada com "${trimmed.length > 40 ? trimmed.substring(0, 40) + '...' : trimmed}" na nossa base. 😅\nSe for um medicamento, tenta me dizer o nome comercial ou o princípio ativo. Se precisar, posso te passar pra um atendente! 👤`;
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
    wantsGeneric = false;
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
  // PRIORIDADE: verificar NEGAÇÃO primeiro (resolve "Não. Quero X" adicionando item errado)
  const startsWithNo = norm.match(/^n[aã]o\b/i) || norm.match(/^(n|nope)$/i);
  const isExplicitNo = norm.match(/(^nao$|^n$|cancela|desisto)/i);

  if (startsWithNo || isExplicitNo) {
    state.pendingItem      = null;
    state.pendingItemsList = [];

    // Extrai o que vem DEPOIS da negação para verificar se é um novo pedido
    const afterNo = rawMsg.replace(/^[Nn][ãa]o\.?\s*/i, '').trim();
    if (afterNo.length >= 3) {
      // Remove "quero", "preciso de", etc. e tenta encontrar um novo medicamento
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

  // Depois verifica AFIRMAÇÃO
  const isYes = norm.match(/(^sim$|^s$|pode|coloca|^quero$|ok|claro|isso|confirma|adiciona|bora|vai|manda)/i);

  if (isYes) {
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

  return 'Quer que eu coloque no carrinho? 😊';
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
    const total    = cartTotal();
    state.simState = 'waiting_delivery_method';
    return `Perfeito! Resumo do pedido:\n${cartSummary()}\n\n*Subtotal: R$ ${total.toFixed(2)}*\n*(+ R$ 5,00 taxa de entrega se delivery)*\n\nComo prefere receber: *entrega* no seu endereço ou *retirada* aqui na farmácia?`;
  }

  // Tenta encontrar mais medicamentos na mensagem
  const parsedItems = parseMedicinesFromText(rawMsg);
  if (parsedItems.length > 0) {
    state.pendingActionRawText = rawMsg;
    state.pendingItemsList     = parsedItems;
    // CPF já está definido — vai direto para cotação
    return proceedToQuoteAfterCpf();
  }

  // Detecção de mensagens conversacionais (evitar tratar como busca de medicamento)
  const isConversational = norm.match(/(^(sim|s|ok|certo|beleza|legal|massa|top|boa|perfeito|otimo|entendi|hmm|uhum|aham|ta|blz|show|maravilha|combinado|tranquilo|suave|firmeza|fechou|de\s*boa)$|obrigad[oa]|valeu|brigadao|vlw)/i);
  if (isConversational) {
    return 'Quer adicionar mais algum medicamento? Me diz o nome ou escreva *finalizar* pra fechar o pedido. 🛒';
  }

  // O usuário nomeou algo que não está no banco — responde que não encontrou
  const productRequested = _extractMedicineRequest(rawMsg);
  if (productRequested) {
    return `⚠️ Não encontrei "${productRequested}" no nosso estoque. Pode tentar com outro nome, a dosagem ou a marca completa?\n\nOu escreva *finalizar* se quiser fechar o pedido com os itens já adicionados. 🛒`;
  }

  return 'Me diz o nome do próximo medicamento ou escreva *finalizar* pra fechar o pedido. 🛒';
}

/**
 * State: waiting_delivery_method — "Entrega ou retirada?"  (FIX #1)
 */
function handleWaitingDeliveryMethod(norm) {
  const wantsDelivery = norm.match(/(entrega|delivery|entregar|meu\s+endereco|trazer|levar|mandar)/i);
  const wantsPickup   = norm.match(/(retirada|retirar|buscar|busco|pegar|loja|farmacia|presencial|vou\s+buscar|vou\s+la)/i);

  if (wantsDelivery) {
    state.deliveryMethod = 'delivery';
    state.simState       = 'waiting_address';
    return 'Ótimo! 🛵 Delivery confirmado.\n\nQual é o seu endereço completo? (Rua, número, bairro)';
  }

  if (wantsPickup) {
    state.deliveryMethod = 'retirada';
    state.simState       = 'waiting_payment';
    const total          = cartTotal();
    return `Ótimo! 🏪 Pode vir retirar aqui na Rua da Saúde, 500 - Centro.\n\n*Total: R$ ${total.toFixed(2)}*\n\nQual forma de pagamento prefere?\n• *Pix* — 5% de desconto\n• *Cartão* de débito/crédito\n• *Dinheiro*`;
  }

  return 'Como prefere receber: *entrega* no seu endereço ou *retirada* aqui na farmácia?';
}

/**
 * State: waiting_address — bot aguarda endereço de entrega  (FIX #1)
 */
function handleWaitingAddressState(rawMsg) {
  if (rawMsg.trim().length < 5) {
    return 'Por favor, me diga o endereço completo (Rua, número e bairro) para organizarmos a entrega.';
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
    return 'Não entendi a forma de pagamento. Escolha:\n• *Pix* (5% de desconto)\n• *Cartão* de débito/crédito\n• *Dinheiro*';
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
function handleWaitingConfirmState(norm) {
  const isConfirm = norm.match(/(confirmar|confirmo|^sim$|^s$|ok|pode|bora|feito|certo|isso\s+mesmo|vai)/i);
  const isCancel  = norm.match(/(cancelar|^nao$|^n$|desistir|cancela)/i);

  if (isConfirm) {
    // Capture values BEFORE resetting state
    const total       = cartTotal();
    const deliveryFee = state.deliveryMethod === 'delivery' ? 5 : 0;
    const grandTotal  = total + deliveryFee;
    const deliveryInfo = state.deliveryMethod === 'delivery'
      ? `Seu pedido será entregue em: *${state.deliveryAddress}*`
      : 'Pode vir retirar aqui na *Rua da Saúde, 500 - Centro*.';
    const payment = state.paymentMethod || 'forma selecionada';

    resetSimState();

    return `✅ *Pedido confirmado!*\n\n${deliveryInfo}\n\nTotal cobrado: *R$ ${grandTotal.toFixed(2)}* via ${payment}.\n\nVocê receberá uma confirmação em breve. Obrigada pela preferência! 💊||Tem mais alguma coisa em que eu possa te ajudar?`;
  }

  if (isCancel) {
    resetSimState();
    return 'Pedido cancelado. Se mudar de ideia ou precisar de outra coisa, é só me chamar! 😊';
  }

  return 'Para finalizar o pedido, digite *confirmar*. Para cancelar, escreva *cancelar*.';
}

/**
 * State: waiting_calculation_days — bot aguarda número de dias de tratamento  (FIX #1)
 */
function handleWaitingCalculationDays(norm, rawMsg) {
  const src      = rawMsg || norm;
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
    if (mediaType === 'image') return runSimulation('foto_receita_simulada');
    if (mediaType === 'audio') return 'Recebi seu áudio e já estou analisando...||Identifiquei que você precisa de Amoxicilina e Advil. Deseja adicionar ao carrinho?';
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
