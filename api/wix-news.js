/**
 * Vercel Serverless Function: Leitor & Parser Automático do RSS do Wix Blog
 * Fonte: https://www.cathlabflix.org/blog-feed.xml
 */

export default async function handler(req, res) {
  // CORS permissivo para permitir consumo interno e de embeds
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const feedUrl = req.query.feedUrl || process.env.WIX_BLOG_FEED || 'https://www.cathlabflix.org/blog-feed.xml';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'CathlabFlix-News-Fetcher/1.0 (Mozilla/5.0 compatible)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Feed HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const items = parseRssItems(xmlText);

    // Cache de 5 minutos na borda da Vercel
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      success: true,
      source: feedUrl,
      updatedAt: new Date().toISOString(),
      count: items.length,
      items
    });

  } catch (error) {
    console.warn('[Wix News API] Falha ao buscar feed ao vivo, usando dados de contingência:', error.message);
    
    // Fallback elegante com as notícias oficiais do print
    const fallbackItems = getFallbackNews();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({
      success: true,
      isFallback: true,
      error: error.message,
      source: feedUrl,
      updatedAt: new Date().toISOString(),
      count: fallbackItems.length,
      items: fallbackItems
    });
  }
}

/**
 * Parser robusto de itens RSS XML para JSON
 */
function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemBlock = match[1];

    const title = extractTag(itemBlock, 'title');
    const descriptionRaw = extractTag(itemBlock, 'description');
    const link = extractTag(itemBlock, 'link');
    const pubDate = extractTag(itemBlock, 'pubDate');
    const guid = extractTag(itemBlock, 'guid');
    const category = extractTag(itemBlock, 'category') || 'Notícias';
    const creator = extractTag(itemBlock, 'dc:creator') || 'SBHCI';

    // Imagem do enclosure ou regex dentro do texto
    let image = '';
    const enclosureMatch = itemBlock.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
    if (enclosureMatch) {
      image = enclosureMatch[1];
    } else {
      const mediaMatch = itemBlock.match(/<media:content[^>]+url=["']([^"']+)["']/i);
      if (mediaMatch) {
        image = mediaMatch[1];
      } else {
        const imgMatch = descriptionRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          image = imgMatch[1];
        }
      }
    }

    // Se ainda não tiver imagem, usa placeholder temático da SBHCI
    if (!image) {
      image = '/assets/images/og-cathlabflix.png';
    }

    const cleanDescription = stripHtml(descriptionRaw);
    const formattedDate = formatDatePtBr(pubDate);

    // Extrai slug limpo do link/guid
    const slugMatch = (link || guid || '').match(/\/post\/([^/?#]+)/i);
    const slug = slugMatch ? slugMatch[1] : (guid ? guid.replace(/[^a-zA-Z0-9_-]/g, '-') : `post-${items.length + 1}`);

    // Tenta extrair conteúdo completo do blog se disponível
    const contentEncoded = extractTag(itemBlock, 'content:encoded');
    let fullBody = [];
    if (contentEncoded) {
      const pMatches = contentEncoded.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (pMatches) {
        fullBody = pMatches
          .map(p => stripHtml(p).trim())
          .filter(text => text.length > 20);
      }
    }

    // Todos os botões dos posts padronizados como 'Confira'
    const lowerTitle = (title || '').toLowerCase();
    const isCongress = lowerTitle.includes('solaci') || lowerTitle.includes('congresso');
    const internalAction = {
      label: 'Confira',
      url: isCongress ? '/new/solaci' : `/new/post?id=${encodeURIComponent(slug)}`,
      isInternal: true
    };

    items.push({
      id: slug || guid || String(items.length + 1),
      slug: slug,
      title: unescapeEntities(title),
      description: unescapeEntities(cleanDescription),
      fullBody: fullBody.length ? fullBody : null,
      link,
      image,
      category: unescapeEntities(category),
      creator,
      pubDate,
      formattedDate,
      internalAction
    });
  }

  return items;
}

function extractTag(xml, tag) {
  // Trata tags com ou sem CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const standardRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(standardRegex);
  return match ? match[1].trim() : '';
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unescapeEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function formatDatePtBr(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Notícias de contingência oficiais baseadas no print
 */
function getFallbackNews() {
  return [
    {
      id: 'solaci-2026-destaque',
      slug: 'conteudos-do-congresso-solaci-sbhci-2026-ganham-destaque-com-cobertura-multiplataforma',
      title: 'Conteúdos do Congresso SOLACI-SBHCI 2026 ganham destaque com cobertura multiplataforma',
      description: 'Já estão disponíveis no CathlabFlix os conteúdos e principais discussões do Congresso SOLACI-SBHCI 2026, um dos maiores encontros de Cardiologia Intervencionista da América Latina.',
      link: 'https://www.cathlabflix.org/post/conteudos-do-congresso-solaci-sbhci-2026-ganham-destaque-com-cobertura-multiplataforma',
      image: 'https://static.wixstatic.com/media/1d3d47_0e8baa2ca7354d62b8b17794f33d9e28~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Congresso',
      formattedDate: '23 Set 2026',
      internalAction: {
        label: 'Confira',
        url: '/new/post?id=solaci-2026-destaque',
        isInternal: true
      }
    },
    {
      id: 'cathlabflix-nova-era',
      slug: 'cathlabflix-inaugura-nova-era-da-educacao-em-cardiologia-intervencionista',
      title: 'CathlabFlix inaugura nova era da educação em Cardiologia Intervencionista',
      description: 'Desenvolvida para centralizar conteúdos da especialidade em um único ambiente, a plataforma reúne aulas, apresentações e materiais complementares de alta qualidade.',
      link: 'https://www.cathlabflix.org/post/cathlabflix-inaugura-nova-era-da-educacao-em-cardiologia-intervencionista',
      image: 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Institucional',
      formattedDate: '11 Mai 2026',
      internalAction: {
        label: 'Confira',
        url: '/new/post?id=cathlabflix-nova-era',
        isInternal: true
      }
    },
    {
      id: 'curso-intervencionistas-formacao',
      slug: 'curso-para-intervencionistas-em-formacao-inicia-com-foco-em-fundamentos-da-especialidade',
      title: 'Curso para Intervencionistas em Formação inicia com foco em fundamentos da especialidade',
      description: 'Já está disponível o Módulo 1 do Curso para Intervencionistas em Formação, iniciativa educacional desenvolvida para apoiar médicos em treinamento.',
      link: 'https://www.cathlabflix.org/post/curso-para-intervencionistas-em-formacao-inicia-com-foco-em-fundamentos-da-especialidade',
      image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Curso',
      formattedDate: '11 Mai 2026',
      internalAction: {
        label: 'Confira',
        url: '/new/post?id=curso-intervencionistas-formacao',
        isInternal: true
      }
    },
    {
      id: 'webinar-valve-in-valve',
      slug: 'valve-in-valve-mitral-ganha-destaque-em-conteudo-sobre-terapias-estruturais',
      title: 'Valve-in-Valve Mitral ganha destaque em conteúdo sobre terapias estruturais',
      description: 'O procedimento de Valve-in-Valve Mitral vem consolidando seu espaço como alternativa terapêutica para pacientes com disfunção de biopróteses mitrais.',
      link: 'https://www.cathlabflix.org/post/valve-in-valve-mitral-ganha-destaque-em-conteudo-sobre-terapias-estruturais',
      image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
      category: 'Webinar',
      formattedDate: '11 Mai 2026',
      internalAction: {
        label: 'Confira',
        url: '/new/post?id=webinar-valve-in-valve',
        isInternal: true
      }
    }
  ];
}
