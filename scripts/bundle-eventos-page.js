/**
 * CathlabFlix - Script de Empacotamento 100% Standalone para a Página/Embed de Eventos
 * Semelhante a embed-noticias.html: Catálogo SPA com busca, filtros de tipo, cards 16:9,
 * e Leitor Interno Completo com botão de inscrição condicional e exportação para agenda.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Ler base de dados e serviço
const eventsDataCode = fs.readFileSync(path.join(ROOT_DIR, 'js/events-data.js'), 'utf8');

// 2. Montar HTML Completo Standalone
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="blue">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>Agenda & Eventos - CathlabFlix SBHCI</title>
  <meta name="description" content="Calendário oficial com todos os congressos, simpósios, cursos e webinares da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista.">

  <!-- Favicon Oficial -->
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
  <link rel="apple-touch-icon" href="/assets/images/favicon.png">

  <!-- Tipografia Montserrat Oficial SBHCI -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       Variáveis e Reset - Tema Azul Oficial SBHCI
       ========================================================================== */
    :root {
      --color-bg-base: #010234;
      --color-surface: #062257;
      --color-surface-elevated: #082b6e;
      --color-surface-hover: #0d3887;
      --color-text-primary: #FFFFFF;
      --color-text-secondary: #94a3b8;
      --color-text-tertiary: #64748b;
      --color-primary: #E50914;
      --color-primary-hover: #B80710;
      --color-blue-accent: #38bdf8;
      --color-border-subtle: rgba(255, 255, 255, 0.12);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-pill: 9999px;
      --font-family-base: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --transition-fast: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      background-color: var(--color-bg-base) !important;
      color: var(--color-text-primary) !important;
      font-family: var(--font-family-base) !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden !important;
    }

    .embed-eventos-container {
      width: 94%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 8px 48px;
    }

    @media (max-width: 768px) {
      .embed-eventos-container {
        width: 92% !important;
        max-width: 420px !important;
        padding: 12px 4px 32px !important;
      }
    }

    @media (max-width: 480px) {
      .embed-eventos-container {
        width: 90% !important;
        max-width: 350px !important;
      }
    }

    /* Painéis SPA: Catálogo vs Leitor */
    .eventos-view-panel {
      display: none;
      animation: fadeIn 0.25s ease-out;
    }

    .eventos-view-panel.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ==========================================================================
       VIEW 1: CATÁLOGO DE EVENTOS
       ========================================================================== */

    /* Barra de Busca */
    .eventos-search-bar-wrap {
      width: 100%;
      margin-bottom: 20px;
    }

    .eventos-search-box {
      position: relative;
      display: flex;
      align-items: center;
      background: #020627;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: var(--radius-pill);
      padding: 2px 16px;
      transition: all 0.2s ease;
    }

    .eventos-search-box:focus-within {
      border-color: var(--color-blue-accent);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.22);
      background: #050b38;
    }

    .eventos-search-icon {
      color: var(--color-text-secondary);
      margin-right: 10px;
      flex-shrink: 0;
    }

    .eventos-search-input {
      width: 100%;
      border: none;
      background: transparent;
      color: #FFFFFF;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 10px 0;
      outline: none;
    }

    .eventos-search-input::placeholder {
      color: var(--color-text-secondary);
    }

    .eventos-search-clear {
      background: none;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: 4px;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .eventos-search-clear:hover {
      color: #FFFFFF;
    }

    /* Cabeçalho do Feed */
    .eventos-feed-header {
      margin-bottom: 20px;
    }

    .eventos-feed-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 6px;
    }

    .eventos-feed-title {
      font-size: 1.375rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    @media (max-width: 768px) {
      .eventos-feed-title {
        font-size: 1.125rem !important;
      }
    }

    .eventos-count-badge {
      display: none !important;
    }

    .eventos-feed-subtitle {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      margin: 0;
    }

    /* Pílulas de Filtro por Categoria */
    .eventos-category-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 24px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
    }

    .eventos-category-pill {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #062257;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: var(--radius-pill);
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }

    .eventos-category-pill:hover {
      background: #0a2d72;
      color: #FFFFFF;
      border-color: rgba(255, 255, 255, 0.25);
    }

    .eventos-category-pill.active {
      background: var(--color-primary);
      color: #FFFFFF;
      border-color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(229, 9, 20, 0.35);
    }

    /* Grade de Cards de Eventos (Igual Notícias) */
    .eventos-cards-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 100%;
    }

    @media (min-width: 900px) {
      .eventos-cards-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }
    }

    /* Card Individual de Evento */
    .evento-card {
      background: #062257;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      position: relative;
    }

    .evento-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      border-color: rgba(255, 255, 255, 0.22);
    }

    .evento-card-thumb-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      height: auto;
      overflow: hidden;
      background: #010234;
      cursor: pointer;
    }

    .evento-card-thumb-img {
      width: 100%;
      height: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      object-position: center;
      display: block;
      transition: transform 0.35s ease;
    }

    .evento-card:hover .evento-card-thumb-img {
      transform: scale(1.02);
    }

    .evento-card-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(10, 12, 16, 0.85);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      color: #FFFFFF;
      font-size: 0.55rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.4px;
      z-index: 2;
    }

    .evento-card-badge.badge-oficial {
      background: rgba(229, 9, 20, 0.9);
    }

    .evento-card-badge.badge-apoio {
      background: rgba(2, 132, 199, 0.9);
    }

    .evento-card-badge.badge-eventos {
      background: rgba(124, 58, 237, 0.9);
    }

    .evento-card-body {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 6px;
    }

    @media (max-width: 768px) {
      .evento-card-body {
        padding: 12px 14px;
      }
    }

    .evento-card-date-badge {
      font-size: 0.6875rem;
      color: var(--color-blue-accent);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .evento-card-title {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.35;
      color: #FFFFFF;
      margin: 2px 0 6px 0;
      cursor: pointer;
      transition: color 0.15s ease;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .evento-card-title:hover {
      color: var(--color-blue-accent);
    }

    .evento-card-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
      margin-bottom: 12px;
    }

    .evento-meta-row {
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .evento-meta-row svg {
      flex-shrink: 0;
      color: var(--color-blue-accent);
    }

    .evento-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid var(--color-border-subtle);
      margin-top: auto;
    }

    .evento-card-btn {
      background: var(--color-primary);
      color: #FFFFFF;
      border: none;
      height: 32px;
      min-width: 105px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 700;
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      text-decoration: none;
    }

    .evento-card-btn:hover {
      background: var(--color-primary-hover);
      transform: translateY(-1px);
    }

    .evento-card-save-btn {
      background: transparent;
      border: 1px solid var(--color-border-subtle);
      color: var(--color-text-secondary);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: var(--radius-pill);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all var(--transition-fast);
    }

    .evento-card-save-btn:hover {
      border-color: rgba(255, 255, 255, 0.3);
      color: #fff;
    }

    /* ==========================================================================
       VIEW 2: LEITOR INTERNO DO EVENTO
       ========================================================================== */
    .evento-reader-wrap {
      max-width: 900px;
      margin: 0 auto;
    }

    .evento-reader-header-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--color-border-subtle);
      flex-wrap: wrap;
      gap: 12px;
    }

    .evento-back-btn {
      background: #062257;
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 8px 16px;
      border-radius: var(--radius-pill);
      font-size: 0.8125rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .evento-back-btn:hover {
      background: #0a2d72;
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateX(-2px);
    }

    .evento-hero-banner {
      width: 100%;
      aspect-ratio: 16 / 9;
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: #020b24;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      margin-bottom: 24px;
    }

    .evento-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .evento-reader-article {
      background: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      padding: 32px 28px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    }

    @media (max-width: 600px) {
      .evento-reader-article {
        padding: 20px 16px;
      }
    }

    .evento-reader-title {
      font-size: 1.625rem;
      font-weight: 900;
      line-height: 1.25;
      color: #fff;
      margin: 0 0 10px 0;
      letter-spacing: -0.02em;
    }

    @media (max-width: 600px) {
      .evento-reader-title {
        font-size: 1.3rem;
      }
    }

    .evento-reader-subtitle {
      font-size: 0.9375rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      margin: 0 0 24px 0;
    }

    /* Grid de Informações Chave */
    .evento-info-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }

    @media (max-width: 768px) {
      .evento-info-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    .evento-info-card {
      background: var(--color-surface-elevated);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .info-card-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .info-card-icon.red {
      background: rgba(229, 9, 20, 0.15);
      color: var(--color-primary);
    }

    .info-card-icon.blue {
      background: rgba(56, 189, 248, 0.15);
      color: var(--color-blue-accent);
    }

    .info-card-icon.amber {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .info-card-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .info-card-label {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-secondary);
      margin-bottom: 2px;
    }

    .info-card-val {
      font-size: 0.8125rem;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Barra de Ações do Leitor */
    .evento-reader-action-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 0;
      margin-bottom: 24px;
      border-top: 1px solid var(--color-border-subtle);
      border-bottom: 1px solid var(--color-border-subtle);
      flex-wrap: wrap;
    }

    .btn-registration-cta {
      background: linear-gradient(135deg, #E50914, #c80812);
      color: #fff;
      font-size: 0.875rem;
      font-weight: 800;
      padding: 11px 22px;
      border-radius: var(--radius-pill);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(229, 9, 20, 0.4);
      transition: all var(--transition-fast);
    }

    .btn-registration-cta:hover {
      background: linear-gradient(135deg, #f01420, #E50914);
      transform: translateY(-2px);
    }

    .btn-save-calendar {
      background: var(--color-surface-elevated);
      color: #fff;
      border: 1px solid var(--color-border-subtle);
      font-size: 0.8125rem;
      font-weight: 700;
      padding: 10px 18px;
      border-radius: var(--radius-pill);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all var(--transition-fast);
    }

    .btn-save-calendar:hover {
      background: var(--color-surface-hover);
    }

    .agenda-export-dropdown-wrapper {
      position: relative;
    }

    .agenda-export-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: #041844;
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      width: 200px;
      display: none;
      flex-direction: column;
      z-index: 50;
      overflow: hidden;
    }

    .agenda-export-menu.is-open {
      display: flex;
    }

    .export-menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      color: var(--color-text-primary);
      text-decoration: none;
      font-size: 0.8125rem;
      font-weight: 600;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .export-menu-item:hover {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
    }

    .evento-desc-text {
      font-size: 0.9375rem;
      line-height: 1.7;
      color: #cbd5e1;
      margin-bottom: 28px;
    }

    .evento-desc-text p {
      margin: 0 0 14px 0;
    }

    .evento-bottom-back-row {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border-subtle);
      display: flex;
      justify-content: flex-start;
    }

    /* Estado Vazio */
    .eventos-empty-state {
      padding: 48px 20px;
      text-align: center;
      background: var(--color-surface);
      border: 1px dashed var(--color-border-subtle);
      border-radius: var(--radius-lg);
      grid-column: 1 / -1;
    }

    .eventos-empty-title {
      font-size: 1.0625rem;
      font-weight: 700;
      margin: 12px 0 6px 0;
      color: #fff;
    }

    .eventos-empty-text {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      margin: 0 0 18px 0;
    }
  </style>
</head>
<body class="embed-eventos-body">

  <div class="embed-eventos-container">

    <!-- ================================================================
         VIEW 1: CATÁLOGO DE EVENTOS (FEED)
         ================================================================ -->
    <section class="eventos-view-panel active" id="eventosCatalogView">

      <!-- Barra de Busca -->
      <div class="eventos-search-bar-wrap">
        <div class="eventos-search-box">
          <svg class="eventos-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="eventos-search-input" id="eventosSearchInput" placeholder="Buscar por evento, local, cidade ou tipo..." autocomplete="off">
          <button type="button" class="eventos-search-clear" id="eventosSearchClear" title="Limpar busca">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cabeçalho -->
      <header class="eventos-feed-header">
        <div class="eventos-feed-title-row">
          <h1 class="eventos-feed-title">
            <span>Agenda de Eventos & Congressos</span>
          </h1>
          <span class="eventos-count-badge" id="eventosCountBadge" style="display: none;"></span>
        </div>
        <p class="eventos-feed-subtitle">Confira a programação científica completa da SBHCI e parceiros oficiais.</p>
      </header>

      <!-- Pílulas de Filtro por Categoria -->
      <nav class="eventos-category-bar" aria-label="Filtrar por Categoria">
        <button type="button" class="eventos-category-pill active" data-filter="all">Todos os Eventos</button>
        <button type="button" class="eventos-category-pill" data-filter="oficial">Oficiais SBHCI</button>
        <button type="button" class="eventos-category-pill" data-filter="apoio">Apoio SBHCI</button>
        <button type="button" class="eventos-category-pill" data-filter="congresso">Congressos</button>
        <button type="button" class="eventos-category-pill" data-filter="webinar">Webinares</button>
        <button type="button" class="eventos-category-pill" data-filter="curso">Cursos</button>
      </nav>

      <!-- Grade de Cards de Eventos -->
      <main class="eventos-cards-grid" id="eventosCardsGrid">
        <!-- Renderizado dinamicamente via JS -->
      </main>

    </section>

    <!-- ================================================================
         VIEW 2: LEITOR INTERNO DO EVENTO
         ================================================================ -->
    <section class="eventos-view-panel" id="eventoDetailView">
      <div class="evento-reader-wrap" id="eventoReaderContent">
        <!-- Preenchido dinamicamente ao clicar em um evento -->
      </div>
    </section>

  </div>

  <!-- Base de Dados Standalone Oficial SBHCI Inlined -->
  <script>
${eventsDataCode}
  </script>

  <!-- Lógica da Aplicação SPA Standalone de Eventos -->
  <script>
    (function() {
      'use strict';

      const STORAGE_KEY = 'cathlabflix_custom_events';
      const API_ENDPOINT = '/api/wix-events';

      let allEvents = [];
      let filteredEvents = [];
      let currentFilter = 'all';
      let searchQuery = '';

      // 1. Carrega eventos locais e remotos
      function loadAllEvents() {
        let baseList = [];
        if (typeof INITIAL_EVENTS !== 'undefined' && Array.isArray(INITIAL_EVENTS)) {
          baseList = INITIAL_EVENTS.slice();
        }

        let customList = [];
        try {
          if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) customList = JSON.parse(stored);
          }
        } catch (e) {
          console.warn('[Eventos] Erro ao ler eventos customizados:', e);
        }

        const map = new Map();
        baseList.forEach(ev => map.set(ev.id, ev));
        customList.forEach(ev => map.set(ev.id, ev));

        allEvents = Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Tenta sincronizar com a API em background
        fetchRemoteEvents();
      }

      async function fetchRemoteEvents() {
        try {
          const res = await fetch(API_ENDPOINT);
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.items) && data.items.length > 0) {
              const map = new Map();
              allEvents.forEach(ev => map.set(ev.id, ev));
              data.items.forEach(ev => map.set(ev.id, ev));
              allEvents = Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              applyFilters();
            }
          }
        } catch (e) {
          // Utiliza base local sem travar
        }
      }

      // 2. Filtros e Busca
      function applyFilters() {
        filteredEvents = allEvents.filter(ev => {
          // Filtro por Categoria
          if (currentFilter !== 'all') {
            const t = (ev.type || '').toLowerCase();
            const b = (ev.badge || '').toLowerCase();
            const c = (ev.category || '').toLowerCase();

            if (currentFilter === 'oficial' && !t.includes('evento') && !b.includes('oficial')) return false;
            if (currentFilter === 'apoio' && !t.includes('apoio') && !b.includes('apoio')) return false;
            if (currentFilter === 'congresso' && !c.includes('congresso') && !t.includes('congresso')) return false;
            if (currentFilter === 'webinar' && !c.includes('webinar') && !t.includes('webinar')) return false;
            if (currentFilter === 'curso' && !c.includes('curso') && !t.includes('curso')) return false;
          }

          // Busca textual
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchTitle = (ev.title || '').toLowerCase().includes(q);
            const matchSub = (ev.subtitle || '').toLowerCase().includes(q);
            const matchDesc = (ev.description || '').toLowerCase().includes(q);
            const matchLoc = (ev.location || '').toLowerCase().includes(q);
            if (!matchTitle && !matchSub && !matchDesc && !matchLoc) return false;
          }

          return true;
        });

        renderCatalog();
      }

      // 3. Renderização do Catálogo
      function renderCatalog() {
        const grid = document.getElementById('eventosCardsGrid');
        const countBadge = document.getElementById('eventosCountBadge');
        if (!grid) return;

        if (countBadge) {
          countBadge.style.display = 'none';
          countBadge.textContent = '';
        }

        if (filteredEvents.length === 0) {
          grid.innerHTML = \`
            <div class="eventos-empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-blue-accent);">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <h3 class="eventos-empty-title">Nenhum evento encontrado</h3>
              <p class="eventos-empty-text">Tente alterar os termos da busca ou selecione outro filtro.</p>
              <button type="button" class="evento-card-btn" id="resetFiltersBtn">Limpar Filtros</button>
            </div>
          \`;

          const resetBtn = document.getElementById('resetFiltersBtn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              searchQuery = '';
              currentFilter = 'all';
              const input = document.getElementById('eventosSearchInput');
              if (input) input.value = '';
              document.querySelectorAll('.eventos-category-pill').forEach(p => {
                p.classList.toggle('active', p.getAttribute('data-filter') === 'all');
              });
              applyFilters();
            });
          }
          return;
        }

        grid.innerHTML = filteredEvents.map(ev => {
          const isApoio = (ev.type && ev.type.includes('apoio')) || (ev.badge && ev.badge.includes('APOIO'));
          const isGeral = (ev.type && ev.type === 'eventos') || (ev.badge && ev.badge.toLowerCase() === 'eventos');
          const badgeClass = isApoio ? 'badge-apoio' : (isGeral ? 'badge-eventos' : 'badge-oficial');
          const badgeText = isApoio ? 'APOIO SBHCI' : (isGeral ? 'EVENTOS' : 'EVENTO OFICIAL SBHCI');
          const dateLabel = formatDateLabel(ev.date, ev.endDate, ev.dateRangeLabel);
          const imgUrl = ev.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';

          return \`
            <article class="evento-card" data-id="\${escapeHTML(ev.id)}">
              <div class="evento-card-thumb-wrap" onclick="EventosRouter.openDetail('\${escapeHTML(ev.id)}')">
                <img src="\${imgUrl}" alt="\${escapeHTML(ev.title)}" class="evento-card-thumb-img" onerror="this.src='/assets/images/og-cathlabflix.png'">
                <span class="evento-card-badge \${badgeClass}">\${badgeText}</span>
              </div>

              <div class="evento-card-body">
                <div class="evento-card-date-badge">\${dateLabel}</div>
                <h3 class="evento-card-title" onclick="EventosRouter.openDetail('\${escapeHTML(ev.id)}')">
                  \${escapeHTML(ev.title)}
                </h3>

                <div class="evento-card-meta">
                  <div class="evento-meta-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>\${escapeHTML(ev.time || 'Horário a definir')}</span>
                  </div>
                  <div class="evento-meta-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>\${escapeHTML(ev.location || 'CathlabFlix Streaming')}</span>
                  </div>
                </div>

                <div class="evento-card-footer">
                  <button type="button" class="evento-card-btn" onclick="EventosRouter.openDetail('\${escapeHTML(ev.id)}')">
                    <span>Confira</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>

                  <button type="button" class="evento-card-save-btn" onclick="EventosRouter.quickSaveCalendar('\${escapeHTML(ev.id)}')">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Salvar</span>
                  </button>
                </div>
              </div>
            </article>
          \`;
        }).join('');

        notifyHeight();
      }

      // 4. Renderização do Leitor Interno
      function renderDetail(ev) {
        const container = document.getElementById('eventoReaderContent');
        if (!container) return;

        const isApoio = (ev.type && ev.type.includes('apoio')) || (ev.badge && ev.badge.includes('APOIO'));
        const isGeral = (ev.type && ev.type === 'eventos') || (ev.badge && ev.badge.toLowerCase() === 'eventos');
        const badgeLabel = isApoio ? 'Apoio SBHCI' : (isGeral ? 'Eventos' : 'Evento Oficial SBHCI');
        const badgeClass = isApoio ? 'badge-apoio' : (isGeral ? 'badge-eventos' : 'badge-oficial');
        const dateFormatted = formatDateString(ev.date, ev.endDate, ev.dateRangeLabel);
        const imgUrl = ev.image || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';

        // REGRA CRÍTICA: se registrationUrl estiver vazio, nada de botão de inscrição exibido
        const hasRegistration = Boolean(ev.registrationUrl && ev.registrationUrl.trim() !== '' && !ev.registrationUrl.includes('evento?id='));

        const googleCalUrl = generateGoogleCalendarUrl(ev);

        container.innerHTML = \`
          <div class="evento-reader-header-nav">
            <button type="button" class="evento-back-btn" onclick="EventosRouter.showCatalog()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Voltar para Todos os Eventos</span>
            </button>
            <span class="evento-card-badge \${badgeClass}" style="position: static; font-size: 0.6875rem; padding: 5px 12px; border-radius: var(--radius-pill);">
              \${badgeLabel}
            </span>
          </div>

          <div class="evento-hero-banner">
            <img src="\${imgUrl}" alt="\${escapeHTML(ev.title)}" class="evento-hero-img" onerror="this.src='/assets/images/og-cathlabflix.png'">
          </div>

          <article class="evento-reader-article">
            <h1 class="evento-reader-title">\${escapeHTML(ev.title)}</h1>
            \${ev.subtitle ? \`<p class="evento-reader-subtitle">\${escapeHTML(ev.subtitle)}</p>\` : ''}

            <section class="evento-info-cards-grid">
              <div class="evento-info-card">
                <div class="info-card-icon red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div class="info-card-text">
                  <span class="info-card-label">Data</span>
                  <span class="info-card-val">\${dateFormatted}</span>
                </div>
              </div>

              <div class="evento-info-card">
                <div class="info-card-icon blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="info-card-text">
                  <span class="info-card-label">Horário</span>
                  <span class="info-card-val">\${escapeHTML(ev.time || 'A definir')}</span>
                </div>
              </div>

              <div class="evento-info-card">
                <div class="info-card-icon amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="info-card-text">
                  <span class="info-card-label">Local</span>
                  <span class="info-card-val">\${escapeHTML(ev.location || 'CathlabFlix Streaming')}</span>
                </div>
              </div>
            </section>

            <section class="evento-reader-action-bar">
              <!-- BOTÃO DE INSCRIÇÃO: Apenas exibido se houver link -->
              \${hasRegistration ? \`
                <a href="\${escapeHTML(ev.registrationUrl)}" class="btn-registration-cta" target="_blank" rel="noopener noreferrer">
                  <span>Inscrição no Site</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              \` : ''}

              <!-- Menu Salvar na Agenda -->
              <div class="agenda-export-dropdown-wrapper">
                <button type="button" class="btn-save-calendar" id="readerSaveCalendarBtn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Salvar na Agenda</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div class="agenda-export-menu" id="readerCalendarMenu">
                  <a href="\${googleCalUrl}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                    <span style="font-weight: 800; color: #4285F4;">G</span>
                    Google Calendar
                  </a>
                  <button type="button" class="export-menu-item" id="readerAppleBtn">
                    <span></span>
                    Apple Agenda (.ics)
                  </button>
                  <button type="button" class="export-menu-item" id="readerOutlookBtn">
                    <span style="color: #0078D4;">O</span>
                    Outlook (.ics)
                  </button>
                </div>
              </div>
            </section>

            \${ev.description ? \`
              <section class="evento-desc-text">
                <h3 style="font-size: 1.125rem; font-weight: 800; color: #fff; margin: 0 0 12px 0;">Sobre este Evento</h3>
                <p>\${escapeHTML(ev.description).replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>')}</p>
              </section>
            \` : ''}

            <div class="evento-bottom-back-row">
              <button type="button" class="evento-back-btn" onclick="EventosRouter.showCatalog()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Voltar para Todos os Eventos</span>
              </button>
            </div>
          </article>
        \`;

        // Listeners do menu de calendário
        const saveCalBtn = document.getElementById('readerSaveCalendarBtn');
        const calMenu = document.getElementById('readerCalendarMenu');
        if (saveCalBtn && calMenu) {
          saveCalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            calMenu.classList.toggle('is-open');
          });

          document.addEventListener('click', (e) => {
            if (!e.target.closest('.agenda-export-dropdown-wrapper')) {
              calMenu.classList.remove('is-open');
            }
          });

          const appleBtn = document.getElementById('readerAppleBtn');
          if (appleBtn) {
            appleBtn.addEventListener('click', () => {
              downloadIcs(ev);
              calMenu.classList.remove('is-open');
            });
          }

          const outlookBtn = document.getElementById('readerOutlookBtn');
          if (outlookBtn) {
            outlookBtn.addEventListener('click', () => {
              downloadIcs(ev);
              calMenu.classList.remove('is-open');
            });
          }
        }

        notifyHeight();
      }

      // Router SPA
      window.EventosRouter = {
        showCatalog() {
          document.getElementById('eventoDetailView').classList.remove('active');
          document.getElementById('eventosCatalogView').classList.add('active');
          window.history.pushState(null, '', window.location.pathname);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          notifyHeight();
        },

        openDetail(id) {
          const ev = allEvents.find(e => (e.id && e.id.toLowerCase() === id.toLowerCase()) || (e.slug && e.slug.toLowerCase() === id.toLowerCase()));
          if (!ev) return;

          renderDetail(ev);
          document.getElementById('eventosCatalogView').classList.remove('active');
          document.getElementById('eventoDetailView').classList.add('active');
          window.history.pushState({ eventId: id }, '', '?id=' + encodeURIComponent(id));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        quickSaveCalendar(id) {
          const ev = allEvents.find(e => e.id === id);
          if (ev) {
            downloadIcs(ev);
          }
        }
      };

      // Notificação de altura para iframe Wix
      function notifyHeight() {
        if (window.parent && window.parent !== window) {
          try {
            const h = document.documentElement.scrollHeight || document.body.scrollHeight;
            window.parent.postMessage({ type: 'cathlabflix:resize', height: h }, '*');
          } catch (e) {}
        }
      }

      function formatDateLabel(dateStr, endDateStr, dateRangeLabel) {
        if (dateRangeLabel) return dateRangeLabel;
        if (!dateStr) return 'DATA A DEFINIR';
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const parts = dateStr.split('-');
        const year = parts[0];
        const month = months[parseInt(parts[1], 10) - 1] || 'OUT';
        const day = parts[2];

        if (endDateStr && endDateStr !== dateStr) {
          const endParts = endDateStr.split('-');
          const endDay = endParts[2];
          return \`\${day} A \${endDay} \${month} \${year}\`;
        }
        return \`\${day} \${month} \${year}\`;
      }

      function formatDateString(dateStr, endDateStr, dateRangeLabel) {
        if (dateRangeLabel) return dateRangeLabel;
        if (!dateStr) return 'Data a definir';
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const parts = dateStr.split('-');
        const year = parts[0];
        const month = months[parseInt(parts[1], 10) - 1];
        const day = parseInt(parts[2], 10);

        if (endDateStr && endDateStr !== dateStr) {
          const endParts = endDateStr.split('-');
          const endDay = parseInt(endParts[2], 10);
          const endMonth = months[parseInt(endParts[1], 10) - 1];
          if (parts[1] === endParts[1]) {
            return \`\${day} a \${endDay} de \${month} de \${year}\`;
          }
          return \`\${day} de \${month} a \${endDay} de \${endMonth} de \${year}\`;
        }
        return \`\${day} de \${month} de \${year}\`;
      }

      function generateGoogleCalendarUrl(event) {
        if (!event) return '#';
        const title = encodeURIComponent(event.title || 'Evento CathlabFlix');
        const details = encodeURIComponent((event.description || event.subtitle || '') + '\\n\\nMais informações: ' + (event.registrationUrl || 'https://cathlabflix-sessions.vercel.app'));
        const location = encodeURIComponent(event.location || 'CathlabFlix Streaming');

        const dateClean = (event.date || '').replace(/-/g, '');
        const endDateClean = (event.endDate || event.date || '').replace(/-/g, '');
        const startHour = (event.startTime || '09:00').replace(':', '');
        const endHour = (event.endTime || '18:00').replace(':', '');

        return \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${title}&details=\${details}&location=\${location}&dates=\${dateClean}T\${startHour}00Z/\${endDateClean}T\${endHour}00Z\`;
      }

      function downloadIcs(event) {
        if (!event) return;
        const dateClean = (event.date || '').replace(/-/g, '');
        const endDateClean = (event.endDate || event.date || '').replace(/-/g, '');
        const startHour = (event.startTime || '09:00').replace(':', '');
        const endHour = (event.endTime || '18:00').replace(':', '');
        const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//CathlabFlix SBHCI//Agenda Oficial//PT',
          'CALSCALE:GREGORIAN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          \`UID:\${event.id || 'event'}-\${dateClean}@cathlabflix.org\`,
          \`DTSTAMP:\${now}\`,
          \`DTSTART:\${dateClean}T\${startHour}00\`,
          \`DTEND:\${endDateClean}T\${endHour}00\`,
          \`SUMMARY:\${event.title}\`,
          \`DESCRIPTION:\${(event.description || event.subtitle || '').replace(/\\n/g, '\\\\n')}\`,
          \`LOCATION:\${event.location || 'CathlabFlix Streaming'}\`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\\r\\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = \`\${event.id || 'evento-sbhci'}.ics\`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }

      function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }

      // Inicialização
      document.addEventListener('DOMContentLoaded', () => {
        loadAllEvents();

        // Busca
        const searchInput = document.getElementById('eventosSearchInput');
        const clearBtn = document.getElementById('eventosSearchClear');

        if (searchInput) {
          searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim();
            if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
            applyFilters();
          });
        }

        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            if (searchInput) {
              searchInput.value = '';
              searchQuery = '';
              clearBtn.style.display = 'none';
              applyFilters();
            }
          });
        }

        // Pílulas de Categoria
        document.querySelectorAll('.eventos-category-pill').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.eventos-category-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            applyFilters();
          });
        });

        // Suporte a Deep Link / Query param ?id=
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        if (eventId) {
          EventosRouter.openDetail(eventId);
        } else {
          applyFilters();
        }

        // Popstate
        window.addEventListener('popstate', (e) => {
          const params = new URLSearchParams(window.location.search);
          const id = params.get('id');
          if (id) {
            EventosRouter.openDetail(id);
          } else {
            EventosRouter.showCatalog();
          }
        });
      });

    })();
  </script>

</body>
</html>
`;

// 3. Escrever arquivos em todas as rotas necessárias
fs.writeFileSync(path.join(ROOT_DIR, 'embed-eventos.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/embed-eventos.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(ROOT_DIR, 'new/eventos.html'), htmlContent, 'utf8');

const embedEventosDir = path.join(ROOT_DIR, 'new/embed-eventos');
if (!fs.existsSync(embedEventosDir)) fs.mkdirSync(embedEventosDir, { recursive: true });
fs.writeFileSync(path.join(embedEventosDir, 'index.html'), htmlContent, 'utf8');

const eventosDir = path.join(ROOT_DIR, 'new/eventos');
if (!fs.existsSync(eventosDir)) fs.mkdirSync(eventosDir, { recursive: true });
fs.writeFileSync(path.join(eventosDir, 'index.html'), htmlContent, 'utf8');

console.log('✅ Gerado: embed-eventos.html e rotas sincronizadas com sucesso!');
