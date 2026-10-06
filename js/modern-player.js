/**
 * CathlabFlix Modern Player - Interatividade da Página Interna
 * Baseado nas diretrizes do design_system_p_gina_interna_player.md
 * Grid 70/30, player 16:9 Vimeo, troca dinâmica de aulas e materiais PPTX.
 */

// Base de dados das sessões oficiais SOLACI SBHCI 2026
const PLAYER_SESSIONS = [
  {
    id: "vimeo-1223707542",
    vimeoId: "1223707542",
    title: "SOLACI INCOR - Dr Raul Arrieta - Caso 003",
    speaker: "Dr. Raul Arrieta",
    affiliation: "INCOR - Instituto do Coração",
    room: "Sala INCOR",
    day: "Dia 29 de Julho",
    category: "Estrutural Congênita",
    duration: "43 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Intervenção estrutural congênita e discussão aprofundada de procedimentos percutâneos em cardiopatias congênitas complexas, com foco em fechamento percutâneo e oclusores de nova geração.",
    materials: [
      {
        id: "mat-1",
        name: "Caso_003_Dr_Raul_Arrieta_INCOR_Apresentacao.pptx",
        format: "PPTX",
        size: "18.4 MB",
        description: "Slides da Apresentação Oficial com imagens fluoroscópicas"
      },
      {
        id: "mat-2",
        name: "Protocolo_Intervencao_Estrutural_Congenita_2026.pdf",
        format: "PDF",
        size: "4.2 MB",
        description: "Diretrizes e critérios de seleção de dispositivos"
      }
    ]
  },
  {
    id: "vimeo-1223707532",
    vimeoId: "1223707532",
    title: "SOLACI INCOR - Dr Raul Arrieta - Caso 004",
    speaker: "Dr. Raul Arrieta",
    affiliation: "INCOR - Instituto do Coração",
    room: "Sala INCOR",
    day: "Dia 29 de Julho",
    category: "Congênitas",
    duration: "46 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Discussão detalhada sobre fechamento de defeitos de septo interatrial e interventricular com oclusores vasculares avançados e reconstrução 3D ecocardiográfica.",
    materials: [
      {
        id: "mat-3",
        name: "Caso_004_Oclusores_Vasculares_Avancados.pptx",
        format: "PPTX",
        size: "22.1 MB",
        description: "Slides de acompanhamento e casos desafiadores"
      }
    ]
  },
  {
    id: "vimeo-1223707531",
    vimeoId: "1223707531",
    title: "SOLACI INCOR - Dr Carlos Campos - 002",
    speaker: "Dr. Carlos Campos",
    affiliation: "INCOR - Instituto do Coração",
    room: "Sala INCOR",
    day: "Dia 29 de Julho",
    category: "Coronária Complexa",
    duration: "40 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Intervenção coronária complexa guiada por tomografia de coerência óptica (OCT) e ultrassom intracoronário (IVUS). Avaliação de lesões bifurcadas e otimização de stent.",
    materials: [
      {
        id: "mat-4",
        name: "OCT_e_IVUS_Otimizacao_Stents_Campos.pptx",
        format: "PPTX",
        size: "31.5 MB",
        description: "Imagens intracoronárias em alta resolução"
      },
      {
        id: "mat-5",
        name: "Checklist_Angioplastia_Guiada_Imagem.pdf",
        format: "PDF",
        size: "2.8 MB",
        description: "Protocolo prático de interpretação de OCT"
      }
    ]
  },
  {
    id: "vimeo-1223707530",
    vimeoId: "1223707530",
    title: "SOLACI INCOR - Dr Carlos Campos - 001",
    speaker: "Dr. Carlos Campos",
    affiliation: "INCOR - Instituto do Coração",
    room: "Sala INCOR",
    day: "Dia 29 de Julho",
    category: "Tronco & Bifurcações",
    duration: "24 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Abordagem moderna de lesões no tronco de coronária esquerda (TCE) e bifurcações: técnicas provisionais vs double-stenting com evidências clínicas atualizadas.",
    materials: [
      {
        id: "mat-6",
        name: "Lesoes_Tronco_Coronaria_Estratificacao.pptx",
        format: "PPTX",
        size: "15.9 MB",
        description: "Casos anatômicos e algoritmos decisórios"
      }
    ]
  },
  {
    id: "vimeo-1223744925",
    vimeoId: "1223744925",
    title: "Sessão Dante Pazzanese - MEDTRONIC 001",
    speaker: "Heart Team Dante Pazzanese",
    affiliation: "Instituto Dante Pazzanese de Cardiologia",
    room: "Auditório Dante Pazzanese",
    day: "Dia 31 de Julho",
    category: "TAVI & Valvar",
    duration: "48 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "TAVI autoexpansível em anatomias desafiadoras com vias de acesso femoral e alternativas. Monitoramento eletrocardiográfico e prevenção de distúrbios de condução.",
    materials: [
      {
        id: "mat-7",
        name: "TAVI_Autoexpansivel_Dante_Medtronic.pptx",
        format: "PPTX",
        size: "27.0 MB",
        description: "Planejamento tomográfico e casos anatômicos"
      },
      {
        id: "mat-8",
        name: "Diretrizes_TAVI_Brasil_2026.pdf",
        format: "PDF",
        size: "5.1 MB",
        description: "Recomendações técnicas para a prática clínica"
      }
    ]
  },
  {
    id: "vimeo-1223744924",
    vimeoId: "1223744924",
    title: "Sessão Dante Pazzanese - SMT 002",
    speaker: "Equipe Dante Pazzanese",
    affiliation: "Instituto Dante Pazzanese de Cardiologia",
    room: "Auditório Dante Pazzanese",
    day: "Dia 31 de Julho",
    category: "Oclusões Crônicas (CTO)",
    duration: "34 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Oclusões totais crônicas (CTO) no laboratório de hemodinâmica: seleção de guias hidrofílicos, microcateteres e técnicas de reentrada subintimal controlada.",
    materials: [
      {
        id: "mat-9",
        name: "CTO_Tecnicas_Avancadas_Dante.pptx",
        format: "PPTX",
        size: "19.6 MB",
        description: "Algoritmo de cruzamento anterógrado e retrógrado"
      }
    ]
  },
  {
    id: "vimeo-1223744923",
    vimeoId: "1223744923",
    title: "Simpósio Dante Pazzanese - DANTE 003",
    speaker: "Corpo Clínico Dante Pazzanese",
    affiliation: "Instituto Dante Pazzanese de Cardiologia",
    room: "Auditório Dante Pazzanese",
    day: "Dia 31 de Julho",
    category: "Casos Ao Vivo",
    duration: "42 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-gravacao.png",
    description: "Transmissão ao vivo de angioplastia de alto risco com suporte circulatório mecânico temporário (Impella/ECMO) em pacientes com disfunção ventricular severa.",
    materials: [
      {
        id: "mat-10",
        name: "Suporte_Circulatorio_Mecanico_CHIP.pptx",
        format: "PPTX",
        size: "24.3 MB",
        description: "Apresentação completa do caso e dados hemodinâmicos"
      }
    ]
  },
  {
    id: "vimeo-1223744922",
    vimeoId: "1223744922",
    title: "Sessão Dante Pazzanese - MERIL 004",
    speaker: "Especialistas Convidados",
    affiliation: "Instituto Dante Pazzanese de Cardiologia",
    room: "Auditório Dante Pazzanese",
    day: "Dia 31 de Julho",
    category: "Estrutural Adulto",
    duration: "46 min",
    year: "2026",
    poster: "/assets/images/solaci-2026-confira.png",
    description: "Implante de prótese transcateter balão-expansível de última geração em estenose aórtica severa em anéis bicúspides e pequenos diâmetros.",
    materials: [
      {
        id: "mat-11",
        name: "Valvulas_Balao_Expansiveis_Meril.pptx",
        format: "PPTX",
        size: "20.8 MB",
        description: "Dados de seguimento ecocardiográfico e gradientes"
      }
    ]
  }
];

