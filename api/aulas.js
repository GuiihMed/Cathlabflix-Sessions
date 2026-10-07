/**
 * Cathlabflix Sessions - Vercel Serverless Function: API Google Drive (/api/aulas)
 * 
 * Consome a pasta oficial do Google Drive do SOLACI SBHCI 2026.
 * Agrupa as apresentações automaticamente por Dias (Dia 29, Dia 30, Dia 31),
 * por Salas/Arenas (Heart Team, Structural, Crossroads, Nursing, Peripheral, Training),
 * formata horários, palestrantes, tamanhos de PPTX e links diretos de download.
 */

// Cache em memória na instância da Serverless Function (TTL: 10 minutos)
let cachedData = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

export default async function handler(req, res) {
  // Headers CORS permissivos para acesso via web ou iframes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Permite override via query params ou variáveis de ambiente, com fallback para as credenciais oficiais
  const apiKey = (process.env.GOOGLE_DRIVE_API_KEY || req.query.apiKey || 'AIzaSyAsrt8IpND3OpSwfBw6-yAiPVxP49TYGeU').trim();
  const rootFolderId = (process.env.GOOGLE_DRIVE_FOLDER_ID || req.query.folderId || '1SMalStl1bf2r3gLhf_61RZv-eDLRembQ').trim();

  const forceRefresh = req.query.refresh === 'true';
  const now = Date.now();

  // Se houver cache válido em memória, responde instantaneamente (~20ms)
  if (!forceRefresh && cachedData && (now - lastCacheTime < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(cachedData);
  }

  try {
    // 1. Busca as salas/arenas na pasta raiz do Drive
    const rootItems = await listDriveFolder(rootFolderId, apiKey);
    const roomFolders = rootItems.filter(f => f.mimeType === 'application/vnd.google-apps.folder');

    // 2. Busca os arquivos de cada sala/arena em paralelo
    const roomPromises = roomFolders.map(async (room) => {
      const roomChildren = await listDriveFolder(room.id, apiKey);
      const roomFiles = [];

      for (const child of roomChildren) {
        if (child.mimeType === 'application/vnd.google-apps.folder') {
          // Subpasta de dia (ex: 29-07, 30-07, 31-07)
          const dayTag = detectDayTag(child.name);
          if (dayTag) {
            const files = await collectDayFiles(child.id, room.name, dayTag, apiKey);
            roomFiles.push(...files);
          } else {
            // Nível intermediário (ex: TRAINING HALL THEATER)
            const nestedChildren = await listDriveFolder(child.id, apiKey);
            for (const nested of nestedChildren) {
              if (nested.mimeType === 'application/vnd.google-apps.folder') {
                const nestedDayTag = detectDayTag(nested.name);
                if (nestedDayTag) {
                  const files = await collectDayFiles(nested.id, room.name, nestedDayTag, apiKey);
                  roomFiles.push(...files);
                }
              }
            }
          }
        }
      }
      return roomFiles;
    });

    const allFilesNested = await Promise.all(roomPromises);
    const allFiles = allFilesNested.flat();

    // 3. Organiza os arquivos nos 3 dias canônicos do congresso
    const dayMap = {
      'dia-29': {
        id: 'dia-29',
        name: 'Dia 29',
        label: 'Dia 29',
        subtitle: '29 de Julho',
        dateStr: '29 de Julho de 2026',
        aulas: []
      },
      'dia-30': {
        id: 'dia-30',
        name: 'Dia 30',
        label: 'Dia 30',
        subtitle: '30 de Julho',
        dateStr: '30 de Julho de 2026',
        aulas: []
      },
      'dia-31': {
        id: 'dia-31',
        name: 'Dia 31',
        label: 'Dia 31',
        subtitle: '31 de Julho',
        dateStr: '31 de Julho de 2026',
        aulas: []
      }
    };

    allFiles.forEach(file => {
      const dayKey = file.day || 'dia-29';
      if (dayMap[dayKey]) {
        dayMap[dayKey].aulas.push(formatAula(file));
      }
    });

    // 4. Ordena as apresentações dentro de cada dia por Horário -> Sala -> Título
    const daysArray = Object.values(dayMap).map(day => {
      // Ordena por horário e depois título
      day.aulas.sort((a, b) => {
        if (a.time && b.time && a.time !== b.time) {
          return a.time.localeCompare(b.time);
        }
        if (a.room && b.room && a.room !== b.room) {
          return a.room.localeCompare(b.room);
        }
        return a.title.localeCompare(b.title);
      });

      // Extrai lista única de salas presentes no dia
      const uniqueRooms = ['Todas as Salas', ...new Set(day.aulas.map(a => a.room).filter(Boolean))];

      return {
        ...day,
        totalAulas: day.aulas.length,
        rooms: uniqueRooms
      };
    });

    const responsePayload = {
      configured: true,
      lastSync: new Date().toISOString(),
      totalFiles: allFiles.length,
      days: daysArray
    };

    // Atualiza cache em memória
    cachedData = responsePayload;
    lastCacheTime = now;

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error('[API Google Drive Error]', error);
    return res.status(500).json({
      error: 'Erro ao consultar o Google Drive.',
      message: error.message
    });
  }
}

/**
 * Consulta itens de uma pasta no Drive (com paginação e pageSize 1000)
 */
async function listDriveFolder(folderId, apiKey) {
  let allFiles = [];
  let pageToken = null;

  do {
    const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const url = `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(folderId)}'+in+parents+and+trashed=false&fields=nextPageToken,files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)&pageSize=1000&key=${apiKey}${pageParam}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Falha ao ler pasta ${folderId} (${res.status}): ${text}`);
    }
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      allFiles.push(...data.files);
    }
    pageToken = data.nextPageToken || null;
  } while (pageToken);

  return allFiles;
}

