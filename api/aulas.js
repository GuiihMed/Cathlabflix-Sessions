/**
 * Cathlabflix Sessions - Vercel Serverless Function: API Google Drive (/api/aulas)
 * 
 * Consome uma pasta pública do Google Drive via Google Drive API v3.
 * Agrupa as aulas automaticamente por Dias (subpastas "Dia 29", "Dia 30", "Dia 31"
 * ou por padrão de nome de arquivo), formata tamanhos de PPTX e gera links diretos de download.
 */

export default async function handler(req, res) {
  // Configuração CORS permissiva
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = (process.env.GOOGLE_DRIVE_API_KEY || req.query.apiKey || '').trim();
  const rootFolderId = (process.env.GOOGLE_DRIVE_FOLDER_ID || req.query.folderId || '').trim();

  // Se ainda não configurou chave ou ID de pasta, retorna instrução amigável
  if (!apiKey || !rootFolderId) {
    return res.status(200).json({
      configured: false,
      message: 'Configure as variáveis de ambiente GOOGLE_DRIVE_API_KEY e GOOGLE_DRIVE_FOLDER_ID na Vercel.',
      missing: {
        apiKey: !apiKey,
        folderId: !rootFolderId
      },
      days: []
    });
  }

  try {
    // 1. Busca os itens dentro da pasta raiz
    const driveEndpoint = `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(rootFolderId)}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)&pageSize=100&key=${apiKey}`;
    
    const rootRes = await fetch(driveEndpoint);
    if (!rootRes.ok) {
      const errText = await rootRes.text();
      return res.status(rootRes.status).json({
        error: `Erro na API do Google Drive (${rootRes.status})`,
        details: errText
      });
    }

    const rootData = await rootRes.json();
    const items = rootData.files || [];

    // Separa subpastas e arquivos diretos na raiz
    const subfolders = items.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
    const directFiles = items.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');

    let scheduleDays = [];

    // Cenário A: Existem subpastas (ex: "Dia 29", "Dia 30", "Dia 31")
    if (subfolders.length > 0) {
      // Ordena subpastas por nome
      subfolders.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      for (const folder of subfolders) {
        const folderEndpoint = `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(folder.id)}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)&pageSize=100&key=${apiKey}`;
        const subRes = await fetch(folderEndpoint);

        let files = [];
        if (subRes.ok) {
          const subData = await subRes.json();
          files = (subData.files || []).filter(f => f.mimeType !== 'application/vnd.google-apps.folder');
        }

        scheduleDays.push({
          id: slugify(folder.name),
          name: folder.name,
          label: folder.name,
          subtitle: `Arquivos da pasta ${folder.name}`,
          aulas: files.map(file => formatAulaItem(file, folder.name))
        });
      }
    } else {
      // Cenário B: Arquivos colocados diretamente na pasta raiz
      // Agrupa automaticamente por dia caso haja "Dia 29", "Dia 30" no nome, ou coloca em dia padrão
      const day29 = [];
      const day30 = [];
      const day31 = [];
      const outros = [];

      directFiles.forEach(file => {
        const lower = file.name.toLowerCase();
        if (lower.includes('dia 29') || lower.includes('dia29') || lower.includes('29-10') || lower.includes('29/10')) {
          day29.push(formatAulaItem(file, 'Dia 29'));
        } else if (lower.includes('dia 30') || lower.includes('dia30') || lower.includes('30-10') || lower.includes('30/10')) {
          day30.push(formatAulaItem(file, 'Dia 30'));
        } else if (lower.includes('dia 31') || lower.includes('dia31') || lower.includes('31-10') || lower.includes('31/10')) {
          day31.push(formatAulaItem(file, 'Dia 31'));
        } else {
          outros.push(formatAulaItem(file, 'Geral'));
        }
      });

      if (day29.length > 0 || day30.length > 0 || day31.length > 0) {
        if (day29.length > 0) scheduleDays.push({ id: 'dia-29', name: 'Dia 29', label: 'Dia 29', subtitle: '29 de Outubro', aulas: day29 });
        if (day30.length > 0) scheduleDays.push({ id: 'dia-30', name: 'Dia 30', label: 'Dia 30', subtitle: '30 de Outubro', aulas: day30 });
        if (day31.length > 0) scheduleDays.push({ id: 'dia-31', name: 'Dia 31', label: 'Dia 31', subtitle: '31 de Outubro', aulas: day31 });
        if (outros.length > 0) scheduleDays.push({ id: 'outras-aulas', name: 'Outras Aulas', label: 'Outras Aulas', subtitle: 'Apresentações Complementares', aulas: outros });
      } else {
        // Se não houver menção aos dias, agrupa todos na grade
        scheduleDays.push({
          id: 'todas-aulas',
          name: 'Todas as Aulas',
          label: 'Apresentações',
          subtitle: `${directFiles.length} arquivos disponíveis`,
          aulas: directFiles.map(file => formatAulaItem(file, 'Geral'))
        });
      }
    }

    // Cache de 120s na borda da Vercel para alta velocidade e economia de requisições ao Google Drive
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

    return res.status(200).json({
      configured: true,
      totalFiles: scheduleDays.reduce((acc, d) => acc + d.aulas.length, 0),
      days: scheduleDays
    });

  } catch (error) {
    console.error('[API Google Drive Error]', error);
    return res.status(500).json({
      error: 'Erro interno ao consultar o Google Drive.',
      message: error.message
    });
  }
}

/**
 * Converte arquivo bruto do Drive no formato limpo da aula
 */
function formatAulaItem(file, dayName) {
  const cleanTitle = cleanFileName(file.name);
  const sizeFormatted = formatFileSize(file.size);
  const isPptx = file.name.toLowerCase().endsWith('.pptx') || file.name.toLowerCase().endsWith('.ppt');
  const format = isPptx ? 'PPTX' : (file.name.split('.').pop() || 'ARQUIVO').toUpperCase();

  // Link direto de download do Google Drive para arquivos públicos
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
  const viewUrl = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;

  return {
    id: file.id,
    title: cleanTitle,
    day: dayName,
    rawName: file.name,
    viewUrl: viewUrl,
    file: {
      id: file.id,
      name: file.name,
      size: sizeFormatted,
      format: format,
      downloadUrl: downloadUrl,
      viewUrl: viewUrl
    }
  };
}

function cleanFileName(fileName) {
  if (!fileName) return 'Apresentação Sem Título';
  return fileName
    .replace(/\.[^/.]+$/, '')          // Remove extensão (.pptx, .pdf)
    .replace(/^\[.*?\]\s*/, '')         // Remove tags iniciais [Dia 29]
    .replace(/^dia\s*\d+\s*[-_]?\s*/i, '') // Remove prefixos "Dia 29 - "
    .replace(/_/g, ' ')                 // Troca underscores por espaços
    .replace(/\s+/g, ' ')               // Normaliza espaços múltiplos
    .trim();
}

function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Disponível';
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
