/**
 * Farmacia WhatsApp Frontend — app.js
 * Handles chat logic, local simulation, webhook integration, and UI interactions.
 */

// ============ CONFIG ============
const CONFIG = {
  simulationMode: false, // Se true, simula localmente no navegador. Se false, envia para o webhook n8n.
  webhookUrl: 'https://n8n.srv1181762.hstgr.cloud/webhook/sofia/chat',
  sessionKey: 'farmacia_session_id',
  historyKey: 'farmacia_history',
  soundKey: 'farmacia_sound',
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

  // Estados de simulação local
  simState: 'idle',
  cart: [],
  deliveryAddress: '',
  paymentMethod: '',
  pendingItem: null,
  pendingCalculation: null,
  pendingItemsList: [],
  pendingBrand: null,
  pendingGeneric: null,
  pendingUpsell: null,
  upsellOffered: false,
  deliveryMethod: '',
};

// ============ DOM REFS ============
const dom = {};

function cacheDom() {
  dom.chatMessages = document.getElementById('chatMessages');
  dom.messageInput = document.getElementById('messageInput');
  dom.sendBtn = document.getElementById('sendBtn');
  dom.typingIndicator = document.getElementById('typingIndicator');
  dom.chatStatus = document.getElementById('chatStatus');
  dom.sidebarTime = document.getElementById('sidebarTime');
  dom.sidebarLastMsg = document.getElementById('sidebarLastMsg');
  dom.sidebarBadge = document.getElementById('sidebarBadge');
  dom.sidebar = document.getElementById('sidebar');
  dom.backBtn = document.getElementById('backBtn');
  dom.contactClinic = document.getElementById('contactClinic');
  dom.scrollFab = document.getElementById('scrollFab');
  dom.scrollFabBadge = document.getElementById('scrollFabBadge');
  dom.dialogOverlay = document.getElementById('dialogOverlay');
  dom.dialogText = document.getElementById('dialogText');
  dom.dialogSubtext = document.getElementById('dialogSubtext');
  dom.dialogConfirm = document.getElementById('dialogConfirm');
  dom.dialogCancel = document.getElementById('dialogCancel');
  dom.toastContainer = document.getElementById('toastContainer');

  // Menu buttons
  dom.btnNewChat = document.getElementById('btnNewChat');
  dom.btnNewChatHeader = document.getElementById('btnNewChatHeader');
  dom.btnSidebarMenu = document.getElementById('btnSidebarMenu');
  dom.btnChatMenu = document.getElementById('btnChatMenu');
  dom.sidebarDropdown = document.getElementById('sidebarDropdown');
  dom.chatDropdown = document.getElementById('chatDropdown');

  // Menu items
  dom.menuNewChat = document.getElementById('menuNewChat');
  dom.menuClearChat = document.getElementById('menuClearChat');
  dom.menuToggleSound = document.getElementById('menuToggleSound');
  dom.menuNewChat2 = document.getElementById('menuNewChat2');
  dom.menuClearChat2 = document.getElementById('menuClearChat2');
  dom.menuExport = document.getElementById('menuExport');
  dom.soundLabel = document.getElementById('soundLabel');
  dom.btnAttach = document.querySelector('.btn-attach');
}

// ============ INIT ============
function init() {
  cacheDom();
  state.sessionId = loadOrCreateSession();
  state.soundEnabled = localStorage.getItem(CONFIG.soundKey) !== 'false';
  updateSoundLabel();
  loadHistory();
  setupEventListeners();
  renderSavedMessages();
  handleResize();

  // If no messages yet, show initial bot greeting
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

// ============ RESPONSIVE HELPERS ============
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    dom.sidebar.classList.add('sidebar-closed');
  } else {
    dom.sidebar.classList.remove('sidebar-closed');
  }
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
    // Keep last 100 messages to avoid localStorage bloat
    const toSave = state.messages.slice(-100);
    localStorage.setItem(CONFIG.historyKey, JSON.stringify(toSave));
  } catch { /* ignore quota errors */ }
}

// ============ EVENTS ============
function setupEventListeners() {
  // Send on button click
  dom.sendBtn.addEventListener('click', handleSend);

  // Send on Enter (Shift+Enter for new line)
  dom.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Auto-resize textarea
  dom.messageInput.addEventListener('input', () => {
    dom.messageInput.style.height = 'auto';
    dom.messageInput.style.height = Math.min(dom.messageInput.scrollHeight, 120) + 'px';
    // Toggle send button state
    dom.sendBtn.classList.toggle('active', dom.messageInput.value.trim().length > 0);
  });

  // Mobile: sidebar toggle
  dom.backBtn.addEventListener('click', () => {
    dom.sidebar.classList.remove('sidebar-closed');
  });

  dom.contactClinic.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      dom.sidebar.classList.add('sidebar-closed');
    }
    dom.sidebarBadge.style.display = 'none';
  });

  // Scroll detection for FAB
  dom.chatMessages.addEventListener('scroll', handleScroll);

  // Scroll FAB click
  dom.scrollFab.addEventListener('click', () => {
    scrollToBottom();
    state.unreadCount = 0;
    dom.scrollFabBadge.classList.remove('show');
    dom.scrollFabBadge.textContent = '';
  });

  // New chat buttons (direct)
  dom.btnNewChat.addEventListener('click', () => showNewChatDialog());
  dom.btnNewChatHeader.addEventListener('click', () => showNewChatDialog());

  dom.btnAttach.addEventListener('click', () => {
    handleAttachRecipe();
  });

  // Dropdown menus
  dom.btnSidebarMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dom.sidebarDropdown, dom.btnSidebarMenu);
  });

  dom.btnChatMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dom.chatDropdown, dom.btnChatMenu);
  });

  // Menu items — sidebar
  dom.menuNewChat.addEventListener('click', () => {
    closeAllDropdowns();
    showNewChatDialog();
  });

  dom.menuClearChat.addEventListener('click', () => {
    closeAllDropdowns();
    showClearChatDialog();
  });

  dom.menuToggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem(CONFIG.soundKey, state.soundEnabled);
    updateSoundLabel();
    showToast(state.soundEnabled ? 'Som de notificação ativado' : 'Som de notificação desativado');
  });

  // Menu items — chat header
  dom.menuNewChat2.addEventListener('click', () => {
    closeAllDropdowns();
    showNewChatDialog();
  });

  dom.menuClearChat2.addEventListener('click', () => {
    closeAllDropdowns();
    showClearChatDialog();
  });

  dom.menuExport.addEventListener('click', () => {
    closeAllDropdowns();
    exportConversation();
  });

  // Dialog
  dom.dialogCancel.addEventListener('click', closeDialog);
  dom.dialogOverlay.addEventListener('click', (e) => {
    if (e.target === dom.dialogOverlay) closeDialog();
  });
  dom.dialogConfirm.addEventListener('click', () => {
    if (state.pendingAction) state.pendingAction();
    closeDialog();
  });

  // Close dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);

  // Tab visibility — clear unread on focus
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      document.title = state.originalTitle;
    }
  });

  // Escape key closes dialogs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDialog();
      closeAllDropdowns();
    }
  });

  // Window resize — adapt sidebar visibility
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });
}

async function handleAttachRecipe() {
  if (state.isSending) return;
  state.isSending = true;

  // Mostrar toast indicativo
  showToast('Simulando envio de receita...');

  // Adicionar mensagem do usuário no chat
  addUserMessage('📷 *Receita_Lucas_Rocha.jpg* (Receita enviada)');

  // Mostrar indicador de digitação
  showTyping();
  await delay(1200);
  hideTyping();

  // Exibir feedback de OCR escaneando a receita
  addBotMessage('🔎 *Escaneando receita médica...*');

  showTyping();
  await delay(1800);
  hideTyping();

  // Chamar o motor de simulação passando o marcador de receita
  try {
    const response = await sendToWebhook('FOTO_RECEITA_SIMULADA');
    const responseText = typeof response === 'string' ? response : JSON.stringify(response);
    const messages = responseText.split('||');
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i].trim();
      if (msg) {
        if (i > 0) {
          showTyping();
          await delay(Math.min(msg.length * 30 + 500, 2000));
          hideTyping();
        }
        addBotMessage(msg);
      }
    }
  } catch (error) {
    console.error('Attach error:', error);
    addBotMessage('Ocorreu um erro ao processar a receita. Tente novamente.');
  }

  state.isSending = false;
  dom.messageInput.focus();
}

// ============ SEND MESSAGE ============
async function handleSend() {
  const text = dom.messageInput.value.trim();
  if (!text || state.isSending) return;

  state.isSending = true;
  dom.messageInput.value = '';
  dom.messageInput.style.height = 'auto';
  dom.sendBtn.classList.remove('active');

  // Add user message to UI
  addUserMessage(text);

  // Show typing indicator
  showTyping();

  try {
    const response = await sendToWebhook(text);
    hideTyping();
    
    // Separar a resposta pelo delimitador || para simular mensagens múltiplas
    const responseText = typeof response === 'string' ? response : JSON.stringify(response);
    const messages = responseText.split('||');
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i].trim();
      if (msg) {
        if (i > 0) {
          // Mostrar "digitando..." antes da próxima mensagem
          showTyping();
          await delay(Math.min(msg.length * 30 + 500, 2000));
          hideTyping();
        }
        addBotMessage(msg);
      }
    }
  } catch (error) {
    hideTyping();
    addBotMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente em alguns instantes.');
    console.error('[ClinicAI] Webhook error:', error);
  }

  state.isSending = false;
  dom.messageInput.focus();
}

