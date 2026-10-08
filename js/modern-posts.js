/**
 * CathlabFlix Modern Posts - Lógica da Página de Notícias & Publicações (/new/posts)
 * Integração com API Wix Blog (/api/wix-news), Filtros por Categoria, Busca e Paginação de 12 posts/página
 */

document.addEventListener('DOMContentLoaded', () => {
  initPostsPage();
  initHamburgerDrawer();
  initThemeSwitcher();
});

const POSTS_PER_PAGE = 12;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';

/**
 * 1. Inicialização da Página de Posts
 */
async function initPostsPage() {
  const gridContainer = document.getElementById('postsGridContainer');
  const paginationContainer = document.getElementById('postsPaginationContainer');
  const searchInput = document.getElementById('postsSearchInput');
  const searchClearBtn = document.getElementById('postsSearchClearBtn');

  // Renderiza skeletons iniciais enquanto busca
  renderSkeletons(gridContainer, 6);

  try {
    const res = await fetch('/api/wix-news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      allPosts = data.items;
    } else {
      allPosts = getLocalFallbackPosts();
    }
  } catch (err) {
    console.warn('[Posts Page] Falha na API ao vivo, utilizando fallback local:', err);
    allPosts = getLocalFallbackPosts();
  }

  // Prepara filtros de categoria dinâmicos
  setupCategoryFilters();

  // Event listeners da busca
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = (e.target.value || '').trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = currentSearch ? 'flex' : 'none';
      }
      applyFilters();
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      searchClearBtn.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });
  }

  applyFilters();
}

/**
 * 2. Filtros e Pesquisa
 */
