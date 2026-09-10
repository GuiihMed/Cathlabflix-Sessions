/**
 * Cathlabflix Sessions - Script Auxiliar de Descoberta Automática de Pastas
 * 
 * Este script consulta a API do Vimeo a partir da sua pasta principal "Gravações" (ID: 30421333),
 * busca automaticamente as subpastas de Dias (Dia 29, 30, 31) e as subpastas de Salas,
 * gerando a estrutura JSON exata para o js/config.js.
 * 
 * Como rodar:
 * node scripts/inspect-vimeo-folders.js SEU_TOKEN_DO_VIMEO
 */

const https = require('https');

const USER_ID = "1803190";
const ROOT_FOLDER_ID = "30421333";
const ACCESS_TOKEN = process.argv[2] || process.env.VIMEO_TOKEN || "";

if (!ACCESS_TOKEN) {
  console.log("\n❌ Token de acesso do Vimeo não fornecido!");
  console.log("\nComo usar este script:");
  console.log("  node scripts/inspect-vimeo-folders.js SEU_TOKEN_DO_VIMEO\n");
  console.log("Para gerar seu token:");
  console.log("  1. Acesse https://developer.vimeo.com/apps");
  console.log("  2. Crie um app e gere um Personal Access Token com escopos 'public', 'private', 'video_files'");
  process.exit(1);
}

function vimeoFetch(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vimeo.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN.trim()}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4',
        'User-Agent': 'Cathlabflix-Session-Inspector'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Vimeo API Erro ${res.statusCode}: ${json.error || json.message || data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log(`\n🔍 Conectando à API do Vimeo para o Usuário ${USER_ID}...`);
  console.log(`📂 Mapeando subpastas a partir da pasta raiz 'Gravações' (ID: ${ROOT_FOLDER_ID})...\n`);

  try {
    // 1. Busca os dias dentro da pasta raiz
    const daysResponse = await vimeoFetch(`/users/${USER_ID}/projects/${ROOT_FOLDER_ID}/items?filter=folders&per_page=50`);
    const dayFolders = daysResponse.data ? daysResponse.data.map(item => item.folder || item) : [];

    if (dayFolders.length === 0) {
      console.log("⚠️ Nenhuma subpasta encontrada dentro da pasta Gravações.");
      return;
    }

    console.log(`✅ Encontradas ${dayFolders.length} pastas de dias:`);
    const resultDays = [];

    // 2. Para cada dia, busca as pastas de salas
    for (const day of dayFolders) {
      const dayId = day.uri.replace('/projects/', '').replace('/users/' + USER_ID + '/projects/', '');
      console.log(`  📅 [${day.name}] (ID da Pasta: ${dayId})`);

      const roomsResponse = await vimeoFetch(`/users/${USER_ID}/projects/${dayId}/items?filter=folders&per_page=50`);
      const roomFolders = roomsResponse.data ? roomsResponse.data.map(item => item.folder || item) : [];

      const mappedRooms = roomFolders.map((room, idx) => {
        const roomId = room.uri.replace('/projects/', '').replace('/users/' + USER_ID + '/projects/', '');
        console.log(`     🚪 Sala: ${room.name} -> folder_id: ${roomId}`);
        return {
          id: `sala-0${idx + 1}`,
          name: room.name,
          folder_id: roomId
        };
      });

      resultDays.push({
        id: day.name.toLowerCase().replace(/\s+/g, '-'),
        label: day.name,
        rooms: mappedRooms
      });
    }

    console.log("\n=======================================================");
    console.log("📋 ESTRUTURA GERADA PARA COLAR EM js/config.js:");
    console.log("=======================================================\n");
    console.log("const EVENT_SCHEDULE = " + JSON.stringify({ days: resultDays }, null, 2) + ";\n");

  } catch (error) {
    console.error("❌ Erro durante a inspeção:", error.message);
  }
}

run();
