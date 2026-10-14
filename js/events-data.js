/**
 * CathlabFlix - Base de Dados Oficial de Eventos e Congressos SBHCI
 * Compatível com Wix Data Collection e Armazenamento Local
 */

const INITIAL_EVENTS = [
  // ==========================================
  // OUTUBRO 2026
  // ==========================================
  {
    id: 'webinar-sbhci-outubro',
    title: 'Webinar SBHCI: Atualizações em Terapias Estruturais',
    subtitle: 'Discussão de casos de TAVI e Valve-in-Valve Mitral com especialistas renomados.',
    description: 'Neste webinar oficial da SBHCI, renomados intervencionistas debatem as melhores estratégias em intervenções valvares transcateter, com ênfase no planejamento tomográfico pré-TAVI, escolha de próteses balão-expansíveis versus autoexpansíveis e prevenção de oclusão coronariana em procedimentos Valve-in-Valve Mitral.',
    date: '2026-10-09',
    startTime: '19:00',
    endTime: '20:30',
    time: '19:00 - 20:30',
    location: 'Plataforma CathlabFlix Streaming',
    modality: 'Transmissão Online',
    type: 'apoio_sbhci',
    badge: 'APOIO SBHCI',
    category: 'Webinar',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=webinar-sbhci-outubro',
    actionLabel: 'Confira'
  },
  {
    id: 'tct-highlights-replay',
    title: 'Debate TCT 2026: Principais Ensaios Clínicos',
    subtitle: 'Análise crítica dos clinical trials e o impacto na prática clínica nacional.',
    description: 'Sessão especial de revisão dos trials apresentados no CRF TCT 2026. Discussão multidisciplinar sobre novas tecnologias em stents farmacológicos, balões farmacofóricos, intervenções tricúspides e dispositivos de proteção embólica cerebral.',
    date: '2026-10-15',
    startTime: '20:00',
    endTime: '21:30',
    time: '20:00 - 21:30',
    location: 'CathlabFlix Streaming',
    modality: 'Ao Vivo com Perguntas',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Webinar',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png',
    actionUrl: '/new/evento?id=tct-highlights-replay',
    actionLabel: 'Confira'
  },
  {
    id: 'solaci-2026-destaque',
    title: 'Sessão Especial SOLACI SBHCI 2026',
    subtitle: 'Debates sobre Intervenções Coronárias Complexas e Casos Ao Vivo.',
    description: 'Transmissão exclusiva dos melhores momentos e casos ao vivo do Congresso SOLACI-SBHCI 2026. Acompanhe a discussão detalhada de técnicas de bifurcação, intervenção guiada por imagem intracoronária (OCT e IVUS) e manejo de complicações na sala de hemodinâmica.',
    date: '2026-10-21',
    startTime: '14:00',
    endTime: '18:00',
    time: '14:00 - 18:00',
    location: 'WTC Events Center - São Paulo, SP',
    modality: 'Presencial e On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Congresso',
    color: 'red',
    image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    actionUrl: '/new/evento?id=solaci-2026-destaque',
    actionLabel: 'Confira'
  },
  {
    id: 'solaci-satelite-bifurcacoes',
    title: 'Simpósio Satélite: Tratamento de Bifurcações',
    subtitle: 'Estratégias de Stent Único vs Culotte e Double Kissing Crush.',
    description: 'Simpósio temático focado em técnicas de alta precisão em bifurcações coronárias, com análise passo a passo de procedimentos gravados, indicações de DK-Crush, Mini-Crush e T/TAP, e o papel da fisiologia coronariana pré e pós-stent.',
    date: '2026-10-21',
    startTime: '18:30',
    endTime: '19:45',
    time: '18:30 - 19:45',
    location: 'CathlabFlix Ao Vivo / Sala 2',
    modality: 'Transmissão Online',
    type: 'apoio_sbhci',
    badge: 'APOIO SBHCI',
    category: 'Congresso',
    color: 'red',
    image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    actionUrl: '/new/evento?id=solaci-satelite-bifurcacoes',
    actionLabel: 'Confira'
  },
  {
    id: 'curso-intervencionistas-modulo',
    title: 'Curso para Intervencionistas em Formação',
    subtitle: 'Módulo 2: Técnicas Fundamentais de Hemodinâmica e Acessos Vasculares.',
    description: 'Capacitação dedicada a fellows e médicos residentes em cardiologia intervencionista. Inclui punção radial e femoral ecoguiada, prevenção e manejo de espasmo radial, cateterismo seletivo e princípios de radioproteção.',
    date: '2026-10-28',
    startTime: '09:00',
    endTime: '12:00',
    time: '09:00 - 12:00',
    location: 'CathlabFlix Academy',
    modality: 'On-demand & Exercícios',
    type: 'apoio_sbhci',
    badge: 'APOIO SBHCI',
    category: 'Curso',
    color: 'amber',
    image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=curso-intervencionistas-modulo',
    actionLabel: 'Confira'
  },

  // ==========================================
  // FEVEREIRO 2027
  // ==========================================
  {
    id: 'curso-atualizacao-hci-01',
    title: 'Curso de Atualização em HCI - Módulo 1',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista.',
    description: 'Primeiro encontro do Programa de Educação Médica Continuada 2027 da SBHCI. Foco em avanços farmacológicos adjuntos na intervenção coronária percutânea e novas diretrizes de antiagregação dupla.',
    date: '2027-02-01',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    location: 'Plataforma CathlabFlix / SBHCI',
    modality: 'On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Webinar',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=curso-atualizacao-hci-01',
    actionLabel: 'Confira'
  },
  {
    id: 'tavi-certificacao-2027',
    title: 'Curso Teórico-Prático de Certificação em TAVI SBHCI/SBCCV 2027',
    subtitle: 'Programa Oficial Conjunto SBHCI e SBCCV para Formação e Habilitação em TAVI.',
    description: 'Curso anual intensivo de habilitação e certificação para implante percutâneo de válvula aórtica (TAVI), com treinamento prático em simuladores virtuais, dissecção cadavérica e acompanhamento de procedimentos in-loco.',
    date: '2027-02-15',
    endDate: '2027-12-15',
    time: 'Fevereiro a Dezembro',
    dateRangeLabel: 'FEV-DEZ',
    location: 'Centros Credenciados SBHCI / SBCCV',
    modality: 'Teórico-Prático Presencial',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Curso',
    color: 'amber',
    image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=tavi-certificacao-2027',
    actionLabel: 'Confira'
  },
  {
    id: 'curso-atualizacao-hci-02',
    title: 'Curso de Atualização em HCI - Módulo 2',
    subtitle: 'Intervenções em Oclusões Totais Crônicas (CTO) e Fisiologia Coronária.',
    description: 'Módulo avançado discutindo o algoritmo híbrido para CTO, indicações de via retrógrada e antegrada, utilização de microcateteres específicos e avaliação com iFR/FFR.',
    date: '2027-02-22',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    location: 'Plataforma CathlabFlix / SBHCI',
    modality: 'On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Webinar',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=curso-atualizacao-hci-02',
    actionLabel: 'Confira'
  },

  // ==========================================
  // MARÇO 2027
  // ==========================================
  {
    id: 'latam-valves-2027',
    title: 'Latam Valves 2027 - The Structural Heart Summit',
    subtitle: 'Maior Encontro Latino-Americano de Doenças Estruturais do Coração e Terapias Valvares.',
    description: 'Edição histórica do Latam Valves reunindo cardiologistas intervencionistas, cirurgiões cardíacos e ecocardiografistas da América Latina e do mundo. Três dias intensos de transmissão ao vivo de casos estruturais complexos, debates de trials valvares e workshops práticos.',
    date: '2027-03-17',
    endDate: '2027-03-19',
    dates: ['2027-03-17', '2027-03-18', '2027-03-19'],
    dateRangeLabel: '17 a 19',
    startTime: '08:00',
    endTime: '18:30',
    time: '08:00 - 18:30 (17 a 19 de março)',
    location: 'WTC Events Golden Hall - São Paulo, SP',
    modality: 'Presencial e On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Congresso',
    color: 'red',
    image: 'https://static.wixstatic.com/media/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png',
    actionUrl: '/new/evento?id=latam-valves-2027',
    actionLabel: 'Confira'
  },

  // ==========================================
  // JUNHO 2027
  // ==========================================
  {
    id: 'congresso-sbhci-2027',
    title: 'Congresso SBHCI 2027',
    subtitle: 'O Maior Encontro da Cardiologia Intervencionista Brasileira.',
    description: 'O Congresso Anual da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista é o principal fórum científico da especialidade na América Latina. Apresentação de pesquisas inéditas, premiações científicas, arenas de inovação tecnológica e dezenas de casos editados e ao vivo.',
    date: '2027-06-23',
    endDate: '2027-06-25',
    dates: ['2027-06-23', '2027-06-24', '2027-06-25'],
    dateRangeLabel: '23 a 25',
    startTime: '08:00',
    endTime: '19:00',
    time: '08:00 - 19:00 (23 a 25 de junho)',
    location: 'Centro de Convenções de Goiânia, GO',
    modality: 'Presencial e On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Congresso',
    color: 'red',
    image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    actionUrl: '/new/evento?id=congresso-sbhci-2027',
    actionLabel: 'Confira'
  },

  // ==========================================
  // AGOSTO 2027
  // ==========================================
  {
    id: 'solaci-2027',
    title: 'Congresso SOLACI 2027',
    subtitle: 'Sociedade Latino-Americana de Cardiologia Intervencionista.',
    description: 'Congresso oficial da SOLACI reunindo líderes mundiais da hemodinâmica para debater os rumos das intervenções cardiovasculares em países em desenvolvimento, inovações terapêuticas e programas conjuntos de educação.',
    date: '2027-08-04',
    endDate: '2027-08-06',
    dates: ['2027-08-04', '2027-08-05', '2027-08-06'],
    dateRangeLabel: '04 a 06',
    startTime: '08:00',
    endTime: '18:30',
    time: '08:00 - 18:30 (04 a 06 de agosto)',
    location: 'Buenos Aires, Argentina',
    modality: 'Presencial com Transmissão',
    type: 'apoio_sbhci',
    badge: 'APOIO SBHCI',
    category: 'Congresso',
    color: 'red',
    image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    actionUrl: '/new/evento?id=solaci-2027',
    actionLabel: 'Confira'
  },

  // ==========================================
  // NOVEMBRO 2027
  // ==========================================
  {
    id: 'pci-plus-2027',
    title: 'PCI Plus 2027',
    subtitle: 'Simpósio Internacional de Intervenção Coronária Percutânea e Terapias Avançadas.',
    description: 'Encontro técnico-científico dedicado exclusivamente à intervenção coronariana percutânea complexa, calcificação severa, litotripsia intravascular (IVL), aterectomia rotacional e suporte circulatório mecânico.',
    date: '2027-11-12',
    endDate: '2027-11-13',
    dates: ['2027-11-12', '2027-11-13'],
    dateRangeLabel: '12 e 13',
    startTime: '08:30',
    endTime: '18:00',
    time: '08:30 - 18:00 (12 e 13 de novembro)',
    location: 'Windsor Barra Hotel - Rio de Janeiro, RJ',
    modality: 'Presencial e On-line',
    type: 'evento',
    badge: 'EVENTO OFICIAL',
    category: 'Congresso',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=pci-plus-2027',
    actionLabel: 'Confira'
  },
  {
    id: 'nursing-summit-2027',
    title: 'Nursing Summit SBHCI 2027',
    subtitle: 'Encontro Nacional de Enfermagem em Hemodinâmica e Cardiologia Intervencionista.',
    description: 'Summit oficial do Departamento de Enfermagem da SBHCI, abordando protocolos assistenciais seguros, preparo de salas de procedimento, gestão de contraste e cuidados pós-punção arterial.',
    date: '2027-11-13',
    startTime: '08:30',
    endTime: '17:30',
    time: '08:30 - 17:30 (13 de novembro)',
    location: 'Windsor Barra Hotel - Rio de Janeiro, RJ',
    modality: 'Presencial e On-line',
    type: 'apoio_sbhci',
    badge: 'APOIO SBHCI',
    category: 'Congresso',
    color: 'blue',
    image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/evento?id=nursing-summit-2027',
    actionLabel: 'Confira'
  }
];

if (typeof window !== 'undefined') {
  window.INITIAL_EVENTS = INITIAL_EVENTS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INITIAL_EVENTS };
}