const MEDICINES_DB = [
  // MIP / Venda Livre (no prescription, delivery OK)
  { 
    name: 'Dipirona Gotas', 
    aliases: ['dipirona', 'dipirona gotas', 'dipirona liquida', 'novalgina'], 
    price: 12.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'frasco de 20ml', 
    unitName: 'frasco',
    activeIngredient: 'Dipirona Sódica',
    indication: 'Alívio de dores de cabeça, no corpo, febre e cólicas',
    dosage: '30 a 40 gotas a cada 6 horas (adultos)',
    contraindications: 'Hipersensibilidade a pirazolonas ou asma induzida por analgésicos',
    manufacturer: 'EMS Genéricos',
    isGeneric: true
  },
  { 
    name: 'Novalgina 1g', 
    aliases: ['novalgina', 'novalgina 1g', 'novalgina comprimido'], 
    price: 18.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 10 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Dipirona Sódica',
    indication: 'Dor intensa e febre alta resistente',
    dosage: '1 comprimido de 12 em 12 horas ou de 8 em 8 horas',
    contraindications: 'Alergia a dipirona ou gravidez no último trimestre',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },
  { 
    name: 'Paracetamol 500mg', 
    aliases: ['paracetamol', 'paracetamol comprimido'], 
    price: 7.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Paracetamol',
    indication: 'Redução da febre e alívio temporário de dores leves',
    dosage: '1 a 2 comprimidos a cada 6 horas se necessário',
    contraindications: 'Doença de fígado grave (insuficiência hepática grave)',
    manufacturer: 'Medley Genéricos',
    isGeneric: true
  },
  { 
    name: 'Tylenol 750mg', 
    aliases: ['tylenol', 'tylenol 750mg'], 
    price: 15.00, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Paracetamol',
    indication: 'Alívio rápido de dores de dente, musculares, articulares e febre',
    dosage: '1 comprimido a cada 6 horas',
    contraindications: 'Doença hepática ativa ou alcoolismo crônico',
    manufacturer: 'Kenvue S.A.',
    isGeneric: false
  },
  { 
    name: 'Buscopan Composto', 
    aliases: ['buscopan', 'buscopan composto', 'buscopan comprimido'], 
    price: 18.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Butilbrometo de Escopolamina + Dipirona',
    indication: 'Dores de cólica no estômago, intestino, rins e vias biliares',
    dosage: '1 a 2 comprimidos de 8 em 8 horas',
    contraindications: 'Alergia a dipirona, glaucoma ou miastenia grave',
    manufacturer: 'Boehringer Ingelheim',
    isGeneric: false
  },
  {
    name: 'Butilbrometo de Escopolamina',
    aliases: ['butilbrometo', 'escopolamina', 'buscopan generico'],
    price: 9.90,
    category: 'MIP',
    needsRecipe: false,
    allowsDelivery: true,
    presentation: 'caixa com 20 comprimidos',
    unitName: 'caixa',
    activeIngredient: 'Butilbrometo de Escopolamina',
    indication: 'Tratamento de cólicas gastrointestinais e uterinas',
    dosage: '1 comprimido até 4 vezes ao dia',
    contraindications: 'Glaucoma agudo ou aumento da próstata',
    manufacturer: 'Neo Química',
    isGeneric: true
  },
  { 
    name: 'Neosaldina', 
    aliases: ['neosaldina', 'neosa', 'neosaldina comprimido'], 
    price: 21.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Dipirona + Mucato de Isometepteno + Cafeína',
    indication: 'Tratamento de dor de cabeça crônica e crises de enxaqueca',
    dosage: '1 a 2 comprimidos a cada 6 horas se houver sintomas',
    contraindications: 'Hipertensão descontrolada ou alergia a dipirona',
    manufacturer: 'Takeda Pharma',
    isGeneric: false
  },
  { 
    name: 'Neosoro', 
    aliases: ['neosoro', 'sorine', 'descongestionante', 'rinosoro'], 
    price: 8.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'frasco de 30ml', 
    unitName: 'frasco',
    activeIngredient: 'Cloridrato de Naftazolina',
    indication: 'Descongestionamento nasal rápido por gripes ou sinusites',
    dosage: '2 a 4 gotas em cada narina até 4 vezes ao dia',
    contraindications: 'Glaucoma de ângulo estreito ou uso com antidepressivos IMAO',
    manufacturer: 'Neo Química',
    isGeneric: false
  },
  { 
    name: 'Dorflex', 
    aliases: ['dorflex', 'dorflex comprimido'], 
    price: 14.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 36 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Dipirona + Citrato de Orfenadrina + Cafeína Anidra',
    indication: 'Alívio da dor muscular decorrente de contraturas dolorosas',
    dosage: '1 a 2 comprimidos até 4 vezes ao dia',
    contraindications: 'Glaucoma, fraqueza muscular grave ou alergia a dipirona',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },
  { 
    name: 'Advil 400mg', 
    aliases: ['advil', 'ibuprofeno comprimido'], 
    price: 18.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 8 cápsulas gelatinosas', 
    unitName: 'caixa',
    activeIngredient: 'Ibuprofeno',
    indication: 'Redução rápida de inflamações, dor de garganta, muscular e dente',
    dosage: '1 cápsula mole a cada 8 horas',
    contraindications: 'Úlcera gástrica ativa ou asma desencadeada por anti-inflamatórios',
    manufacturer: 'Haleon Brasil',
    isGeneric: false
  },
  {
    name: 'Ibuprofeno 600mg',
    aliases: ['ibuprofeno', 'ibuprofeno generico'],
    price: 10.90,
    category: 'MIP',
    needsRecipe: false,
    allowsDelivery: true,
    presentation: 'caixa com 20 comprimidos',
    unitName: 'caixa',
    activeIngredient: 'Ibuprofeno',
    indication: 'Tratamento de processos inflamatórios e de dor intensa',
    dosage: '1 comprimido a cada 12 horas pós-refeição',
    contraindications: 'Sangramento gastrointestinal ou insuficiência renal severa',
    manufacturer: 'Prati-Donaduzzi',
    isGeneric: true
  },
  { 
    name: 'Eno Efervescente', 
    aliases: ['eno', 'sal de fruta eno', 'sal de fruta'], 
    price: 6.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'envelope de 5g', 
    unitName: 'envelope',
    activeIngredient: 'Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico',
    indication: 'Azia, queimação no estômago e má digestão em segundos',
    dosage: '1 envelope dissolvido em um copo d\'água se necessário',
    contraindications: 'Hipertensão severa ou dieta restritiva de sódio',
    manufacturer: 'Haleon Brasil',
    isGeneric: false
  },
  { 
    name: 'Sonrisal', 
    aliases: ['sonrisal'], 
    price: 5.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 2 comprimidos efervescentes', 
    unitName: 'caixa',
    activeIngredient: 'Ácido Acetilsalicílico + Carbonato de Sódio',
    indication: 'Indigestão ácida acompanhada de dor de cabeça',
    dosage: '1 a 2 comprimidos efervescentes dissolvidos em água',
    contraindications: 'Alergia a AAS, asma ou histórico de sangramento gástrico',
    manufacturer: 'Haleon Brasil',
    isGeneric: false
  },
  { 
    name: 'Estomazil', 
    aliases: ['estomazil'], 
    price: 7.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 6 envelopes', 
    unitName: 'caixa',
    activeIngredient: 'Bicarbonato de Sódio + Carbonato de Cálcio',
    indication: 'Alívio rápido de queimação estomacal e refluxo ácido',
    dosage: '1 envelope dissolvido em meio copo de água',
    contraindications: 'Insuficiência renal grave ou hipocalcemia',
    manufacturer: 'Hypera Pharma',
    isGeneric: false
  },
  { 
    name: 'Luftal Gotas', 
    aliases: ['luftal', 'simeticona', 'luftal gotas'], 
    price: 16.20, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'frasco de 15ml', 
    unitName: 'frasco',
    activeIngredient: 'Simeticona',
    indication: 'Alívio de excesso de gases no estômago e intestino',
    dosage: '10 a 20 gotas até 3 vezes ao dia',
    contraindications: 'Nenhuma contraindicação severa relatada',
    manufacturer: 'Reckitt Benckiser',
    isGeneric: false
  },
  { 
    name: 'Benegrip', 
    aliases: ['benegrip', 'antigripal'], 
    price: 14.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 12 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Dipirona + Maleato de Clorfeniramina + Cafeína',
    indication: 'Alívio dos sintomas decorrentes de gripe e resfriados',
    dosage: '1 comprimido verde e 1 amarelo ao mesmo tempo até 4 vezes ao dia',
    contraindications: 'Alergia a dipirona, glaucoma ou hipertensão grave',
    manufacturer: 'Hypera Pharma',
    isGeneric: false
  },
  { 
    name: 'Cimegripe', 
    aliases: ['cimegripe'], 
    price: 10.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Paracetamol + Maleato de Clorfeniramina + Fenilefrina',
    indication: 'Febre, dores corporais, coriza e nariz entupido por resfriado',
    dosage: '1 cápsula a cada 4 horas',
    contraindications: 'Problemas de tireoide ou doença cardíaca coronária grave',
    manufacturer: 'Cimed Indústria',
    isGeneric: false
  },
  { 
    name: 'Resfenol', 
    aliases: ['resfenol'], 
    price: 13.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Paracetamol + Clorfeniramina + Cloridrato de Fenilefrina',
    indication: 'Alívio sintomático da gripe e congestão nasal',
    dosage: '1 cápsula de 4 em 4 horas',
    contraindications: 'Doença hepática ativa ou hipertensão grave',
    manufacturer: 'Kley Hertz',
    isGeneric: false
  },
  { 
    name: 'Strepsils pastilha', 
    aliases: ['strepsils', 'pastilha para garganta'], 
    price: 18.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 8 pastilhas', 
    unitName: 'caixa',
    activeIngredient: 'Flurbiprofeno',
    indication: 'Alívio da dor e inflamação da garganta inflamada',
    dosage: 'Dissolver 1 pastilha na boca a cada 3 a 6 horas',
    contraindications: 'Histórico de asma induzida por AINEs ou úlcera ativa',
    manufacturer: 'Reckitt Benckiser',
    isGeneric: false
  },
  { 
    name: 'Benalet pastilhas', 
    aliases: ['benalet'], 
    price: 14.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 12 pastilhas', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Difenhidramina',
    indication: 'Alívio sintomático da tosse irritativa e dor de garganta',
    dosage: 'Dissolver 1 pastilha lentamente a cada 2 ou 3 horas',
    contraindications: 'Uso com sedativos, asma aguda ou menores de 12 anos',
    manufacturer: 'Kenvue S.A.',
    isGeneric: false
  },
  { 
    name: 'Flogoral Spray', 
    aliases: ['flogoral'], 
    price: 26.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'frasco spray de 30ml', 
    unitName: 'frasco',
    activeIngredient: 'Cloridrato de Benzidamina',
    indication: 'Dor e inflamação na boca e garganta (aftas, amigdalite)',
    dosage: '2 a 6 nebulizações na garganta de 4 a 6 vezes ao dia',
    contraindications: 'Hipersensibilidade à benzidamina',
    manufacturer: 'Aché Laboratórios',
    isGeneric: false
  },
  { 
    name: 'Cataflan Emulgel', 
    aliases: ['cataflan', 'cataflan emulgel', 'pomada cataflan'], 
    price: 29.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'bisnaga de 60g', 
    unitName: 'bisnaga',
    activeIngredient: 'Diclofenaco Dietilamônio',
    indication: 'Alívio local de dor por contusões, torções e dores nas costas',
    dosage: 'Aplicar na região dolorida massageando levemente até 4 vezes ao dia',
    contraindications: 'Terceiro trimestre de gravidez ou feridas na pele',
    manufacturer: 'Novartis Pharma',
    isGeneric: false
  },
  { 
    name: 'Lubrificante KY', 
    aliases: ['ky', 'lubrificante ky', 'gel ky', 'lubrificante'], 
    price: 24.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'bisnaga de 50g', 
    unitName: 'bisnaga',
    activeIngredient: 'Glicerol + Água (Gel à base de água)',
    indication: 'Lubrificação íntima para alívio da secura vaginal',
    dosage: 'Aplicar quantidade desejada na região íntima',
    contraindications: 'Hipersensibilidade aos componentes da fórmula',
    manufacturer: 'Kenvue S.A.',
    isGeneric: false
  },
  { 
    name: 'Preservativo Jontex', 
    aliases: ['jontex', 'camisinha', 'preservativo'], 
    price: 12.00, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'pacote com 3 unidades', 
    unitName: 'pacote',
    activeIngredient: 'Látex Natural',
    indication: 'Planejamento familiar e prevenção de ISTs',
    dosage: 'Colocar antes de iniciar qualquer contato genital',
    contraindications: 'Alergia conhecida ao látex de borracha natural',
    manufacturer: 'Reckitt Benckiser',
    isGeneric: false
  },
  { 
    name: 'Protetor Solar Sundown SPF 50', 
    aliases: ['sundown', 'protetor solar'], 
    price: 49.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'frasco de 120ml', 
    unitName: 'frasco',
    activeIngredient: 'Filtros químicos UVA/UVB',
    indication: 'Prevenção de queimaduras solares e envelhecimento precoce',
    dosage: 'Aplicar abundantemente antes da exposição solar e reaplicar a cada 2 horas',
    contraindications: 'Irritação de pele grave aos componentes',
    manufacturer: 'Kenvue S.A.',
    isGeneric: false
  },
  { 
    name: 'Xantinon', 
    aliases: ['xantinon', 'xantinon comprimido', 'xanitinom'], 
    price: 16.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Citrato de Colina + Metionina',
    indication: 'Facilitação da digestão e eliminação de gorduras no fígado',
    dosage: '1 comprimido 3 vezes ao dia',
    contraindications: 'Nenhuma contraindicação severa relatada',
    manufacturer: 'Mensa S.A.',
    isGeneric: false
  },
  { 
    name: 'Imosec 2mg', 
    aliases: ['imosec', 'loperamida', 'imosec comprimido'], 
    price: 18.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 12 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Loperamida',
    indication: 'Tratamento sintomático de diarreia aguda sem infecção bacteriana',
    dosage: '2 comprimidos iniciais, seguidos de 1 comprimido após evacuação líquida',
    contraindications: 'Diarreia com febre alta ou fezes escuras e com sangue',
    manufacturer: 'Janssen-Cilag',
    isGeneric: false
  },
  { 
    name: 'Floratil 200mg', 
    aliases: ['floratil', 'floratil capsula', 'floratil sachê'], 
    price: 29.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 6 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Saccharomyces boulardii',
    indication: 'Restauração da flora intestinal bacteriana benéfica',
    dosage: '1 cápsula duas vezes ao dia',
    contraindications: 'Pacientes imunocomprometidos ou com cateter venoso central',
    manufacturer: 'Biocodex',
    isGeneric: false
  },
  { 
    name: 'Dramin B6', 
    aliases: ['dramin', 'dramin b6', 'dramin comprimido'], 
    price: 15.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Dimenidrinato + Piridoxina',
    indication: 'Prevenção de náuseas, tonturas e vômitos por cinetose (viagens)',
    dosage: '1 comprimido de 4 em 4 horas se houver náusea',
    contraindications: 'Porfiria aguda ou hipersensibilidade ao dimenidrinato',
    manufacturer: 'Takeda Pharma',
    isGeneric: false
  },
  { 
    name: 'Vonau Flash 4mg', 
    aliases: ['vonau', 'vonau flash', 'ondansetrona'], 
    price: 32.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 10 comprimidos sublinguais', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Ondansetrona',
    indication: 'Prevenção e tratamento rápido de enjoos e vômitos agudos',
    dosage: '1 comprimido sublingual dissolver na boca sob a língua',
    contraindications: 'Uso concomitante com apomorfina',
    manufacturer: 'Biolab',
    isGeneric: false
  },
  { 
    name: 'Nebacetin', 
    aliases: ['nebacetin', 'pomada nebacetin', 'neomicina'], 
    price: 19.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'bisnaga de 15g', 
    unitName: 'bisnaga',
    activeIngredient: 'Sulfato de Neomicina + Bacitracina Zíncica',
    indication: 'Tratamento de infecções de pele, cortes, ralados e pequenas queimaduras',
    dosage: 'Aplicar fina camada sobre a ferida 2 a 5 vezes ao dia',
    contraindications: 'Feridas abertas extensas ou insuficiência renal grave',
    manufacturer: 'Takeda Pharma',
    isGeneric: false
  },
  { 
    name: 'Tandrilax', 
    aliases: ['tandrilax', 'tandrilax comprimido', 'tandrilas'], 
    price: 28.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Carisoprodol + Cafeína + Diclofenaco Sódico + Paracetamol',
    indication: 'Espasmos musculares dolorosos, gota e reumatismo',
    dosage: '1 comprimido a cada 12 horas',
    contraindications: 'Úlcera ativa, hipertensão grave ou doença cardíaca instável',
    manufacturer: 'Aché Laboratórios',
    isGeneric: false
  },
  { 
    name: 'Loratadina 10mg', 
    aliases: ['loratadina', 'loratadina comprimido'], 
    price: 14.20, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 12 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Loratadina',
    indication: 'Rinite alérgica, espirros, coceira no nariz e olhos',
    dosage: '1 comprimido uma vez ao dia',
    contraindications: 'Alergia a loratadina ou idade menor de 2 anos',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Engov', 
    aliases: ['engov', 'engov comprimido'], 
    price: 9.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 6 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Maleato de Mepiramina + AAS + Hidróxido de Alumínio + Cafeína',
    indication: 'Alívio sintomático da cefaleia decorrente de ressaca',
    dosage: '1 a 2 comprimidos antes ou após o consumo de álcool',
    contraindications: 'Caso haja suspeita de dengue (contém AAS), hemofilia ou úlcera',
    manufacturer: 'Hypera Pharma',
    isGeneric: false
  },
  { 
    name: 'Epocler', 
    aliases: ['epocler', 'flaconete epocler'], 
    price: 3.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'flaconete de 10ml', 
    unitName: 'flaconete',
    activeIngredient: 'Citrato de Colina + Betaina + Metionina',
    indication: 'Ação antitóxica no fígado após abusos alimentares ou de álcool',
    dosage: '1 flaconete até 3 vezes ao dia antes das principais refeições',
    contraindications: 'Insuficiência renal grave',
    manufacturer: 'Hypera Pharma',
    isGeneric: false
  },
  { 
    name: 'Aspirina 500mg', 
    aliases: ['aspirina', 'acido acetilsalicilico'], 
    price: 11.50, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'caixa com 10 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Ácido Acetilsalicílico',
    indication: 'Dores de cabeça tensionais e febre moderada',
    dosage: '1 a 2 comprimidos a cada 4 ou 6 horas',
    contraindications: 'Hemofilia, úlcera ou suspeita de dengue',
    manufacturer: 'Bayer S.A.',
    isGeneric: false
  },
  { 
    name: 'Bepantol Derma', 
    aliases: ['bepantol', 'bepantol derma', 'pomada bepantol'], 
    price: 34.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'bisnaga de 20g', 
    unitName: 'bisnaga',
    activeIngredient: 'Dexpantenol',
    indication: 'Proteção e cicatrização acelerada de assaduras e pele ressecada',
    dosage: 'Aplicar fina camada sobre a pele limpa sempre que necessário',
    contraindications: 'Hipersensibilidade aos componentes',
    manufacturer: 'Bayer S.A.',
    isGeneric: false
  },
  { 
    name: 'Hipoglós Amêndoas', 
    aliases: ['hipoglos', 'pomada hipoglos'], 
    price: 18.90, 
    category: 'MIP', 
    needsRecipe: false, 
    allowsDelivery: true, 
    presentation: 'bisnaga de 40g', 
    unitName: 'bisnaga',
    activeIngredient: 'Óxido de Zinco + Vitaminas A e D + Óleo de Amêndoas',
    indication: 'Prevenção e tratamento de assaduras em bebês e adultos',
    dosage: 'Aplicar a cada troca de fraldas ou conforme necessidade na pele seca',
    contraindications: 'Lesões de pele abertas e infeccionadas',
    manufacturer: 'Johnson & Johnson',
    isGeneric: false
  },

  // Tarja Vermelha - Receita Simples (prescription simple, delivery OK)
  { 
    name: 'Losartana 50mg', 
    aliases: ['losartana', 'losartana 50mg', 'losartana comprimido'], 
    price: 14.90, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Losartana Potássica',
    indication: 'Hipertensão arterial crônica e insuficiência cardíaca crônica',
    dosage: '1 comprimido pela manhã',
    contraindications: 'Uso de alisquireno em pacientes diabéticos',
    manufacturer: 'EMS Genéricos',
    isGeneric: true
  },
  { 
    name: 'Omeprazol 20mg', 
    aliases: ['omeprazol', 'omeprazol 20mg'], 
    price: 22.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 28 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Omeprazol',
    indication: 'Tratamento de gastrite aguda, refluxo esofágico e úlceras',
    dosage: '1 cápsula pela manhã em jejum de 30 minutos antes do café',
    contraindications: 'Uso combinado com nelfinavir',
    manufacturer: 'EMS Genéricos',
    isGeneric: true
  },
  { 
    name: 'Pantoprazol 40mg', 
    aliases: ['pantoprazol', 'pantoprazol 40mg'], 
    price: 38.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 28 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Pantoprazol',
    indication: 'Doença de refluxo grave e esofagite erosiva moderada',
    dosage: '1 comprimido ao dia antes do café da manhã',
    contraindications: 'Doença hepática moderada a grave',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Allegra 120mg', 
    aliases: ['allegra', 'allegra 120mg', 'desalex', 'antialergico', 'claritin'], 
    price: 34.90, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 10 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Fexofenadina',
    indication: 'Rinite alérgica crônica e urticária cutânea leve',
    dosage: '1 comprimido uma vez ao dia pela manhã',
    contraindications: 'Menores de 12 anos ou gravidez sem orientação médica',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },
  { 
    name: 'Nimesulida 100mg', 
    aliases: ['nimesulida', 'nimesulida 100mg'], 
    price: 12.50, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 12 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Nimesulida',
    indication: 'Dor aguda, processos inflamatórios de garganta, articulações e febre',
    dosage: '1 comprimido de 12 em 12 horas após as refeições',
    contraindications: 'Insuficiência hepática, úlcera péptica ou asma por AAS',
    manufacturer: 'Medley Genéricos',
    isGeneric: true
  },
  { 
    name: 'Meloxicam 15mg', 
    aliases: ['meloxicam', 'meloxicam 15mg'], 
    price: 18.90, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 10 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Meloxicam',
    indication: 'Tratamento de artrite reumatoide crônica e osteoartrite dolorosa',
    dosage: '1 comprimido de 15mg uma vez ao dia',
    contraindications: 'Insuficiência renal grave ou sangramento gástrico ativo',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Sinvastatina 20mg', 
    aliases: ['sinvastatina', 'remedio de colesterol'], 
    price: 16.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Sinvastatina',
    indication: 'Redução dos níveis elevados de colesterol total, LDL e triglicerídeos',
    dosage: '1 comprimido à noite antes de dormir',
    contraindications: 'Doença hepática ativa ou gravidez confirmada',
    manufacturer: 'Medley Genéricos',
    isGeneric: true
  },
  { 
    name: 'Puran T4 50mcg', 
    aliases: ['puran', 'puran t4', 'levotiroxina', 'remedio de tireoide'], 
    price: 19.50, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Levotiroxina Sódica',
    indication: 'Terapia de reposição de hormônio da tireoide no hipotireoidismo',
    dosage: '1 comprimido ao dia em jejum total de pelo menos 30 a 60 minutos',
    contraindications: 'Insuficiência adrenal não tratada ou infarto agudo recente',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },
  { 
    name: 'Sertralina 50mg', 
    aliases: ['sertralina', 'sertralina 50mg'], 
    price: 35.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Sertralina',
    indication: 'Tratamento de depressão crônica, ansiedade social, TOC e pânico',
    dosage: '1 comprimido pela manhã ou à noite',
    contraindications: 'Uso combinado com inibidores da MAO ou pimozida',
    manufacturer: 'Teuto Genéricos',
    isGeneric: true
  },
  { 
    name: 'Fluoxetina 20mg', 
    aliases: ['fluoxetina', 'fluoxetina 20mg'], 
    price: 28.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Fluoxetina',
    indication: 'Tratamento da depressão, transtorno disfórico pré-menstrual e bulimia',
    dosage: '1 cápsula pela manhã',
    contraindications: 'Uso combinado de IMAOs ou tioridazina',
    manufacturer: 'Neo Química Genéricos',
    isGeneric: true
  },
  { 
    name: 'Escitalopram 10mg', 
    aliases: ['escitalopram', 'escitalopram 10mg'], 
    price: 48.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Oxalato de Escitalopram',
    indication: 'Ansiedade generalizada, depressão unipolar e agorafobia',
    dosage: '1 comprimido de 10mg ao dia',
    contraindications: 'Prolongamento do intervalo QT no eletrocardiograma',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Metformina 850mg', 
    aliases: ['metformina', 'glifage', 'glifage xr', 'metformina 850mg'], 
    price: 15.00, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Metformina',
    indication: 'Controle de glicemia em diabetes mellitus tipo 2',
    dosage: '1 comprimido duas vezes ao dia durante refeições',
    contraindications: 'Insuficiência renal grave (gfr inferior a 30ml/min)',
    manufacturer: 'EMS Genéricos',
    isGeneric: true
  },
  { 
    name: 'Aerolin Spray', 
    aliases: ['aerolin', 'aerolin spray', 'bombinha aerolin', 'salbutamol'], 
    price: 26.50, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'frasco spray de 200 doses', 
    unitName: 'frasco',
    activeIngredient: 'Sulfato de Salbutamol',
    indication: 'Alívio rápido de falta de ar crônica por asma ou bronquite',
    dosage: '1 a 2 inalações jateadas em crises de espasmo brônquico',
    contraindications: 'Alergia ao salbutamol ou arritmia cardíaca acelerada grave',
    manufacturer: 'GlaxoSmithKline (GSK)',
    isGeneric: false
  },
  { 
    name: 'Tadalafila 5mg', 
    aliases: ['tadalafila', 'tadalafina', 'tadalafila 5mg'], 
    price: 29.90, 
    category: 'Tarja Vermelha', 
    needsRecipe: true, 
    recipeType: 'simples', 
    allowsDelivery: true, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Tadalafila',
    indication: 'Disfunção erétil e tratamento de hiperplasia prostática benigna',
    dosage: '1 comprimido uma vez ao dia no mesmo horário',
    contraindications: 'Uso de medicamentos doadores de óxido nítrico ou nitratos',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },

  // Tarja Vermelha - Receita Retida (antibiotic, delivery OK, must hand recipe to driver)
  { 
    name: 'Amoxicilina 500mg', 
    aliases: ['amoxicilina', 'amoxicilina 500mg', 'amoxilina'], 
    price: 28.00, 
    category: 'Antibiótico', 
    needsRecipe: true, 
    recipeType: 'retida', 
    allowsDelivery: true, 
    presentation: 'caixa com 21 cápsulas', 
    unitName: 'caixa', 
    unitPills: 21,
    activeIngredient: 'Amoxicilina tri-hidratada',
    indication: 'Infecções respiratórias superiores, amigdalite e pneumonia bacteriana',
    dosage: '1 cápsula de 8 em 8 horas por 7 a 10 dias',
    contraindications: 'Alergia a penicilinas e derivados beta-lactâmicos',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Azitromicina 500mg', 
    aliases: ['azitromicina', 'azitromicina 500mg', 'zitromax'], 
    price: 24.50, 
    category: 'Antibiótico', 
    needsRecipe: true, 
    recipeType: 'retida', 
    allowsDelivery: true, 
    presentation: 'caixa com 5 comprimidos', 
    unitName: 'caixa', 
    unitPills: 5,
    activeIngredient: 'Azitromicina di-hidratada',
    indication: 'Infecções bacterianas das vias aéreas e infecções de pele leves',
    dosage: '1 comprimido de 500mg ao dia por 3 a 5 dias',
    contraindications: 'Histórico de icterícia associada ao uso deste antibiótico',
    manufacturer: 'EMS Genéricos',
    isGeneric: true
  },
  { 
    name: 'Cefalexina 500mg', 
    aliases: ['cefalexina', 'cefalexina 500mg'], 
    price: 39.90, 
    category: 'Antibiótico', 
    needsRecipe: true, 
    recipeType: 'retida', 
    allowsDelivery: true, 
    presentation: 'caixa com 40 comprimidos', 
    unitName: 'caixa', 
    unitPills: 40,
    activeIngredient: 'Cefalexina monoidratada',
    indication: 'Infecções bacterianas de tecidos moles, urinárias e ósseas',
    dosage: '1 comprimido a cada 6 horas por 7 a 14 dias',
    contraindications: 'Alergia grave a cefalosporinas ou penicilina',
    manufacturer: 'Medley Genéricos',
    isGeneric: true
  },
  { 
    name: 'Ciprofloxacino 500mg', 
    aliases: ['ciprofloxacino', 'cipro'], 
    price: 32.00, 
    category: 'Antibiótico', 
    needsRecipe: true, 
    recipeType: 'retida', 
    allowsDelivery: true, 
    presentation: 'caixa com 14 comprimidos', 
    unitName: 'caixa', 
    unitPills: 14,
    activeIngredient: 'Cloridrato de Ciprofloxacino',
    indication: 'Infecções urinárias graves, diarreia bacteriana e otite média',
    dosage: '1 comprimido a cada 12 horas por 3 a 7 dias',
    contraindications: 'Uso concomitante com tizanidina ou gravidez',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Bactrim', 
    aliases: ['bactrim', 'bactrim comprimido'], 
    price: 21.00, 
    category: 'Antibiótico', 
    needsRecipe: true, 
    recipeType: 'retida', 
    allowsDelivery: true, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa', 
    unitPills: 20,
    activeIngredient: 'Sulfametoxazol + Trimetoprima',
    indication: 'Infecções bacterianas respiratórias, urinárias e renais',
    dosage: '1 comprimido a cada 12 horas por 10 dias',
    contraindications: 'Disfunção hepática crônica grave ou anemia megaloblástica',
    manufacturer: 'Roche S.A.',
    isGeneric: false
  },

  // Tarja Preta (controlled, NO delivery, presencial only)
  { 
    name: 'Rivotril 2mg', 
    aliases: ['rivotril', 'clonazepam', 'rivotril 2mg'], 
    price: 19.90, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Clonazepam',
    indication: 'Espasmos musculares, ansiedade patológica crônica, crises focais e fobia social',
    dosage: '0.5mg a 2mg ao deitar ou conforme receita controlada',
    contraindications: 'Glaucoma agudo ou insuficiência respiratória grave',
    manufacturer: 'Roche S.A.',
    isGeneric: false
  },
  { 
    name: 'Ritalina 10mg', 
    aliases: ['ritalina', 'ritalina 10mg', 'metilfenidato'], 
    price: 45.00, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 60 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Metilfenidato',
    indication: 'Transtorno de Déficit de Atenção e Hiperatividade (TDAH) e narcolepsia',
    dosage: '1 comprimido pela manhã e 1 após almoço',
    contraindications: 'Psicose ativa, tiques motores severos ou glaucoma de ângulo fechado',
    manufacturer: 'Novartis Pharma',
    isGeneric: false
  },
  { 
    name: 'Lexotan 3mg', 
    aliases: ['lexotan', 'bromazepam', 'lexotan 3mg'], 
    price: 26.90, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Bromazepam',
    indication: 'Ansiedade acentuada, tensão, depressão ansiosa crônica e insônia',
    dosage: '1.5mg a 3mg até 3 vezes ao dia conforme prescrição',
    contraindications: 'Miastenia grave ou insuficiência pulmonar crônica grave',
    manufacturer: 'Roche S.A.',
    isGeneric: false
  },
  { 
    name: 'Frontal 0.5mg', 
    aliases: ['frontal', 'alprazolam', 'frontal 0.5mg'], 
    price: 38.50, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Alprazolam',
    indication: 'Ansiedade reativa, pânico, fobia social e insônia tensional',
    dosage: '1 comprimido ao deitar ou de 12 em 12 horas',
    contraindications: 'Glaucoma agudo de ângulo fechado',
    manufacturer: 'Pfizer Brasil',
    isGeneric: false
  },
  { 
    name: 'Diazepam 10mg', 
    aliases: ['diazepam', 'diazepam 10mg'], 
    price: 15.00, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Diazepam',
    indication: 'Tensão ansiosa crônica, abstinência alcoólica ou espasmos musculares',
    dosage: '5mg a 10mg ao deitar ou conforme orientação',
    contraindications: 'Alergia a benzodiazepínicos, dependência de drogas',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Stilnox 10mg', 
    aliases: ['stilnox', 'zolpidem', 'stilnox 10mg'], 
    price: 62.00, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Hemitartarato de Zolpidem',
    indication: 'Tratamento de curto prazo da insônia grave ou incapacitante',
    dosage: '1 comprimido sublingual ou oral ao deitar imediatamente',
    contraindications: 'Insuficiência respiratória severa ou apneia do sono',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },
  { 
    name: 'Venvanse 30mg', 
    aliases: ['venvanse', 'lisdexanfetamina', 'venvanse 30mg'], 
    price: 390.00, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 28 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Dimesilato de Lisdexanfetamina',
    indication: 'Tratamento de TDAH em crianças e adultos e transtorno de compulsão alimentar',
    dosage: '1 cápsula ao dia pela manhã',
    contraindications: 'Cardiopatia grave, arteriosclerose avançada ou hipertensão grave',
    manufacturer: 'Takeda Pharma',
    isGeneric: false
  },
  { 
    name: 'Sibutramina 15mg', 
    aliases: ['sibutramina', 'sibutramina 15mg'], 
    price: 54.00, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Cloridrato de Sibutramina',
    indication: 'Tratamento auxiliar de perda de peso em obesidade com IMC > 30',
    dosage: '1 cápsula ao dia em jejum pela manhã',
    contraindications: 'Histórico de doença arterial coronariana, derrame (AVC) ou arritmia',
    manufacturer: 'Eurofarma Genéricos',
    isGeneric: true
  },
  { 
    name: 'Gardenal 100mg', 
    aliases: ['gardenal', 'fenobarbital', 'gardenal 100mg'], 
    price: 14.20, 
    category: 'Tarja Preta', 
    needsRecipe: true, 
    recipeType: 'azul', 
    allowsDelivery: false, 
    presentation: 'caixa com 20 comprimidos', 
    unitName: 'caixa',
    activeIngredient: 'Fenobarbital',
    indication: 'Prevenção e controle de crises convulsivas de epilepsia e convulsões tônico-clônicas',
    dosage: '1 comprimido à noite antes de deitar',
    contraindications: 'Porfiria intermitente aguda ou insuficiência hepática severa',
    manufacturer: 'Sanofi-Aventis',
    isGeneric: false
  },

  // Retinoide / Especial (controlled, NO delivery, special paperwork)
  { 
    name: 'Roacutan 20mg', 
    aliases: ['roacutan', 'isotretinoina', 'roacutan 20mg'], 
    price: 150.00, 
    category: 'Especial', 
    needsRecipe: true, 
    recipeType: 'especial', 
    allowsDelivery: false, 
    presentation: 'caixa com 30 cápsulas', 
    unitName: 'caixa',
    activeIngredient: 'Isotretinoína',
    indication: 'Tratamento de formas graves de acne vulgar (nódulo-cística e conglobata) resistentes',
    dosage: '0.5 a 1.0 mg/kg ao dia conforme receita especial e peso',
    contraindications: 'Mulheres em idade fértil sem contracepção ativa (risco extremo de malformação fetal)',
    manufacturer: 'Roche S.A.',
    isGeneric: false
  }
];