let currentSession = null;
let savedFavorites = JSON.parse(localStorage.getItem('cathlabflix_my_list') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  initPlayerApp();
});

function initPlayerApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id') || urlParams.get('v');

  // Seleciona a sessão correspondente ou a primeira por padrão
  let initial = PLAYER_SESSIONS.find(s => s.id === targetId || s.vimeoId === targetId);
  if (!initial) {
    initial = PLAYER_SESSIONS[0];
  }

  loadSession(initial, false);
  renderPlaylist();
  bindActionButtons();
  initTopSearch();
}

/**
 * Carrega a sessão no player e atualiza todos os componentes
 */
function loadSession(session, updateHistory = true) {
  currentSession = session;

  // 1. Atualizar Iframe do Player Vimeo (16:9)
  const iframeContainer = document.getElementById('playerIframeStage');
  if (iframeContainer) {
    const vimeoUrl = `https://player.vimeo.com/video/${session.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&color=e50914`;
    iframeContainer.innerHTML = `
      <iframe 
        src="${vimeoUrl}" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture" 
        allowfullscreen
        title="${escapeHtml(session.title)}"
      ></iframe>
    `;
  }

  // 2. Atualizar Metadados da Aula
  const titleEl = document.getElementById('lessonMainTitle');
  if (titleEl) titleEl.textContent = session.title;

  const categoryBadge = document.getElementById('lessonCategoryBadge');
  if (categoryBadge) categoryBadge.textContent = session.category;

  const dayBadge = document.getElementById('lessonDayBadge');
  if (dayBadge) dayBadge.textContent = session.day;

  const roomBadge = document.getElementById('lessonRoomBadge');
  if (roomBadge) roomBadge.textContent = session.room;

  const speakerNameEl = document.getElementById('lessonSpeakerName');
  if (speakerNameEl) speakerNameEl.textContent = session.speaker;

  const speakerAffiliationEl = document.getElementById('lessonSpeakerAffiliation');
  if (speakerAffiliationEl) speakerAffiliationEl.textContent = session.affiliation;

  const speakerAvatarEl = document.getElementById('lessonSpeakerAvatar');
  if (speakerAvatarEl) {
    speakerAvatarEl.textContent = getInitials(session.speaker);
  }

  const descEl = document.getElementById('lessonDescription');
  if (descEl) descEl.textContent = session.description;

  const breadcrumbCurrent = document.getElementById('breadcrumbCurrentLesson');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = session.title;

  // 3. Atualizar Estado do Botão Minha Lista
  updateMyListButtonState();

  // 4. Renderizar Materiais de Apoio (PPTX)
  renderMaterials(session.materials);

  // 5. Atualizar seleção na Playlist lateral
  updatePlaylistSelection();

  // 6. Atualizar URL e Título da Página
  document.title = `${session.title} | CathlabFlix Sessions`;

  if (updateHistory) {
    const newUrl = `${window.location.pathname}?id=${session.id}`;
    window.history.pushState({ sessionId: session.id }, session.title, newUrl);
  }
}

