/**
 * Vercel Serverless Function: API de Eventos CathlabFlix & SBHCI
 * Integração bidirecional com Coleção Wix CMS "Eventos" e embeds externos.
 */

import { INITIAL_EVENTS } from '../js/events-data.js';

// Cache em memória para eventos cadastrados durante o runtime
let customRuntimeEvents = [];

export default async function handler(req, res) {
  // CORS permissivo para permitir embeds de qualquer origem (Wix, Vercel, localhost)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ==============================================================
  // POST: Cadastrar novo evento e sincronizar com o Wix CMS
  // ==============================================================
  if (req.method === 'POST') {
    try {
      const data = req.body || {};
      if (!data.title || !data.date) {
        return res.status(400).json({
          success: false,
          error: 'Os campos "title" e "date" são obrigatórios.'
        });
      }

      // Regra: se endDate não for informado, replica a data de início
      const finalEndDate = data.endDate && data.endDate.trim() !== '' ? data.endDate.trim() : data.date.trim();

      // Gerar slug amigável
      const slug = data.slug || slugify(data.title) + '-' + Date.now().toString(36);

      // Mapeamento do tipo e badge
      const type = data.type || 'evento';
      const badge = data.badge || (type === 'apoio_sbhci' ? 'APOIO SBHCI' : (type === 'eventos' ? 'EVENTOS' : 'EVENTO OFICIAL SBHCI'));

      const newEvent = {
        id: slug,
        slug: slug,
        title: data.title.trim(),
        date: data.date.trim(),
        endDate: finalEndDate,
        time: data.time ? data.time.trim() : 'Horário a definir',
        location: data.location ? data.location.trim() : 'CathlabFlix Streaming',
        type: type,
        badge: badge,
        image: data.image ? data.image.trim() : 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
        registrationUrl: data.registrationUrl ? data.registrationUrl.trim() : '',
        description: data.description ? data.description.trim() : '',
        createdAt: new Date().toISOString()
      };

      // Adiciona ao cache em memória
      customRuntimeEvents.unshift(newEvent);

      // Se houver endpoint configurado para o Wix CMS, repassar o POST
      const wixEndpoint = process.env.WIX_EVENTS_ENDPOINT || req.query.wix_endpoint;
      let wixSynced = false;
      let wixResponse = null;

      if (wixEndpoint) {
        try {
          const wixRes = await fetch(wixEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
          });
          if (wixRes.ok) {
            wixSynced = true;
            wixResponse = await wixRes.json().catch(() => null);
          }
        } catch (wixErr) {
          console.warn('[wix-events] Erro ao sincronizar com endpoint Wix:', wixErr.message);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Evento cadastrado com sucesso!',
        item: newEvent,
        wixSynced: wixSynced,
        wixResponse: wixResponse
      });

    } catch (postErr) {
      return res.status(500).json({
        success: false,
        error: postErr.message
      });
    }
  }

  // ==============================================================
  // GET: Consultar eventos (do Wix CMS ou Base Local)
  // ==============================================================
  try {
    const { tipo, busca, id, wix_endpoint } = req.query;
    const wixEndpoint = process.env.WIX_EVENTS_ENDPOINT || wix_endpoint;

    let allEvents = [];

    // Tenta carregar do Wix CMS se configurado
    if (wixEndpoint) {
      try {
        const wixRes = await fetch(wixEndpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3500)
        });
        if (wixRes.ok) {
          const wixData = await wixRes.json();
          const items = Array.isArray(wixData) ? wixData : (wixData.items || []);
          if (items.length > 0) {
            allEvents = items.map(mapWixItemToStandard);
          }
        }
      } catch (e) {
        console.warn('[wix-events] Falha ao consultar endpoint Wix CMS, usando base local:', e.message);
      }
    }

    // Se não carregou do Wix ou retornou vazio, usa INITIAL_EVENTS + customRuntimeEvents
    if (allEvents.length === 0) {
      const base = (INITIAL_EVENTS || []).slice();
      const map = new Map();
      base.forEach(ev => map.set(ev.id, ev));
      customRuntimeEvents.forEach(ev => map.set(ev.id, ev));
      allEvents = Array.from(map.values());
    }

    // Busca específica por ID ou Slug
    if (id) {
      const cleanId = id.toLowerCase();
      const found = allEvents.find(e => (e.id && e.id.toLowerCase() === cleanId) || (e.slug && e.slug.toLowerCase() === cleanId));
      if (found) {
        return res.status(200).json({ success: true, item: found });
      }
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }

    // Filtros
    let filtered = allEvents;

    if (tipo) {
      const cleanTipo = tipo.toLowerCase();
      filtered = filtered.filter(e => 
        (e.type && e.type.toLowerCase().includes(cleanTipo)) ||
        (e.badge && e.badge.toLowerCase().includes(cleanTipo))
      );
    }

    if (busca) {
      const q = busca.toLowerCase();
      filtered = filtered.filter(e => 
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q))
      );
    }

    // Ordenação cronológica crescente
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Cache de borda Vercel de 60s
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    return res.status(200).json({
      success: true,
      count: filtered.length,
      items: filtered
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapWixItemToStandard(item) {
  const isApoio = (item.type && item.type.toLowerCase().includes('apoio')) || (item.badge && item.badge.includes('APOIO'));
  const isGeral = (item.type && item.type.toLowerCase() === 'eventos') || (item.badge && item.badge.toLowerCase() === 'eventos');
  return {
    id: item._id || item.slug || slugify(item.title || item.Title),
    slug: item.slug || slugify(item.title || item.Title),
    title: item.title || item.Title || 'Evento sem título',
    date: item.date || item.eventDate || '',
    endDate: item.endDate || item.date || '',
    time: item.time || item.timeText || 'Horário a definir',
    location: item.location || 'CathlabFlix Streaming',
    type: isApoio ? 'apoio_sbhci' : (isGeral ? 'eventos' : 'evento'),
    badge: item.badge || (isApoio ? 'APOIO SBHCI' : (isGeral ? 'EVENTOS' : 'EVENTO OFICIAL SBHCI')),
    image: item.image || item.bannerImage || 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    registrationUrl: item.registrationUrl || item.actionUrl || '',
    description: item.description || ''
  };
}
