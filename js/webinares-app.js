/**
 * CathlabFlix by SBHCI - Módulo de Webinares com IA
 * Controla a listagem no Hub e a interatividade da Página de Detalhe do Webinar.
 */

(function () {
  'use strict';

  // Verifica se a base de dados de webinares está disponível
  if (typeof WEBINARES_DATA === 'undefined') {
    console.error('WEBINARES_DATA não encontrada. Certifique-se de carregar /js/webinares-data.js antes.');
    return;
  }

  // =========================================================================
  // 1. HUB DE WEBINARES (Listagem, Filtros por Categoria e Busca em Tempo Real)
  // =========================================================================
  function initWebinaresHub() {
    const gridContainer = document.getElementById('webinaresGrid');
    const filterButtons = document.querySelectorAll('.wb-chip-btn');
    const searchInput = document.getElementById('wbSearchInput');

    if (!gridContainer) return; // Não é a página do Hub

    let currentFilter = 'all';
    let searchQuery = '';

    function renderCards() {
      const filtered = WEBINARES_DATA.filter(item => {
        const matchesCategory = currentFilter === 'all' || item.categorySlug === currentFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          item.title.toLowerCase().includes(q) || 
          item.category.toLowerCase().includes(q) || 
          (item.summary && item.summary.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px;">
            <p style="font-size: 1.1rem; color: var(--wb-text-muted); margin-bottom: 12px;">Nenhum webinar encontrado para esta busca ou categoria.</p>
            <button type="button" class="wb-chip-btn active" id="wbResetFiltersBtn">Limpar filtros</button>
          </div>
        `;
        const resetBtn = document.getElementById('wbResetFiltersBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentFilter = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'all'));
            renderCards();
          });
        }
        return;
      }

      gridContainer.innerHTML = filtered.map(item => `
        <article class="webinar-card" data-category="${item.categorySlug}">
          <div class="webinar-card-thumb-wrapper">
            <img 
              src="${item.thumbnail}" 
              alt="${item.title}" 
              class="webinar-card-thumb" 
              loading="lazy"
            >
            <a href="/new/webinar?id=${item.id}" class="webinar-card-play-overlay" aria-label="Assistir ${item.title}">
              <div class="webinar-card-play-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </a>
          </div>

          <div class="webinar-card-body">
            <div class="webinar-card-meta">
              <span class="webinar-card-date">${item.dateFormatted}</span>
            </div>

            <h3 class="webinar-card-title">
              <a href="/new/webinar?id=${item.id}" title="${item.title}">${item.title}</a>
            </h3>

            <div class="webinar-card-actions">
              <a href="/new/webinar?id=${item.id}" class="wb-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Assistir Webinar
              </a>
            </div>
          </div>
        </article>
      `).join('');
    }

    // Eventos de filtro
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';
        renderCards();
      });
    });

    // Eventos de busca
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCards();
      });
    }

    renderCards();
  }

  // =========================================================================
  // 2. DETALHE DO WEBINAR (Player, Abas, Infográfico com Zoom, Quiz Interativo)
  // =========================================================================
  function initWebinarDetail() {
    const detailContainer = document.getElementById('webinarDetailContainer');
    if (!detailContainer) return; // Não é a página de detalhe

    // Obter ID da URL (?id=...) ou padrão 'magic-touch'
    const urlParams = new URLSearchParams(window.location.search);
    const webinarId = urlParams.get('id') || 'magic-touch';
    const webinar = getWebinarById(webinarId);

    // Atualizar título da página dinamicamente mantendo o padrão oficial
    document.title = `CathlabFlix by SBHCI`;

    // Atualizar breadcrumbs e cabeçalho
    const breadcrumbCurrent = document.getElementById('wbBreadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = webinar.shortTitle;

    const titleEl = document.getElementById('wbTitle');
    if (titleEl) titleEl.textContent = webinar.title;

    const categoryEl = document.getElementById('wbCategory');
    if (categoryEl) categoryEl.textContent = webinar.category;

    const dateEl = document.getElementById('wbDate');
    if (dateEl) dateEl.textContent = webinar.dateFormatted;

    const durationEl = document.getElementById('wbDuration');
    if (durationEl) durationEl.textContent = webinar.duration;

    // Renderizar Seletor Rápido de Sessões
    const sessionsList = document.getElementById('wbSessionsPillList');
    if (sessionsList) {
      sessionsList.innerHTML = WEBINARES_DATA.map(item => `
        <a href="/new/webinar?id=${item.id}" class="wb-session-pill ${item.id === webinar.id ? 'active' : ''}">
          ${item.shortTitle}
        </a>
      `).join('');
    }

    // Renderizar Player de Vídeo Principal (Vimeo 16:9 responsivo)
    const videoWrapper = document.getElementById('wbVideoWrapper');
    if (videoWrapper) {
      const vimeoUrl = `https://player.vimeo.com/video/${webinar.vimeoId}?autoplay=0&title=0&byline=0&portrait=0&color=e50914`;
      videoWrapper.innerHTML = `
        <iframe 
          src="${vimeoUrl}" 
          class="webinar-video-iframe" 
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
          referrerpolicy="strict-origin-when-cross-origin"
          title="${webinar.title}"
        ></iframe>
      `;
    }

    // Atualizar Links de IA na Sidebar Lateral
    const quizLink = document.getElementById('wbAiQuizLink');
    if (quizLink) {
      quizLink.href = webinar.notebookLm.quizUrl || '#quiz';
      quizLink.addEventListener('click', (e) => {
        if (!webinar.notebookLm.quizUrl) {
          e.preventDefault();
          switchTab('tab-quiz');
        }
      });
    }

    const flashcardsLink = document.getElementById('wbAiFlashcardsLink');
    if (flashcardsLink) {
      flashcardsLink.href = webinar.notebookLm.flashcardsUrl || webinar.notebookLm.notebookUrl;
    }

    const notebookLink = document.getElementById('wbAiNotebookLink');
    if (notebookLink) {
      notebookLink.href = webinar.notebookLm.notebookUrl;
    }

    const pdfSidebarLink = document.getElementById('wbAiPdfLink');
    if (pdfSidebarLink) {
      pdfSidebarLink.href = webinar.pdfUrl;
    }

    // Preencher Conteúdo das Abas:
    // 1. Aba Resumo
    const summaryPanel = document.getElementById('panel-resumo');
    if (summaryPanel) {
      summaryPanel.innerHTML = webinar.summary;
    }

    // 2. Aba Relatório da Aula
    const reportPanel = document.getElementById('panel-relatorio');
    if (reportPanel) {
      reportPanel.innerHTML = webinar.fullReport;
    }

    // 3. Aba Infográfico HD com Zoom
    const infographicImg = document.getElementById('wbInfographicImg');
    const infographicTitle = document.getElementById('wbInfographicTitle');
    const infographicDownload = document.getElementById('wbInfographicDownload');
    if (infographicImg) infographicImg.src = webinar.infographicUrl;
    if (infographicTitle) infographicTitle.textContent = webinar.infographicTitle || 'Infográfico Oficial em Alta Resolução';
    if (infographicDownload) infographicDownload.href = webinar.infographicUrl;

    // 4. Aba Áudios e Podcasts
    const audiosContainer = document.getElementById('wbAudiosContainer');
    if (audiosContainer) {
      audiosContainer.innerHTML = webinar.audios.map(audio => `
        <div class="audio-track-card" data-audio-id="${audio.id}">
          <div class="audio-track-header">
            <div class="audio-track-meta">
              <h4>${audio.title.replace(/_/g, ' ')}</h4>
              <div class="audio-track-artist">${audio.artist} &bull; ${audio.duration}</div>
            </div>
            <span class="audio-track-type-badge">${audio.type}</span>
          </div>

          <p style="font-size: 0.88rem; color: var(--wb-text-muted); margin: 0;">${audio.desc}</p>

          <div class="audio-player-controls-row">
            <button type="button" class="audio-play-trigger-btn" aria-label="Reproduzir Áudio" data-track-id="${audio.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>

            <div class="audio-waveform-wrapper">
              <div class="audio-progress-bar-bg" data-track-id="${audio.id}">
                <div class="audio-progress-bar-fill" style="width: 0%;"></div>
              </div>
              <div class="audio-time-row">
                <span class="curr-time">00:00</span>
                <span class="total-time">${audio.duration}</span>
              </div>
            </div>

            <button type="button" class="audio-speed-btn" data-speed="1">1.0x</button>
          </div>
        </div>
      `).join('');

      initAudioPlayerInteractivity();
    }

    // 5. Aba Quiz Interativo com IA
    const quizContainer = document.getElementById('wbQuizContainer');
    if (quizContainer && webinar.quiz && webinar.quiz.length > 0) {
      renderQuiz(webinar.quiz);
    }

    // 6. Aba PDFs e Documentos
    const pdfsContainer = document.getElementById('wbPdfsContainer');
    if (pdfsContainer) {
      pdfsContainer.innerHTML = `
        <div class="pdf-download-card">
          <div class="pdf-info-left">
            <div class="pdf-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div class="pdf-info-text">
              <h4>${webinar.pdfTitle || 'Material Científico em PDF'}</h4>
              <p>Documento oficial complementar com esquemas anatômicos e dados de estudos clínicos.</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="${webinar.pdfUrl}" target="_blank" rel="noopener noreferrer" class="wb-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Baixar PDF Oficial
            </a>
          </div>
        </div>
      `;
    }

    // Sistema de Troca de Abas
    initTabs();

    // Controles de Zoom do Infográfico
    initInfographicZoom();

    // Salvar no Continue Assistindo
    if (typeof window.recordContinueWatchingSession === 'function') {
      window.recordContinueWatchingSession({
        id: webinar.id,
        title: webinar.title,
        category: webinar.category,
        date: webinar.dateFormatted,
        thumbnail: webinar.thumbnail,
        url: `/new/webinar?id=${webinar.id}`
      });
    }
  }

  // =========================================================================
  // 3. SISTEMA DE ABAS (Tab Switching)
  // =========================================================================
  function initTabs() {
    const tabButtons = document.querySelectorAll('.wb-tab-button');
    const tabPanels = document.querySelectorAll('.webinar-tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPanelId = btn.getAttribute('aria-controls');
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const activePanel = document.getElementById(targetPanelId);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Hash navigation (ex: #infografico)
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const matchedBtn = document.querySelector(`[aria-controls="panel-${hash}"]`);
      if (matchedBtn) matchedBtn.click();
    }
  }

  function switchTab(panelId) {
    const btn = document.querySelector(`[aria-controls="${panelId}"]`);
    if (btn) btn.click();
  }

  // =========================================================================
  // 4. ZOOM DO INFOGRÁFICO
  // =========================================================================
  function initInfographicZoom() {
    const img = document.getElementById('wbInfographicImg');
    const canvas = document.getElementById('wbInfographicCanvas');
    const zoomInBtn = document.getElementById('wbZoomInBtn');
    const zoomOutBtn = document.getElementById('wbZoomOutBtn');
    const zoomResetBtn = document.getElementById('wbZoomResetBtn');

    if (!img) return;

    let scale = 1;
    const maxScale = 2.5;
    const minScale = 0.6;

    function applyScale() {
      img.style.transform = `scale(${scale})`;
      if (canvas) {
        canvas.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
      }
    }

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (scale < maxScale) {
          scale += 0.25;
          applyScale();
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (scale > minScale) {
          scale -= 0.25;
          applyScale();
        }
      });
    }

    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        scale = 1;
        applyScale();
      });
    }

    if (canvas) {
      canvas.addEventListener('click', (e) => {
        if (e.target === zoomInBtn || e.target === zoomOutBtn || e.target === zoomResetBtn) return;
        if (scale === 1) {
          scale = 1.6;
        } else {
          scale = 1;
        }
        applyScale();
      });
    }
  }

  // =========================================================================
  // 5. PLAYER DE ÁUDIO & CONTROLES
  // =========================================================================
  function initAudioPlayerInteractivity() {
    const cards = document.querySelectorAll('.audio-track-card');

    cards.forEach(card => {
      const playBtn = card.querySelector('.audio-play-trigger-btn');
      const fillBar = card.querySelector('.audio-progress-bar-fill');
      const bgBar = card.querySelector('.audio-progress-bar-bg');
      const currTimeEl = card.querySelector('.curr-time');
      const speedBtn = card.querySelector('.audio-speed-btn');

      let isPlaying = false;
      let progress = 0;
      let interval = null;
      let playbackRate = 1;

      function updateProgress() {
        progress += (1 * playbackRate);
        if (progress > 100) {
          progress = 0;
          stopAudio();
          return;
        }
        fillBar.style.width = `${progress}%`;
        const totalSeconds = 120; // Aproximação visual
        const curSec = Math.floor((progress / 100) * totalSeconds);
        const m = String(Math.floor(curSec / 60)).padStart(2, '0');
        const s = String(curSec % 60).padStart(2, '0');
        currTimeEl.textContent = `${m}:${s}`;
      }

      function startAudio() {
        isPlaying = true;
        playBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
        interval = setInterval(updateProgress, 1000);
      }

      function stopAudio() {
        isPlaying = false;
        playBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
        if (interval) clearInterval(interval);
      }

      playBtn.addEventListener('click', () => {
        if (!isPlaying) {
          // Pausa outros
          document.querySelectorAll('.audio-track-card').forEach(c => {
            if (c !== card) {
              const b = c.querySelector('.audio-play-trigger-btn');
              if (b && b.dataset.activeAudio === 'true') {
                b.click();
              }
            }
          });
          playBtn.dataset.activeAudio = 'true';
          startAudio();
        } else {
          playBtn.dataset.activeAudio = 'false';
          stopAudio();
        }
      });

      if (bgBar) {
        bgBar.addEventListener('click', (e) => {
          const rect = bgBar.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          progress = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
          fillBar.style.width = `${progress}%`;
        });
      }

      if (speedBtn) {
        const speeds = [1, 1.25, 1.5, 2];
        let sIdx = 0;
        speedBtn.addEventListener('click', () => {
          sIdx = (sIdx + 1) % speeds.length;
          playbackRate = speeds[sIdx];
          speedBtn.textContent = `${playbackRate}x`;
        });
      }
    });
  }

  // =========================================================================
  // 6. QUIZ INTERATIVO COM AVALIAÇÃO EM TEMPO REAL E FEEDBACK
  // =========================================================================
  function renderQuiz(questions) {
    const container = document.getElementById('wbQuizContainer');
    if (!container) return;

    let score = 0;
    const answered = new Set();

    container.innerHTML = `
      <div class="quiz-component-box">
        <div class="quiz-header-status">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--wb-text-main); margin: 0 0 4px;">Quiz Interativo com IA</h3>
            <p style="font-size: 0.88rem; color: var(--wb-text-muted); margin: 0;">Teste seus conhecimentos clínicos sobre os principais tópicos abordados nesta aula.</p>
          </div>
          <div class="quiz-score-badge" id="wbQuizScoreBadge">
            Pontuação: <span id="wbQuizScoreNum">0</span> / ${questions.length}
          </div>
        </div>

        <div id="wbQuizQuestionsList">
          ${questions.map((q, qIdx) => `
            <div class="quiz-question-card" data-question-index="${qIdx}">
              <div class="quiz-question-title"><strong>Questão ${qIdx + 1}:</strong> ${q.question}</div>
              <div class="quiz-options-list">
                ${q.options.map((opt, optIdx) => `
                  <button 
                    type="button" 
                    class="quiz-option-btn" 
                    data-q-idx="${qIdx}" 
                    data-opt-idx="${optIdx}"
                  >
                    <span style="font-weight: 700; opacity: 0.7;">${String.fromCharCode(65 + optIdx)})</span>
                    <span>${opt}</span>
                  </button>
                `).join('')}
              </div>
              <div class="quiz-explanation-box" id="quizExp_${qIdx}">
                <strong>Explicação Clínica:</strong> ${q.explanation}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
          <button type="button" class="wb-chip-btn" id="wbQuizResetBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Reiniciar Quiz
          </button>
        </div>
      </div>
    `;

    const scoreNumEl = document.getElementById('wbQuizScoreNum');
    const optionBtns = container.querySelectorAll('.quiz-option-btn');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.dataset.qIdx, 10);
        const optIdx = parseInt(btn.dataset.optIdx, 10);

        if (answered.has(qIdx)) return; // Já respondeu
        answered.add(qIdx);

        const currentQ = questions[qIdx];
        const allBtnsForQ = container.querySelectorAll(`[data-q-idx="${qIdx}"]`);
        const explanationEl = document.getElementById(`quizExp_${qIdx}`);

        allBtnsForQ.forEach(b => {
          b.disabled = true;
          const idx = parseInt(b.dataset.optIdx, 10);
          if (idx === currentQ.correctIndex) {
            b.classList.add('correct');
          } else if (idx === optIdx) {
            b.classList.add('incorrect');
          }
        });

        if (optIdx === currentQ.correctIndex) {
          score++;
          if (scoreNumEl) scoreNumEl.textContent = String(score);
        }

        if (explanationEl) {
          explanationEl.classList.add('active');
        }
      });
    });

    const resetBtn = document.getElementById('wbQuizResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        renderQuiz(questions);
      });
    }
  }

  // =========================================================================
  // Inicialização Automática após Carregamento do DOM
  // =========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initWebinaresHub();
      initWebinarDetail();
    });
  } else {
    initWebinaresHub();
    initWebinarDetail();
  }

})();