/**
 * Renderiza os cards de download de materiais (PPTX / PDF)
 */
function renderMaterials(materials) {
  const container = document.getElementById('materialsGrid');
  const countBadge = document.getElementById('materialsCountBadge');

  if (!container) return;

  if (!materials || materials.length === 0) {
    container.innerHTML = `
      <div style="padding: 20px; background: #FFFFFF; border-radius: 16px; border: 1px dashed rgba(0,0,0,0.1); color: var(--color-text-secondary); font-size: 0.875rem; text-align: center;">
        Nenhum material complementar anexado a esta aula.
      </div>
    `;
    if (countBadge) countBadge.textContent = '0 arquivos';
    return;
  }

  if (countBadge) {
    countBadge.textContent = `${materials.length} ${materials.length === 1 ? 'arquivo' : 'arquivos'}`;
  }

  container.innerHTML = materials.map(mat => {
    const isPptx = mat.format.toLowerCase().includes('ppt');
    const badgeColor = isPptx ? '#fee2e2' : '#e0f2fe';
    const iconColor = isPptx ? 'var(--color-primary)' : '#0284c7';

    return `
      <div class="file-card-horizontal" data-material-id="${mat.id}">
        <div class="file-info-left">
          <div class="file-icon-badge" style="background: ${badgeColor}; color: ${iconColor};">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="file-text-details">
            <div class="file-name" title="${escapeHtml(mat.name)}">${escapeHtml(mat.name)}</div>
            <div class="file-meta">${mat.format} • ${mat.size} • ${escapeHtml(mat.description || 'Material oficial')}</div>
          </div>
        </div>

        <button 
          type="button" 
          class="file-download-btn" 
          title="Baixar ${escapeHtml(mat.name)}"
          aria-label="Baixar ${escapeHtml(mat.name)}"
          onclick="handleDownloadMaterial('${escapeHtml(mat.name)}')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}

/**
 * Renderiza a lista de próximas aulas na coluna direita (Playlist)
 */
function renderPlaylist() {
  const container = document.getElementById('playlistItemsContainer');
  const counterPill = document.getElementById('playlistCounterPill');

  if (!container) return;

  if (counterPill) {
    counterPill.textContent = `${PLAYER_SESSIONS.length} AULAS`;
  }

  container.innerHTML = PLAYER_SESSIONS.map((session, index) => {
    const isActive = currentSession && currentSession.id === session.id;

    return `
      <div 
        class="playlist-item-card ${isActive ? 'active' : ''}" 
        data-session-id="${session.id}"
        onclick="onPlaylistItemClick('${session.id}')"
        role="button"
        tabindex="0"
        aria-label="Assistir ${escapeHtml(session.title)}"
      >
        <div class="playlist-item-thumb">
          <img src="${session.poster}" alt="${escapeHtml(session.title)}" loading="lazy">
          <span class="playlist-thumb-duration">${session.duration}</span>
        </div>

        <div class="playlist-item-content">
          ${isActive ? `
            <span class="playlist-now-playing-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Assistindo
            </span>
          ` : `
            <span style="font-size: 0.6875rem; color: var(--color-text-tertiary); font-weight: 600;">
              Aula 0${index + 1}
            </span>
          `}
          <h4 class="playlist-item-title">${escapeHtml(session.title)}</h4>
          <span class="playlist-item-speaker">${escapeHtml(session.speaker)}</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Atualiza classe ativa na playlist sem re-renderizar todo o HTML
 */
function updatePlaylistSelection() {
  const cards = document.querySelectorAll('.playlist-item-card');
  cards.forEach((card, index) => {
    const sid = card.getAttribute('data-session-id');
    const isNowActive = currentSession && currentSession.id === sid;

    if (isNowActive) {
      card.classList.add('active');
      const content = card.querySelector('.playlist-item-content');
      const tag = card.querySelector('.playlist-now-playing-tag');
      if (!tag && content) {
        const span = document.createElement('span');
        span.className = 'playlist-now-playing-tag';
        span.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Assistindo
        `;
        content.prepend(span);
      }
    } else {
      card.classList.remove('active');
      const tag = card.querySelector('.playlist-now-playing-tag');
      if (tag) tag.remove();
    }
  });
}

/**
 * Manipulador de clique em item da playlist
 */
window.onPlaylistItemClick = function(sessionId) {
  const selected = PLAYER_SESSIONS.find(s => s.id === sessionId);
  if (selected) {
    loadSession(selected, true);

    // No mobile (< 992px), rola suavemente para o player
    if (window.innerWidth < 992) {
      const stage = document.getElementById('playerIframeStage');
      if (stage) {
        stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
};

/**
 * Eventos dos botões de ação (Minha Lista, Compartilhar, Baixar Slides)
 */
function bindActionButtons() {
  const myListBtn = document.getElementById('lessonMyListBtn');
  if (myListBtn) {
    myListBtn.addEventListener('click', toggleMyList);
  }

  const shareBtn = document.getElementById('lessonShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', shareLesson);
  }

  const scrollSlidesBtn = document.getElementById('lessonDownloadSlidesBtn');
  if (scrollSlidesBtn) {
    scrollSlidesBtn.addEventListener('click', () => {
      const section = document.getElementById('materialsSection');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

/**
 * Alterna aula atual na Minha Lista (Favoritos)
 */
function toggleMyList() {
  if (!currentSession) return;

  const idx = savedFavorites.indexOf(currentSession.id);
  if (idx === -1) {
    savedFavorites.push(currentSession.id);
    showToast('Aula adicionada à sua Minha Lista!');
  } else {
    savedFavorites.splice(idx, 1);
    showToast('Aula removida da sua Minha Lista.');
  }

  localStorage.setItem('cathlabflix_my_list', JSON.stringify(savedFavorites));
  updateMyListButtonState();
}

function updateMyListButtonState() {
  const btn = document.getElementById('lessonMyListBtn');
  if (!btn || !currentSession) return;

  const isSaved = savedFavorites.includes(currentSession.id);
  if (isSaved) {
    btn.classList.add('saved');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Salvo na Lista
    `;
  } else {
    btn.classList.remove('saved');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Minha Lista
    `;
  }
}

/**
 * Compartilhar link da aula
 */
function shareLesson() {
  if (!currentSession) return;

  const shareUrl = `${window.location.origin}/new/player?id=${currentSession.id}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link da aula copiado para a área de transferência!');
    }).catch(() => {
      fallbackShare(shareUrl);
    });
  } else {
    fallbackShare(shareUrl);
  }
}

function fallbackShare(text) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast('Link da aula copiado!');
}

/**
 * Simulação amigável de download de material
 */
window.handleDownloadMaterial = function(fileName) {
  showToast(`Iniciando download de: ${fileName}...`);

  // Simula trigger de download
  setTimeout(() => {
    showToast(`Download de "${fileName}" concluído!`);
  }, 1500);
};

/**
 * Exibe notificação flutuante (Toast)
 */
function showToast(message) {
  let toast = document.getElementById('playerToastFeedback');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'playerToastFeedback';
    toast.className = 'toast-feedback';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  toast.classList.add('active');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/**
 * Busca rápida na topbar
 */
function initTopSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        window.location.href = `/new?q=${encodeURIComponent(q)}`;
      }
    }
  });
}

// Suporte ao botão voltar/avançar do navegador
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.sessionId) {
    const s = PLAYER_SESSIONS.find(x => x.id === e.state.sessionId);
    if (s) loadSession(s, false);
  }
});

// Helpers utilitários
function getInitials(name) {
  if (!name) return 'CL';
  const clean = name.replace(/^Dr\.\s*|^Dra\.\s*/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
