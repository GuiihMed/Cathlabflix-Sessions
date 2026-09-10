# Cathlabflix Sessions - Exibidor Dinâmico de Vídeos (API Vimeo)

Sistema web construído com **HTML5, CSS3 e JavaScript Puro (Vanilla JS)** para exibição e navegação dinâmica da grade de vídeos de eventos e congressos médicos complexos, integrado à **API v3 do Vimeo**.

---

## 🏛️ Arquitetura de Mapeamento de Dados (3 Níveis)

Como a API do Vimeo não permite buscar subpastas aninhadas em uma única requisição de forma otimizada, a solução emprega um objeto de configuração relacional em `js/config.js`:

```
Nível 1: Dias do Evento (ex: Dia 19, Dia 20, Dia 21)
   └── Nível 2: Salas do Evento (ex: Sala 01, Sala 02, Sala 03)
         └── Nível 3: folder_id do Vimeo (Identificador numérico da pasta)
```

Sempre que o usuário seleciona um Dia ou uma Sala:
1. O estado da aplicação (`state.currentDayId`, `state.currentRoomId`) é atualizado.
2. O script resgata o `folder_id` correspondente no JSON.
3. A chamada `fetch` é disparada para a API do Vimeo (`GET https://api.vimeo.com/me/projects/{folder_id}/videos`), ou para a base de mock (se ativo).
4. As respostas são armazenadas em **cache em memória** por `folder_id` para garantir navegação instantânea e economia de requisições de rede.

---

## 🎨 Interface e Experiência do Usuário (UI/UX)

- **Identidade Visual**: Tema escuro com fundo azul marinho profundo (`#040a23`), cartões em azul escuro (`#0a1540`) e detalhes em ciano/azul claro (`#38bdf8`).
- **Navegação Primária (Dias)**: Sistema de abas no topo. A aba do **dia ativo possui fundo branco (`#ffffff`) e texto escuro (`#040a23`)**, destacando-se fortemente das demais abas que permanecem azul escuro.
- **Navegação Secundária (Salas)**: Barra horizontal imediatamente abaixo dos dias. A sala ativa é identificada por um **sublinhado/linha de destaque em azul mais claro (`#38bdf8`)**.
- **Exibição em Accordion (Lista Expansível)**:
  - **Estado Fechado**: Barra elegante em azul escuro com o título da aula, palestrante, badge de duração e ícone de seta (chevron) apontando para baixo.
  - **Estado Aberto**: Expansão suave via CSS Grid (`0fr` → `1fr`) revelando o player Vimeo na **proporção perfeita 16:9 (`padding-bottom: 56.25%`)** e a seta rotaciona 180° para cima.
- **Comportamento Interativo (Item Único Aberto)**:
  - Apenas **1 accordion permanece aberto por vez**. Ao abrir a "Aula B", a "Aula A" se recolhe automaticamente.
  - **Lazy Loading & Gestão de Áudio**: O `iframe` do Vimeo só é inserido no DOM no momento em que o usuário clica para abrir. Ao fechar a aula, o player é desmontado para cessar imediatamente a reprodução de áudio e evitar consumo desnecessário de dados.
- **Busca em Tempo Real**: Campo de pesquisa para filtrar rapidamente palestras por título, nome do médico/palestrante ou tópicos da sala ativa.

---

## 📁 Estrutura de Arquivos

```
Cathlabflix Sessions/
├── index.html            # Estrutura semântica HTML5, abas e modal
├── README.md             # Documentação técnica e guia de configuração
├── css/
│   ├── variables.css     # Design tokens, paleta #040a23, tipografia, bordas e sombras
│   └── style.css         # Reset, layout flexbox/grid, abas, accordions e proporção 16:9
└── js/
    ├── config.js         # Mapeamento (Dias -> Salas -> folder_id), credenciais e dados Mock
    ├── vimeoService.js   # Cliente API Vimeo v3 com fetch, cache e fallback gracioso
    ├── accordion.js      # Controlador do Accordion (item único, injeção de iframe e acessibilidade)
    └── app.js            # Orquestrador de estado reativo, renderização e eventos
```

---

## ⚙️ Como Personalizar os Dias, Salas e Pastas Reais do Vimeo

Abra o arquivo [`js/config.js`](file:///Users/guilherme-wdcom/Desktop/Cathlabflix%20Sessions/js/config.js) e edite o objeto `EVENT_SCHEDULE`:

```javascript
const EVENT_SCHEDULE = {
  days: [
    {
      id: "dia-19",
      label: "Dia 19",
      subtitle: "19 de Outubro • Abertura e Plenárias",
      rooms: [
        {
          id: "sala-01",
          name: "Sala 01 - Plenária Principal",
          folder_id: "SEU_FOLDER_ID_REAL_AQUI" // ID numérico obtido na URL da pasta no Vimeo
        },
        {
          id: "sala-02",
          name: "Sala 02 - Inovação & TAVI",
          folder_id: "OUTRO_FOLDER_ID_REAL"
        }
      ]
    }
    // Adicione mais dias ou salas conforme necessário
  ]
};
```

> **Como descobrir o `folder_id` no Vimeo?**
> Ao abrir a pasta no painel do Vimeo (ex: `https://vimeo.com/manage/folders/12345678`), o número final na barra de endereço (`12345678`) é o `folder_id`.

---

## 🔑 Como Conectar à API Real do Vimeo

1. Acesse o [Vimeo Developer Console](https://developer.vimeo.com/apps) e crie uma aplicação.
2. Em **Personal Access Tokens**, gere um token com escopos de leitura (`private`, `video_files`).
3. Você pode inserir o token de duas maneiras:
   - **Pela Interface Web**: Clique no botão **"Configurar Vimeo"** no cabeçalho da página, desmarque o modo Mock e cole o seu token.
   - **Diretamente no Código**: No arquivo [`js/config.js`](file:///Users/guilherme-wdcom/Desktop/Cathlabflix%20Sessions/js/config.js):
     ```javascript
     const VIMEO_CONFIG = {
       useMock: false,
       accessToken: "SEU_TOKEN_AQUI",
       apiBaseUrl: "https://api.vimeo.com"
     };
     ```

---

## 🌐 Links do Projeto & Deploy em Produção

- **Repositório GitHub:** [https://github.com/GuiihMed/Cathlabflix-Sessions](https://github.com/GuiihMed/Cathlabflix-Sessions)
- **URL Oficial Vercel:** [https://cathlabflix-sessions.vercel.app](https://cathlabflix-sessions.vercel.app)

### Como incorporar no seu site via Embed (Iframe):
O projeto já conta com cabeçalhos permissivos (`Content-Security-Policy: frame-ancestors *;` e `Access-Control-Allow-Origin: *`) configurados no `vercel.json` para permitir embed sem bloqueios de segurança:

```html
<iframe 
  src="https://cathlabflix-sessions.vercel.app" 
  width="100%" 
  height="900" 
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
  allowfullscreen
  style="border: none; border-radius: 12px; width: 100%; min-height: 850px;"
></iframe>
```

---

## 🚀 Como Executar Localmente

Como o projeto é em JavaScript puro sem dependências externas de compilação:
- Dê dois cliques no arquivo `index.html` para abrir diretamente no seu navegador preferido (Chrome, Safari, Firefox, Edge); ou
- Execute um servidor local simples:
  ```bash
  # Via Python 3
  python3 -m http.server 8000
  ```
  E abra `http://localhost:8000` no navegador.