function normalizeText(text) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function runSimulation(message) {
  const norm = normalizeText(message);

  // 1. Verificar Transferência Humana
  if (state.simState === 'human') {
    return "O atendimento humano está ativo. Um atendente entrará em contato em instantes por este canal.";
  }

  // 2. Comandos Globais (Emergência, Cancelamento, Solicitar Humano)
  if (norm.match(/(morrendo|infarto|dor no peito|falta de ar|desmaiou|urgente|grave|emergencia)/i)) {
    return "Isso parece urgente! 🚨 O melhor é ir direto pro pronto-socorro ou ligar pro SAMU no 192. Cuida-se!";
  }

  if (norm.match(/(humano|atendente|falar com alguem|suporte|reclamacao)/i)) {
    state.simState = 'human';
    setTimeout(() => {
      const headerStatus = document.getElementById('chatStatus');
      if (headerStatus) headerStatus.textContent = 'atendente humano';
    }, 100);
    return "Vou te passar pra um atendente que vai conseguir te ajudar melhor. Só um momento! 👤||[Sistema: Chat transferido para atendimento humano. O bot foi desativado.]";
  }

  if (norm.match(/(cancelar|cancelar pedido|desistir|limpar tudo)/i)) {
    state.cart = [];
    state.pendingItem = null;
    state.pendingCalculation = null;
    state.simState = 'idle';
    return "Sem problemas! Cancelei o pedido e limpei o carrinho. Se precisar de outra coisa, é só me chamar.";
  }

  // 3. Máquina de Estados Conversacional
  switch (state.simState) {
    case 'idle':
      return handleIdleState(norm, message);

    case 'confirm_brand_or_generic':
      return handleConfirmBrandOrGeneric(norm);

    case 'confirm_upsell':
      return handleConfirmUpsell(norm);

    case 'waiting_delivery_method':
      return handleWaitingDeliveryMethod(norm);

    case 'confirm_add_cart':
      return handleConfirmAddCartState(norm);

    case 'waiting_calculation_days':
      return handleWaitingCalculationDays(norm);

    case 'more_items':
      return handleMoreItemsState(norm, message);

    case 'waiting_address':
      return handleWaitingAddressState(message);

    case 'waiting_payment':
      return handleWaitingPaymentState(norm);

    case 'waiting_confirm':
      return handleWaitingConfirmState(norm);

    default:
      state.simState = 'idle';
      return "Oi! Desculpa, me perdi um pouco no fluxo. No que posso te ajudar? Digite o nome do remédio ou faça sua pergunta.";
  }
}

