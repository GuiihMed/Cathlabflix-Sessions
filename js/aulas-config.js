/**
 * Cathlabflix Sessions - Configuração e Estrutura da Grade de Aulas PPTX (/solaci/aulas)
 * 
 * Hierarquia de Navegação:
 * - Apenas por Dias: Dia 29, Dia 30, Dia 31
 * - Títulos das aulas sincronizados com a página oficial de gravações
 * 
 * Hook preparado para integração com a API da pasta do Google Drive.
 */

// Configuração para futura conexão com a API do Google Drive
const GOOGLE_DRIVE_CONFIG = {
  enabled: false,
  folderId: '', // Será preenchido com o ID da pasta do Google Drive
  apiKey: '',   // Chave de API caso necessário
  driveEndpoint: 'https://www.googleapis.com/drive/v3/files'
};

// Grade Estrutural por Dias com nomes reais das aulas de Gravação
const AULAS_SCHEDULE = {
  days: [
    {
      id: "dia-29",
      name: "Dia 29",
      label: "Dia 29",
      subtitle: "29 de Outubro",
      aulas: [
        {
          id: "aula-29-01",
          title: "08-45 - 10-00 - Opening & Vision - The Future Of Interventional Cardiology 2026",
          file: {
            name: "08-45 - 10-00 - Opening & Vision - The Future Of Interventional Cardiology 2026.pptx",
            size: "34.20MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-02",
          title: "10-00 - 11-00 - Lecture & National Live Case - Support - Meril Life Science",
          file: {
            name: "10-00 - 11-00 - Lecture & National Live Case - Meril.pptx",
            size: "28.50MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-03",
          title: "11-00 - 12-00 - Lecture & National Live Case - Support - Lepu",
          file: {
            name: "11-00 - 12-00 - Lecture & National Live Case - Lepu.pptx",
            size: "22.80MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-04",
          title: "12-00 - 13-00 - Scientific Talk - Advancing From Long-Term Evidence To Next-Generation Design - Support - Venus",
          file: {
            name: "12-00 - 13-00 - Scientific Talk - Venus.pptx",
            size: "31.10MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-05",
          title: "13-00 - 14-00 - Lecture & International Case - Support - Medtronic",
          file: {
            name: "13-00 - 14-00 - Lecture & International Case - Medtronic.pptx",
            size: "26.40MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-06",
          title: "14-00 - 15-00 - Lecture & International Live Case - Support - Boston Scientific",
          file: {
            name: "14-00 - 15-00 - Lecture & International Live Case - Boston Scientific.pptx",
            size: "38.39MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-07",
          title: "15-30 - 16-00 - Pulmonary Embolism - From Risk Stratification To Advanced Therapies - Support - Penumbra",
          file: {
            name: "15-30 - 16-00 - Pulmonary Embolism - Penumbra.pptx",
            size: "19.75MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-08",
          title: "16-00 - 17-00 - Mechanical Circulatory Support - From High-Risk Pci To Cardiogenic Shock",
          file: {
            name: "16-00 - 17-00 - Mechanical Circulatory Support.pptx",
            size: "41.60MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-09",
          title: "17-00 - 18-00 - Coronary Physiology In Debate - Wires, Algorithms, And The Battle For Guidance",
          file: {
            name: "17-00 - 18-00 - Coronary Physiology In Debate.pptx",
            size: "29.90MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-10",
          title: "18-00 - 19-00 - Solaci-Sbhci Awards Ceremony",
          file: {
            name: "18-00 - 19-00 - Solaci-Sbhci Awards Ceremony.pptx",
            size: "15.30MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-11",
          title: "Dr. Edgar",
          file: {
            name: "Dr. Edgar - Heart Team Presentation.pptx",
            size: "23.40MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-12",
          title: "01 - SOLACI INCOR - Dr Carlos Campos",
          file: {
            name: "01 - SOLACI INCOR - Dr Carlos Campos.pptx",
            size: "27.50MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-13",
          title: "02 - SOLACI INCOR - Dr Raul Arrieta - 003",
          file: {
            name: "02 - SOLACI INCOR - Dr Raul Arrieta - 003.pptx",
            size: "33.10MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-14",
          title: "03 - SOLACI INCOR - Dr Carlos Campos - 002",
          file: {
            name: "03 - SOLACI INCOR - Dr Carlos Campos - 002.pptx",
            size: "30.45MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-29-15",
          title: "04 - SOLACI INCOR - Dr Raul Arrieta - 004",
          file: {
            name: "04 - SOLACI INCOR - Dr Raul Arrieta - 004.pptx",
            size: "36.80MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        }
      ]
    },
    {
      id: "dia-30",
      name: "Dia 30",
      label: "Dia 30",
      subtitle: "30 de Outubro",
      aulas: [
        {
          id: "aula-30-01",
          title: "08-00 - 09-00 - From Calcium To Compliance - Contemporary Atherectomy Strategies",
          file: {
            name: "08-00 - 09-00 - From Calcium To Compliance.pptx",
            size: "32.10MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-02",
          title: "09-00 - 10-00 - Live Case - Support - Microport",
          file: {
            name: "09-00 - 10-00 - Live Case - Microport.pptx",
            size: "25.60MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-03",
          title: "10-30 - 11-15 - Non-Left Main Bifurcation Pci - Strategy, Devices, And Decision-Making At The Edge",
          file: {
            name: "10-30 - 11-15 - Non-Left Main Bifurcation Pci.pptx",
            size: "29.40MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-04",
          title: "11-15 - 12-00 - National Live Case - Support - Shockwave",
          file: {
            name: "11-15 - 12-00 - National Live Case - Shockwave.pptx",
            size: "21.90MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-05",
          title: "12-00 - 13-00 - Scientific Talk - Modern Pci In Practice - See. Prep. Treat. From Strategy To Case Discussion - Support - Boston Sci",
          file: {
            name: "12-00 - 13-00 - Scientific Talk - Modern Pci In Practice - Boston Sci.pptx",
            size: "35.80MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-06",
          title: "13-00 - 14-00 - Lecture & International Live Case - Support - Boston Scientific",
          file: {
            name: "13-00 - 14-00 - Lecture & International Live Case - Boston Scientific.pptx",
            size: "37.20MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-07",
          title: "14-00 - 14-30 - Shockwave Ivl In Complex Pci - From Procedural Strategy To Proven Clinical Impact - Support - Shockwave",
          file: {
            name: "14-00 - 14-30 - Shockwave Ivl In Complex Pci.pptx",
            size: "24.50MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-08",
          title: "14-30 - 15-00 - Coronary Calcium Case Theater - Cracking The Toughest Lesions",
          file: {
            name: "14-30 - 15-00 - Coronary Calcium Case Theater.pptx",
            size: "27.30MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-09",
          title: "16-15 - 17-00 - Joint Session Crf - Tavi Durability In 2026 - Evidence, Gaps, And What Comes Next",
          file: {
            name: "16-15 - 17-00 - Joint Session Crf - Tavi Durability In 2026.pptx",
            size: "39.10MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-30-10",
          title: "17-00 - 18-00 - Updates In Mitral Valve-In-Valve Interventions & Live Case - Support - Edwards Lifesciences",
          file: {
            name: "17-00 - 18-00 - Updates In Mitral Valve-In-Valve - Edwards.pptx",
            size: "33.70MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        }
      ]
    },
    {
      id: "dia-31",
      name: "Dia 31",
      label: "Dia 31",
      subtitle: "31 de Outubro",
      aulas: [
        {
          id: "aula-31-01",
          title: "08-00 - 09-00 - Stable Cad And Multivessel Disease",
          file: {
            name: "08-00 - 09-00 - Stable Cad And Multivessel Disease.pptx",
            size: "28.90MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-02",
          title: "09-00 - 10-00 - Lecture & Live Case",
          file: {
            name: "09-00 - 10-00 - Lecture & Live Case.pptx",
            size: "30.15MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-03",
          title: "10-30 - 11-00 - The Future Of Pci - Technology, Intelligence, And The End Of Conventional Workflows - Part 2",
          file: {
            name: "10-30 - 11-00 - The Future Of Pci - Part 2.pptx",
            size: "26.80MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-04",
          title: "12-00 - 13-00 - Scientific Talk - Crdn - Innovations In Cardiovascular Intervention - Support - Medtronic",
          file: {
            name: "12-00 - 13-00 - Scientific Talk - Crdn - Medtronic.pptx",
            size: "31.40MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-05",
          title: "13-00 - 13-30 - Complex Acs Presentation",
          file: {
            name: "13-00 - 13-30 - Complex Acs Presentation.pptx",
            size: "18.20MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-06",
          title: "13-30 - 13-56 - Boston Scientific Calcium Challenge",
          file: {
            name: "13-30 - 13-56 - Boston Scientific Calcium Challenge.pptx",
            size: "22.30MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-07",
          title: "13-56 - 14-30 - Best Elca Cases Biomedical-Philips",
          file: {
            name: "13-56 - 14-30 - Best Elca Cases Biomedical-Philips.pptx",
            size: "25.10MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-08",
          title: "15-00 - 16-15 - Solaci-Sbhci Best Case And Abstract Award Cerimony",
          file: {
            name: "15-00 - 16-15 - Solaci-Sbhci Best Case And Abstract Award.pptx",
            size: "20.50MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-09",
          title: "16-15 - 16-30 - Closing Ceremony",
          file: {
            name: "16-15 - 16-30 - Closing Ceremony.pptx",
            size: "14.80MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-10",
          title: "MEDITRONIC - 001",
          file: {
            name: "MEDITRONIC - 001.pptx",
            size: "32.40MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-11",
          title: "SMT - 002",
          file: {
            name: "SMT - 002.pptx",
            size: "24.90MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-12",
          title: "DANTE - 003",
          file: {
            name: "DANTE - 003.pptx",
            size: "29.70MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        },
        {
          id: "aula-31-13",
          title: "MERIL - 004",
          file: {
            name: "MERIL - 004.pptx",
            size: "27.30MB",
            format: "PPTX",
            downloadUrl: "#",
            driveFileId: ""
          }
        }
      ]
    }
  ]
};
