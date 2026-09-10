/**
 * Cathlabflix Sessions - Controlador Principal da Aplicação (App.js)
 * 
 * Orquestra:
 * 1. Gerenciamento de Estado Reativo (Dia Ativo, Sala Ativa, Carregamento)
 * 2. Navegação Primária (Dias) em grid de 3 colunas (Dia 19 | Dia 20 | Dia 21)
 * 3. Navegação Secundária (Salas) horizontal com linha azul clara
 * 4. Mapeamento de folder_id e requisição ao VimeoService
 * 5. Renderização do Accordion de Vídeos com lazy loading 16:9 idêntico ao design de referência
 */

(function () {
  'use strict';

  // Estado Central da Aplicação
  const state = {
    currentDayId: null,
    currentRoomId: null,
    currentFolderId: null,
    videos: [],
    isLoading: false,
    useMock: VIMEO_CONFIG.useMock,
    accessToken: VIMEO_CONFIG.accessToken || ''
  };

  // Cache de Elementos do DOM
  const dom = {
    daysNav: document.getElementById('daysNav'),
    roomsNav: document.getElementById('roomsNav'),
    roomsNavWrapper: document.getElementById('roomsNavWrapper'),
    roomsScrollNext: document.getElementById('roomsScrollNext'),
    accordionContainer: document.getElementById('accordionContainer'),
    
    // Modal de Configurações
    btnOpenSettings: document.getElementById('btnOpenSettings'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    btnCancelSettings: document.getElementById('btnCancelSettings'),
    settingsModal: document.getElementById('settingsModal'),
    settingsForm: document.getElementById('settingsForm'),
    tokenInput: document.getElementById('tokenInput'),
    toggleMockSwitch: document.getElementById('toggleMockSwitch')
  };

  // Instância do Gerenciador de Accordion
  let accordionManager = null;

  /**
   * Inicialização do Aplicativo
   */
  function init() {
    if (!EVENT_SCHEDULE.days || EVENT_SCHEDULE.days.length === 0) {
      console.error("Nenhum dia configurado em EVENT_SCHEDULE.");
      return;
    }

    // Inicializa o gerenciador de Accordion
    accordionManager = new VideoAccordionManager(dom.accordionContainer);
    accordionManager.init();

    // Define o dia e a sala iniciais (Dia 19, Sala 01)
    const initialDay = EVENT_SCHEDULE.days[0];
    const initialRoom = initialDay.rooms[0];

    state.currentDayId = initialDay.id;
    state.currentRoomId = initialRoom.id;
    state.currentFolderId = initialRoom.folder_id;

    // Renderiza abas dos dias e salas
    renderDaysNav();
    renderRoomsNav();

    // Registra os ouvintes de eventos globais
    bindEvents();

    // Carrega os vídeos da sala ativa
    loadVideosForActiveRoom();
  }

  /**
   * Configuração de Ouvintes de Eventos
   */
  function bindEvents() {
    // 1. Navegação de Dias (Nível 1)
    dom.daysNav.addEventListener('click', (e) => {
      const tab = e.target.closest('.day-tab');
      if (!tab) return;
      const dayId = tab.dataset.dayId;
      if (dayId && dayId !== state.currentDayId) {
        selectDay(dayId);
      }
    });

    // 2. Navegação de Salas (Nível 2)
    dom.roomsNav.addEventListener('click', (e) => {
      const tab = e.target.closest('.room-tab');
      if (!tab) return;
      const roomId = tab.dataset.roomId;
      if (roomId && roomId !== state.currentRoomId) {
        selectRoom(roomId);
      }
    });

    // 3. Seta de Scroll Horizontal de Salas
    if (dom.roomsScrollNext && dom.roomsNavWrapper) {
      dom.roomsScrollNext.addEventListener('click', () => {
        dom.roomsNavWrapper.scrollBy({
          left: 220,
          behavior: 'smooth'
        });
      });
    }

    // 4. Modal de Configurações da API do Vimeo
    if (dom.btnOpenSettings) {
      dom.btnOpenSettings.addEventListener('click', openSettingsModal);
    }
    if (dom.btnCloseSettings) {
      dom.btnCloseSettings.addEventListener('click', closeSettingsModal);
    }
    if (dom.btnCancelSettings) {
      dom.btnCancelSettings.addEventListener('click', closeSettingsModal);
    }

    // Fechar modal ao clicar fora do card
    if (dom.settingsModal) {
      dom.settingsModal.addEventListener('click', (e) => {
        if (e.target === dom.settingsModal) closeSettingsModal();
      });
    }

    // Submissão das Configurações
    if (dom.settingsForm) {
      dom.settingsForm.addEventListener('submit', handleSettingsSubmit);
    }
  }

  /**
   * Renderiza a Barra de Abas dos Dias (Nível 1)
   * Aba ativa tem fundo branco e texto escuro
   */
  function renderDaysNav() {
    dom.daysNav.innerHTML = '';

    EVENT_SCHEDULE.days.forEach((day) => {
      const isActive = day.id === state.currentDayId;
      const li = document.createElement('li');
      
      li.innerHTML = `
        <button 
          class="day-tab ${isActive ? 'active' : ''}" 
          data-day-id="${day.id}" 
          role="tab" 
          aria-selected="${isActive}"
          id="tab-${day.id}"
        >
          ${escapeHtml(day.label)}
        </button>
      `;

      dom.daysNav.appendChild(li);
    });
  }

  /**
   * Renderiza a Barra de Navegação Horizontal das Salas (Nível 2)
   * Sala ativa possui linha sublinhada em azul claro
   */
  function renderRoomsNav() {
    const currentDay = getCurrentDayObject();
    if (!currentDay) return;

    dom.roomsNav.innerHTML = '';

    currentDay.rooms.forEach((room) => {
      const isActive = room.id === state.currentRoomId;
      const li = document.createElement('li');

      li.innerHTML = `
        <button 
          class="room-tab ${isActive ? 'active' : ''}" 
          data-room-id="${room.id}"
          role="tab"
          aria-selected="${isActive}"
          id="tab-${room.id}"
        >
          ${escapeHtml(room.name)}
        </button>
      `;

      dom.roomsNav.appendChild(li);
    });

    // Centraliza a aba ativa no scroll horizontal
    const activeTab = dom.roomsNav.querySelector('.room-tab.active');
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  /**
   * Ação ao Selecionar um Dia: Atualiza Salas e seleciona a primeira sala do dia
   */
  function selectDay(dayId) {
    state.currentDayId = dayId;
    const currentDay = getCurrentDayObject();

    if (currentDay && currentDay.rooms.length > 0) {
      state.currentRoomId = currentDay.rooms[0].id;
      state.currentFolderId = currentDay.rooms[0].folder_id;
    }

    renderDaysNav();
    renderRoomsNav();
    loadVideosForActiveRoom();
  }

  /**
   * Ação ao Selecionar uma Sala: Resgata o folder_id correspondente no JSON e faz requisição
   */
  function selectRoom(roomId) {
    state.currentRoomId = roomId;
    const currentRoom = getCurrentRoomObject();

    if (currentRoom) {
      state.currentFolderId = currentRoom.folder_id;
    }

    // Atualiza classes ativas
    const allRoomTabs = dom.roomsNav.querySelectorAll('.room-tab');
    allRoomTabs.forEach(tab => {
      const isActive = tab.dataset.roomId === roomId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    loadVideosForActiveRoom();
  }

  /**
   * Carrega e Renderiza os Vídeos da Sala e Pasta Ativa
   */
  async function loadVideosForActiveRoom() {
    const currentRoom = getCurrentRoomObject();
    if (!currentRoom) return;

    if (accordionManager) {
      accordionManager.closeAll();
    }

    renderSkeletonLoading();
    state.isLoading = true;

    try {
      const result = await window.vimeoService.getFolderVideos(currentRoom.folder_id);
      
      state.videos = result.videos || [];
      state.isLoading = false;

      renderAccordionList();

      // Abre automaticamente o primeiro item se houver vídeos (como no design de referência)
      if (state.videos.length > 0) {
        const firstItem = dom.accordionContainer.querySelector('.accordion-item');
        if (firstItem && accordionManager) {
          accordionManager.openItem(firstItem);
        }
      }

    } catch (error) {
      state.isLoading = false;
      console.error("Erro ao carregar vídeos da pasta:", error);
      renderErrorState(error.message);
    }
  }

  /**
   * Renderiza a Lista de Vídeos em formato de Accordion
   * Visual minimalista idêntico à imagem: apenas Título e Chevron
   */
  function renderAccordionList() {
    dom.accordionContainer.innerHTML = '';

    const videosToRender = state.videos;

    if (videosToRender.length === 0) {
      renderEmptyState();
      return;
    }

    const fragment = document.createDocumentFragment();

    videosToRender.forEach((video, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'accordion-item';
      itemEl.id = `video-item-${video.id}`;

      itemEl.innerHTML = `
        <!-- Cabeçalho do Accordion (Barra Azul Escura) -->
        <button 
          type="button"
          class="accordion-header" 
          aria-expanded="false" 
          aria-controls="panel-${video.id}"
          id="header-${video.id}"
        >
          <h3 class="accordion-title">${escapeHtml(video.title)}</h3>

          <!-- Ícone de Seta (Chevron) -->
          <div class="accordion-chevron-wrapper">
            <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <!-- Corpo Expansível com Iframe do Vimeo (16:9) -->
        <div 
          class="accordion-body" 
          id="panel-${video.id}" 
          role="region" 
          aria-labelledby="header-${video.id}"
          aria-hidden="true"
        >
          <div class="accordion-inner">
            <div class="accordion-content-box">
              
              <!-- Container 16:9 com Lazy Loading -->
              <div 
                class="video-responsive-wrapper" 
                data-embed-url="${escapeHtml(video.embedUrl)}"
                data-video-title="${escapeHtml(video.title)}"
              >
                <!-- Iframe é injetado dinamicamente ao expandir -->
              </div>

            </div>
          </div>
        </div>
      `;

      fragment.appendChild(itemEl);
    });

    dom.accordionContainer.appendChild(fragment);
  }

  /**
   * Renderiza Skeleton Screens durante o carregamento
   */
  function renderSkeletonLoading() {
    dom.accordionContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-item';
      skeleton.innerHTML = `
        <div class="skeleton-shimmer"></div>
        <div class="skeleton-line"></div>
        <div style="width: 16px; height: 16px; background: rgba(255,255,255,0.06); border-radius: 2px;"></div>
      `;
      dom.accordionContainer.appendChild(skeleton);
    }
  }

  /**
   * Renderiza estado vazio
   */
  function renderEmptyState() {
    dom.accordionContainer.innerHTML = `
      <div class="empty-state">
        <h3>Nenhuma sessão encontrada</h3>
        <p>Não foram encontrados vídeos cadastrados para esta sala.</p>
      </div>
    `;
  }

  /**
   * Renderiza estado de erro
   */
  function renderErrorState(message) {
    dom.accordionContainer.innerHTML = `
      <div class="empty-state" style="border: 1px solid rgba(239, 68, 68, 0.3);">
        <h3 style="color: #ef4444;">Falha ao carregar vídeos do Vimeo</h3>
        <p>${escapeHtml(message)}</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="location.reload()">
          Recarregar
        </button>
      </div>
    `;
  }

  /**
   * Abertura do Modal de Configurações
   */
  function openSettingsModal() {
    dom.tokenInput.value = state.accessToken;
    dom.toggleMockSwitch.checked = state.useMock;
    dom.settingsModal.classList.add('is-visible');
    dom.settingsModal.setAttribute('aria-hidden', 'false');
  }

  /**
   * Fechamento do Modal de Configurações
   */
  function closeSettingsModal() {
    dom.settingsModal.classList.remove('is-visible');
    dom.settingsModal.setAttribute('aria-hidden', 'true');
  }

  /**
   * Salva configurações personalizadas (Token e Modo)
   */
  function handleSettingsSubmit(e) {
    e.preventDefault();
    const token = dom.tokenInput.value.trim();
    const useMock = dom.toggleMockSwitch.checked;

    state.accessToken = token;
    state.useMock = useMock;

    window.vimeoService.updateConfig({
      accessToken: token,
      useMock: useMock
    });

    closeSettingsModal();
    loadVideosForActiveRoom();
  }

  /* --- Funções Utilitárias --- */
  function getCurrentDayObject() {
    return EVENT_SCHEDULE.days.find(d => d.id === state.currentDayId) || EVENT_SCHEDULE.days[0];
  }

  function getCurrentRoomObject() {
    const day = getCurrentDayObject();
    if (!day) return null;
    return day.rooms.find(r => r.id === state.currentRoomId) || day.rooms[0];
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
