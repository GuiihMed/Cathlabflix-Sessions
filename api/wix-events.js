/**
 * Vercel Serverless Function: API de Eventos CathlabFlix & SBHCI
 * Permite leitura de eventos por embeds, sites externos e integração Wix
 */

import { INITIAL_EVENTS } from '../js/events-data.js';

export default async function handler(req, res) {
  // CORS permissivo para permitir embeds de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const events = (INITIAL_EVENTS || []).slice();

    // Filtros opcionais via query parameters
    const { tipo, busca, id } = req.query;

    let filtered = events;

    if (id) {
      const found = events.find(e => e.id.toLowerCase() === id.toLowerCase());
      if (found) {
        return res.status(200).json({ success: true, item: found });
      }
      return res.status(404).json({ success: false, message: 'Evento não encontrado' });
    }

    if (tipo) {
      filtered = filtered.filter(e => e.type === tipo);
    }

    if (busca) {
      const q = busca.toLowerCase();
      filtered = filtered.filter(e => 
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
        (e.location && e.location.toLowerCase().includes(q))
      );
    }

    // Cache de borda na Vercel
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
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
