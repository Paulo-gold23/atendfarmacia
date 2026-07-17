
/**
 * Farmacia WhatsApp Frontend — app.js
 * Handles chat logic, local simulation, webhook integration, and UI interactions.
 */

// ============ CONFIG ============
// simulationMode: true  → funciona sem n8n (GitHub Pages / demo)
// simulationMode: false → envia para o webhook n8n real
const CONFIG = {
  simulationMode: true,
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
  cpf: null,
  discountPercent: 0,
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
  dom.btnAttach = document.getElementById('attachBtn');
  dom.micBtn = document.getElementById('micBtn');
  dom.imageFileInput = document.getElementById('imageFileInput');
  dom.docFileInput = document.getElementById('docFileInput');
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

  // Garantir que o micBtn esteja visível ao carregar (sendBtn começa hidden)
  if (dom.micBtn) dom.micBtn.style.display = 'flex';
  if (dom.sendBtn) dom.sendBtn.style.display = 'none';

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
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function toggleRecording() {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/ogg' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result;
          addUserMessage('🎙️ *Mensagem de Áudio* (Áudio enviado)');
          showTyping();
          try {
            const response = await sendToWebhook(base64Audio, 'audio');
            hideTyping();
            
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
            hideTyping();
            addBotMessage('Desculpe, ocorreu um erro na comunicação.');
            console.error('[ClinicAI] Webhook error:', error);
          }
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorder.start();
      isRecording = true;
      dom.micBtn.classList.add('recording');
      showToast('🎙️ Gravando áudio... Clique no microfone novamente para enviar.');
    } catch (err) {
      console.error('Error starting recording:', err);
      showToast('⚠️ Não foi possível acessar o microfone. Enviando áudio simulado...');
      sendSimulatedAudio();
    }
  } else {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    dom.micBtn.classList.remove('recording');
  }
}