function parseMedicinesFromText(text) {
  const norm = normalizeText(text);
  const itemsFound = [];
  
  // Lista de partes separadas por "e", ",", "mais"
  const parts = text.split(/\s+e\s+|\s*,\s*|\s+mais\s+/i);
  
  for (const part of parts) {
    const normPart = normalizeText(part);
    if (!normPart) continue;
    
    // Lista de palavras proibidas que desqualificam a parte como nome de medicamento
    const invalidWords = [
      'estou', 'preciso', 'remedio', 'medicamento', 'dor', 'barriga', 'cabeca', 
      'garganta', 'gripe', 'azia', 'comprar', 'gostaria', 'quero', 'ajudar', 
      'saber', 'preco', 'horario', 'endereco', 'farmacia', 'receita', 'entrega', 
      'delivery', 'enviar', 'foto', 'bom', 'dia', 'tarde', 'noite', 'ola', 'oi', 
      'tudo', 'bem', 'obrigado', 'por', 'favor', 'como', 'tomar', 'para', 'com'
    ];
    
    const hasInvalid = invalidWords.some(w => normPart.split(/\s+/).includes(w));
    if (hasInvalid) continue;
    
    // Tentar encontrar quantidade (padrão: número seguido ou não por caixas/un/etc.)
    let quantity = 1;
    const qtyMatch = normPart.match(/(\d+)\s*(caixas?|frascos?|unidades?|un|cps?|comprimidos?)?/i);
    if (qtyMatch) {
      quantity = parseInt(qtyMatch[1]);
    }
    
    // Tentar encontrar o nome do medicamento na parte
    let cleanName = normPart
      .replace(/(\d+)\s*(caixas?|frascos?|unidades?|un|cps?|comprimidos?)?/i, '')
      .replace(/^(de|da|do|para|com|comprar|tem|vcs\s+tem|gostaria\s+de|gostaria|quero|preciso\s+de|preciso|me\s+ve)\s+/i, '')
      .trim();
      
    // Limpar pontuações e emojis
    cleanName = cleanName.replace(/[^\w\s-]/g, '').trim();
    
    if (cleanName.length < 3) continue; // Nome muito curto
    
    // Se o nome limpo tem mais de 3 palavras, provavelmente é uma frase, não um remédio
    if (cleanName.split(/\s+/).length > 3) continue;
    
    // Tentar casar com a base de dados
    let matchedDrug = null;
    for (const drug of MEDICINES_DB) {
      for (const alias of drug.aliases) {
        if (cleanName.includes(alias) || alias.includes(cleanName)) {
          matchedDrug = drug;
          break;
        }
      }
      if (matchedDrug) break;
    }
    
    // Se não encontrou na base de dados, não geramos medicamento fictício
    if (!matchedDrug) {
      continue;
    }
    
    if (matchedDrug) {
      itemsFound.push({ drug: matchedDrug, quantity: quantity });
    }
  }
  
  return itemsFound;
}

