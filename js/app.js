/**
 * Cathlabflix Sessions - Controlador Principal da Aplicação (App.js)
 * 
 * Orquestra:
 * 1. Gerenciamento de Estado Reativo (Dia Ativo, Sala Ativa, Busca, Carregamento)
 * 2. Navegação Primária (Dias) com abas em alto contraste
 * 3. Navegação Secundária (Salas) com sublinhado/indicador azul claro
 * 4. Mapeamento de folder_id e requisição ao VimeoService
 * 5. Renderização do Accordion de Vídeos com lazy loading e Skeleton Screen
 * 6. Modal de configuração da API do Vimeo
 */

(function () {
  'use strict';

  // Estado Central da Aplicação
  const state = {
    currentDayId: null,
    currentRoomId: null,
    currentFolderId: null,
    videos: [],
    filteredVideos: [],
    searchQuery: '',
    isLoading: false,
    useMock: VIMEO_CONFIG.useMock,
    accessToken: VIMEO_CONFIG.accessToken || ''
  };

  // Cache de Elementos do DOM
  const dom = {
    daysNav: document.getElementById('daysNav'),
    roomsNav: document.getElementById('roomsNav'),
    accordionContainer: document.getElementById('accordionContainer'),
    roomCurrentTitle: document.getElementById('roomCurrentTitle'),
    roomFolderDisplay: document.getElementById('roomFolderDisplay'),
    roomCountDisplay: document.getElementById('roomCountDisplay'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    modeBadge: document.getElementById('modeBadge'),
    modeStatusText: document.getElementById('modeStatusText'),
    
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

    // Define o dia e a sala iniciais (primeiro dia, primeira sala)
    const initialDay = EVENT_SCHEDULE.days[0];
    const initialRoom = initialDay.rooms[0];

    state.currentDayId = initialDay.id;
    state.currentRoomId = initialRoom.id;
    state.currentFolderId = initialRoom.folder_id;

    // Renderiza a navegação primária (Dias) e secundária (Salas)
    renderDaysNav();
    renderRoomsNav();

    // Atualiza status do badge no cabeçalho
    updateModeBadge();

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

    // 3. Campo de Busca Instantânea
    dom.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      filterVideos();
    });

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
   * Regra Visual: Aba ativa tem fundo branco e texto escuro
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
          aria-controls="panel-day"
        >
          <span>${day.label}</span>
          <span class="day-sub">${day.subtitle.split('•')[1] || day.subtitle}</span>
        </button>
      `;

      dom.daysNav.appendChild(li);
    });
  }

  /**
   * Renderiza a Barra de Navegação Horizontal das Salas (Nível 2)
   * Regra Visual: Sala ativa possui borda ou linha sublinhada em azul mais claro
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
          <span>${room.name}</span>
          <span class="room-badge-folder">ID: ${room.folder_id}</span>
        </button>
      `;

      dom.roomsNav.appendChild(li);
    });

    // Se o elemento ativo estiver fora da visão em telas menores, faz scroll suave
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

    // Ao mudar o dia, define a sala ativa como a primeira sala daquele dia
    if (currentDay && currentDay.rooms.length > 0) {
      state.currentRoomId = currentDay.rooms[0].id;
      state.currentFolderId = currentDay.rooms[0].folder_id;
    }

    // Limpa busca
    resetSearch();

    // Re-renderiza interfaces de navegação
    renderDaysNav();
    renderRoomsNav();

    // Busca os vídeos do novo folder_id
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

    // Limpa busca
    resetSearch();

    // Atualiza classes ativas na barra de salas
    const allRoomTabs = dom.roomsNav.querySelectorAll('.room-tab');
    allRoomTabs.forEach(tab => {
      const isActive = tab.dataset.roomId === roomId;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Busca os vídeos do novo folder_id
    loadVideosForActiveRoom();
  }

  /**
   * Carrega e Renderiza os Vídeos da Sala e Pasta Ativa
   */
  async function loadVideosForActiveRoom() {
    const currentRoom = getCurrentRoomObject();
    if (!currentRoom) return;

    // Fecha qualquer accordion aberto anteriormente
    if (accordionManager) {
      accordionManager.closeAll();
    }

    // Atualiza títulos e metadados no topo da lista
    dom.roomCurrentTitle.textContent = currentRoom.name;
    dom.roomFolderDisplay.textContent = currentRoom.folder_id;
    dom.roomCountDisplay.textContent = 'Carregando vídeos...';

    // Exibe Skeleton Loading animado
    renderSkeletonLoading();

    state.isLoading = true;

    try {
      // Faz o fetch através do serviço do Vimeo (com cache e fallback embutidos)
      const result = await window.vimeoService.getFolderVideos(currentRoom.folder_id);
      
      state.videos = result.videos || [];
      state.filteredVideos = [...state.videos];
      state.isLoading = false;

      // Renderiza lista de accordions
      renderAccordionList();

      // Atualiza contador
      updateVideoCount();

      // Se houve aviso de fallback na API real
      if (result.fallbackWarning) {
        console.info(`[Info] ${result.fallbackWarning}`);
      }

    } catch (error) {
      state.isLoading = false;
      console.error("Erro ao carregar vídeos da pasta:", error);
      renderErrorState(error.message);
    }
  }

  /**
   * Renderiza a Lista de Vídeos em formato de Accordion
   * Regra Visual: Fechado = barra azul escura com título e chevron. Aberto = iframe 16:9
   */
  function renderAccordionList() {
    dom.accordionContainer.innerHTML = '';

    const videosToRender = state.filteredVideos;

    if (videosToRender.length === 0) {
      renderEmptyState();
      return;
    }

    const fragment = document.createDocumentFragment();

    videosToRender.forEach((video, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'accordion-item';
      itemEl.id = `video-item-${video.id}`;

      // Monta tags HTML
      const tagsHtml = video.tags && video.tags.length > 0
        ? video.tags.map(t => `<span class="video-meta-tag">${escapeHtml(t)}</span>`).join('')
        : '';

      itemEl.innerHTML = `
        <!-- Cabeçalho / Gatilho do Accordion (Barra Azul Escura) -->
        <button 
          type="button"
          class="accordion-header" 
          aria-expanded="false" 
          aria-controls="panel-${video.id}"
          id="header-${video.id}"
        >
          <div class="accordion-title-block">
            <div class="lecture-badges">
              <span class="lecture-index">Aula ${String(index + 1).padStart(2, '0')}</span>
              <span class="lecture-duration">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${escapeHtml(video.formattedDuration)}
              </span>
              <span class="lecture-speaker-tag">${escapeHtml(video.speaker)}</span>
            </div>
            <h3 class="accordion-title">${escapeHtml(video.title)}</h3>
          </div>

          <!-- Ícone de Seta (Chevron) com Animação de Rotação -->
          <div class="accordion-chevron-wrapper">
            <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <!-- Corpo Expansível do Accordion (CSS Grid Transition) -->
        <div 
          class="accordion-body" 
          id="panel-${video.id}" 
          role="region" 
          aria-labelledby="header-${video.id}"
          aria-hidden="true"
        >
          <div class="accordion-inner">
            <div class="accordion-content-box">
              
              <!-- Container do Player: Proporção Estrita 16:9 (padding-bottom: 56.25%) -->
              <div 
                class="video-responsive-wrapper" 
                data-embed-url="${escapeHtml(video.embedUrl)}"
                data-video-title="${escapeHtml(video.title)}"
              >
                <!-- O iframe é injetado sob demanda via JavaScript ao expandir -->
              </div>

              <!-- Rodapé com Metadados e Informações do Palestrante -->
              <div class="video-details-footer">
                <p class="video-description">${escapeHtml(video.description)}</p>
                
                <div class="video-actions-bar">
                  <div class="video-meta-tags">
                    ${tagsHtml}
                  </div>
                  <a 
                    href="https://vimeo.com/${video.id}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="vimeo-external-link"
                    title="Assistir diretamente na plataforma Vimeo"
                  >
                    <span>Abrir no Vimeo</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                </div>
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
   * Filtra os vídeos carregados pelo termo digitado na busca
   */
  function filterVideos() {
    if (!state.searchQuery) {
      state.filteredVideos = [...state.videos];
    } else {
      const q = state.searchQuery;
      state.filteredVideos = state.videos.filter(v => {
        const inTitle = v.title.toLowerCase().includes(q);
        const inSpeaker = v.speaker.toLowerCase().includes(q);
        const inDesc = v.description.toLowerCase().includes(q);
        const inTags = v.tags.some(t => t.toLowerCase().includes(q));
        return inTitle || inSpeaker || inDesc || inTags;
      });
    }

    if (accordionManager) {
      accordionManager.closeAll();
    }

    renderAccordionList();
    updateVideoCount();
  }

  /**
   * Limpa a busca ao trocar de sala ou dia
   */
  function resetSearch() {
    state.searchQuery = '';
    if (dom.searchInput) dom.searchInput.value = '';
  }

  /**
   * Atualiza o contador de aulas encontradas
   */
  function updateVideoCount() {
    const total = state.filteredVideos.length;
    const label = total === 1 ? '1 aula disponível' : `${total} aulas disponíveis`;
    dom.roomCountDisplay.textContent = label;
  }

  /**
   * Renderiza Skeleton Screens durante a requisição
   */
  function renderSkeletonLoading() {
    dom.accordionContainer.innerHTML = '';
    const count = 3;
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-item';
      skeleton.innerHTML = `
        <div class="skeleton-shimmer"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
        </div>
        <div style="width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.06);"></div>
      `;
      dom.accordionContainer.appendChild(skeleton);
    }
  }

  /**
   * Renderiza estado vazio amigável
   */
  function renderEmptyState() {
    dom.accordionContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h3>Nenhuma sessão encontrada</h3>
        <p>Não foram encontrados vídeos para os filtros aplicados nesta sala. Tente outro termo de busca ou selecione outra sala.</p>
      </div>
    `;
  }

  /**
   * Renderiza estado de erro
   */
  function renderErrorState(message) {
    dom.accordionContainer.innerHTML = `
      <div class="empty-state" style="border-color: rgba(239, 68, 68, 0.4);">
        <svg class="empty-state-icon" style="color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Falha ao carregar vídeos do Vimeo</h3>
        <p>${escapeHtml(message)}</p>
        <button class="btn-primary" style="margin-top: 1.25rem;" onclick="location.reload()">
          Recarregar Página
        </button>
      </div>
    `;
  }

  /**
   * Atualiza o badge de modo (Mock vs API Live) no cabeçalho
   */
  function updateModeBadge() {
    if (state.useMock) {
      dom.modeBadge.classList.remove('is-live');
      dom.modeStatusText.textContent = 'Modo Mock Ativo';
    } else {
      dom.modeBadge.classList.add('is-live');
      dom.modeStatusText.textContent = 'API Vimeo Conectada';
    }
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

    // Atualiza o serviço do Vimeo
    window.vimeoService.updateConfig({
      accessToken: token,
      useMock: useMock
    });

    updateModeBadge();
    closeSettingsModal();

    // Recarrega vídeos com as novas credenciais
    loadVideosForActiveRoom();
  }

  /* --- Funções Utilitárias de Consulta --- */
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