async function sendSimulatedAudio() {
  addUserMessage('🎙️ *Mensagem de Áudio* (Simulado)');
  showTyping();
  try {
    const dummyAudioBase64 = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAA+AAAAAAAAAAAAAAABaGVhZAAAAAA=';
    const response = await sendToWebhook(dummyAudioBase64, 'audio');
    hideTyping();
    
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
    hideTyping();
    addBotMessage('Desculpe, ocorreu um erro na comunicação.');
    console.error('[ClinicAI] Webhook error:', error);
  }
}

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

  // Auto-resize textarea and toggle send/mic buttons
  dom.messageInput.addEventListener('input', () => {
    dom.messageInput.style.height = 'auto';
    dom.messageInput.style.height = Math.min(dom.messageInput.scrollHeight, 120) + 'px';
    
    const hasText = dom.messageInput.value.trim().length > 0;
    if (hasText) {
      dom.sendBtn.style.display = 'flex';
      dom.micBtn.style.display = 'none';
      dom.sendBtn.classList.add('active');
    } else {
      dom.sendBtn.style.display = 'none';
      dom.micBtn.style.display = 'flex';
      dom.sendBtn.classList.remove('active');
    }
  });

  // Mic button click
  dom.micBtn.addEventListener('click', toggleRecording);

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
    dom.imageFileInput.click();
  });

  dom.imageFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast('Processando imagem...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      addUserMessage(`📷 *Imagem enviada:* ${file.name}`);
      showTyping();
      try {
        const response = await sendToWebhook(base64Image, 'image', file.name);
        hideTyping();
        
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
        hideTyping();
        addBotMessage('Desculpe, ocorreu um erro ao processar a imagem.');
        console.error('[ClinicAI] Webhook error:', error);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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

// ============ SEND MESSAGE ============
async function handleSend() {
  const text = dom.messageInput.value.trim();
  if (!text || state.isSending) return;

  state.isSending = true;
  dom.messageInput.value = '';
  dom.messageInput.style.height = 'auto';
  dom.sendBtn.classList.remove('active');
  dom.sendBtn.style.display = 'none';
  dom.micBtn.style.display = 'flex';

  addUserMessage(text);
  showTyping();

  try {
    const response = await sendToWebhook(text);
    hideTyping();
    
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
    hideTyping();
    addBotMessage('Desculpe, ocorreu um erro na comunicação. Tente novamente em alguns instantes.');
    console.error('[ClinicAI] Webhook error:', error);
  }

  state.isSending = false;
  dom.messageInput.focus();
}

// MEDICINES_DB is loaded from medicines_database.js


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

    case 'waiting_cpf':
      return handleWaitingCpf(norm, message);

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

const COLLOQUIAL_MAP = {
  'remedio de pressao': ['pressão', 'hipertensão'],
  'remedio de pressao alta': ['pressão', 'hipertensão'],
  'remedio para pressao': ['pressão', 'hipertensão'],
  'remedio de acucar': ['diabetes'],
  'remedio de diabetes': ['diabetes'],
  'remedio para diabetes': ['diabetes'],
  'remedio pra dormir': ['sono', 'insônia'],
  'remedio para dormir': ['sono', 'insônia'],
  'remedio de dor': ['dor'],
  'remedio para dor': ['dor'],
  'remedio de dor de cabeca': ['cabeça', 'dor'],
  'remedio para dor de cabeca': ['cabeça', 'dor'],
  'bombinha': ['bombinha', 'asma', 'falta de ar'],
  'remedio de colesterol': ['colesterol'],
  'remedio para colesterol': ['colesterol'],
  'remedio de tireoide': ['tireoide'],
  'remedio para tireoide': ['tireoide']
};

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function parseMedicinesFromText(text) {
  const norm = normalizeText(text);
  const itemsFound = [];
  
  // Split input by potential separators for multiple items
  const parts = text.split(/\s+e\s+|\s*,\s*|\s+mais\s+|\s*\+\s*/i);
  
  for (const part of parts) {
    const normPart = normalizeText(part);
    if (!normPart) continue;
    
    // Look for quantity
    let quantity = 1;
    const qtyMatch = normPart.match(/(\d+)\s*(caixas?|frascos?|unidades?|un|cps?|comprimidos?|envelopes?|bisnagas?)/i);
    if (qtyMatch) {
      quantity = parseInt(qtyMatch[1]);
    }
    
    // Clean the text to search for name
    let searchText = normPart
      .replace(/(\d+)\s*(caixas?|frascos?|unidades?|un|cps?|comprimidos?|envelopes?|bisnagas?)/gi, '')
      .replace(/^(de|da|do|para|com|comprar|tem|vcs\s+tem|gostaria\s+de|gostaria|quero|preciso\s+de|preciso|me\s+ve)\s+/i, '')
      .trim();
      
    // Clear punctuation
    searchText = searchText.replace(/[^\w\s-]/g, '').trim();
    if (searchText.length < 3) continue;
    
    // Try to find matching drug in MEDICINES_DB using exact word boundaries
    let matchedDrug = null;
    let longestMatchLen = 0;
    
    for (const drug of MEDICINES_DB) {
      for (const alias of drug.aliases) {
        const regex = new RegExp('\\b' + escapeRegex(alias) + '\\b', 'i');
        if (regex.test(searchText)) {
          if (alias.length > longestMatchLen) {
            matchedDrug = drug;
            longestMatchLen = alias.length;
          }
        }
      }
    }
    
    // Fallback: substring matching if search text is longer and no exact match found
    if (!matchedDrug && searchText.length >= 4) {
      for (const drug of MEDICINES_DB) {
        for (const alias of drug.aliases) {
          if (alias.includes(searchText) || searchText.includes(alias)) {
            matchedDrug = drug;
            break;
          }
        }
        if (matchedDrug) break;
      }
    }
    
    if (matchedDrug) {
      itemsFound.push({ drug: matchedDrug, quantity });
    }
  }
  
  return itemsFound;
}

function generateMockDrug(name) {
  return null;
}

function getGenericAlternative(drug) {
  if (!drug.activeIngredient || drug.isGeneric) return null;
  
  // Find in DB for an equivalent that is generic
  const genericAlt = MEDICINES_DB.find(d => 
    d.activeIngredient === drug.activeIngredient && 
    d.isGeneric === true
  );
  
  if (genericAlt) return genericAlt;

  // Manual fallback for common ones
  const nameLower = drug.name.toLowerCase();
  if (nameLower.includes('tylenol')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('paracetamol'));
  }
  if (nameLower.includes('novalgina')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('dipirona'));
  }
  if (nameLower.includes('buscopan composto')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('butilbrometo de escopolamina') && d.name.toLowerCase().includes('dipirona')) || MEDICINES_DB.find(d => d.name.toLowerCase().includes('butilbrometo'));
  }
  if (nameLower.includes('glifage')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('metformina'));
  }
  if (nameLower.includes('rivotril')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('clonazepam'));
  }
  if (nameLower.includes('ritalina')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('metilfenidato'));
  }
  if (nameLower.includes('lexotan')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('bromazepam'));
  }
  if (nameLower.includes('frontal')) {
    return MEDICINES_DB.find(d => d.name.toLowerCase().includes('alprazolam'));
  }
  return null;
}

