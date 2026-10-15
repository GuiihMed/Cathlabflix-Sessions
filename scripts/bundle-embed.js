/**
 * CathlabFlix - Script de Empacotamento 100% Standalone para Embed Wix
 * Concatena todo o CSS e JS em arquivos únicos sem nenhuma dependência externa.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// 1. Ler todos os arquivos CSS necessários
const cssUi = fs.readFileSync(path.join(ROOT_DIR, 'css/modern-ui.css'), 'utf8');
const cssHub = fs.readFileSync(path.join(ROOT_DIR, 'css/modern-hub.css'), 'utf8');
const cssEvents = fs.readFileSync(path.join(ROOT_DIR, 'css/modern-events.css'), 'utf8');
const cssEmbed = fs.readFileSync(path.join(ROOT_DIR, 'css/modern-embed.css'), 'utf8');

const combinedCss = [cssUi, cssHub, cssEvents, cssEmbed].join('\n\n');

// 2. Ler todos os scripts JS necessários
const jsData = fs.readFileSync(path.join(ROOT_DIR, 'js/events-data.js'), 'utf8');
const jsService = fs.readFileSync(path.join(ROOT_DIR, 'js/events-service.js'), 'utf8');
const jsCalendar = fs.readFileSync(path.join(ROOT_DIR, 'js/modern-calendar.js'), 'utf8');
const jsEmbed = fs.readFileSync(path.join(ROOT_DIR, 'js/embed-home.js'), 'utf8');

const combinedJs = [jsData, jsService, jsCalendar, jsEmbed].join('\n\n');

// 3. Montar o HTML Standalone Completo
const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR" data-theme="blue">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>Notícias & Agenda de Eventos - CathlabFlix SBHCI</title>
  <meta name="description" content="Embed oficial com as notícias em destaque, catálogo de publicações e agenda interativa de eventos da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista.">

  <!-- Tipografia Montserrat Oficial SBHCI -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Estilos Embutidos (Zero Dependência Externa) -->
  <style>
${combinedCss}
  </style>

  <!-- Tema Azul Oficial Padrão (#010234 / #062257) -->
  <script>
    (function() {
      try {
        var params = new URLSearchParams(window.location.search);
        var qTheme = params.get("theme");
        if (qTheme === "light") {
          document.documentElement.removeAttribute("data-theme");
        } else {
          document.documentElement.setAttribute("data-theme", "blue");
        }
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "blue");
      }
    })();
  </script>
</head>
<body class="embed-body theme-blue" data-theme="blue">

  <div class="embed-main-wrapper">

    <!-- ==========================================================================
         Barra de Busca Interna do Embed ("Busque em Notícias e Eventos...")
         ========================================================================== -->
    <header class="embed-top-bar-container" aria-label="Busca em Notícias e Eventos">
      <div class="embed-search-wrapper">
        <div class="embed-search-bar">
          <svg class="embed-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="search" 
            class="embed-search-input" 
            id="embedSearchInput" 
            placeholder="Busque em Notícias e Eventos..." 
            autocomplete="off" 
            spellcheck="false"
            aria-label="Busque em Notícias e Eventos"
          >
          <button type="button" class="embed-search-clear-btn" id="embedSearchClearBtn" aria-label="Limpar busca" title="Limpar busca">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="embed-search-status-bar" id="embedSearchStatusBar" style="display: none;">
          <span class="embed-search-count-badge" id="embedSearchBadge"></span>
          <span style="font-size: 0.75rem; color: var(--color-text-secondary);">Filtrando notícias e agenda em tempo real</span>
        </div>
      </div>
    </header>

    <!-- ==========================================================================
         VIEW 1: HOME (Painel Principal: Em Destaque + Agenda de Eventos)
         ========================================================================== -->
    <section class="embed-view-panel active" id="viewHome" aria-label="Página Inicial do Embed">
      <main class="embed-content-grid">

        <!-- Coluna Esquerda: Notícias em Destaque do Wix -->
        <section class="hub-news-column" id="destaquesSection" aria-label="Notícias em Destaque">
          <div class="column-heading-wrapper">
            <h2 class="column-heading-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary)">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Em Destaque
            </h2>
            <a href="https://www.cathlabflix.org/noticias" target="_top" class="column-heading-link" title="Ver todas as notícias e publicações">
              <span>Ver todas</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>

          <!-- Lista de Notícias do Wix com Paginação -->
          <div class="wix-news-feed-list" id="wixNewsContainer">
            <div class="news-loading-state" style="padding: 40px; text-align: center; color: var(--color-text-secondary);">
              <p>Carregando as últimas atualizações do CathlabFlix...</p>
            </div>
          </div>

          <nav class="news-pagination-nav" id="newsPaginationContainer" aria-label="Navegação entre páginas de notícias" style="display: none;"></nav>
        </section>

        <!-- Coluna Direita: Agenda de Eventos com Calendário e Próximos -->
        <aside class="hub-agenda-column" id="agendaSection" aria-label="Agenda de Eventos">
          <div class="column-heading-wrapper">
            <h2 class="column-heading-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary)">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Agenda Eventos
            </h2>
            <a href="https://www.cathlabflix.org/eventos" target="_top" class="column-heading-link" title="Ver todos os eventos e congressos">
              <span>Ver todos</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>

          <!-- Componente do Calendário Interativo -->
          <div id="agendaCalendarContainer">
            <!-- Injetado dinamicamente pelo script interno -->
          </div>
        </aside>

      </main>
    </section>

    <!-- ==========================================================================
         VIEW 2: NOTÍCIAS (Painel de Catálogo Completo com Filtros de Categoria)
         ========================================================================== -->
    <section class="embed-view-panel" id="viewPosts" aria-label="Catálogo de Notícias">
      <div class="embed-subview-nav">
        <button type="button" class="embed-back-btn" data-route-view="home" aria-label="Voltar para o Início">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Voltar para Início</span>
        </button>
        <div class="embed-breadcrumbs">
          <a data-route-view="home">Início</a>
          <span>/</span>
          <span>Notícias</span>
        </div>
      </div>

      <div class="embed-posts-header">
        <h1 class="embed-posts-title">Todas as Notícias</h1>
        <p class="embed-posts-subtitle">Publicações científicas, coberturas de congressos e atualizações institucionais da SBHCI</p>
      </div>

      <!-- Filtro por Categorias (Oculto temporariamente) -->
      <div class="embed-category-pills-row" id="embedCategoryPillsRow" style="display: none;"></div>

      <!-- Grade Responsiva de Publicações (3 Colunas) -->
      <div class="embed-posts-grid" id="allPostsGrid">
        <div class="news-loading-state" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--color-text-secondary);">
          <p>Carregando publicações...</p>
        </div>
      </div>

      <!-- Paginação do Catálogo de Notícias -->
      <nav class="news-pagination-nav" id="allPostsPagination" aria-label="Navegação entre páginas"></nav>
    </section>

    <!-- ==========================================================================
         VIEW 3: POST INDIVIDUAL (Painel Leitor do Artigo)
         ========================================================================== -->
    <section class="embed-view-panel" id="viewPost" aria-label="Leitor do Artigo">
      <div class="embed-subview-nav">
        <button type="button" class="embed-back-btn" data-route-view="posts" aria-label="Voltar para Notícias">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Voltar para Notícias</span>
        </button>
        <div class="embed-breadcrumbs">
          <a data-route-view="home">Início</a>
          <span>/</span>
          <a data-route-view="posts">Notícias</a>
          <span>/</span>
          <span>Artigo</span>
        </div>
      </div>

      <!-- Conteúdo do Post Renderizado via JS -->
      <div id="postDetailContent"></div>
    </section>

    <!-- ==========================================================================
         VIEW 4: EVENTO INDIVIDUAL (Painel de Detalhes do Evento)
         ========================================================================== -->
    <section class="embed-view-panel" id="viewEvent" aria-label="Detalhes do Evento">
      <div class="embed-subview-nav">
        <button type="button" class="embed-back-btn" data-route-view="home" aria-label="Voltar para Agenda">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Voltar para Agenda</span>
        </button>
        <div class="embed-breadcrumbs">
          <a data-route-view="home">Início</a>
          <span>/</span>
          <span>Detalhes do Evento</span>
        </div>
      </div>

      <!-- Conteúdo do Evento Renderizado via JS -->
      <div id="eventDetailContent"></div>
    </section>

  </div>

  <!-- Scripts Embutidos (Zero Dependência Externa) -->
  <script>
${combinedJs}
  </script>

</body>
</html>
`;

// 4. Gravar nos 3 destinos canônicos
const targets = [
  path.join(ROOT_DIR, 'new/embed-home.html'),
  path.join(ROOT_DIR, 'new/embed-home/index.html'),
  path.join(ROOT_DIR, 'embed-home.html')
];

targets.forEach(targetPath => {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetPath, htmlTemplate, 'utf8');
  console.log(`✅ Gerado: ${path.relative(ROOT_DIR, targetPath)} (${htmlTemplate.length} bytes)`);
});
