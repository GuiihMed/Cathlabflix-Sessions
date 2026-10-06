## 1. Cores

A página interna mantém a estética "Soft UI / Streaming" focada no conforto visual para longos períodos de estudo.

| Nome | Hexadecimal | Uso Recomendado | Estados |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#E50914` | Indicador de aula ativa, botão de download (hover), barra de progresso do player. | Hover: `#B80710` |
| **Background Base** | `#F5F6F8` | Fundo geral da página, garantindo contraste suave. | - |
| **Surface White** | `#FFFFFF` | Fundo dos cards de materiais (PPTX), área de comentários (se houver). | - |
| **Surface Dark** | `#1A1C20` | Fundo do Video Player. | - |
| **Text Primary** | `#141414` | Títulos da aula, nome dos arquivos PPTX. | - |
| **Text Secondary** | `#757A82` | Descrição da aula, duração, tamanho dos arquivos (ex: 2.4MB). | - |
| **Hover / Active Subdued** | `#EAECEF` | Fundo de hover para os itens da playlist e cards de arquivo. | - |

## 2. Tipografia

*   **Família Primária:** `Inter`, `SF Pro Display`, `sans-serif`.
*   **Escala na Página Interna:**
    *   `xs` (12px): Tags de categoria, tamanho do arquivo PPTX, tempo de vídeo.
    *   `sm` (14px): Títulos das aulas na playlist (coluna direita).
    *   `md` (16px): Descrição da aula atual.
    *   `lg` (20px): Título da seção "Materiais de Apoio" e "Próximas Aulas".
    *   `xl` (28px): Título principal da Aula em Evidência.

## 3. Tokens CSS (Extensão para Página Interna)

```css
:root {
  /* ... (Cores e tipografia base mantidas) ... */

  /* Raios de Borda Específicos (Soft UI) */
  --radius-sm: 8px;    /* Imagens miniatura da playlist */
  --radius-md: 16px;   /* Cards de arquivos PPTX */
  --radius-lg: 24px;   /* Video Player principal */
  --radius-pill: 50px; /* Badges e botões de ícone */

  /* Sombras */
  --shadow-card: 0 4px 16px rgba(0,0,0,0.05); /* Sombra suave para o player e arquivos */
}
```

## 4. Layout (Página de Aula)

*   **Grid Principal (Desktop):** Divisão em duas colunas assimétricas.
    *   **Coluna Esquerda (Main):** Ocupa `70%` da largura (ou `7fr` no CSS Grid). Contém o Player, Informações e Materiais.
    *   **Coluna Direita (Sidebar):** Ocupa `30%` da largura (ou `3fr`). Dedicada exclusivamente à Playlist (Próximas Aulas).
*   **Gap (Espaçamento):** `32px` de distância entre a coluna principal e a sidebar.

## 5. Componentes Específicos

### A. Video Player (Em Evidência)
*   **Proporção:** 16:9 estrito.
*   **Visual:** Arredondamento alto (`var(--radius-lg)`), fundo preto (`--color-surface-dark`).
*   **Sombras:** Leve sombra (`--shadow-card`) para destacar o player do fundo cinza claro.

### B. Cards de Material de Apoio (PPTX/Arquivos)
*   **Layout:** Horizontal (Flexbox linha).
*   **Formato:** Fundo branco (`--color-surface`), bordas de `16px`, padding interno de `16px`.
*   **Conteúdo:** 
    *   Esquerda: Ícone de documento (fundo circular suave).
    *   Centro: Nome do arquivo (Bold) + Tamanho/Formato (Regular, texto secundário).
    *   Direita: Botão de ícone (Seta de Download `↓`), formato circular (`--radius-pill`).

### C. Itens da Playlist (Coluna Direita)
*   **Estrutura:** Lista com `overflow-y: auto` (scroll vertical interno) e altura máxima definida para não quebrar o layout da página.
*   **Thumbnail:** Imagem em 16:9 reduzida, bordas de `8px`.
*   **Estado Ativo (Aula Atual):** Card ganha fundo translúcido vermelho ou cinza, com um ícone de equalizador animado ou tag "Assistindo" em vermelho.
*   **Hover:** Mudança sutil no fundo (`#EAECEF`) e cursor de "mãozinha" para indicar interatividade.

## 6. Responsividade (Mobile First Adaptado)

*   **Mobile (< 992px):**
    *   O Grid de 2 colunas se transforma em 1 coluna (`100%` de largura).
    *   **Ordem de Elementos:** 1. Video Player -> 2. Título e Descrição -> 3. Materiais de Apoio (PPTX) -> 4. Playlist de Aulas.
    *   **Player Sticky:** Ao rolar a tela, o Video Player pode se fixar no topo (`position: sticky`) com tamanho reduzido, permitindo que o usuário assista enquanto lê ou baixa arquivos.
*   **Tablet e Desktop (> 992px):**
    *   Retorna ao formato 70/30.
    *   Scroll da página rola todo o conteúdo esquerdo, enquanto a playlist na direita pode ter seu próprio scroll interno.