function formatCPF(digits) {
  const d = digits.slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function handleWaitingCpf(norm, rawMsg) {
  if (norm.match(/(nao|no|na|pular|continuar|sem)/i)) {
    state.cpf = 'não';
    state.discountPercent = 0;
    localStorage.setItem('sofia_cpf', 'não');
    localStorage.setItem('sofia_discount_percent', '0');
    return proceedToQuoteAfterCpf();
  }
  
  const digits = rawMsg.replace(/\D/g, '');
  if (digits.length >= 11) {
    const cpfFormatted = formatCPF(digits);
    state.cpf = cpfFormatted;
    const discount = 10 + Math.floor(Math.random() * 21);
    state.discountPercent = discount;
    localStorage.setItem('sofia_cpf', cpfFormatted);
    localStorage.setItem('sofia_discount_percent', discount.toString());
    return `CPF *${cpfFormatted}* localizado! 🎉\nVocê ganhou um desconto de *${discount}%* fidelidade nos medicamentos de marca para este pedido.||` + proceedToQuoteAfterCpf();
  } else {
    return `Por favor, digite um CPF válido (11 números) ou digite *não* para prosseguir sem desconto fidelidade.`;
  }
}

function proceedToQuoteAfterCpf() {
  const parsedItems = state.pendingItemsList || [];
  state.pendingItemsList = [];
  
  if (parsedItems.length === 0) {
    state.simState = 'idle';
    return "No que posso ajudar? Digite o nome do medicamento.";
  }
  
  if (parsedItems.length === 1) {
    const pItem = parsedItems[0];
    const drug = pItem.drug;
    const quantity = pItem.quantity;
    
    if (!drug.allowsDelivery) {
      state.simState = 'idle';
      if (drug.recipeType === 'especial' || drug.name.toLowerCase().includes('roacutan')) {
        return `${drug.name} tem controle especial e exige termo de consentimento. Precisa vir presencialmente com receita e documentação. Não fazemos delivery desse. 🚫||Quer ver outro remédio?`;
      }
      return `${drug.name} é controlado e precisa de receita especial que fica retida. Por regras da Anvisa, só vendemos presencialmente na farmácia - não dá pra entregar. 🚫||Quer ver outro remédio?`;
    }
    
    let price = drug.price;
    let discountNotice = '';
    if (state.discountPercent > 0 && !drug.isGeneric) {
      const originalPrice = drug.price;
      price = originalPrice * (1 - state.discountPercent / 100);
      discountNotice = ` (de R$ ${originalPrice.toFixed(2)} por *R$ ${price.toFixed(2)}* com ${state.discountPercent}% desc. fidelidade)`;
    }
    
    const isGotas = state.pendingActionRawText ? state.pendingActionRawText.match(/(\d+)\s*gotas?/i) : null;
    const isComprimidos = state.pendingActionRawText ? state.pendingActionRawText.match(/(\d+)\s*(comprimidos?|capsulas?|cp|caps)/i) : null;
    
    // Suggest generic if available
    const genericAlt = getGenericAlternative(drug);
    if (genericAlt) {
      state.pendingBrand = { drug, quantity, finalPrice: price };
      state.pendingGeneric = { drug: genericAlt, quantity, finalPrice: genericAlt.price };
      state.simState = 'confirm_brand_or_generic';
      
      const priceQuoteText = quantity > 1
        ? `tá R$ ${drug.price.toFixed(2)} cada${discountNotice} (total R$ ${(price * quantity).toFixed(2)})`
        : `tá R$ ${drug.price.toFixed(2)}${discountNotice}`;
        
      const genericPriceText = quantity > 1
        ? `R$ ${genericAlt.price.toFixed(2)} cada (total de R$ ${(genericAlt.price * quantity).toFixed(2)})`
        : `R$ ${genericAlt.price.toFixed(2)}`;
        
      const cleanGenericName = genericAlt.name.replace(' (Genérico)', '').replace(' 500mg', '').replace(' Gotas', '');
      
      let infoMsg = '';
      if (drug.activeIngredient) {
        infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n⚠️ *Nota de Segurança:* ${drug.safetyNote}`;
      }

      return `Temos o de referência *${drug.name}* que ${priceQuoteText}.${infoMsg}||Mas ó, temos o genérico dele (${cleanGenericName}) por ${genericPriceText}.||Quer levar o genérico pra economizar?`;
    }
    
    state.pendingItem = { drug, quantity, finalPrice: price };
    state.simState = 'confirm_add_cart';
    
    let recipeMsg = '';
    if (drug.recipeType === 'retida') {
      recipeMsg = '||Como é antibiótico, o entregador vai precisar recolher a receita física (duas vias) na hora da entrega. Você tem ela aí?';
    } else if (drug.needsRecipe) {
      recipeMsg = '||Esse precisa de receita simples.';
    }
    
    const finalPriceText = quantity > 1 
      ? `${quantity} unidades ficam R$ ${(quantity * price).toFixed(2)}`
      : `tá R$ ${price.toFixed(2)}`;
      
    let infoMsg = '';
    if (drug.activeIngredient) {
      infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n⚠️ *Nota de Segurança:* ${drug.safetyNote}`;
    }
    
    return `O *${drug.name}* (${drug.presentation}) ${finalPriceText}${discountNotice}.${recipeMsg}${infoMsg}||Posso colocar no carrinho?`;
    
  } else {
    let responseText = '';
    let subtotal = 0;
    let hasControlled = false;
    let hasAntibiotic = false;
    const pendingList = [];
    
    parsedItems.forEach((pItem) => {
      const drug = pItem.drug;
      const qty = pItem.quantity;
      
      let price = drug.price;
      let discountLabel = '';
      if (state.discountPercent > 0 && !drug.isGeneric) {
        price = drug.price * (1 - state.discountPercent / 100);
        discountLabel = ` (com ${state.discountPercent}% desc.)`;
      }
      
      const totalItem = price * qty;
      subtotal += totalItem;
      pendingList.push({ drug, quantity: qty, finalPrice: price });
      
      if (!drug.allowsDelivery) {
        hasControlled = true;
      }
      if (drug.recipeType === 'retida') {
        hasAntibiotic = true;
      }
      
      const recipeNote = drug.needsRecipe 
        ? (drug.recipeType === 'retida' ? ' (antibiótico)' : ' (precisa de receita)') 
        : '';
        
      responseText += `• ${qty}x ${drug.name} - R$ ${totalItem.toFixed(2)}${discountLabel}${recipeNote}\n`;
    });
    
    if (hasControlled) {
      state.simState = 'idle';
      return `Olha, vi que você incluiu medicamentos controlados (tarja preta/amarela). Por regras da Anvisa, a gente não pode entregar esses.||Nesse caso, você precisaria vir buscar aqui na loja física com a receita original em mãos. Quer que eu tire eles do carrinho e continue com os outros?`;
    }
    
    state.pendingItemsList = pendingList;
    state.simState = 'confirm_add_cart';
    
    let warnings = '';
    if (hasAntibiotic) {
      warnings = '||E lembrando que a receita do antibiótico precisa ser física em duas vias (uma fica com a gente na entrega), beleza?';
    }
    
    return `Achei os itens por aqui! Olha os preços (com desconto fidelidade aplicado):\n${responseText}\n*Total:* R$ ${subtotal.toFixed(2)}.${warnings}||Posso colocar todos eles no carrinho?`;
  }
}

function handleIdleState(norm, rawMsg) {
  // 1. Simulação OCR de Receita
  if (norm.match(/(foto\s+da\s+receita|minha\s+receita|enviar\s+receita|receita\s+medica|foto_receita_simulada)/i)) {
    const amox = MEDICINES_DB.find(d => d.name.toLowerCase().includes('amoxicilina')) || MEDICINES_DB.find(d => d.name === 'Amoxicilina 500mg');
    const advil = MEDICINES_DB.find(d => d.name.toLowerCase().includes('advil')) || MEDICINES_DB.find(d => d.name.includes('Advil'));
    
    if (amox && advil) {
      const extractedList = [
        { drug: amox, quantity: 1 },
        { drug: advil, quantity: 1 }
      ];
      
      if (!state.cpf) {
        state.pendingItemsList = extractedList;
        state.simState = 'waiting_cpf';
        return `🔎 *Escaneando receita médica...*\n\nIdentifiquei na receita:\n• 1x ${amox.name}\n• 1x ${advil.name}\n\nAntes de passar a cotação, você tem CPF cadastrado para descontos de fidelidade? 🏷️\nDigite o CPF ou digite *não* para prosseguir.`;
      }
      
      state.pendingItemsList = extractedList;
      return proceedToQuoteAfterCpf();
    }
  }

  // 2. Extract specific medicines from message
  const parsedItems = parseMedicinesFromText(rawMsg);
  
  if (parsedItems.length > 0) {
    state.pendingActionRawText = rawMsg;
    if (!state.cpf) {
      state.pendingItemsList = parsedItems;
      state.simState = 'waiting_cpf';
      return `Localizei o(s) medicamento(s) no estoque! 🔎\nAntes de passar o valor, você tem cadastro na nossa fidelidade com CPF? 🏷️\n\nDigite o seu CPF para consultar descontos de 10% a 30% (ou digite *não* para continuar sem desconto).`;
    }
    
    state.pendingItemsList = parsedItems;
    return proceedToQuoteAfterCpf();
  }

  // 3. Check Colloquial map
  let matchedColloquialTags = null;
  let colloquialLabel = "";
  for (const [colKey, tags] of Object.entries(COLLOQUIAL_MAP)) {
    if (norm.includes(colKey)) {
      matchedColloquialTags = tags;
      colloquialLabel = colKey;
      break;
    }
  }
  
  if (matchedColloquialTags) {
    const suggestions = MEDICINES_DB.filter(d => 
      matchedColloquialTags.some(tag => d.tags.includes(tag))
    ).slice(0, 3);
    
    if (suggestions.length > 0) {
      const listStr = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
      return `Temos estas opções para ${colloquialLabel}:\n${listStr}\n\nQual você costuma tomar?`;
    }
  }

  // 4. Check dynamic symptoms mapping
  const symptoms = {
    cabeca: { tag: 'cabeça', label: 'dor de cabeça' },
    enxaqueca: { tag: 'enxaqueca', label: 'enxaqueca' },
    cefaleia: { tag: 'cabeça', label: 'dor de cabeça' },
    azia: { tag: 'azia', label: 'azia' },
    queimacao: { tag: 'azia', label: 'queimação' },
    refluxo: { tag: 'azia', label: 'refluxo' },
    gastrite: { tag: 'azia', label: 'gastrite' },
    estomago: { tag: 'azia', label: 'dor de estômago' },
    gripe: { tag: 'gripe', label: 'gripe' },
    resfriad: { tag: 'gripe', label: 'resfriado' },
    coriza: { tag: 'gripe', label: 'coriza' },
    espirro: { tag: 'gripe', label: 'espirros' },
    garganta: { tag: 'garganta', label: 'dor de garganta' },
    tosse: { tag: 'tosse', label: 'tosse' },
    barriga: { tag: 'diarreia', label: 'dor de barriga' },
    diarreia: { tag: 'diarreia', label: 'diarreia' },
    intestino: { tag: 'diarreia', label: 'desconforto intestinal' },
    enjoo: { tag: 'enjoo', label: 'enjoo' },
    nausea: { tag: 'enjoo', label: 'náusea' },
    vomito: { tag: 'enjoo', label: 'vômitos' },
    colica: { tag: 'colica', label: 'cólica' },
    febre: { tag: 'febre', label: 'febre' },
    quente: { tag: 'febre', label: 'febre' },
    muscular: { tag: 'muscular', label: 'dor muscular' },
    costas: { tag: 'muscular', label: 'dor nas costas' },
    corpo: { tag: 'dor', label: 'dor no corpo' },
    alergia: { tag: 'alergia', label: 'alergia' },
    rinite: { tag: 'alergia', label: 'rinite' },
    micose: { tag: 'micose', label: 'micose' },
    frieira: { tag: 'micose', label: 'frieira' },
    laxante: { tag: 'laxante', label: 'prisão de ventre' }
  };

  for (const [key, info] of Object.entries(symptoms)) {
    if (norm.includes(key)) {
      const suggestions = MEDICINES_DB.filter(d => d.tags.includes(info.tag)).slice(0, 3);
      if (suggestions.length > 0) {
        const listStr = suggestions.map(d => `• ${d.name} (${d.presentation}) - R$ ${d.price.toFixed(2)}`).join('\n');
        return `Nossa, ${info.label} é bem incômodo. Melhoras!||Temos estas opções para ajudar:\n${listStr}\n\nQual delas você prefere?`;
      }
    }
  }

  // 5. Global Command Answers
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

  return "Desculpa, não encontrei esse medicamento na nossa base. 🤔\nPode verificar se escreveu o nome certinho? Se precisar, a gente pode transferir pra um atendente humano verificar pra você.";
}

function performCalculationAndOffer(drug, dose, frequency, days, type) {
  let quantityNeeded = 0;

  if (type === 'gotas') {
    const totalDrops = dose * frequency * days;
    const mlNeeded = totalDrops / 20;
    let bottleSize = 20;
    const mlMatch = drug.presentation.match(/(\d+)\s*ml/i);
    if (mlMatch) bottleSize = parseInt(mlMatch[1]);
    const bottlesNeeded = Math.ceil(mlNeeded / bottleSize);
    quantityNeeded = bottlesNeeded;
  } else {
    const totalPills = dose * frequency * days;
    let pillsPerBox = 20;
    const cpMatch = drug.presentation.match(/(\d+)\s*(comprimidos|capsulas|cps|envelopes|pastilhas)/i);
    if (cpMatch) pillsPerBox = parseInt(cpMatch[1]);
    const boxesNeeded = Math.ceil(totalPills / pillsPerBox);
    quantityNeeded = boxesNeeded;
  }

  let price = drug.price;
  let discountNotice = '';
  if (state.discountPercent > 0 && !drug.isGeneric) {
    const originalPrice = drug.price;
    price = originalPrice * (1 - state.discountPercent / 100);
    discountNotice = ` (de R$ ${originalPrice.toFixed(2)} por *R$ ${price.toFixed(2)}* com ${state.discountPercent}% desc. fidelidade)`;
  }

  state.pendingItem = { drug, quantity: quantityNeeded, finalPrice: price };
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
    infoMsg = `||*Ficha do Medicamento:*\n• **Princípio Ativo:** ${drug.activeIngredient}\n• **Laboratório:** ${drug.manufacturer}\n⚠️ *Nota de Segurança:* ${drug.safetyNote}`;
  }

  return `Pro tratamento completo de ${days} dias, você vai precisar de ${quantityNeeded} ${containerName} de ${drug.name}.||Fica R$ ${(quantityNeeded * price).toFixed(2)} no total${discountNotice}.${recipeMsg}${infoMsg}||Quer que eu adicione ao pedido?`;
}

function handleConfirmBrandOrGeneric(norm) {
  const pGeneric = state.pendingGeneric;
  const pBrand = state.pendingBrand;
  
  if (!pGeneric || !pBrand) {
    state.simState = 'idle';
    return "Ocorreu um erro no fluxo do pedido. No que posso ajudar?";
  }
  
  if (norm.match(/(generico|segundo|mais barato|outro|economizar|simil|2|sim|quero)/i)) {
    state.pendingItem = pGeneric;
    state.pendingGeneric = null;
    state.pendingBrand = null;
    state.simState = 'confirm_add_cart';
    
    let recipeMsg = pGeneric.drug.needsRecipe
      ? (pGeneric.drug.recipeType === 'retida' ? '||Como é antibiótico, o entregador vai precisar recolher a receita original de duas vias na entrega. Você tem ela?' : '||Esse precisa de receita simples. A receita não fica retida, mas precisa estar válida.')
      : '';
      
    const price = pGeneric.finalPrice || pGeneric.drug.price;
    const totalText = pGeneric.quantity > 1 ? ` R$ ${(price * pGeneric.quantity).toFixed(2)} no total` : ` R$ ${price.toFixed(2)}`;
    return `Combinado, vamos levar o Genérico (${pGeneric.drug.name}). Fica${totalText}.${recipeMsg}||Posso colocar no carrinho?`;
  } else {
    state.pendingItem = pBrand;
    state.pendingGeneric = null;
    state.pendingBrand = null;
    state.simState = 'confirm_add_cart';
    
    let recipeMsg = pBrand.drug.needsRecipe
      ? (pBrand.drug.recipeType === 'retida' ? '||Como é antibiótico, o entregador vai precisar recolher a receita original de duas vias na entrega. Você tem ela?' : '||Esse precisa de receita simples. A receita não fica retida, mas precisa estar válida.')
      : '';
      
    const price = pBrand.finalPrice || pBrand.drug.price;
    const totalText = pBrand.quantity > 1 ? ` R$ ${(price * pBrand.quantity).toFixed(2)} no total` : ` R$ ${price.toFixed(2)}`;
    return `Beleza, então vai ser o de referência mesmo (${pBrand.drug.name}). Fica${totalText}.${recipeMsg}||Posso colocar no carrinho?`;
  }
}

// ============ WEBHOOK ============
async function sendToWebhook(message, mediaType = 'text', fileName = '', attempt = 0) {
  if (CONFIG.simulationMode) {
    await delay(600 + Math.random() * 400);
    if (mediaType === 'image') {
      return runSimulation('foto_receita_simulada');
    }
    if (mediaType === 'audio') {
      return "Recebi seu áudio e já estou analisando...||Identifiquei que você precisa de Amoxicilina e Advil. Deseja adicionar ao carrinho?";
    }
    return runSimulation(message);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const messageId = 'WEB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
  const remoteJid = '5500000000000@s.whatsapp.net';
  const INSTANCE_NAME = 'minha-empresa-d4bdb5';
  const USER_NAME = 'Cliente Web';

  let messageContent = {};
  let msgType = 'conversation';

  if (mediaType === 'audio') {
    msgType = 'audioMessage';
    messageContent = {
      audioMessage: {
        url: message,
        mimetype: 'audio/ogg'
      }
    };
  } else if (mediaType === 'image') {
    msgType = 'imageMessage';
    messageContent = {
      imageMessage: {
        url: message,
        caption: '',
        mimetype: 'image/jpeg'
      }
    };
  } else if (mediaType === 'document') {
    msgType = 'documentMessage';
    messageContent = {
      documentMessage: {
        url: message,
        fileName: fileName || 'documento.pdf',
        mimetype: 'application/pdf'
      }
    };
  } else {
    messageContent = {
      conversation: message
    };
  }

  const payload = {
    event: 'messages.upsert',
    instance: INSTANCE_NAME,
    data: {
      key: {
        remoteJid: remoteJid,
        fromMe: false,
        id: messageId
      },
      pushName: USER_NAME,
      status: 'DELIVERY_ACK',
      message: messageContent,
      messageType: msgType,
      messageTimestamp: timestamp,
      source: 'web',
      conversationId: state.sessionId
    },
    sender: remoteJid,
    server_url: window.location.origin,
    apikey: 'web-client',
    conversationId: state.sessionId
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let data;
    const rawText = await res.text();
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error('Resposta inválida do servidor');
    }

    // Extração tolerante a múltiplos formatos de resposta do n8n/Evolution API
    let extracted = null;
    if (Array.isArray(data)) {
      const first = data[0];
      extracted = first?.message || first?.output || first?.text || first?.response ||
                  first?.data?.message || first?.content;
    } else if (typeof data === 'object' && data !== null) {
      extracted = data.message || data.output || data.text || data.response ||
                  data.data?.message || data.content ||
                  // Evolution API format: data.data.message.conversation
                  data.data?.data?.message?.conversation ||
                  data.body?.message;
    } else if (typeof data === 'string') {
      extracted = data;
    }

    if (!extracted || typeof extracted !== 'string' || extracted.trim() === '') {
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
