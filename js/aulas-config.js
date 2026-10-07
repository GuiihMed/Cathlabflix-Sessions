/**
 * Cathlabflix Sessions - Configuração e Estrutura da Grade de Aulas PPTX (/solaci/aulas)
 * 
 * Estrutura:
 * - Abas canônicas: Dia 29, Dia 30, Dia 31 (29 a 31 de Julho de 2026)
 * - Conexão ativa com o Google Drive oficial do SOLACI SBHCI 2026
 */

// Configuração oficial da pasta e API Key do Google Drive
const GOOGLE_DRIVE_CONFIG = {
  enabled: true,
  folderId: '1SMalStl1bf2r3gLhf_61RZv-eDLRembQ',
  apiKey: 'AIzaSyAsrt8IpND3OpSwfBw6-yAiPVxP49TYGeU',
  driveEndpoint: 'https://www.googleapis.com/drive/v3/files'
};

// Estrutura inicial dos 3 dias canônicos (atualizada dinamicamente pela API /api/aulas)
const AULAS_SCHEDULE = {
  days: [
    {
      id: "dia-29",
      name: "Dia 29",
      label: "Dia 29",
      subtitle: "29 de Julho",
      dateStr: "29 de Julho de 2026",
      rooms: ["Todas as Salas"],
      aulas: []
    },
    {
      id: "dia-30",
      name: "Dia 30",
      label: "Dia 30",
      subtitle: "30 de Julho",
      dateStr: "30 de Julho de 2026",
      rooms: ["Todas as Salas"],
      aulas: []
    },
    {
      id: "dia-31",
      name: "Dia 31",
      label: "Dia 31",
      subtitle: "31 de Julho",
      dateStr: "31 de Julho de 2026",
      rooms: ["Todas as Salas"],
      aulas: []
    }
  ]
};
