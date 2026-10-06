const https = require('https');

const ACCESS_TOKEN = "dcfc518d6c38756016a3330df5ef8e5f";
const USER_ID = "1803190";
const ROOT_FOLDER_ID = "30421333";

function vimeo(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.vimeo.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function start() {
  console.log("=== VIMEO SUBFOLDERS MAPPER ===");
  const root = await vimeo(`/users/${USER_ID}/projects/${ROOT_FOLDER_ID}/items?filter=folders&per_page=50`);
  
  if (!root.data) {
    console.log("Nenhum dado retornado:", root);
    return;
  }

  const days = [];

  for (const item of root.data) {
    const folder = item.folder || (item.type === 'folder' ? item : null);
    if (!folder || !folder.uri) continue;

    const folderId = folder.uri.split('/').pop();
    const folderName = folder.name;

    console.log(`\n📅 DIA ENCONTRADO: "${folderName}" | ID: ${folderId}`);

    // Busca subpastas dentro desse dia
    const roomsData = await vimeo(`/users/${USER_ID}/projects/${folderId}/items?per_page=50`);
    const rooms = [];

    if (roomsData.data) {
      for (const subItem of roomsData.data) {
        const roomFolder = subItem.folder || (subItem.type === 'folder' ? subItem : null);
        if (!roomFolder || !roomFolder.uri) {
          // Pode ser um vídeo solto na pasta do dia
          continue;
        }

        const roomId = roomFolder.uri.split('/').pop();
        const roomName = roomFolder.name;

        // Verifica vídeos da sala
        const vidsData = await vimeo(`/users/${USER_ID}/projects/${roomId}/videos?per_page=1`);
        const vidTotal = vidsData.total !== undefined ? vidsData.total : 0;

        console.log(`   🚪 SALA: "${roomName}" | folder_id: "${roomId}" | Vídeos: ${vidTotal}`);

        rooms.push({
          id: `sala-${roomId}`,
          name: roomName,
          folder_id: roomId,
          videoCount: vidTotal
        });
      }
    }

    days.push({
      id: folderName.toLowerCase().replace(/\s+/g, '-'),
      label: folderName,
      folder_id: folderId,
      rooms: rooms
    });
  }

  // Ordena os dias (Dia 29, Dia 30, Dia 31)
  days.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

  console.log("\n=======================================================");
  console.log("JSON FINAL PRONTO PARA USO:");
  console.log("=======================================================");
  console.log(JSON.stringify(days, null, 2));
}

start().catch(console.error);
