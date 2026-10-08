/**
 * CathlabFlix Modern Post - Lógica da Página Interna de Notícias (/new/post)
 * Renderiza o post completo, galeria de imagem sem corte e sugestões
 */

document.addEventListener('DOMContentLoaded', () => {
  initPostPage();
  initHamburgerDrawer();
  initThemeSwitcher();
});

async function initPostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id') || urlParams.get('slug');

  const loadingEl = document.getElementById('postLoadingState');
  const articleEl = document.getElementById('postArticleWrapper');

  try {
    const res = await fetch('/api/wix-news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = data.items || [];

    if (!items.length) {
      throw new Error('Nenhum post encontrado no feed.');
    }

    // Busca o post por ID ou slug, ou pega o primeiro como fallback
    let currentPost = null;
    if (postId) {
      currentPost = items.find(item => item.id === postId || item.slug === postId || item.link.includes(postId));
    }
    if (!currentPost) {
      currentPost = items[0];
    }

    renderPost(currentPost);
    renderRelatedPosts(items, currentPost.id);

    if (loadingEl) loadingEl.style.display = 'none';
    if (articleEl) articleEl.style.display = 'flex';

  } catch (error) {
    console.error('[Post Error]', error);
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--color-text-secondary);">
          <p>Não foi possível carregar este artigo no momento.</p>
          <a href="/new" class="btn-pill-primary" style="margin-top: 16px; display: inline-flex;">Voltar ao Início</a>
        </div>
      `;
    }
  }
}

function renderPost(post) {
  document.title = `${post.title} - CathlabFlix`;

  // Breadcrumbs
  const crumbEl = document.getElementById('postBreadcrumbCurrent');
  if (crumbEl) crumbEl.textContent = post.title;

  // Header
  const categoryEl = document.getElementById('postCategoryBadge');
  if (categoryEl) categoryEl.textContent = post.category || 'Notícia';

  const dateEl = document.getElementById('postDate');
  if (dateEl) dateEl.textContent = post.formattedDate || '';

  const titleEl = document.getElementById('postMainTitle');
  if (titleEl) titleEl.textContent = post.title;

  const leadEl = document.getElementById('postLeadSummary');
  if (leadEl) leadEl.textContent = post.description;

  // Imagem Destacada (Ajustada sem corte)
  const imgEl = document.getElementById('postFeaturedImg');
  if (imgEl) {
    imgEl.src = post.image || '/assets/images/og-cathlabflix.png';
    imgEl.alt = post.title;
  }

  // Corpo do Artigo
  const bodyEl = document.getElementById('postContentParagraphs');
  if (bodyEl) {
    const paragraphs = getDetailedParagraphs(post);
    bodyEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Banner Especial se for do SOLACI 2026
  const solaciBanner = document.getElementById('postSolaciCtaBanner');
  if (solaciBanner) {
    const isSolaci = post.title.toLowerCase().includes('solaci') || post.description.toLowerCase().includes('solaci');
    solaciBanner.style.display = isSolaci ? 'flex' : 'none';
  }

  // Compartilhamento
  bindShareButtons(post);
}

function getDetailedParagraphs(post) {
  // Se o item já tiver corpo completo
  if (post.fullBody && Array.isArray(post.fullBody) && post.fullBody.length) {
    return post.fullBody;
  }

  const titleLower = post.title.toLowerCase();

  if (titleLower.includes('solaci')) {
    return [
      `Já estão disponíveis no CathlabFlix os conteúdos e principais discussões do Congresso SOLACI-SBHCI 2026, um dos maiores encontros de Cardiologia Intervencionista da América Latina. O evento, realizado entre os dias 29 e 31 de julho de 2026, no World Trade Center, em São Paulo (SP), agora tem seus destaques acessíveis de forma versátil na plataforma.`,
      `A disponibilização do material foi pensada para apoiar a educação médica continuada, adaptando-se à rotina dos profissionais. Para isso, o acervo foi organizado em dois formatos complementares:`,
      `<strong>• Cobertura:</strong> Uma seleção de vídeos dinâmicos, com foco nas redes sociais, que reúnem entrevistas exclusivas e os melhores momentos das atividades científicas.`,
      `<strong>• Gravação:</strong> Acesso na íntegra a algumas das principais sessões do congresso, permitindo que o usuário assista a discussões aprofundadas, simpósios e apresentações completas no seu próprio ritmo.`,
      `O lançamento reforça o compromisso da plataforma em centralizar o conhecimento e facilitar o acesso à atualização científica de excelência para hemodinamicistas e cardiologistas intervencionistas de todo o Brasil e da América Latina.`
    ];
  }

  if (titleLower.includes('webinar jovem')) {
    return [
      `A SBHCI realizou mais uma edição do Webinar Jovem SBHCI, iniciativa voltada ao desenvolvimento científico e profissional dos médicos em formação e jovens especialistas da Hemodinâmica e Cardiologia Intervencionista.`,
      `O encontro reuniu especialistas convidados para discutir desafios da carreira, atualização científica, rotina no laboratório de hemodinâmica e as perspectivas futuras da especialidade. A programação também destacou a importância da educação continuada e da troca de experiências entre diferentes gerações de intervencionistas.`,
      `A gravação e os principais destaques discutidos estão disponíveis para consulta no CathlabFlix, promovendo a capacitação técnica contínua.`
    ];
  }

  if (titleLower.includes('valve-in-valve')) {
    return [
      `O procedimento de Valve-in-Valve Mitral vem consolidando seu espaço como alternativa terapêutica para pacientes com disfunção de biopróteses mitrais, especialmente em casos de maior risco cirúrgico.`,
      `O tema foi abordado em conteúdo educacional que apresentou aspectos fundamentais do planejamento e da execução do procedimento, incluindo avaliação anatômica, seleção de pacientes, técnicas de imagem e estratégias para prevenção de complicações.`,
      `O avanço das terapias estruturais tem ampliado as possibilidades de tratamento minimamente invasivo, reforçando a importância do constante aprimoramento técnico e da discussão multidisciplinar no Heart Team.`
    ];
  }

  if (titleLower.includes('curso para intervencionistas')) {
    return [
      `Já está disponível o Módulo 1 do Curso para Intervencionistas em Formação, iniciativa educacional desenvolvida para apoiar médicos em treinamento na área de Hemodinâmica e Cardiologia Intervencionista.`,
      `O curso foi estruturado para abordar os principais fundamentos da especialidade, reunindo aulas teóricas, conteúdos práticos e materiais de apoio voltados à formação técnica e científica dos participantes.`,
      `A proposta busca contribuir para o desenvolvimento das competências essenciais do intervencionista moderno, promovendo uma base sólida de conhecimento aliada à prática clínica segura.`
    ];
  }

  // Fallback genérico a partir da descrição
  return [
    post.description,
    `A iniciativa reforça a missão da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista (SBHCI) em disponibilizar educação médica continuada de alta qualidade acessível a especialistas e residentes de todo o país.`,
    `Para mais informações e conteúdos relacionados, continue navegando pelo portal CathlabFlix.`
  ];
}

function renderRelatedPosts(items, currentId) {
  const container = document.getElementById('postRelatedGrid');
  if (!container) return;

  const related = items.filter(it => it.id !== currentId).slice(0, 3);
  if (!related.length) {
    document.getElementById('postRelatedSection').style.display = 'none';
    return;
  }

  container.innerHTML = related.map(item => `
    <article class="post-related-card">
      <div class="post-related-thumb-box">
        <img 
          src="${item.image}" 
          alt="${escapeHTML(item.title)}" 
          class="post-related-thumb"
          loading="lazy"
          onerror="this.src='/assets/images/og-cathlabflix.png'"
        >
      </div>
      <div class="post-related-content">
        <span class="post-related-date">${item.formattedDate || ''}</span>
        <h4 class="post-related-title">
          <a href="/new/post?id=${encodeURIComponent(item.id)}" style="color: inherit; text-decoration: none;">
            ${escapeHTML(item.title)}
          </a>
        </h4>
        <a href="/new/post?id=${encodeURIComponent(item.id)}" style="font-size: 0.8125rem; font-weight: 700; color: var(--color-primary); text-decoration: none; margin-top: auto; display: inline-flex; align-items: center; gap: 4px;">
          Confira <span>&rarr;</span>
        </a>
      </div>
    </article>
  `).join('');
}

function bindShareButtons(post) {
  const copyBtn = document.getElementById('postShareCopyBtn');
  const whatsappBtn = document.getElementById('postShareWhatsappBtn');

  const currentUrl = window.location.href;

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        showToast('Link do artigo copiado com sucesso!');
      } catch (e) {
        showToast('Não foi possível copiar o link.');
      }
    });
  }

  if (whatsappBtn) {
    const text = encodeURIComponent(`${post.title}\n\nConfira no CathlabFlix: ${currentUrl}`);
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${text}`;
    whatsappBtn.target = '_blank';
  }
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 2800);
}

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

  // Fechar ao clicar fora do dropdown
  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('active')) return;
    if (!drawer.contains(e.target) && (!hamburgerBtn || !hamburgerBtn.contains(e.target))) {
      closeDrawer();
    }
  });

  // Fechar no ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Fechar ao clicar em qualquer link interno do menu
  drawer.querySelectorAll('.dropdown-nav-link, .drawer-nav-link, .dropdown-featured-card').forEach(link => {
    link.addEventListener('click', () => closeDrawer());
  });
}

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
