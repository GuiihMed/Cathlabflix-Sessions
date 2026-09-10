/**
 * Vercel Serverless Function: Proxy Seguro para a API do Vimeo
 * 
 * Bypassa limitações de CORS de navegadores fazendo a requisição servidor-a-servidor
 * com o Bearer Token do Vimeo.
 */

export default async function handler(req, res) {
  // Configuração de CORS permissivo para permitir embed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { folderId } = req.query;
  if (!folderId) {
    return res.status(400).json({ error: 'O parâmetro folderId é obrigatório.' });
  }

  const token = process.env.VIMEO_TOKEN || 'dcfc518d6c38756016a3330df5ef8e5f';
  const userId = '1803190';

  try {
    const endpoint = `https://api.vimeo.com/users/${userId}/projects/${encodeURIComponent(folderId)}/videos?fields=uri,name,description,duration,created_time,player_embed_url,embed.html,tags,pictures&per_page=50`;
    
    const vimeoRes = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    });

    if (!vimeoRes.ok) {
      const err = await vimeoRes.text();
      return res.status(vimeoRes.status).json({ error: `Erro na API do Vimeo (${vimeoRes.status}): ${err}` });
    }

    const data = await vimeoRes.json();
    // Cache de 5 minutos na borda da Vercel
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('[API Proxy Error]', error);
    return res.status(500).json({ error: error.message || 'Erro interno do servidor.' });
  }
}