/**
 * Coleta recursivamente os arquivos de um dia específico
 */
async function collectDayFiles(folderId, roomName, dayTag, apiKey) {
  const items = await listDriveFolder(folderId, apiKey);
  const files = [];

  for (const item of items) {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      const subFiles = await collectDayFiles(item.id, roomName, dayTag, apiKey);
      files.push(...subFiles);
    } else if (isValidPresentationFile(item.name)) {
      files.push({
        ...item,
        room: roomName,
        day: dayTag
      });
    }
  }

  return files;
}

/**
 * Filtra arquivos relevantes (ignora Thumbs.db, temporários e vídeos soltos)
 */
function isValidPresentationFile(fileName) {
  if (!fileName || fileName.startsWith('.') || fileName === 'Thumbs.db') return false;
  const lower = fileName.toLowerCase();
  // Prioriza apresentações (.pptx, .ppt, .pdf, .key)
  return lower.endsWith('.pptx') || lower.endsWith('.ppt') || lower.endsWith('.pdf') || lower.endsWith('.key');
}

/**
 * Detecta qual dia corresponde pelo nome da pasta (ex: 29-07, 30-07, 31-07)
 */
function detectDayTag(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('29')) return 'dia-29';
  if (lower.includes('30')) return 'dia-30';
  if (lower.includes('31')) return 'dia-31';
  return null;
}

/**
 * Formata um arquivo bruto do Drive em um objeto padronizado de Aula
 */
function formatAula(file) {
  const parsed = parseFileName(file.name);
  const sizeFormatted = formatFileSize(file.size);
  const lowerName = file.name.toLowerCase();
  let format = 'PPTX';
  if (lowerName.endsWith('.pdf')) format = 'PDF';
  else if (lowerName.endsWith('.key')) format = 'KEYNOTE';
  else if (lowerName.endsWith('.ppt')) format = 'PPT';
  else if (lowerName.endsWith('.pptx')) format = 'PPTX';
  else format = (file.name.split('.').pop() || 'ARQUIVO').toUpperCase();

  // Link direto de download do Google Drive
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
  const viewUrl = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;

  return {
    id: file.id,
    title: parsed.title,
    speaker: parsed.speaker,
    time: parsed.time,
    room: file.room,
    day: file.day,
    rawName: file.name,
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

/**
 * Extrai horário, palestrante e título limpo a partir do nome do arquivo
 */
function parseFileName(name) {
  let clean = name.replace(/\.[^/.]+$/, '').trim(); // Remove extensão
  clean = clean.replace(/-\d{3}$/, '').trim();      // Remove sufixo "-002"
  clean = clean.replace(/\(VIDEO SEM AUDIO\)/gi, '').replace(/\(AULA GRAVADA\)/gi, '').trim();

  // Extrai horário se presente (ex: 18H00, 09H00, 10H35)
  const timeMatch = clean.match(/(\d{1,2}H\d{2})/i);
  const time = timeMatch ? timeMatch[1].toUpperCase().replace('H', ':') : '';

  // Remove prefixos de sala, data e hora para deixar o nome do palestrante/tema em evidência
  clean = clean.replace(/^[A-Z\s&]+\s+\d{2}-\d{2}\s+/i, '');
  clean = clean.replace(/^\d{1,2}H\d{2}\s+/i, '');
  clean = clean.replace(/^SLIDE\s+/i, '');
  clean = clean.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    title: clean || name,
    speaker: clean || 'Especialista Convidado',
    time: time
  };
}

/**
 * Formata bytes em KB, MB ou GB
 */
function formatFileSize(bytes) {
  const num = Number(bytes || 0);
  if (!num || isNaN(num)) return 'Disponível';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