function generateMockDrug(name) {
  const cleanName = name.charAt(0).toUpperCase() + name.slice(1);
  const norm = name.toLowerCase();
  
  // Evitar simular palavras comuns de conversação como medicamento
  const stopWords = ['ola', 'tudo bem', 'bom dia', 'boa tarde', 'boa noite', 'obrigado', 'por favor', 'endereco', 'pagamento', 'sim', 'nao', 'tudo certo', 'cancelar', 'humano', 'atendente', 'remedio', 'medicamento', 'receita', 'delivery', 'caixa', 'caixas', 'comprimido', 'gotas'];
  if (stopWords.includes(norm) || norm.length < 3) {
    return null;
  }
  
  // Classificar de acordo com o nome
  let category = 'MIP';
  let needsRecipe = false;
  let recipeType = null;
  let allowsDelivery = true;
  let presentation = 'caixa com 20 comprimidos';
  
  // Tarja Preta (controlled)
  if (norm.match(/(pam|lam|pax|tril|italin|rital|dorm|zolpid|codein|morfin|tramad)/i)) {
    category = 'Tarja Preta';
    needsRecipe = true;
    recipeType = 'azul';
    allowsDelivery = false;
    presentation = 'caixa com 30 comprimidos';
  } 
  // Antibiótico (receita retida)
  else if (norm.match(/(cina|xina|lina|mox|clav|cef|cefale|azitro)/i)) {
    category = 'Antibiótico';
    needsRecipe = true;
    recipeType = 'retida';
    allowsDelivery = true;
    presentation = 'caixa com 21 cápsulas';
  } 
  // Tarja Vermelha (receita simples)
  else if (norm.match(/(tada|fil|pril|art|stat|cort|pred|glic|metfor|omepra|panto)/i)) {
    category = 'Tarja Vermelha';
    needsRecipe = true;
    recipeType = 'simples';
    allowsDelivery = true;
    presentation = 'caixa com 30 comprimidos';
  } 
  // Lubrificantes e correlatos
  else if (norm.match(/(ky|lubrificante|gel|preservativo|camisinha|sabonete|creme|pomada)/i)) {
    category = 'MIP';
    needsRecipe = false;
    allowsDelivery = true;
    presentation = 'unidade';
  }
  // MIP Padrão
  else {
    category = 'MIP';
    needsRecipe = false;
    allowsDelivery = true;
    presentation = 'caixa com 20 comprimidos';
  }
  
  // Gerar um preço estável baseado no nome
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = norm.charCodeAt(i) + ((hash << 5) - hash);
  }
  let basePrice = Math.abs(hash % 50) + 10;
  
  if (category === 'Tarja Preta') basePrice += 20;
  
  const mockDrug = {
    name: cleanName,
    aliases: [norm],
    price: Math.round(basePrice * 10) / 10 + 0.90,
    category: category,
    needsRecipe: needsRecipe,
    recipeType: recipeType,
    allowsDelivery: allowsDelivery,
    presentation: presentation,
    isMocked: true
  };
  
  MEDICINES_DB.push(mockDrug);
  return mockDrug;
}

function getGenericAlternative(drug) {
  if (!drug.activeIngredient || drug.isGeneric) return null;
  
  // Buscar na base por um equivalente que seja genérico
  const genericAlt = MEDICINES_DB.find(d => 
    d.activeIngredient === drug.activeIngredient && 
    d.isGeneric === true
  );
  
  if (genericAlt) return genericAlt;

  // Fallback seguro baseado em texto caso não esteja totalmente mapeado
  const nameLower = drug.name.toLowerCase();
  if (nameLower.includes('tylenol')) {
    return MEDICINES_DB.find(d => d.name.includes('Paracetamol'));
  }
  if (nameLower.includes('novalgina')) {
    return MEDICINES_DB.find(d => d.name.includes('Dipirona'));
  }
  if (nameLower.includes('buscopan composto')) {
    return MEDICINES_DB.find(d => d.name.includes('Butilbrometo'));
  }
  if (nameLower.includes('glifage')) {
    return MEDICINES_DB.find(d => d.name.includes('Metformina'));
  }
  if (nameLower.includes('rivotril')) {
    return MEDICINES_DB.find(d => d.name.includes('Clonazepam'));
  }
  if (nameLower.includes('ritalina')) {
    return MEDICINES_DB.find(d => d.name.includes('Metilfenidato'));
  }
  if (nameLower.includes('lexotan')) {
    return MEDICINES_DB.find(d => d.name.includes('Bromazepam'));
  }
  if (nameLower.includes('frontal')) {
    return MEDICINES_DB.find(d => d.name.includes('Alprazolam'));
  }
  return null;
}

