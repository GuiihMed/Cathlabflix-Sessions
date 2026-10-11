/**
 * CathlabFlix Modern Agenda & Interactive Calendar
 * Design System: Frosted Glass / Soft UI + Expansão Vertical + Exportação de Agenda
 */

// Estrutura de dados com metadados para sincronização e exportação de calendário
const INITIAL_EVENTS = [
  {
    id: 'solaci-2026-destaque',
    date: '2026-10-21',
    startTime: '14:00',
    endTime: '18:00',
    title: 'Sessão Especial SOLACI SBHCI 2026',
    subtitle: 'Debates sobre Intervenções Coronárias Complexas e Casos Ao Vivo',
    time: '14:00 - 18:00',
    category: 'Congresso',
    color: 'red',
    badge: 'LEMBRE-SE',
    modality: 'Presencial e On-line',
    location: 'Transmissão Oficial CathlabFlix',
    actionUrl: '/new/solaci',
    actionLabel: 'Acessar Congresso'
  },
  {
    id: 'solaci-satelite-bifurcacoes',
    date: '2026-10-21',
    startTime: '18:30',
    endTime: '19:45',
    title: 'Simpósio Satélite: Tratamento de Bifurcações',
    subtitle: 'Estratégias de Stent Único vs Culotte e Double Kissing Crush',
    time: '18:30 - 19:45',
    category: 'Congresso',
    color: 'red',
    badge: 'SIMPÓSIO',
    modality: 'Sala de Transmissão 2',
    location: 'CathlabFlix Ao Vivo',
    actionUrl: '/new/solaci',
    actionLabel: 'Acessar Simpósio'
  },
  {
    id: 'webinar-sbhci-outubro',
    date: '2026-10-09',
    startTime: '19:00',
    endTime: '20:30',
    title: 'Webinar SBHCI: Atualizações em Terapias Estruturais',
    subtitle: 'Discussão de casos de TAVI e Valve-in-Valve Mitral',
    time: '19:00 - 20:30',
    category: 'Webinar',
    color: 'blue',
    badge: 'GRAVAÇÃO',
    modality: 'Transmissão Online',
    location: 'Plataforma CathlabFlix',
    actionUrl: 'https://www.cathlabflix.org/destaques',
    actionLabel: 'Ver Transmissão'
  },
  {
    id: 'tct-highlights-replay',
    date: '2026-10-15',
    startTime: '20:00',
    endTime: '21:30',
    title: 'Debate TCT 2026: Principais Ensaios Clínicos',
    subtitle: 'Análise crítica dos clinical trials e o impacto na prática clínica nacional',
    time: '20:00 - 21:30',
    category: 'Webinar',
    color: 'blue',
    badge: 'DEBATE',
    modality: 'Ao Vivo com Perguntas',
    location: 'CathlabFlix Streaming',
    actionUrl: '/new/tct',
    actionLabel: 'Ver Debate'
  },
  {
    id: 'curso-intervencionistas-modulo',
    date: '2026-10-28',
    startTime: '09:00',
    endTime: '12:00',
    title: 'Curso para Intervencionistas em Formação',
    subtitle: 'Módulo 2: Técnicas Fundamentais de Hemodinâmica e Acessos Vasculares',
    time: '09:00 - 12:00',
    category: 'Curso',
    color: 'amber',
    badge: 'AULA',
    modality: 'On-demand & Exercícios',
    location: 'CathlabFlix Academy',
    actionUrl: 'https://www.cathlabflix.org/destaques',
    actionLabel: 'Ver Conteúdo'
  }
];

class ModernAgendaCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Data inicial demonstrativa (Outubro 2026) com opção de navegar livremente
    this.currentDate = new Date(2026, 9, 1); // Mês 9 = Outubro
    this.today = new Date(); // Referência para indicador de hoje
    this.selectedDateStr = '2026-10-21';
    this.activeFilter = 'all'; // all | Congresso | Webinar | Curso
    this.currentView = 'month'; // 'month' | 'list'
    this.events = options.events || INITIAL_EVENTS;
    this.activeEventId = 'solaci-2026-destaque';

    this.monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.monthShortNames = [
      'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
      'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];

    this.dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    this.init();
  }

  init() {
    this.renderSkeleton();
    this.renderContent();
    this.attachEventListeners();

    // Se houver data pré-selecionada com evento, abre a gaveta inicial
    if (this.currentView === 'month' && this.selectedDateStr) {
      const dayEvents = this.getFilteredEventsForDate(this.selectedDateStr);
      if (dayEvents.length > 0) {
        this.expandEventDrawer(dayEvents, this.selectedDateStr, this.activeEventId);
      }
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="agenda-card-wrapper">
        <!-- Topo da Agenda com Kicker e Alternador de Visão (Mês vs Lista) -->
        <div class="agenda-top-bar">
          <div class="agenda-header-titles">
            <span class="agenda-kicker">AGENDA CATHLABFLIX</span>
          </div>

          <div class="agenda-view-toggle" role="tablist" aria-label="Modo de visualização da agenda">
            <button 
              type="button" 
              class="agenda-view-tab ${this.currentView === 'month' ? 'active' : ''}" 
              id="agendaViewMonthBtn" 
              role="tab"
              aria-selected="${this.currentView === 'month'}"
              title="Visualização em Calendário Mensal"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Mês</span>
            </button>
            <button 
              type="button" 
              class="agenda-view-tab ${this.currentView === 'list' ? 'active' : ''}" 
              id="agendaViewListBtn" 
              role="tab"
              aria-selected="${this.currentView === 'list'}"
              title="Visualização em Lista de Próximos Eventos"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Próximos</span>
            </button>
          </div>
        </div>

        <!-- Barra de Navegação do Mês (Visível no modo Calendário) -->
        <div class="agenda-header" id="agendaMonthHeader">
          <h3 class="agenda-month-title" id="agendaMonthDisplay">Outubro 2026</h3>

          <div class="agenda-nav-controls">
            <button type="button" class="agenda-nav-btn" id="agendaPrevMonthBtn" aria-label="Mês anterior" title="Mês anterior">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button type="button" class="agenda-today-btn" id="agendaTodayBtn" title="Ir para o mês atual">
              Hoje
            </button>
            <button type="button" class="agenda-nav-btn" id="agendaNextMonthBtn" aria-label="Próximo mês" title="Próximo mês">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Chips de Filtro por Categoria (Serve como legenda e filtro interativo) -->
        <div class="agenda-filters-row" role="group" aria-label="Filtrar por categoria">
          <button type="button" class="agenda-filter-chip ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">
            Todos
          </button>
          <button type="button" class="agenda-filter-chip ${this.activeFilter === 'Congresso' ? 'active' : ''}" data-filter="Congresso">
            <span class="chip-dot red"></span>
            Congressos
          </button>
          <button type="button" class="agenda-filter-chip ${this.activeFilter === 'Webinar' ? 'active' : ''}" data-filter="Webinar">
            <span class="chip-dot blue"></span>
            Webinars
          </button>
          <button type="button" class="agenda-filter-chip ${this.activeFilter === 'Curso' ? 'active' : ''}" data-filter="Curso">
            <span class="chip-dot amber"></span>
            Cursos
          </button>
        </div>

        <!-- Área Principal de Conteúdo Dinâmico -->
        <div class="agenda-content-area" id="agendaContentArea">
          <!-- Grade Mensal -->
          <div class="agenda-month-view-wrapper" id="agendaMonthViewWrapper">
            <div class="agenda-weekdays-row">
              ${this.dayNames.map(day => `<span class="agenda-weekday-label">${day}</span>`).join('')}
            </div>
            <div class="agenda-days-grid" id="agendaDaysGrid" role="grid" aria-label="Calendário de Eventos">
              <!-- Injetado dinamicamente -->
            </div>
          </div>

          <!-- Lista de Próximos Eventos -->
          <div class="agenda-list-view-wrapper" id="agendaListViewWrapper" style="display: none;">
            <!-- Injetado dinamicamente -->
          </div>
        </div>

        <!-- Gaveta Expansível Inferior com Detalhes e Salvar na Agenda -->
        <div class="agenda-expandable-drawer" id="agendaExpandableDrawer" aria-live="polite">
          <div class="agenda-drawer-inner" id="agendaDrawerInner">
            <!-- Detalhe do evento selecionado -->
          </div>
        </div>
      </div>
    `;
  }

  renderContent() {
    if (this.currentView === 'month') {
      const monthHeader = document.getElementById('agendaMonthHeader');
      const monthWrapper = document.getElementById('agendaMonthViewWrapper');
      const listWrapper = document.getElementById('agendaListViewWrapper');

      if (monthHeader) monthHeader.style.display = 'flex';
      if (monthWrapper) monthWrapper.style.display = 'block';
      if (listWrapper) listWrapper.style.display = 'none';

      this.renderMonthDays();
    } else {
      const monthHeader = document.getElementById('agendaMonthHeader');
      const monthWrapper = document.getElementById('agendaMonthViewWrapper');
      const listWrapper = document.getElementById('agendaListViewWrapper');

      if (monthHeader) monthHeader.style.display = 'none';
      if (monthWrapper) monthWrapper.style.display = 'none';
      if (listWrapper) listWrapper.style.display = 'block';

      this.collapseEventDrawer();
      this.renderUpcomingList();
    }
  }

  renderMonthDays() {
    const monthDisplay = document.getElementById('agendaMonthDisplay');
    const daysGrid = document.getElementById('agendaDaysGrid');
    if (!monthDisplay || !daysGrid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    monthDisplay.textContent = `${this.monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let gridHtml = '';

    // Células vazias do mês anterior
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += `<div class="agenda-day-cell empty" aria-hidden="true"></div>`;
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const dayFormatted = String(day).padStart(2, '0');
      const monthFormatted = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

      const eventsOnDay = this.getFilteredEventsForDate(dateStr);
      const hasEvent = eventsOnDay.length > 0;
      const isSelected = dateStr === this.selectedDateStr;

      // Verificação do dia "Hoje"
      const isToday = this.isToday(year, month, day);

      let cellClasses = ['agenda-day-cell'];
      if (hasEvent) cellClasses.push('has-event');
      if (isSelected) cellClasses.push('is-selected');
      if (isToday) cellClasses.push('is-today');

      // Geração de dots de alta visibilidade sob o número
      let dotsHtml = '';
      if (hasEvent) {
        dotsHtml = `
          <div class="agenda-dots-row">
            ${eventsOnDay.slice(0, 3).map(ev => `<span class="agenda-event-dot ${ev.color || 'red'}"></span>`).join('')}
          </div>
        `;
      }

      gridHtml += `
        <button 
          type="button" 
          class="${cellClasses.join(' ')}" 
          data-date="${dateStr}"
          aria-label="${day} de ${this.monthNames[month]}${hasEvent ? ` - ${eventsOnDay.length} evento(s)` : ''}${isToday ? ' (Hoje)' : ''}"
          ${hasEvent ? 'aria-haspopup="dialog"' : ''}
        >
          <span class="agenda-day-number">${day}</span>
          ${dotsHtml}
        </button>
      `;
    }

    daysGrid.innerHTML = gridHtml;
    this.attachDayClicks();
  }

  renderUpcomingList() {
    const listWrapper = document.getElementById('agendaListViewWrapper');
    if (!listWrapper) return;

    // Filtra e ordena eventos cronologicamente
    let filteredEvents = this.events.slice();
    if (this.activeFilter !== 'all') {
      filteredEvents = filteredEvents.filter(ev => ev.category === this.activeFilter);
    }

    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredEvents.length === 0) {
      listWrapper.innerHTML = `
        <div class="agenda-list-empty">
          <p>Nenhum evento encontrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    const itemsHtml = filteredEvents.map(event => {
      const parts = event.date.split('-');
      const dayNum = parts[2];
      const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];

      return `
        <div class="agenda-list-card ${event.color || 'red'}">
          <div class="agenda-list-card-date">
            <span class="card-date-day">${dayNum}</span>
            <span class="card-date-month">${monthShort}</span>
          </div>

          <div class="agenda-list-card-content">
            <div class="agenda-list-card-badges">
              <span class="card-category-badge ${event.color || 'red'}">${event.category}</span>
              ${event.badge ? `<span class="card-status-badge">${event.badge}</span>` : ''}
            </div>

            <h4 class="agenda-list-card-title">${event.title}</h4>
            <p class="agenda-list-card-subtitle">${event.subtitle}</p>

            <div class="agenda-list-card-meta">
              <div class="list-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${event.time}</span>
              </div>
              <div class="list-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                </svg>
                <span>${event.modality}</span>
              </div>
            </div>

            <div class="agenda-list-card-actions">
              ${event.actionUrl ? `
                <a href="${event.actionUrl}" class="list-action-cta-btn">
                  ${event.actionLabel || 'Acessar'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              ` : ''}

              <!-- Botão Salvar na Agenda Dropdown -->
              <div class="agenda-export-dropdown-wrapper">
                <button type="button" class="list-action-export-btn" data-event-id="${event.id}">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Salvar</span>
                </button>
                <div class="agenda-export-menu" id="exportMenu-${event.id}">
                  <a href="${this.generateGoogleCalendarUrl(event)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                    <span class="export-menu-icon google">G</span>
                    Google Calendar
                  </a>
                  <button type="button" class="export-menu-item" data-export="apple" data-event-id="${event.id}">
                    <span class="export-menu-icon apple"></span>
                    Apple Agenda (.ics)
                  </button>
                  <button type="button" class="export-menu-item" data-export="outlook" data-event-id="${event.id}">
                    <span class="export-menu-icon outlook">O</span>
                    Outlook (.ics)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listWrapper.innerHTML = `<div class="agenda-list-container">${itemsHtml}</div>`;
    this.attachExportMenuEvents();
  }

  isToday(year, month, day) {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  getFilteredEventsForDate(dateStr) {
    return this.events.filter(ev => {
      const matchesDate = ev.date === dateStr;
      if (!matchesDate) return false;
      if (this.activeFilter === 'all') return true;
      return ev.category === this.activeFilter;
    });
  }

  attachDayClicks() {
    const dayCells = this.container.querySelectorAll('.agenda-day-cell:not(.empty)');
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.getAttribute('data-date');
        const eventsOnDay = this.getFilteredEventsForDate(dateStr);

        // Se clicou no mesmo dia selecionado, recolhe
        if (this.selectedDateStr === dateStr) {
          this.collapseEventDrawer();
          this.selectedDateStr = null;
          cell.classList.remove('is-selected');
          return;
        }

        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => {
          c.classList.remove('is-selected');
        });

        this.selectedDateStr = dateStr;
        cell.classList.add('is-selected');

        if (eventsOnDay.length > 0) {
          this.activeEventId = eventsOnDay[0].id;
          this.expandEventDrawer(eventsOnDay, dateStr, this.activeEventId);
        } else {
          this.expandEmptyDrawer(dateStr);
        }
      });
    });
  }

  expandEventDrawer(eventsList, dateStr, currentEventId) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];

    // Evento selecionado atual
    let activeEvent = eventsList.find(e => e.id === currentEventId) || eventsList[0];
    const colorClass = activeEvent.color || 'red';

    // Tabs para múltiplos eventos no mesmo dia
    let tabsHtml = '';
    if (eventsList.length > 1) {
      tabsHtml = `
        <div class="agenda-drawer-multi-tabs">
          ${eventsList.map((ev, idx) => `
            <button 
              type="button" 
              class="agenda-drawer-tab-btn ${ev.id === activeEvent.id ? 'active' : ''}" 
              data-event-id="${ev.id}"
            >
              ${idx === 0 ? 'Sessão 1' : 'Sessão ' + (idx + 1)}: ${ev.category}
            </button>
          `).join('')}
        </div>
      `;
    }

    inner.innerHTML = `
      <div class="agenda-event-detail-card ${colorClass}">
        <!-- Topo com badge, pill da data e botão fechar -->
        <div class="event-detail-top">
          <div class="event-date-pill">
            <span class="event-pill-date">${dayNum} ${monthShort}</span>
            <span class="event-pill-badge">${activeEvent.badge || 'LEMBRE-SE'}</span>
          </div>

          <button type="button" class="event-detail-close-btn" id="eventDetailCloseBtn" title="Recolher detalhes" aria-label="Fechar detalhes do evento">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        ${tabsHtml}

        <!-- Conteúdo do evento -->
        <div class="event-detail-body">
          <span class="event-category-tag">${activeEvent.category}</span>
          <h4 class="event-detail-title">${activeEvent.title}</h4>
          <p class="event-detail-desc">${activeEvent.subtitle}</p>

          <div class="event-detail-meta">
            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${activeEvent.time}</span>
            </div>

            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>${activeEvent.modality}</span>
            </div>
          </div>

          <!-- Linha de Botões de Ação -->
          <div class="event-detail-actions-row">
            ${activeEvent.actionUrl ? `
              <a href="${activeEvent.actionUrl}" class="event-detail-cta-btn">
                ${activeEvent.actionLabel || 'Acessar Detalhes'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            ` : ''}

            <!-- Botão com Menu de Exportação de Agenda -->
            <div class="agenda-export-dropdown-wrapper">
              <button type="button" class="event-export-trigger-btn" id="drawerExportTriggerBtn" aria-haspopup="true" aria-expanded="false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Salvar na Agenda</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="agenda-export-menu" id="drawerExportMenu">
                <a href="${this.generateGoogleCalendarUrl(activeEvent)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                  <span class="export-menu-icon google">G</span>
                  Google Calendar
                </a>
                <button type="button" class="export-menu-item" data-export="apple" data-event-id="${activeEvent.id}">
                  <span class="export-menu-icon apple"></span>
                  Apple Agenda (.ics)
                </button>
                <button type="button" class="export-menu-item" data-export="outlook" data-event-id="${activeEvent.id}">
                  <span class="export-menu-icon outlook">O</span>
                  Outlook (.ics)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    drawer.classList.add('is-open');

    // Botão de fechar
    const closeBtn = document.getElementById('eventDetailCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapseEventDrawer();
        this.selectedDateStr = null;
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
      });
    }

    // Abas de múltiplos eventos
    inner.querySelectorAll('.agenda-drawer-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const evId = tabBtn.getAttribute('data-event-id');
        this.activeEventId = evId;
        this.expandEventDrawer(eventsList, dateStr, evId);
      });
    });

    this.attachExportMenuEvents();
  }

  expandEmptyDrawer(dateStr) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];

    inner.innerHTML = `
      <div class="agenda-event-empty-box">
        <div class="empty-header-row">
          <span class="empty-date-tag">${dayNum} ${monthShort}</span>
          <button type="button" class="event-detail-close-btn" id="eventDetailCloseBtn" title="Recolher detalhes">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="empty-text">Nenhum evento agendado para este dia.</p>
      </div>
    `;

    drawer.classList.add('is-open');

    const closeBtn = document.getElementById('eventDetailCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapseEventDrawer();
        this.selectedDateStr = null;
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
      });
    }
  }

  collapseEventDrawer() {
    const drawer = document.getElementById('agendaExpandableDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
    }
  }

  generateGoogleCalendarUrl(event) {
    const dateClean = event.date.replace(/-/g, '');
    const startH = (event.startTime || '14:00').replace(':', '') + '00';
    const endH = (event.endTime || '18:00').replace(':', '') + '00';
    const dates = `${dateClean}T${startH}/${dateClean}T${endH}`;

    const title = encodeURIComponent(event.title || 'Evento CathlabFlix');
    const details = encodeURIComponent(
      `${event.subtitle || ''}\n\nModalidade: ${event.modality || ''}\nTransmissão: ${event.location || ''}\nAcesso: ${window.location.origin}${event.actionUrl || ''}`
    );
    const location = encodeURIComponent(event.modality || 'CathlabFlix Online');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  downloadIcs(event) {
    const dateClean = event.date.replace(/-/g, '');
    const startH = (event.startTime || '14:00').replace(':', '') + '00';
    const endH = (event.endTime || '18:00').replace(':', '') + '00';
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CathlabFlix//Agenda SBHCI//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id || 'event'}-${Date.now()}@cathlabflix.org`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:${dateClean}T${startH}`,
      `DTEND:${dateClean}T${endH}`,
      `SUMMARY:${(event.title || 'Evento CathlabFlix').replace(/,/g, '\\,')}`,
      `DESCRIPTION:${(event.subtitle || '').replace(/,/g, '\\,')}\\n\\nAcesso: ${window.location.origin}${event.actionUrl || ''}`,
      `LOCATION:${(event.modality || 'CathlabFlix').replace(/,/g, '\\,')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id || 'evento-cathlabflix'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  attachExportMenuEvents() {
    // Dropdowns no Drawer ou na Lista
    const triggers = this.container.querySelectorAll('#drawerExportTriggerBtn, .list-action-export-btn');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = btn.closest('.agenda-export-dropdown-wrapper');
        if (!wrapper) return;
        const menu = wrapper.querySelector('.agenda-export-menu');
        if (!menu) return;

        const isOpen = menu.classList.contains('is-open');
        // Fecha todos os outros menus primeiro
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));

        if (!isOpen) {
          menu.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Cliques em itens que disparam download do .ics
    this.container.querySelectorAll('.export-menu-item[data-export]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const evId = item.getAttribute('data-event-id');
        const event = this.events.find(ev => ev.id === evId);
        if (event) {
          this.downloadIcs(event);
        }
        // Fecha menu
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));
      });
    });

    // Fecha menus ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.agenda-export-dropdown-wrapper')) {
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));
      }
    });
  }

  attachEventListeners() {
    // Alternância de Visão (Mês vs Lista)
    const monthViewBtn = document.getElementById('agendaViewMonthBtn');
    const listViewBtn = document.getElementById('agendaViewListBtn');

    if (monthViewBtn) {
      monthViewBtn.addEventListener('click', () => {
        if (this.currentView === 'month') return;
        this.currentView = 'month';
        monthViewBtn.classList.add('active');
        monthViewBtn.setAttribute('aria-selected', 'true');
        if (listViewBtn) {
          listViewBtn.classList.remove('active');
          listViewBtn.setAttribute('aria-selected', 'false');
        }
        this.renderContent();
      });
    }

    if (listViewBtn) {
      listViewBtn.addEventListener('click', () => {
        if (this.currentView === 'list') return;
        this.currentView = 'list';
        listViewBtn.classList.add('active');
        listViewBtn.setAttribute('aria-selected', 'true');
        if (monthViewBtn) {
          monthViewBtn.classList.remove('active');
          monthViewBtn.setAttribute('aria-selected', 'false');
        }
        this.renderContent();
      });
    }

    // Navegação de Mês
    const prevBtn = document.getElementById('agendaPrevMonthBtn');
    const nextBtn = document.getElementById('agendaNextMonthBtn');
    const todayBtn = document.getElementById('agendaTodayBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        const now = new Date();
        this.currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    // Chips de Filtro por Categoria
    const filterChips = this.container.querySelectorAll('.agenda-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.getAttribute('data-filter');
        this.activeFilter = filter;

        filterChips.forEach(c => c.classList.toggle('active', c === chip));

        if (this.currentView === 'month') {
          this.collapseEventDrawer();
          this.renderMonthDays();
        } else {
          this.renderUpcomingList();
        }
      });
    });
  }

  /**
   * Atualização de eventos sob demanda
   */
  setEvents(newEvents) {
    this.events = newEvents;
    this.renderContent();
  }
}

// Exportação global
window.ModernAgendaCalendar = ModernAgendaCalendar;