function setupCategoryFilters() {
  const container = document.getElementById('postsCategoryFilters');
  if (!container) return;

  // Coleta categorias únicas presentes nos posts
  const categoriesSet = new Set();
  allPosts.forEach(post => {
    if (post.category && post.category.trim()) {
      categoriesSet.add(post.category.trim());
    }
  });

  const uniqueCategories = Array.from(categoriesSet);

  // Monta pílulas de categoria
  let html = `
    <button type="button" class="posts-filter-btn active" data-category="all">
      Todos
    </button>
  `;

  uniqueCategories.forEach(cat => {
    html += `
      <button type="button" class="posts-filter-btn" data-category="${escapeHTML(cat)}">
        ${escapeHTML(cat)}
      </button>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll('.posts-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.posts-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'all';
      applyFilters();
    });
  });
}

function applyFilters() {
  filteredPosts = allPosts.filter(post => {
    // Filtro por Categoria
    if (currentCategory !== 'all') {
      const postCat = (post.category || '').toLowerCase();
      if (postCat !== currentCategory.toLowerCase()) {
        return false;
      }
    }

    // Filtro por Busca de Texto
    if (currentSearch) {
      const matchTitle = (post.title || '').toLowerCase().includes(currentSearch);
      const matchDesc = (post.description || '').toLowerCase().includes(currentSearch);
      const matchCat = (post.category || '').toLowerCase().includes(currentSearch);
      if (!matchTitle && !matchDesc && !matchCat) {
        return false;
      }
    }

    return true;
  });

  currentPage = 1;
  updateCounterDisplay();
  renderCurrentPage();
}

function updateCounterDisplay() {
  const counterEl = document.getElementById('postsMetaCounter');
  if (!counterEl) return;

  const count = filteredPosts.length;
  if (count === 0) {
    counterEl.innerHTML = 'Nenhuma publicação encontrada';
  } else if (count === 1) {
    counterEl.innerHTML = '<strong>1</strong> publicação encontrada';
  } else {
    counterEl.innerHTML = `<strong>${count}</strong> publicações encontradas`;
  }
}

/**
 * 3. Renderização da Grade e Paginação (12 posts por página)
 */
function renderCurrentPage() {
  const gridContainer = document.getElementById('postsGridContainer');
  const paginationContainer = document.getElementById('postsPaginationContainer');
  if (!gridContainer) return;

  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);

  if (totalItems === 0) {
    renderEmptyState(gridContainer);
    if (paginationContainer) paginationContainer.style.display = 'none';
    return;
  }

  if (currentPage < 1) currentPage = 1;
  if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const pageItems = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  gridContainer.innerHTML = pageItems.map(item => {
    const postUrl = item.internalAction?.url || `/new/post?id=${encodeURIComponent(item.id || item.slug || '1')}`;
    const category = item.category || 'Notícia';

    return `
      <article class="post-grid-card" data-id="${escapeHTML(item.id || '')}">
        <a href="${postUrl}" class="post-grid-thumb-wrapper" title="${escapeHTML(item.title)}">
          <img 
            src="${item.image || '/assets/images/og-cathlabflix.png'}" 
            alt="${escapeHTML(item.title)}" 
            class="post-grid-thumb" 
            loading="lazy"
            onerror="this.src='/assets/images/og-cathlabflix.png'"
          >
          <span class="post-grid-badge">${escapeHTML(category)}</span>
        </a>

        <div class="post-grid-content">
          <div class="post-grid-header">
            <span class="post-grid-date">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${escapeHTML(item.formattedDate || '')}
            </span>
          </div>

          <h3 class="post-grid-title">
            <a href="${postUrl}" title="${escapeHTML(item.title)}">
              ${escapeHTML(item.title)}
            </a>
          </h3>

          <p class="post-grid-excerpt">${escapeHTML(item.description || '')}</p>

          <div class="post-grid-footer">
            <a href="${postUrl}" class="post-grid-btn" title="Confira">
              <span>Confira</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  renderPagination(paginationContainer, totalPages, currentPage);
}

function renderPagination(container, totalPages, currentPage) {
  if (!container) return;

  if (totalPages <= 1) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  container.style.display = 'flex';

  let html = '';

  const prevDisabled = currentPage === 1;
  html += `
    <button 
      type="button" 
      class="posts-pagination-btn prev ${prevDisabled ? 'disabled' : ''}" 
      aria-label="Página anterior"
      ${prevDisabled ? 'disabled' : ''}
      data-page="${currentPage - 1}"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Anterior</span>
    </button>
  `;

  html += `<div class="posts-pagination-numbers">`;

  // Exibe números com elipses se houver muitas páginas
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (startPage > 1) {
    html += `
      <button type="button" class="posts-pagination-num" data-page="1">1</button>
    `;
    if (startPage > 2) {
      html += `<span style="padding: 0 4px; color: var(--color-text-tertiary);">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    html += `
      <button 
        type="button" 
        class="posts-pagination-num ${isActive ? 'active' : ''}" 
        aria-label="Página ${i}"
        aria-current="${isActive ? 'page' : 'false'}"
        data-page="${i}"
      >
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += `<span style="padding: 0 4px; color: var(--color-text-tertiary);">...</span>`;
    }
    html += `
      <button type="button" class="posts-pagination-num" data-page="${totalPages}">${totalPages}</button>
    `;
  }

  html += `</div>`;

  const nextDisabled = currentPage === totalPages;
  html += `
    <button 
      type="button" 
      class="posts-pagination-btn next ${nextDisabled ? 'disabled' : ''}" 
      aria-label="Próxima página"
      ${nextDisabled ? 'disabled' : ''}
      data-page="${currentPage + 1}"
    >
      <span>Próximo</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  `;

  container.innerHTML = html;

  container.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = parseInt(btn.getAttribute('data-page'), 10);
      if (targetPage && targetPage !== currentPage && targetPage >= 1 && targetPage <= totalPages) {
        currentPage = targetPage;
        renderCurrentPage();

        const catalogSection = document.getElementById('postsCatalogSection');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

function renderEmptyState(container) {
  container.innerHTML = `
    <div class="posts-empty-state">
      <div class="posts-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>
      <h3 class="posts-empty-title">Nenhuma publicação encontrada</h3>
      <p class="posts-empty-desc">Não foram encontrados artigos ou notícias para os filtros selecionados. Tente alterar o termo buscado ou limpar os filtros.</p>
      <button type="button" class="posts-empty-reset-btn" id="postsResetFiltersBtn">
        Limpar Filtros
      </button>
    </div>
  `;

  const resetBtn = document.getElementById('postsResetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCategory = 'all';
      currentSearch = '';
      const searchInput = document.getElementById('postsSearchInput');
      const searchClearBtn = document.getElementById('postsSearchClearBtn');
      if (searchInput) searchInput.value = '';
      if (searchClearBtn) searchClearBtn.style.display = 'none';

      const filterButtons = document.querySelectorAll('.posts-filter-btn');
      filterButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });

      applyFilters();
    });
  }
}