function handleIdleState(norm, rawMsg) {
  // 1. Simulação OCR de Receita
  if (norm.match(/(foto\s+da\s+receita|minha\s+receita|enviar\s+receita|receita\s+medica|foto_receita_simulada)/i)) {
    const amox = MEDICINES_DB.find(d => d.name === 'Amoxicilina 500mg');
    const advil = MEDICINES_DB.find(d => d.name.includes('Advil'));
    
    state.pendingItemsList = [
      { drug: amox, quantity: 1 },
      { drug: advil, quantity: 1 }
    ];
    state.simState = 'confirm_add_cart';
    
    return `Identifiquei na receita:\n• 1x Amoxicilina 500mg (Antibiótico) - R$ 28,00\n• 1x Advil 400mg (MIP) - R$ 18,90\n\n*Total:* R$ 46,90.||Amoxicilina é antibiótico e exige receita física em duas vias (uma fica retida). O entregador precisará recolhê-la na entrega.||Quer que eu adicione todos eles ao seu pedido?`;
  }

  // 2. Verificar correspondência de sintomas comuns primeiro
  if (norm.match(/\b(cabeca|enxaqueca|cefaleia)\b/i)) {
    return "Nossa, dor de cabeça forte é ruim demais. Melhoras, viu!||Temos Tylenol, Novalgina e Dorflex por aqui. Qual você prefere?";
  }
  if (norm.match(/\b(azia|queimacao|refluxo|gastrite|estomago|digestao)\b/i)) {
    return "Putz, azia e queimação incomodam bastante.||Temos Eno, Sonrisal e Estomazil pra aliviar. Prefere algum desses?";
  }
  if (norm.match(/\b(gripe|resfriado|coriza|espirro|resfriada)\b/i)) {
    return "Eita, resfriado é chato demais. Se cuida!||Temos Benegrip, Cimegripe e Resfenol. Qual deles você costuma tomar?";
  }
  if (norm.match(/\b(garganta|pastilha|tosse|rouquidao)\b/i)) {
    return "Dor de garganta e tosse incomodam muito.||Temos pastilhas Strepsils e Benalet, ou Flogoral spray. Quer que eu veja o preço de algum?";
  }
  if (norm.match(/\b(barriga|diarreia|intestino|enjoo|nausea|vomito|colica|abdominal|dor no ventre)\b/i)) {
    return "Putz, dor de barriga ou desconforto intestinal incomoda bastante.||Temos Buscopan Composto, Imosec e Floratil por aqui. Qual você prefere?";
  }
  if (norm.match(/\b(febre|quente|temperatura)\b/i)) {
    return "Eita, febre é chato e dá uma moleza no corpo. Se cuida!||Temos Novalgina e Tylenol pra ajudar. Qual você prefere?";
  }
  if (norm.match(/\b(muscular|costas|corpo|torcicolo|contusao|lesao|articulacao|junta)\b/i)) {
    return "Nossa, dor muscular e no corpo é bem incômoda.||Temos Dorflex, Tandrilax e pomada Cataflan por aqui. Qual você prefere?";
  }
  if (norm.match(/\b(alergia|espirro|coceira|rinite|nariz entupido)\b/i)) {
    return "Eita, rinite e alergia incomodam bastante.||Temos Neosoro, Allegra e Loratadina por aqui. Quer que eu veja o preço de algum?";
  }

  // 3. Extrair medicamentos e quantidades da mensagem
  const parsedItems = parseMedicinesFromText(rawMsg);
  
  if (parsedItems.length > 0) {
    if (parsedItems.length === 1) {
      const pItem = parsedItems[0];
      const drug = pItem.drug;
      const quantity = pItem.quantity;
      
      if (!drug.allowsDelivery) {
        if (drug.recipeType === 'especial' || drug.name.toLowerCase().includes('roacutan')) {
          return `${drug.name} tem controle especial e exige termo de consentimento. Precisa vir presencialmente com receita e documentação. Não fazemos delivery desse. 🚫||Quer ver outro remédio?`;
        }
        return `${drug.name} é controlado e precisa de receita especial que fica retida. Por regras da Anvisa, só vendemos presencialmente na farmácia - não dá pra entregar. 🚫||Quer ver outro remédio?`;
      }
      
      const isGotas = rawMsg.match(/(\d+)\s*gotas?/i);
      const isComprimidos = rawMsg.match(/(\d+)\s*(comprimidos?|capsulas?|cp|caps)/i);
      
      let frequency = 1;
      const freqHrsMatch = rawMsg.match(/(de\s*)?(\d+)\s*(em\s*)?(\d+)\s*(horas|h)/i);
      const freqTimesMatch = rawMsg.match(/(\d+)\s*(vezes|x)\s*ao\s*dia/i);
      if (freqHrsMatch) {
        const hrs = parseInt(freqHrsMatch[4] || freqHrsMatch[2]);
        if (hrs > 0) frequency = Math.round(24 / hrs);
      } else if (freqTimesMatch) {
        frequency = parseInt(freqTimesMatch[1]);
      }
      
      const durationMatch = rawMsg.match(/(\d+)\s*dias/i);
      
      if (isGotas || isComprimidos) {
        const dose = parseInt(isGotas ? isGotas[1] : isComprimidos[1]);
        const type = isGotas ? 'gotas' : 'comprimidos';
        
        if (durationMatch) {
          const days = parseInt(durationMatch[1]);
          return performCalculationAndOffer(drug, dose, frequency, days, type);
        } else {
          state.pendingCalculation = { drug, dose, frequency, type };
          state.simState = 'waiting_calculation_days';
          return `Quantos dias vai ser o tratamento? Assim calculo certinho quantos frascos ou caixas você precisa.`;
        }
      }

      // Se não for posologia detalhada e houver genérico disponível para o item de marca
      const genericAlt = getGenericAlternative(drug);
      if (genericAlt && !drug.isMocked) {
        state.pendingBrand = { drug, quantity };
        state.pendingGeneric = { drug: genericAlt, quantity };
        state.simState = 'confirm_brand_or_generic';
        
        const priceText = quantity > 1
          ? `tá R$ ${drug.price.toFixed(2)} cada (${quantity} unidades ficam R$ ${(drug.price * quantity).toFixed(2)})`
          : `tá R$ ${drug.price.toFixed(2)}`;
          
        const genericPriceText = quantity > 1
          ? `R$ ${genericAlt.price.toFixed(2)} cada (total de R$ ${(genericAlt.price * quantity).toFixed(2)})`
          : `R$ ${genericAlt.price.toFixed(2)}`;
          
        const cleanGenericName = genericAlt.name.replace(' (Genérico)', '').replace(' 500mg', '').replace(' Gotas', '');
        
        let infoMsg = '';
        if (drug.activeIngredient) {
          infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n• **Indicação:** ${drug.indication}\n• **Posologia sugerida:** ${drug.dosage}`;
          if (drug.contraindications) {
            infoMsg += `\n• **Importante:** ${drug.contraindications}`;
          }
        }

        return `A ${drug.name} ${priceText}.${infoMsg}||Mas ó, temos o genérico dele (${cleanGenericName}) por ${genericPriceText}.||Quer levar o genérico pra economizar?`;
      }
      
      state.pendingItem = { drug, quantity };
      state.simState = 'confirm_add_cart';
      
      let recipeMsg = '';
      if (drug.recipeType === 'retida') {
        recipeMsg = '||Como é antibiótico, o entregador vai precisar recolher a receita física (duas vias) na hora da entrega. Você tem ela aí?';
      } else if (drug.needsRecipe) {
        recipeMsg = '||Esse precisa de receita simples, viu?';
      }
      
      const priceText = quantity > 1 
        ? `${quantity} unidades ficam R$ ${(quantity * drug.price).toFixed(2)}`
        : `tá R$ ${drug.price.toFixed(2)}`;
        
      let infoMsg = '';
      if (drug.activeIngredient) {
        infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n• **Indicação:** ${drug.indication}\n• **Posologia sugerida:** ${drug.dosage}`;
        if (drug.contraindications) {
          infoMsg += `\n• **Importante:** ${drug.contraindications}`;
        }
      }
      
      return `A ${drug.name} (${drug.presentation}) ${priceText}.${recipeMsg}${infoMsg}||Posso colocar no carrinho?`;
      
    } else {
      let responseText = '';
      let subtotal = 0;
      let hasControlled = false;
      let hasAntibiotic = false;
      const pendingList = [];
      
      parsedItems.forEach((pItem) => {
        const drug = pItem.drug;
        const qty = pItem.quantity;
        const totalItem = drug.price * qty;
        subtotal += totalItem;
        pendingList.push(pItem);
        
        if (!drug.allowsDelivery) {
          hasControlled = true;
        }
        if (drug.recipeType === 'retida') {
          hasAntibiotic = true;
        }
        
        const recipeNote = drug.needsRecipe 
          ? (drug.recipeType === 'retida' ? ' (antibiótico)' : ' (precisa de receita)') 
          : '';
          
        responseText += `• ${qty}x ${drug.name} - R$ ${totalItem.toFixed(2)}${recipeNote}\n`;
      });
      
      if (hasControlled) {
        return `Olha, vi que você incluiu medicamentos controlados (tarja preta/amarela). Por regras da Anvisa, a gente não pode entregar esses.||Nesse caso, você precisaria vir buscar aqui na loja física com a receita original em mãos. Quer que eu tire eles do carrinho e continue com os outros?`;
      }
      
      state.pendingItemsList = pendingList;
      state.simState = 'confirm_add_cart';
      
      let warnings = '';
      if (hasAntibiotic) {
        warnings = '||E lembrando que a receita do antibiótico precisa ser física em duas vias (uma fica com a gente na entrega), beleza?';
      }
      
      return `Achei os itens por aqui! Olha os preços:\n${responseText}\n*Total:* R$ ${subtotal.toFixed(2)}.${warnings}||Posso colocar todos eles no carrinho?`;
    }
  }

  if (norm.match(/(horario|aberto|funcionamento|que horas)/i)) {
    return "Funcionamos de segunda a sábado das 7h às 22h, e aos domingos das 8h às 18h. ⏰";
  }
  if (norm.match(/(endereco|onde fica|localizacao|onde vcs)/i)) {
    return "Ficamos na Rua da Saúde, 500 - Centro. Quer dar uma passada aqui ou prefere que a gente entregue?";
  }
  if (norm.match(/(delivery|entrega|entregam|taxa|frete)/i)) {
    return "Nosso delivery funciona de segunda a sábado das 8h às 21h30. A taxa é R$ 5,00 pra qualquer bairro. Quer pedir algo?";
  }
  if (norm.match(/(pagamento|forma|pagar|cartao|pix|dinheiro)/i)) {
    return "Aceitamos Pix, cartão de crédito/débito e dinheiro na entrega. 💳";
  }
  if (norm.match(/(oi|ola|bom dia|boa tarde|boa noite|tudo bem)/i)) {
    return "Oi! Tudo bem? Sou a Sofia, assistente virtual da Farmácia. No que posso te ajudar?";
  }
  if (norm.match(/(receita|controlado|antibiotico|tarja preta)/i)) {
    return "Medicamento comum precisa de receita simples. Antibiótico precisa de 2 vias (uma retida, entregamos no delivery). Tarja Preta e Roacutan só presencialmente na farmácia. 🚫";
  }

  return "Desculpa, não entendi muito bem. Você pode me falar o nome do remédio ou me perguntar sobre preços e horários?";
}

function performCalculationAndOffer(drug, dose, frequency, days, type) {
  let quantityNeeded = 0;

  if (type === 'gotas') {
    const totalDrops = dose * frequency * days;
    const mlNeeded = totalDrops / 20;
    const bottlesNeeded = Math.ceil(mlNeeded / 20);
    quantityNeeded = bottlesNeeded;
  } else {
    const totalPills = dose * frequency * days;
    const pillsPerBox = drug.unitPills || 20;
    const boxesNeeded = Math.ceil(totalPills / pillsPerBox);
    quantityNeeded = boxesNeeded;
  }

  state.pendingItem = { drug, quantity: quantityNeeded };
  state.simState = 'confirm_add_cart';

  let recipeMsg = '';
  if (drug.recipeType === 'retida') {
    recipeMsg = '||Como é antibiótico, o entregador vai precisar recolher a receita original de duas vias na entrega. Você tem ela?';
  } else if (drug.needsRecipe) {
    recipeMsg = '||Esse precisa de receita simples. A receita não fica retida, mas precisa estar válida.';
  }

  const containerName = quantityNeeded > 1 
    ? (type === 'gotas' ? 'frascos' : 'caixas')
    : (type === 'gotas' ? 'frasco' : 'caixa');

  let infoMsg = '';
  if (drug.activeIngredient) {
    infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n• **Indicação:** ${drug.indication}\n• **Posologia sugerida:** ${drug.dosage}`;
    if (drug.contraindications) {
      infoMsg += `\n• **Importante:** ${drug.contraindications}`;
    }
  }

  return `Pro tratamento completo de ${days} dias, você vai precisar de ${quantityNeeded} ${containerName} de ${drug.name}.||Fica R$ ${(quantityNeeded * drug.price).toFixed(2)} no total.${recipeMsg}${infoMsg}||Quer que eu adicione ao pedido?`;
}

function handleConfirmBrandOrGeneric(norm) {
  const pGeneric = state.pendingGeneric;
  const pBrand = state.pendingBrand;
  
  if (!pGeneric || !pBrand) {
    state.simState = 'idle';
    return "Ocorreu um erro no fluxo do pedido. No que posso ajudar?";
  }
  
  if (norm.match(/(generico|segundo|mais barato|outro|economizar|simil|2)/i)) {
    const existing = MEDICINES_DB.find(d => d.name === pGeneric.drug.name);
    if (!existing) {
      MEDICINES_DB.push(pGeneric.drug);
    }
    
    state.pendingItem = pGeneric;
    state.pendingGeneric = null;
    state.pendingBrand = null;
    state.simState = 'confirm_add_cart';
    
    let recipeMsg = pGeneric.drug.needsRecipe
      ? (pGeneric.drug.recipeType === 'retida' ? '||Como é antibiótico, o entregador vai precisar recolher a receita original de duas vias na entrega. Você tem ela?' : '||Esse precisa de receita simples. A receita não fica retida, mas precisa estar válida.')
      : '';
      
    const totalText = pGeneric.quantity > 1 ? ` R$ ${(pGeneric.drug.price * pGeneric.quantity).toFixed(2)} no total` : ` R$ ${pGeneric.drug.price.toFixed(2)}`;
    return `Combinado, vamos levar o Genérico (${pGeneric.drug.name}). Fica${totalText}.${recipeMsg}||Posso colocar no carrinho?`;
  } else {
    state.pendingItem = pBrand;
    state.pendingGeneric = null;
    state.pendingBrand = null;
    state.simState = 'confirm_add_cart';
    
    let recipeMsg = pBrand.drug.needsRecipe
      ? (pBrand.drug.recipeType === 'retida' ? '||Como é antibiótico, o entregador vai precisar recolher a receita original de duas vias na entrega. Você tem ela?' : '||Esse precisa de receita simples. A receita não fica retida, mas precisa estar válida.')
      : '';
      
    const totalText = pBrand.quantity > 1 ? ` R$ ${(pBrand.drug.price * pBrand.quantity).toFixed(2)} no total` : ` R$ ${pBrand.drug.price.toFixed(2)}`;
    return `Beleza, então vai ser o de marca mesmo (${pBrand.drug.name}). Fica${totalText}.${recipeMsg}||Posso colocar no carrinho?`;
  }
}

function handleConfirmUpsell(norm) {
  const pUpsell = state.pendingUpsell;
  state.pendingUpsell = null;

  if (norm.match(/(sim|pode|quero|adiciona|ok|confirm|positivo|isso|boa|1|aceito|quero)/i) && pUpsell) {
    const existing = state.cart.find(item => item.drug.name === pUpsell.drug.name);
    if (existing) {
      existing.quantity += pUpsell.quantity;
    } else {
      state.cart.push(pUpsell);
    }
    
    state.simState = 'waiting_delivery_method';
    return `Adicionado! 🛒||Você prefere que a gente faça a entrega (delivery taxa de R$ 5,00) ou prefere retirar na nossa loja (grátis)?`;
  } else {
    state.simState = 'waiting_delivery_method';
    return `Tudo bem!||Você prefere que a gente faça a entrega (delivery taxa de R$ 5,00) ou prefere retirar na nossa loja (grátis)?`;
  }
}

function handleWaitingDeliveryMethod(norm) {
  if (norm.match(/(retira|loja|buscar|presencial|pegar)/i)) {
    state.deliveryMethod = 'Retirada';
    state.deliveryAddress = 'Retirada presencial na loja física';
    state.simState = 'waiting_payment';
    return `Combinado! Você retira aqui na loja (Rua da Saúde, 500). Estará pronto em 30 min.||Qual vai ser a forma de pagamento? Aceitamos Pix, cartão ou dinheiro.`;
  } else if (norm.match(/(entrega|delivery|entregam|receber|casa|endereco)/i)) {
    state.deliveryMethod = 'Delivery';
    state.simState = 'waiting_address';
    return `Beleza! Me passa seu endereço completo com ponto de referência pra entrega, por favor?`;
  } else {
    return `Desculpa, não entendi. Você prefere que a gente faça a entrega (Delivery) ou quer retirar aqui na loja (Retirada)?`;
  }
}

function handleConfirmAddCartState(norm) {
  if (norm.match(/(sim|pode|quero|adiciona|ok|confirm|positivo|isso|boa|coloca|vai)/i)) {
    if (state.pendingItemsList && state.pendingItemsList.length > 0) {
      state.pendingItemsList.forEach(pItem => {
        const existing = state.cart.find(item => item.drug.name === pItem.drug.name);
        if (existing) {
          existing.quantity += pItem.quantity;
        } else {
          state.cart.push(pItem);
        }
      });
      state.pendingItemsList = [];
    } else if (state.pendingItem) {
      const existing = state.cart.find(item => item.drug.name === state.pendingItem.drug.name);
      if (existing) {
        existing.quantity += state.pendingItem.quantity;
      } else {
        state.cart.push(state.pendingItem);
      }
      state.pendingItem = null;
    }
    state.simState = 'more_items';
    return "Adicionado! 🛒||Quer aproveitar e levar mais alguma coisa?";
  } else {
    state.pendingItem = null;
    state.pendingItemsList = [];
    state.simState = 'more_items';
    return "Tudo bem, não adicionei.||Precisa de mais alguma coisa?";
  }
}

function handleWaitingCalculationDays(norm) {
  const daysMatch = norm.match(/(\d+)/);
  if (!daysMatch) {
    return "Não entendi a quantidade de dias. Por favor, me fale apenas o número de dias do tratamento (ex: 7 ou 10 dias).";
  }

  const days = parseInt(daysMatch[1]);
  const calc = state.pendingCalculation;
  if (!calc) {
    state.simState = 'idle';
    return "Opa, ocorreu um errinho no cálculo. Vamos começar de novo? Qual remédio você precisa?";
  }

  const response = performCalculationAndOffer(calc.drug, calc.dose, calc.frequency, days, calc.type);
  state.pendingCalculation = null;
  return response;
}

function handleMoreItemsState(norm, rawMsg) {
  if (norm.match(/(so isso|nao|nada|finalizar|fechar|entregar|checkout|concluir)/i)) {
    if (state.cart.length === 0) {
      state.simState = 'idle';
      return "Seu carrinho tá vazio! Qual medicamento você gostaria de pedir?";
    }

    // Verificar se já oferecemos upsell nesta sessão
    if (!state.upsellOffered) {
      state.upsellOffered = true;
      
      const hasAntigripal = state.cart.some(item => 
        item.drug.name.toLowerCase().match(/(benegrip|cimegripe|resfenol)/i)
      );
      if (hasAntigripal) {
        state.pendingUpsell = { 
          drug: { name: 'Vitamina C Efervescente 1g', price: 14.90, category: 'MIP', needsRecipe: false, allowsDelivery: true, presentation: 'tubo com 10 comprimidos efervescentes', unitName: 'tubo' },
          quantity: 1 
        };
        state.simState = 'confirm_upsell';
        return "Vi que você pegou remédio pra gripe. Quer aproveitar e levar uma Vitamina C efervescente por R$ 14,90 pra ajudar na imunidade?";
      }

      const hasAnalgesico = state.cart.some(item => 
        item.drug.name.toLowerCase().match(/(dipirona|tylenol|dorflex|advil|neosaldina)/i)
      );
      if (hasAnalgesico) {
        state.pendingUpsell = { 
          drug: { name: 'Termômetro Digital G-Tech', price: 19.90, category: 'MIP', needsRecipe: false, allowsDelivery: true, presentation: 'unidade', unitName: 'unidade' },
          quantity: 1 
        };
        state.simState = 'confirm_upsell';
        return "Quer aproveitar e levar um Termômetro Digital por R$ 19,90 pra acompanhar a temperatura?";
      }
    }

    state.simState = 'waiting_delivery_method';
    return "Combinado!||Você prefere que a gente entregue ou quer passar aqui pra retirar?";
  }

  state.simState = 'idle';
  return handleIdleState(norm, rawMsg);
}

function handleWaitingAddressState(rawMsg) {
  state.deliveryAddress = rawMsg.trim();
  state.simState = 'waiting_payment';
  return "Anotado! Qual vai ser a forma de pagamento? Aceitamos Pix, cartão ou dinheiro.";
}

function handleWaitingPaymentState(norm) {
  let matched = '';
  if (norm.match(/pix/i)) {
    matched = 'Pix';
  } else if (norm.match(/(cartao|credito|debito|maquininha)/i)) {
    matched = 'Cartão';
  } else if (norm.match(/(dinheiro|troco)/i)) {
    matched = 'Dinheiro';
  } else {
    return "Desculpa, não entendi a forma de pagamento. Aceitamos Pix, cartão ou dinheiro. Qual prefere?";
  }

  state.paymentMethod = matched;
  state.simState = 'waiting_confirm';

  let subtotal = 0;
  let itemsLines = '';
  let containsAntibiotic = false;

  state.cart.forEach(item => {
    const itemTotal = item.drug.price * item.quantity;
    subtotal += itemTotal;
    itemsLines += ` • ${item.drug.name} - ${item.quantity}un - R$ ${itemTotal.toFixed(2)}\n`;
    if (item.drug.category === 'Antibiótico') {
      containsAntibiotic = true;
    }
  });

  const isRetirada = state.deliveryMethod === 'Retirada';
  const deliveryFee = isRetirada ? 0.00 : 5.00;
  const total = subtotal + deliveryFee;

  let antibioticNotice = '';
  if (containsAntibiotic) {
    if (isRetirada) {
      antibioticNotice = `\n⚠️ *Aviso de Receita:* Como seu pedido possui antibiótico, você precisará trazer a receita original física (2 vias) para retenção no momento da retirada.\n`;
    } else {
      antibioticNotice = `\n⚠️ *Aviso de Receita:* Como seu pedido possui antibiótico, o entregador vai precisar recolher a receita original física (2 vias) na hora da entrega.\n`;
    }
  }

  const deliveryText = isRetirada ? 'Retirada na loja' : 'Delivery';
  const deliveryTime = isRetirada ? 'Pronto em 30 minutos' : '30 a 50 minutos';

  const responseText = `📋 *Confirmando seu pedido:*

*Itens:*
${itemsLines}
*Subtotal produtos:* R$ ${subtotal.toFixed(2)}
*Taxa de entrega:* ${isRetirada ? 'Grátis' : 'R$ ' + deliveryFee.toFixed(2)}
*Total:* R$ ${total.toFixed(2)}

*Modalidade:* ${deliveryText}
*Local/Endereço:* ${state.deliveryAddress}
*Pagamento:* ${state.paymentMethod}
*Previsão:* ${deliveryTime}
${antibioticNotice}
Tudo certo? Posso confirmar?`;

  return responseText;
}

function handleWaitingConfirmState(norm) {
  if (norm.match(/(sim|confirmo|pode|tudo certo|ok|confirmado|isso|positivo)/i)) {
    const payment = state.paymentMethod;
    const isRetirada = state.deliveryMethod === 'Retirada';
    state.cart = [];
    state.deliveryAddress = '';
    state.paymentMethod = '';
    state.deliveryMethod = '';
    state.upsellOffered = false;
    state.simState = 'idle';

    if (isRetirada) {
      if (payment === 'Pix') {
        return "Pedido confirmado! 🎉 Estará pronto para retirada em 30 minutos.||Aqui está nossa chave Pix CNPJ: *12.345.678/0001-99* (Farmácia Sofia Ltda). Assim que fizer o pagamento, traga o comprovante ou nos envie aqui. Obrigado!";
      }
      return "Pedido confirmado! 🎉 Já estamos separando. Estará pronto para retirada em 30 minutos na Rua da Saúde, 500. Te esperamos!";
    } else {
      if (payment === 'Pix') {
        return "Pedido confirmado! 🛵 Chega em cerca de 30 a 50 min.||Aqui está nossa chave Pix CNPJ: *12.345.678/0001-99* (Farmácia Sofia Ltda). Assim que fizer o pagamento, pode mandar o comprovante aqui. Obrigado!";
      }
      return "Pedido confirmado! 🛵 Já estamos preparando o envio. Chega na sua casa em cerca de 30 a 50 min. Obrigado pela preferência!";
    }
  } else if (norm.match(/(nao|cancelar|editar|alterar|mudar)/i)) {
    state.cart = [];
    state.deliveryAddress = '';
    state.paymentMethod = '';
    state.deliveryMethod = '';
    state.upsellOffered = false;
    state.simState = 'idle';
    return "Pedido cancelado. Como posso ajudar com outra coisa?";
  } else {
    return "Não entendi sua resposta. Tudo certo com o resumo acima? Responda 'Sim' para confirmar o pedido, ou 'Não' para cancelar.";
  }
}

// ============ WEBHOOK ============
async function sendToWebhook(message, attempt = 0) {
  if (CONFIG.simulationMode) {
    // Simula atraso na resposta de rede
    await delay(600 + Math.random() * 400);
    return runSimulation(message);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        session_id: state.sessionId,
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (Array.isArray(data)) {
      return data[0]?.message || data[0]?.output || data[0]?.text || JSON.stringify(data[0]);
    }
    return data.message || data.output || data.text || data.response || JSON.stringify(data);

  } catch (err) {
    if (attempt < CONFIG.maxRetries) {
      await delay(CONFIG.retryDelay);
      return sendToWebhook(message, attempt + 1);
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
  const msg = { role: 'assistant', content: text, time: now() };
  state.messages.push(msg);
  saveHistory();
  renderMessage(msg);
  updateSidebar(text);

  // Sound notification
  if (state.soundEnabled) playNotificationSound();

  // If scrolled up, show unread count
  if (state.isScrolledUp) {
    state.unreadCount++;
    dom.scrollFabBadge.textContent = state.unreadCount;
    dom.scrollFabBadge.classList.add('show');
  } else {
    scrollToBottom();
  }

  // Tab title notification
  if (document.hidden) {
    document.title = `(${state.messages.filter(m => m.role === 'assistant').length}) ${state.originalTitle}`;
  }

  // Update sidebar badge with real unread count
  dom.sidebarBadge.textContent = state.unreadCount > 0 ? state.unreadCount : '1';
  dom.sidebarBadge.style.display = 'flex';
}

function renderMessage(msg) {
  const isUser = msg.role === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `message ${isUser ? 'outgoing' : 'incoming'}`;

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';

  const textEl = document.createElement('span');
  textEl.className = 'message-text';
  textEl.innerHTML = linkify(msg.content);

  const meta = document.createElement('span');
  meta.className = 'message-meta';

  const timeEl = document.createElement('span');
  timeEl.className = 'message-time';
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

  // Click to copy message
  bubble.addEventListener('click', () => copyMessage(bubble, msg.content));

  // Insert before typing indicator
  dom.chatMessages.insertBefore(wrapper, dom.typingIndicator);
}

function renderSavedMessages() {
  state.messages.forEach(msg => renderMessage(msg));
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
  dom.sidebarTime.textContent = now();
}

// ============ SCROLL MANAGEMENT ============
function handleScroll() {
  const el = dom.chatMessages;
  const threshold = 150;
  const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  state.isScrolledUp = distFromBottom > threshold;

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
    // Position the fixed dropdown relative to the trigger button
    const rect = triggerBtn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    
    menu.style.left = 'auto';
    menu.style.right = 'auto';
    
    // Position based on which half of the screen the button is on
    if (rect.right > window.innerWidth / 2) {
      // Right side: align right edge, but keep at least 16px from the screen edge
      menu.style.right = Math.max(16, window.innerWidth - rect.right) + 'px';
    } else {
      // Left side: align left edge, but keep at least 16px from the screen edge
      menu.style.left = Math.max(16, rect.left) + 'px';
    }

    menu.classList.add('show');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
}

// ============ DIALOGS ============
function showDialog(text, subtext, onConfirm) {
  dom.dialogText.textContent = text;
  dom.dialogSubtext.textContent = subtext;
  state.pendingAction = onConfirm;
  dom.dialogOverlay.classList.add('show');
}

function closeDialog() {
  dom.dialogOverlay.classList.remove('show');
  state.pendingAction = null;
}

function showNewChatDialog() {
  showDialog(
    'Iniciar nova conversa?',
    'Uma nova sessão será criada. O histórico anterior será apagado do navegador.',
    startNewConversation
  );
}

function showClearChatDialog() {
  showDialog(
    'Limpar conversa?',
    'Todas as mensagens serão removidas da tela. A sessão continuará ativa.',
    clearChat
  );
}

// ============ ACTIONS ============
function startNewConversation() {
  // Clear state
  state.messages = [];
  state.unreadCount = 0;
  state.simState = 'idle';
  state.cart = [];
  state.deliveryAddress = '';
  state.paymentMethod = '';
  state.pendingItem = null;
  state.pendingCalculation = null;
  state.pendingItemsList = [];
  state.pendingBrand = null;
  state.pendingGeneric = null;
  state.pendingUpsell = null;
  state.upsellOffered = false;
  state.deliveryMethod = '';

  // Reset header status if transfer was active
  dom.chatStatus.textContent = 'online';

  // Clear localStorage
  localStorage.removeItem(CONFIG.sessionKey);
  localStorage.removeItem(CONFIG.historyKey);

  // New session
  state.sessionId = loadOrCreateSession();

  // Clear chat DOM
  clearChatDom();

  // Reset sidebar
  dom.sidebarLastMsg.textContent = 'Toque para iniciar conversa';
  dom.sidebarTime.textContent = 'agora';
  dom.sidebarBadge.style.display = 'none';

  // Reset tab title
  document.title = state.originalTitle;

  // Greeting after reset
  greetUser(CONFIG.newChatGreetingDelay);

  showToast('Nova conversa iniciada');
}

function clearChat() {
  state.messages = [];
  state.simState = 'idle';
  state.cart = [];
  state.deliveryAddress = '';
  state.paymentMethod = '';
  state.pendingItem = null;
  state.pendingCalculation = null;
  state.pendingItemsList = [];
  state.pendingBrand = null;
  state.pendingGeneric = null;
  state.pendingUpsell = null;
  state.upsellOffered = false;
  state.deliveryMethod = '';

  // Reset header status if transfer was active
  dom.chatStatus.textContent = 'online';

  localStorage.removeItem(CONFIG.historyKey);
  clearChatDom();
  dom.sidebarLastMsg.textContent = 'Conversa limpa';
  dom.sidebarBadge.style.display = 'none';
  showToast('Conversa limpa');
}

function clearChatDom() {
  // Remove all message elements, keep system message, date divider & typing
  const messages = dom.chatMessages.querySelectorAll('.message');
  messages.forEach(m => m.remove());
}

function exportConversation() {
  if (state.messages.length === 0) {
    showToast('Nenhuma mensagem para exportar');
    return;
  }

  let text = `Conversa — Farmácia\n`;
  text += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;
  text += `Sessão: ${state.sessionId}\n`;
  text += '—'.repeat(40) + '\n\n';

  state.messages.forEach(msg => {
    const sender = msg.role === 'user' ? 'Você' : `${CONFIG.botName} (Bot)`;
    text += `[${msg.time}] ${sender}:\n${msg.content}\n\n`;
  });

  // Download as txt
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `conversa-farmacia-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Conversa exportada com sucesso');
}

function copyMessage(bubble, text) {
  navigator.clipboard.writeText(text).then(() => {
    bubble.classList.add('copied');
    setTimeout(() => bubble.classList.remove('copied'), 1500);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
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
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>${message}`;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 2500);
}

// ============ SOUND ============
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
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
    // Close context after sound ends to prevent resource leak
    osc.addEventListener('ended', () => ctx.close());
  } catch { /* Audio not supported */ }
}

function updateSoundLabel() {
  if (dom.soundLabel) {
    dom.soundLabel.textContent = state.soundEnabled ? 'Som: Ligado' : 'Som: Desligado';
  }
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
  // Escape HTML first to prevent XSS
  let safe = escapeHtml(text);

  // 1. WhatsApp Code Block (```code```)
  safe = safe.replace(/```(.*?)```/gs, '<code>$1</code>');

  // 2. Markdown Bold (**bold**)
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. WhatsApp Bold (*bold*)
  safe = safe.replace(/\*([^\s\*](?:[^\*]*[^\s\*])?)\*/g, '<strong>$1</strong>');

  // 4. WhatsApp Italic (_italic_)
  safe = safe.replace(/_([^\s_](?:[^_]*[^\s_])?)_/g, '<em>$1</em>');

  // 5. WhatsApp Strikethrough (~strikethrough~)
  safe = safe.replace(/~([^\s~](?:[^~]*[^\s~])?)~/g, '<del>$1</del>');

  // 6. Convert URLs to clickable links
  const urlPattern = /(https?:\/\/[^\s<]+)/g;
  return safe.replace(urlPattern, (url) => {
    // Truncate display text for long URLs
    const display = url.length > 45 ? url.slice(0, 42) + '...' : url;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="message-link">${display}</a>`;
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function scrollToBottom(smooth = true) {
  requestAnimationFrame(() => {
    dom.chatMessages.scrollTo({
      top: dom.chatMessages.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  });
}

// ============ START ============
document.addEventListener('DOMContentLoaded', init);
