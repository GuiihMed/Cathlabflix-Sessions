/**
 * CathlabFlix Modern Agenda & Interactive Calendar
 * Agenda Oficial SBHCI 2027 & Integração Completa
 */

// Agenda Oficial CathlabFlix: Eventos Vigentes 2026 e Agenda Anual SBHCI 2027
if (typeof window !== 'undefined' && !window.INITIAL_EVENTS) {
  window.INITIAL_EVENTS = [
  // ==========================================
  // OUTUBRO 2026 (Transmissões e Congressos)
  // ==========================================
  {
    id: 'webinar-sbhci-outubro',
    date: '2026-10-09',
    startTime: '19:00',
    endTime: '20:30',
    time: '19:00 - 20:30',
    title: 'Webinar SBHCI: Atualizações em Terapias Estruturais',
    subtitle: 'Discussão de casos de TAVI e Valve-in-Valve Mitral',
    category: 'Webinar',
    color: 'blue',
    badge: 'GRAVAÇÃO',
    modality: 'Transmissão Online',
    location: 'Plataforma CathlabFlix',
    image: 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Transmissão'
  },
  {
    id: 'tct-highlights-replay',
    date: '2026-10-15',
    startTime: '20:00',
    endTime: '21:30',
    time: '20:00 - 21:30',
    title: 'Debate TCT 2026: Principais Ensaios Clínicos',
    subtitle: 'Análise crítica dos clinical trials e o impacto na prática clínica nacional',
    category: 'Webinar',
    color: 'blue',
    badge: 'DEBATE',
    modality: 'Ao Vivo com Perguntas',
    location: 'CathlabFlix Streaming',
    image: 'https://static.wixstatic.com/media/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png',
    actionUrl: '/new/tct',
    actionLabel: 'Ver Debate'
  },
  {
    id: 'solaci-2026-destaque',
    date: '2026-10-21',
    startTime: '14:00',
    endTime: '18:00',
    time: '14:00 - 18:00',
    title: 'Sessão Especial SOLACI SBHCI 2026',
    subtitle: 'Debates sobre Intervenções Coronárias Complexas e Casos Ao Vivo',
    category: 'Congresso',
    color: 'red',
    badge: 'LEMBRE-SE',
    modality: 'Presencial e On-line',
    location: 'Transmissão Oficial CathlabFlix',
    image: 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png',
    actionUrl: '/new/solaci',
    actionLabel: 'Acessar Congresso'
  },
  {
    id: 'solaci-satelite-bifurcacoes',
    date: '2026-10-21',
    startTime: '18:30',
    endTime: '19:45',
    time: '18:30 - 19:45',
    title: 'Simpósio Satélite: Tratamento de Bifurcações',
    subtitle: 'Estratégias de Stent Único vs Culotte e Double Kissing Crush',
    category: 'Congresso',
    color: 'red',
    badge: 'SIMPÓSIO',
    modality: 'Sala de Transmissão 2',
    location: 'CathlabFlix Ao Vivo',
    image: '/assets/images/solaci-2026-gravacao.png',
    actionUrl: '/new/solaci',
    actionLabel: 'Acessar Simpósio'
  },
  {
    id: 'curso-intervencionistas-modulo',
    date: '2026-10-28',
    startTime: '09:00',
    endTime: '12:00',
    time: '09:00 - 12:00',
    title: 'Curso para Intervencionistas em Formação',
    subtitle: 'Módulo 2: Técnicas Fundamentais de Hemodinâmica e Acessos Vasculares',
    category: 'Curso',
    color: 'amber',
    badge: 'AULA',
    modality: 'On-demand & Exercícios',
    location: 'CathlabFlix Academy',
    image: 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Conteúdo'
  },

  // ==========================================
  // FEVEREIRO 2027
  // ==========================================
  {
    id: 'curso-atualizacao-hci-01',
    date: '2027-02-01',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'tavi-certificacao-2027',
    date: '2027-02-15',
    endDate: '2027-12-15',
    time: 'Fevereiro a Dezembro',
    dateRangeLabel: 'FEV-DEZ',
    title: 'Curso Teórico-Prático de Certificação em TAVI SBHCI/SBCCV 2027',
    subtitle: 'Programa Oficial Conjunto SBHCI e SBCCV para Formação e Habilitação em TAVI',
    category: 'Curso',
    color: 'amber',
    badge: 'CERTIFICAÇÃO',
    modality: 'Teórico-Prático',
    location: 'Centros Credenciados SBHCI / SBCCV',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Programa'
  },
  {
    id: 'curso-atualizacao-hci-02',
    date: '2027-02-22',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // MARÇO 2027
  // ==========================================
  {
    id: 'curso-atualizacao-hci-03',
    date: '2027-03-08',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'latam-valves-2027',
    date: '2027-03-17',
    endDate: '2027-03-19',
    dates: ['2027-03-17', '2027-03-18', '2027-03-19'],
    dateRangeLabel: '17 a 19',
    startTime: '08:00',
    endTime: '18:30',
    time: '08:00 - 18:30 (17 a 19 de março)',
    title: 'Latam Valves 2027 - The Structural Heart Summit',
    subtitle: 'Maior Encontro Latino-Americano de Doenças Estruturais do Coração e Terapias Valvares',
    category: 'Congresso',
    color: 'red',
    badge: 'OFICIAL',
    modality: 'Presencial e On-line',
    location: 'WTC Events Golden Hall - São Paulo, SP',
    actionUrl: '/new/congressos',
    actionLabel: 'Acessar Latam Valves'
  },
  {
    id: 'curso-atualizacao-hci-04',
    date: '2027-03-29',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // ABRIL 2027
  // ==========================================
  {
    id: 'endovascular-mod-01',
    date: '2027-04-02',
    endDate: '2027-04-03',
    dates: ['2027-04-02', '2027-04-03'],
    dateRangeLabel: '2 e 3',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (2 e 3 de abril)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo I',
    subtitle: 'Treinamento Prático e Casos Ao Vivo em Procedimentos Endovasculares',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital Semper (BH / MG)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-05',
    date: '2027-04-12',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-06',
    date: '2027-04-26',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // MAIO 2027
  // ==========================================
  {
    id: 'endovascular-mod-02',
    date: '2027-05-07',
    endDate: '2027-05-08',
    dates: ['2027-05-07', '2027-05-08'],
    dateRangeLabel: '7 e 8',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (7 e 8 de maio)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo II',
    subtitle: 'Técnicas Endovasculares Periféricas e Tratamento de Doença Arterial',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital Amecor (Cuiabá / MT)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-07',
    date: '2027-05-10',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-08',
    date: '2027-05-24',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // JUNHO 2027
  // ==========================================
  {
    id: 'endovascular-mod-03',
    date: '2027-06-04',
    endDate: '2027-06-05',
    dates: ['2027-06-04', '2027-06-05'],
    dateRangeLabel: '4 e 5',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (4 e 5 de junho)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo III',
    subtitle: 'Procedimentos Endovasculares Avançados e Casos Complexos',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital São Francisco e Hospital Semper (BH / MG)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-09',
    date: '2027-06-07',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-10',
    date: '2027-06-21',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // JULHO 2027
  // ==========================================
  {
    id: 'endovascular-mod-04',
    date: '2027-07-02',
    endDate: '2027-07-03',
    dates: ['2027-07-02', '2027-07-03'],
    dateRangeLabel: '2 e 3',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (2 e 3 de julho)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo IV',
    subtitle: 'Técnicas de Recanalização e Abordagem Multidisciplinar',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital Madre Teresa (BH / MG)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-11',
    date: '2027-07-05',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-12',
    date: '2027-07-19',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // AGOSTO 2027
  // ==========================================
  {
    id: 'congresso-sbhci-2027',
    date: '2027-08-04',
    endDate: '2027-08-06',
    dates: ['2027-08-04', '2027-08-05', '2027-08-06'],
    dateRangeLabel: '4 a 6',
    startTime: '08:00',
    endTime: '19:00',
    time: '08:00 - 19:00 (4 a 6 de agosto)',
    title: 'Congresso da SBHCI 2027',
    subtitle: 'Congresso Anual da Sociedade Brasileira de Hemodinâmica e Cardiologia Intervencionista',
    category: 'Congresso',
    color: 'red',
    badge: 'OFICIAL',
    modality: 'Presencial e On-line',
    location: 'CICB - Centro Internacional de Convenções do Brasil (Brasília, DF)',
    actionUrl: '/new/congressos',
    actionLabel: 'Acessar Congresso SBHCI'
  },
  {
    id: 'curso-atualizacao-hci-13',
    date: '2027-08-16',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-14',
    date: '2027-08-30',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // SETEMBRO 2027
  // ==========================================
  {
    id: 'endovascular-mod-06',
    date: '2027-09-10',
    endDate: '2027-09-11',
    dates: ['2027-09-10', '2027-09-11'],
    dateRangeLabel: '10 e 11',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (10 e 11 de setembro)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo VI',
    subtitle: 'Abordagens Endovasculares e Acessos Alternativos em Hemodinâmica',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital Prof. Edgard Santos (Salvador / BA)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-15',
    date: '2027-09-13',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-16',
    date: '2027-09-27',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // OUTUBRO 2027
  // ==========================================
  {
    id: 'endovascular-mod-07',
    date: '2027-10-01',
    endDate: '2027-10-02',
    dates: ['2027-10-01', '2027-10-02'],
    dateRangeLabel: '1 e 2',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (1 e 2 de outubro)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo VII',
    subtitle: 'Tratamento Endovascular da Aorta e Doenças Vasculares Periféricas',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital Santa Casa (BH / MG)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-17',
    date: '2027-10-04',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'curso-atualizacao-hci-18',
    date: '2027-10-11',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'prova-titulo-sbhci-2027',
    date: '2027-10-17',
    startTime: '08:00',
    endTime: '17:00',
    time: '08:00 - 17:00 (17 de outubro)',
    title: 'Prova de Título de Especialista SBHCI / AMB 2027',
    subtitle: 'Exame Oficial Nacional de Obtenção do Título de Especialista em Hemodinâmica',
    category: 'Congresso',
    color: 'red',
    badge: 'EXAME OFICIAL',
    modality: 'Presencial',
    location: 'Sede Oficial SBHCI / AMB',
    actionUrl: 'https://sbhci.org.br',
    actionLabel: 'Edital e Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-19',
    date: '2027-10-25',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo On-line de Atualização em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },

  // ==========================================
  // NOVEMBRO 2027
  // ==========================================
  {
    id: 'endovascular-mod-08',
    date: '2027-11-05',
    endDate: '2027-11-06',
    dates: ['2027-11-05', '2027-11-06'],
    dateRangeLabel: '5 e 6',
    startTime: '08:00',
    endTime: '18:00',
    time: '08:00 - 18:00 (5 e 6 de novembro)',
    title: 'Curso de Aperfeiçoamento Endovascular - Módulo VIII',
    subtitle: 'Módulo de Conclusão: Casos Clínicos Complexos e Procedimentos Ao Vivo',
    category: 'Curso',
    color: 'amber',
    badge: 'PRÁTICO',
    modality: 'Presencial / Prático',
    location: 'Hospital São Francisco (BH / MG)',
    actionUrl: '/new/destaques',
    actionLabel: 'Ver Detalhes'
  },
  {
    id: 'curso-atualizacao-hci-20',
    date: '2027-11-08',
    startTime: '19:30',
    endTime: '21:00',
    time: '19:30 - 21:00',
    title: 'Curso de Atualização em HCI',
    subtitle: 'Módulo de Encerramento do Programa de Atualização em Hemodinâmica 2027',
    category: 'Webinar',
    color: 'blue',
    badge: 'ON-LINE',
    modality: 'On-line',
    location: 'Plataforma CathlabFlix / SBHCI',
    actionUrl: '/new/destaques',
    actionLabel: 'Acessar Aula'
  },
  {
    id: 'pci-plus-2027',
    date: '2027-11-12',
    endDate: '2027-11-13',
    dates: ['2027-11-12', '2027-11-13'],
    dateRangeLabel: '12 e 13',
    startTime: '08:30',
    endTime: '18:00',
    time: '08:30 - 18:00 (12 e 13 de novembro)',
    title: 'PCI Plus 2027',
    subtitle: 'Simpósio Internacional de Intervenção Coronária Percutânea e Terapias Avançadas',
    category: 'Congresso',
    color: 'blue',
    badge: 'OFICIAL',
    modality: 'Presencial e On-line',
    location: 'Rio de Janeiro, RJ',
    actionUrl: '/new/congressos',
    actionLabel: 'Acessar PCI Plus'
  },
  {
    id: 'nursing-summit-2027',
    date: '2027-11-13',
    startTime: '08:30',
    endTime: '17:30',
    time: '08:30 - 17:30 (13 de novembro)',
    title: 'Nursing Summit SBHCI 2027',
    subtitle: 'Encontro Nacional de Enfermagem em Hemodinâmica e Cardiologia Intervencionista',
    category: 'Congresso',
    color: 'blue',
    badge: 'SUMMIT',
    modality: 'Presencial e On-line',
    location: 'Rio de Janeiro / RJ',
    actionUrl: '/new/congressos',
    actionLabel: 'Acessar Summit'
  }
];
}

class ModernAgendaCalendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.activeFilter = 'all';
    this.currentView = options.initialView || 'month'; // 'month' | 'list'
    this.searchQuery = options.searchQuery || '';

    // 1. Carrega eventos do EventsService se disponível, ou options.events, ou window.INITIAL_EVENTS
    if (options.events && Array.isArray(options.events)) {
      this.events = options.events;
    } else if (typeof EventsService !== 'undefined' && typeof EventsService.getAllEvents === 'function') {
      this.events = EventsService.getAllEvents();
    } else if (typeof window !== 'undefined' && Array.isArray(window.INITIAL_EVENTS)) {
      this.events = window.INITIAL_EVENTS;
    } else {
      this.events = [];
    }

    // 2. Data de referência de Hoje
    this.today = new Date();
    const todayYear = this.today.getFullYear();
    const todayMonth = String(this.today.getMonth() + 1).padStart(2, '0');
    const todayDay = String(this.today.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

    // 3. Determina o mês e evento inicial inteligente:
    // Se o mês atual tiver eventos, abre nele.
    // Caso contrário, abre no primeiro mês que tiver eventos para a agenda NUNCA ficar vazia!
    let targetEvent = null;
    const currentMonthPrefix = `${todayYear}-${todayMonth}`;
    const eventsThisMonth = this.events.filter(e => e.date && e.date.startsWith(currentMonthPrefix));

    if (eventsThisMonth.length > 0) {
      targetEvent = eventsThisMonth.find(e => e.date >= todayStr) || eventsThisMonth[0];
    } else if (this.events.length > 0) {
      const upcoming = this.events.slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      targetEvent = upcoming.find(e => e.date >= todayStr) || upcoming[0];
    }

    if (targetEvent && targetEvent.date) {
      const parts = targetEvent.date.split('-');
      this.currentDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      this.selectedDateStr = targetEvent.date;
      this.activeEventId = targetEvent.id;
    } else {
      this.currentDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
      this.selectedDateStr = todayStr;
      this.activeEventId = null;
    }

    this.monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    this.monthShortNames = [
      'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
      'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
    ];

    this.dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    this.init();

    // Ouvinte para recarregar quando eventos forem adicionados/excluídos no painel
    if (typeof window !== 'undefined') {
      window.addEventListener('cathlabflix:events-updated', () => {
        if (typeof EventsService !== 'undefined') {
          this.events = EventsService.getAllEvents();
        }
        this.renderContent();
      });
    }
  }

  setSearchQuery(q) {
    this.searchQuery = (q || '').trim().toLowerCase();
    this.renderContent();
  }

  init() {
    this.renderSkeleton();
    this.renderContent();
    this.attachEventListeners();

    // Se houver evento na data selecionada ou no mês, abre a gaveta de detalhes imediatamente
    if (this.currentView === 'month') {
      let dayEvents = this.selectedDateStr ? this.getFilteredEventsForDate(this.selectedDateStr) : [];
      if (dayEvents.length === 0) {
        const mYear = this.currentDate.getFullYear();
        const mMonth = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const mPrefix = `${mYear}-${mMonth}`;
        const monthEvs = this.events.filter(e => e.date && e.date.startsWith(mPrefix));
        if (monthEvs.length > 0) {
          this.selectedDateStr = monthEvs[0].date;
          this.activeEventId = monthEvs[0].id;
          dayEvents = [monthEvs[0]];
        }
      }

      if (dayEvents.length > 0) {
        this.expandEventDrawer(dayEvents, this.selectedDateStr, this.activeEventId);
      } else {
        this.collapseEventDrawer();
      }
    }
  }

  renderSkeleton() {
    this.container.innerHTML = `
      <div class="agenda-card-wrapper">
        <!-- Topo da Agenda com Alternador de Visão (Mês vs Próximos) -->
        <div class="agenda-top-bar">
          <div class="agenda-view-toggle" role="tablist" aria-label="Modo de visualização da agenda">
            <button 
              type="button" 
              class="agenda-view-tab ${this.currentView === 'month' ? 'active' : ''}" 
              id="agendaViewMonthBtn" 
              role="tab"
              aria-selected="${this.currentView === 'month'}"
              title="Visualização em Calendário Mensal"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Mês</span>
            </button>
            <button 
              type="button" 
              class="agenda-view-tab ${this.currentView === 'list' ? 'active' : ''}" 
              id="agendaViewListBtn" 
              role="tab"
              aria-selected="${this.currentView === 'list'}"
              title="Visualização em Lista de Próximos Eventos"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>Próximos</span>
            </button>
          </div>
        </div>

        <!-- Barra de Navegação do Mês (Visível no modo Calendário) -->
        <div class="agenda-header" id="agendaMonthHeader">
          <h3 class="agenda-month-title" id="agendaMonthDisplay"></h3>

          <div class="agenda-nav-controls">
            <button type="button" class="agenda-nav-btn" id="agendaPrevMonthBtn" aria-label="Mês anterior" title="Mês anterior">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button type="button" class="agenda-today-btn" id="agendaTodayBtn" title="Ir para o dia de hoje">
              Hoje
            </button>
            <button type="button" class="agenda-nav-btn" id="agendaNextMonthBtn" aria-label="Próximo mês" title="Próximo mês">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Área Principal de Conteúdo Dinâmico -->
        <div class="agenda-content-area" id="agendaContentArea">
          <!-- Grade Mensal -->
          <div class="agenda-month-view-wrapper" id="agendaMonthViewWrapper">
            <div class="agenda-weekdays-row">
              ${this.dayNames.map(day => `<span class="agenda-weekday-label">${day}</span>`).join('')}
            </div>
            <div class="agenda-days-grid" id="agendaDaysGrid" role="grid" aria-label="Calendário de Eventos">
              <!-- Injetado dinamicamente -->
            </div>
          </div>

          <!-- Lista de Próximos Eventos -->
          <div class="agenda-list-view-wrapper" id="agendaListViewWrapper" style="display: none;">
            <!-- Injetado dinamicamente -->
          </div>
        </div>

        <!-- Gaveta Expansível Inferior com Detalhes e Salvar na Agenda -->
        <div class="agenda-expandable-drawer" id="agendaExpandableDrawer" aria-live="polite">
          <div class="agenda-drawer-inner" id="agendaDrawerInner">
            <!-- Detalhe do evento selecionado -->
          </div>
        </div>
      </div>
    `;
  }

  renderContent() {
    if (this.currentView === 'month') {
      const monthHeader = document.getElementById('agendaMonthHeader');
      const monthWrapper = document.getElementById('agendaMonthViewWrapper');
      const listWrapper = document.getElementById('agendaListViewWrapper');

      if (monthHeader) monthHeader.style.display = 'flex';
      if (monthWrapper) monthWrapper.style.display = 'block';
      if (listWrapper) listWrapper.style.display = 'none';

      this.renderMonthDays();
    } else {
      const monthHeader = document.getElementById('agendaMonthHeader');
      const monthWrapper = document.getElementById('agendaMonthViewWrapper');
      const listWrapper = document.getElementById('agendaListViewWrapper');

      if (monthHeader) monthHeader.style.display = 'none';
      if (monthWrapper) monthWrapper.style.display = 'none';
      if (listWrapper) listWrapper.style.display = 'block';

      this.collapseEventDrawer();
      this.renderUpcomingList();
    }
  }

  renderMonthDays() {
    const monthDisplay = document.getElementById('agendaMonthDisplay');
    const daysGrid = document.getElementById('agendaDaysGrid');
    if (!monthDisplay || !daysGrid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    monthDisplay.textContent = `${this.monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let gridHtml = '';

    // Células vazias do mês anterior
    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += `<div class="agenda-day-cell empty" aria-hidden="true"></div>`;
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const dayFormatted = String(day).padStart(2, '0');
      const monthFormatted = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

      const eventsOnDay = this.getFilteredEventsForDate(dateStr);
      const hasEvent = eventsOnDay.length > 0;
      const isSelected = dateStr === this.selectedDateStr;
      const isToday = this.isToday(year, month, day);

      let cellClasses = ['agenda-day-cell'];
      if (hasEvent) cellClasses.push('has-event');
      if (isSelected) cellClasses.push('is-selected');
      if (isToday) cellClasses.push('is-today');

      // Geração de dots de alta visibilidade sob o número
      let dotsHtml = '';
      if (hasEvent) {
        dotsHtml = `
          <div class="agenda-dots-row">
            ${eventsOnDay.slice(0, 3).map(ev => `<span class="agenda-event-dot ${ev.color || 'red'}"></span>`).join('')}
          </div>
        `;
      }

      gridHtml += `
        <button 
          type="button" 
          class="${cellClasses.join(' ')}" 
          data-date="${dateStr}"
          aria-label="${day} de ${this.monthNames[month]}${hasEvent ? ` - ${eventsOnDay.length} evento(s)` : ''}${isToday ? ' (Hoje)' : ''}"
          ${hasEvent ? 'aria-haspopup="dialog"' : ''}
        >
          <span class="agenda-day-number">${day}</span>
          ${dotsHtml}
        </button>
      `;
    }

    daysGrid.innerHTML = gridHtml;
    this.attachDayClicks();
  }

  renderUpcomingList() {
    const listWrapper = document.getElementById('agendaListViewWrapper');
    if (!listWrapper) return;

    // Filtra e ordena eventos cronologicamente
    let filteredEvents = this.events.slice();

    if (this.searchQuery) {
      const q = this.searchQuery;
      filteredEvents = filteredEvents.filter(ev => 
        (ev.title && ev.title.toLowerCase().includes(q)) ||
        (ev.subtitle && ev.subtitle.toLowerCase().includes(q)) ||
        (ev.description && ev.description.toLowerCase().includes(q)) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.time && ev.time.toLowerCase().includes(q)) ||
        (ev.date && ev.date.includes(q)) ||
        (ev.badge && ev.badge.toLowerCase().includes(q))
      );
    }

    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredEvents.length === 0) {
      listWrapper.innerHTML = `
        <div class="agenda-list-empty">
          <p>${this.searchQuery ? `Nenhum evento encontrado para "${this.searchQuery}".` : 'Nenhum próximo evento encontrado.'}</p>
        </div>
      `;
      return;
    }

    const itemsHtml = filteredEvents.map(event => {
      const parts = event.date.split('-');
      const dayDisplay = event.dateRangeLabel || parts[2];
      const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];
      const isCompactDay = String(dayDisplay).length > 2;
      const eventImg = this.getEventImage(event);
      const isApoio = event.type === 'apoio_sbhci' || (event.badge && event.badge.includes('APOIO'));
      const badgeText = isApoio ? 'Apoio SBHCI' : 'Evento Oficial';
      const badgeClass = isApoio ? 'badge-apoio' : 'badge-oficial';
      const actionUrl = event.actionUrl || `/new/evento?id=${encodeURIComponent(event.id)}`;

      return `
        <article class="agenda-list-card ${isApoio ? 'is-apoio' : 'is-oficial'}" data-event-id="${event.id}">
          <div class="agenda-list-card-media-col">
            <div class="agenda-list-card-date">
              <span class="card-date-day ${isCompactDay ? 'compact' : ''}">${dayDisplay}</span>
              <span class="card-date-month">${monthShort}</span>
            </div>
            <div class="agenda-list-card-thumb">
              <img src="${eventImg}" alt="${event.title}" loading="lazy" onerror="this.src='/assets/images/og-cathlabflix.png'">
            </div>
          </div>

          <div class="agenda-list-card-content">
            <div class="agenda-list-card-badges">
              <span class="card-type-badge ${badgeClass}">${badgeText}</span>
              ${event.modality ? `<span class="card-modality-badge">${event.modality}</span>` : ''}
            </div>

            <h4 class="agenda-list-card-title">
              <a href="${actionUrl}" title="${event.title}">${event.title}</a>
            </h4>

            <div class="agenda-list-card-meta">
              <div class="list-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${event.time}</span>
              </div>
              ${event.location ? `
                <div class="list-meta-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${event.location}</span>
                </div>
              ` : ''}
            </div>

            <!-- Botões de Ação: Estritamente Confira e Salvar -->
            <div class="agenda-list-card-actions">
              <a href="${actionUrl}" class="list-action-cta-btn" title="Confira os detalhes deste evento">
                <span>Confira</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>

              <div class="agenda-export-dropdown-wrapper">
                <button type="button" class="list-action-export-btn" data-event-id="${event.id}" title="Salvar na agenda" aria-haspopup="true" aria-expanded="false">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Salvar</span>
                </button>
                <div class="agenda-export-menu" id="exportMenu-${event.id}">
                  <a href="${this.generateGoogleCalendarUrl(event)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                    <span class="export-menu-icon google">G</span>
                    Google Calendar
                  </a>
                  <button type="button" class="export-menu-item" data-export="apple" data-event-id="${event.id}">
                    <span class="export-menu-icon apple"></span>
                    Apple Agenda (.ics)
                  </button>
                  <button type="button" class="export-menu-item" data-export="outlook" data-event-id="${event.id}">
                    <span class="export-menu-icon outlook">O</span>
                    Outlook (.ics)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    listWrapper.innerHTML = `<div class="agenda-list-container">${itemsHtml}</div>`;
    this.attachExportMenuEvents();
  }

  isToday(year, month, day) {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  getEventImage(event) {
    if (!event) return '/assets/images/og-cathlabflix.png';
    if (event.image) return event.image;

    const id = (event.id || '').toLowerCase();
    const title = (event.title || '').toLowerCase();
    const cat = (event.category || '').toLowerCase();

    if (id.includes('tct') || title.includes('tct')) {
      return 'https://static.wixstatic.com/media/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_7bdabcd75dea485aa9d845dd2e292447~mv2.png';
    }
    if (id.includes('solaci') || title.includes('solaci')) {
      return 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';
    }
    if (title.includes('valves') || id.includes('valves')) {
      return '/assets/images/tct-latam-2026.png';
    }
    if (title.includes('tavi') || id.includes('tavi') || title.includes('estruturais')) {
      return 'https://static.wixstatic.com/media/a8daef_ac4b37c632b249dda903a904b90b6b29~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png';
    }
    if (id.includes('pci') || title.includes('pci')) {
      return '/assets/images/solaci-2026-confira.png';
    }
    if (id.includes('nursing') || title.includes('nursing')) {
      return '/assets/images/solaci-2026-aulas.png';
    }
    if (id.includes('endovascular') || title.includes('endovascular') || id.includes('intervencionistas') || cat === 'curso') {
      return 'https://static.wixstatic.com/media/1d3d47_720fcf5cc1be4c93b2d26421c9ae4863~mv2.png/v1/fit/w_1000,h_1000,al_c,q_80/file.png';
    }
    if (id.includes('atualizacao') || title.includes('atualização') || cat === 'webinar') {
      return 'https://static.wixstatic.com/media/a8daef_06fc0a89d72d4a05ad4f78d62ae31021~mv2.jpeg/v1/fit/w_1000,h_1000,al_c,q_80/file.png';
    }
    if (cat === 'congresso' || title.includes('congresso') || title.includes('sbhci')) {
      return 'https://static.wixstatic.com/media/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png/v1/fill/w_3000,h_662,al_c,q_95,enc_avif,quality_auto/1d3d47_ea12f71c1a89466e8ce53ce73939e79d~mv2.png';
    }

    return '/assets/images/og-cathlabflix.png';
  }

  getFilteredEventsForDate(dateStr) {
    return this.events.filter(ev => {
      const matchesDate = ev.date === dateStr || (ev.dates && ev.dates.includes(dateStr));
      if (!matchesDate) return false;

      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchesQuery = (
          (ev.title && ev.title.toLowerCase().includes(q)) ||
          (ev.subtitle && ev.subtitle.toLowerCase().includes(q)) ||
          (ev.description && ev.description.toLowerCase().includes(q)) ||
          (ev.location && ev.location.toLowerCase().includes(q)) ||
          (ev.badge && ev.badge.toLowerCase().includes(q))
        );
        if (!matchesQuery) return false;
      }

      return true;
    });
  }

  attachDayClicks() {
    const dayCells = this.container.querySelectorAll('.agenda-day-cell:not(.empty)');
    dayCells.forEach(cell => {
      cell.addEventListener('click', () => {
        const dateStr = cell.getAttribute('data-date');
        const eventsOnDay = this.getFilteredEventsForDate(dateStr);

        // Se clicou no mesmo dia selecionado, recolhe
        if (this.selectedDateStr === dateStr) {
          this.collapseEventDrawer();
          this.selectedDateStr = null;
          cell.classList.remove('is-selected');
          return;
        }

        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => {
          c.classList.remove('is-selected');
        });

        this.selectedDateStr = dateStr;
        cell.classList.add('is-selected');

        if (eventsOnDay.length > 0) {
          this.activeEventId = eventsOnDay[0].id;
          this.expandEventDrawer(eventsOnDay, dateStr, this.activeEventId);
        } else {
          this.expandEmptyDrawer(dateStr);
        }
      });
    });
  }

  expandEventDrawer(eventsList, dateStr, currentEventId) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];

    // Evento selecionado atual
    let activeEvent = eventsList.find(e => e.id === currentEventId) || eventsList[0];
    const colorClass = activeEvent.color || 'red';

    // Tabs para múltiplos eventos no mesmo dia
    let tabsHtml = '';
    if (eventsList.length > 1) {
      tabsHtml = `
        <div class="agenda-drawer-multi-tabs">
          ${eventsList.map((ev, idx) => `
            <button 
              type="button" 
              class="agenda-drawer-tab-btn ${ev.id === activeEvent.id ? 'active' : ''}" 
              data-event-id="${ev.id}"
            >
              ${idx === 0 ? 'Sessão 1' : 'Sessão ' + (idx + 1)}: ${ev.category}
            </button>
          `).join('')}
        </div>
      `;
    }

    const dayDisplay = activeEvent.dateRangeLabel ? `${activeEvent.dateRangeLabel} ${monthShort}` : `${dayNum} ${monthShort}`;
    const eventImg = this.getEventImage(activeEvent);

    inner.innerHTML = `
      <div class="agenda-event-detail-card ${colorClass}">
        <!-- Topo com badge, pill da data e botão fechar -->
        <div class="event-detail-top">
          <div class="event-date-pill">
            <span class="event-pill-date">${dayDisplay}</span>
            <span class="event-pill-badge">${activeEvent.badge || 'OFICIAL'}</span>
          </div>

          <button type="button" class="event-detail-close-btn" id="eventDetailCloseBtn" title="Recolher detalhes" aria-label="Fechar detalhes do evento">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        ${tabsHtml}

        <!-- Imagem Visual do Evento -->
        <div class="event-detail-media">
          <img src="${eventImg}" alt="${activeEvent.title}" class="event-detail-img" loading="lazy" onerror="this.src='/assets/images/og-cathlabflix.png'">
          <div class="event-detail-media-gradient"></div>
          <span class="event-detail-media-badge">${activeEvent.category}</span>
        </div>

        <!-- Conteúdo do evento -->
        <div class="event-detail-body">
          <span class="event-category-tag">${activeEvent.category}</span>
          <h4 class="event-detail-title">${activeEvent.title}</h4>
          <p class="event-detail-desc">${activeEvent.subtitle}</p>

          <div class="event-detail-meta">
            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${activeEvent.time}</span>
            </div>

            <div class="event-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
              </svg>
              <span>${activeEvent.modality}</span>
            </div>

            ${activeEvent.location ? `
              <div class="event-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${activeEvent.location}</span>
              </div>
            ` : ''}
          </div>

          <!-- Linha de Botões de Ação -->
          <div class="event-detail-actions-row">
            <a href="${activeEvent.actionUrl || ('/new/evento?id=' + encodeURIComponent(activeEvent.id))}" class="event-detail-cta-btn" title="Confira os detalhes do evento">
              <span>Confira</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>

            <!-- Botão com Menu de Exportação de Agenda -->
            <div class="agenda-export-dropdown-wrapper">
              <button type="button" class="event-export-trigger-btn" id="drawerExportTriggerBtn" aria-haspopup="true" aria-expanded="false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Salvar na Agenda</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="agenda-export-menu" id="drawerExportMenu">
                <a href="${this.generateGoogleCalendarUrl(activeEvent)}" target="_blank" rel="noopener noreferrer" class="export-menu-item">
                  <span class="export-menu-icon google">G</span>
                  Google Calendar
                </a>
                <button type="button" class="export-menu-item" data-export="apple" data-event-id="${activeEvent.id}">
                  <span class="export-menu-icon apple"></span>
                  Apple Agenda (.ics)
                </button>
                <button type="button" class="export-menu-item" data-export="outlook" data-event-id="${activeEvent.id}">
                  <span class="export-menu-icon outlook">O</span>
                  Outlook (.ics)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    drawer.classList.add('is-open');

    // Botão de fechar
    const closeBtn = document.getElementById('eventDetailCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapseEventDrawer();
        this.selectedDateStr = null;
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
      });
    }

    // Abas de múltiplos eventos
    inner.querySelectorAll('.agenda-drawer-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const evId = tabBtn.getAttribute('data-event-id');
        this.activeEventId = evId;
        this.expandEventDrawer(eventsList, dateStr, evId);
      });
    });

    this.attachExportMenuEvents();
  }

  expandEmptyDrawer(dateStr) {
    const drawer = document.getElementById('agendaExpandableDrawer');
    const inner = document.getElementById('agendaDrawerInner');
    if (!drawer || !inner) return;

    const parts = dateStr.split('-');
    const dayNum = parts[2];
    const monthShort = this.monthShortNames[parseInt(parts[1], 10) - 1];

    inner.innerHTML = `
      <div class="agenda-event-empty-box">
        <div class="empty-header-row">
          <span class="empty-date-tag">${dayNum} ${monthShort}</span>
          <button type="button" class="event-detail-close-btn" id="eventDetailCloseBtn" title="Recolher detalhes">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="empty-text">Nenhum evento agendado para este dia.</p>
      </div>
    `;

    drawer.classList.add('is-open');

    const closeBtn = document.getElementById('eventDetailCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapseEventDrawer();
        this.selectedDateStr = null;
        this.container.querySelectorAll('.agenda-day-cell.is-selected').forEach(c => c.classList.remove('is-selected'));
      });
    }
  }

  collapseEventDrawer() {
    const drawer = document.getElementById('agendaExpandableDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
    }
  }

  generateGoogleCalendarUrl(event) {
    const dateClean = event.date.replace(/-/g, '');
    const endDateClean = (event.endDate || event.date).replace(/-/g, '');
    const startH = (event.startTime || '08:00').replace(':', '') + '00';
    const endH = (event.endTime || '18:00').replace(':', '') + '00';
    const dates = `${dateClean}T${startH}/${endDateClean}T${endH}`;

    const title = encodeURIComponent(event.title || 'Evento SBHCI');
    const details = encodeURIComponent(
      `${event.subtitle || ''}\n\nLocal: ${event.location || ''}\nModalidade: ${event.modality || ''}\nAcesso: ${window.location.origin}${event.actionUrl || ''}`
    );
    const location = encodeURIComponent(event.location || event.modality || 'CathlabFlix Online');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  downloadIcs(event) {
    const dateClean = event.date.replace(/-/g, '');
    const endDateClean = (event.endDate || event.date).replace(/-/g, '');
    const startH = (event.startTime || '08:00').replace(':', '') + '00';
    const endH = (event.endTime || '18:00').replace(':', '') + '00';
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CathlabFlix//Agenda Oficial SBHCI 2027//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id || 'event'}-${Date.now()}@cathlabflix.org`,
      `DTSTAMP:${nowIso}`,
      `DTSTART:${dateClean}T${startH}`,
      `DTEND:${endDateClean}T${endH}`,
      `SUMMARY:${(event.title || 'Evento SBHCI').replace(/,/g, '\\,')}`,
      `DESCRIPTION:${(event.subtitle || '').replace(/,/g, '\\,')}\\n\\nLocal: ${(event.location || '').replace(/,/g, '\\,')}\\nModalidade: ${(event.modality || '').replace(/,/g, '\\,')}`,
      `LOCATION:${(event.location || event.modality || 'CathlabFlix').replace(/,/g, '\\,')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id || 'evento-sbhci'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  attachExportMenuEvents() {
    const triggers = this.container.querySelectorAll('#drawerExportTriggerBtn, .list-action-export-btn');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wrapper = btn.closest('.agenda-export-dropdown-wrapper');
        if (!wrapper) return;
        const menu = wrapper.querySelector('.agenda-export-menu');
        if (!menu) return;

        const isOpen = menu.classList.contains('is-open');
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));

        if (!isOpen) {
          menu.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    this.container.querySelectorAll('.export-menu-item[data-export]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const evId = item.getAttribute('data-event-id');
        const event = this.events.find(ev => ev.id === evId);
        if (event) {
          this.downloadIcs(event);
        }
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.agenda-export-dropdown-wrapper')) {
        this.container.querySelectorAll('.agenda-export-menu.is-open').forEach(m => m.classList.remove('is-open'));
      }
    });
  }

  attachEventListeners() {
    const monthViewBtn = document.getElementById('agendaViewMonthBtn');
    const listViewBtn = document.getElementById('agendaViewListBtn');

    if (monthViewBtn) {
      monthViewBtn.addEventListener('click', () => {
        if (this.currentView === 'month') return;
        this.currentView = 'month';
        monthViewBtn.classList.add('active');
        monthViewBtn.setAttribute('aria-selected', 'true');
        if (listViewBtn) {
          listViewBtn.classList.remove('active');
          listViewBtn.setAttribute('aria-selected', 'false');
        }
        this.renderContent();
      });
    }

    if (listViewBtn) {
      listViewBtn.addEventListener('click', () => {
        if (this.currentView === 'list') return;
        this.currentView = 'list';
        listViewBtn.classList.add('active');
        listViewBtn.setAttribute('aria-selected', 'true');
        if (monthViewBtn) {
          monthViewBtn.classList.remove('active');
          monthViewBtn.setAttribute('aria-selected', 'false');
        }
        this.renderContent();
      });
    }

    const prevBtn = document.getElementById('agendaPrevMonthBtn');
    const nextBtn = document.getElementById('agendaNextMonthBtn');
    const todayBtn = document.getElementById('agendaTodayBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.collapseEventDrawer();
        this.renderMonthDays();
      });
    }

    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        const now = new Date();
        this.currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        this.selectedDateStr = `${y}-${m}-${d}`;

        const dayEvents = this.getFilteredEventsForDate(this.selectedDateStr);
        if (dayEvents.length > 0) {
          this.activeEventId = dayEvents[0].id;
          this.expandEventDrawer(dayEvents, this.selectedDateStr, this.activeEventId);
        } else {
          this.collapseEventDrawer();
        }
        this.renderMonthDays();
      });
    }

  }

  setEvents(newEvents) {
    this.events = newEvents;
    this.renderContent();
  }
}

// Exportação global
window.ModernAgendaCalendar = ModernAgendaCalendar;