function renderSkeletons(container, count = 6) {
  if (!container) return;
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="posts-skeleton-card">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-body">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line title"></div>
          <div class="skeleton-line full"></div>
          <div class="skeleton-line full"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

/**
 * 4. Fallback com posts oficiais para contingência
 */
function getLocalFallbackPosts() {
  return [
    {
      id: 'solaci-2026-destaque',
      slug: 'conteudos-do-congresso-solaci-sbhci-2026-ganham-destaque-com-cobertura-multiplataforma',
      title: 'Conteúdos do Congresso SOLACI-SBHCI 2026 ganham destaque com cobertura multiplataforma',
      description: 'Já estão disponíveis no CathlabFlix os conteúdos e principais discussões do Congresso SOLACI-SBHCI 2026, um dos maiores encontros de Cardiologia Intervencionista da América Latina.',
      image: 'https://static.wixstatic.com/media/1d3d47_0e8baa2ca7354d62b8b17794f33d9e28~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Congresso',
      formattedDate: '23 Set 2026',
      internalAction: { label: 'Confira', url: '/new/solaci', isInternal: true }
    },
    {
      id: 'cathlabflix-nova-era',
      slug: 'cathlabflix-inaugura-nova-era-da-educacao-em-cardiologia-intervencionista',
      title: 'CathlabFlix inaugura nova era da educação em Cardiologia Intervencionista',
      description: 'Desenvolvida para centralizar conteúdos da especialidade em um único ambiente, a plataforma reúne aulas, apresentações e materiais complementares.',
      image: 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Institucional',
      formattedDate: '11 Mai 2026',
      internalAction: { label: 'Confira', url: '/new/post?id=cathlabflix-nova-era', isInternal: true }
    },
    {
      id: 'curso-intervencionistas-formacao',
      slug: 'curso-para-intervencionistas-em-formacao-inicia-com-foco-em-fundamentos-da-especialidade',
      title: 'Curso para Intervencionistas em Formação inicia com foco em fundamentos da especialidade',
      description: 'Já está disponível o Módulo 1 do Curso para Intervencionistas em Formação, iniciativa educacional desenvolvida para apoiar médicos em treinamento.',
      image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Curso',
      formattedDate: '11 Mai 2026',
      internalAction: { label: 'Confira', url: '/new/post?id=curso-intervencionistas-formacao', isInternal: true }
    },
    {
      id: 'webinar-valve-in-valve',
      slug: 'valve-in-valve-mitral-ganha-destaque-em-conteudo-sobre-terapias-estruturais',
      title: 'Valve-in-Valve Mitral ganha destaque em conteúdo sobre terapias estruturais',
      description: 'O procedimento de Valve-in-Valve Mitral vem consolidando seu espaço como alternativa terapêutica para pacientes com disfunção de biopróteses mitrais.',
      image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Webinar',
      formattedDate: '11 Mai 2026',
      internalAction: { label: 'Confira', url: '/new/post?id=webinar-valve-in-valve', isInternal: true }
    }
  ];
}

/**
 * 5. Menu Hambúrguer (Drawer)
 */
function initHamburgerDrawer() {
  const hamburgerBtn = document.getElementById('topbarHamburgerBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawer = document.getElementById('appDrawer');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleDrawer(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleDrawer);
  }

  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });

  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('active')) return;
    if (!drawer.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll('.dropdown-nav-link, .drawer-nav-link, .dropdown-featured-card').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });
}

/**
 * 6. Seletor de Temas (Claro vs Azul #062257 / #010234)
 */
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.drawer-theme-btn');
  if (!themeBtns.length) return;

  function applyTheme(theme) {
    if (theme === 'blue') {
      document.documentElement.setAttribute('data-theme', 'blue');
      try { localStorage.setItem('cathlabflix-theme', 'blue'); } catch (e) {}
    } else {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('cathlabflix-theme', 'light'); } catch (e) {}
    }

    themeBtns.forEach(btn => {
      const val = btn.getAttribute('data-theme-val');
      const isActive = val === (theme === 'blue' ? 'blue' : 'light');
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
  }

  let currentTheme = 'light';
  try {
    const saved = localStorage.getItem('cathlabflix-theme');
    if (saved) {
      currentTheme = saved;
    } else if (document.documentElement.getAttribute('data-theme') === 'blue') {
      currentTheme = 'blue';
    }
  } catch (e) {}

  applyTheme(currentTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTheme = btn.getAttribute('data-theme-val') || 'light';
      applyTheme(targetTheme);
    });
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
