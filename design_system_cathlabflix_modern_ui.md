## 1. Cores

O novo visual adota uma abordagem "Light Theme" para a interface geral, mantendo forte contraste e utilizando o vermelho vibrante como destaque principal, inspirado em plataformas de streaming modernas.

| Nome | Hexadecimal | Uso Recomendado | Estados | 
| ----- | ----- | ----- | ----- | 
| **Brand Primary (Streaming Red)** | `#E50914` | Botões de ação principais, tags ativas, ícones de play, estado ativo no menu. | Hover: `#B80710` / Ativo: `#8C050C` | 
| **Background Base** | `#F5F6F8` | Fundo principal da aplicação (fora dos cards e sidebar). | \- | 
| **Surface White** | `#FFFFFF` | Fundo da sidebar, barra de pesquisa, cards de conteúdo. | \- | 
| **Surface Dark (Banner/Nav)** | `#1A1C20` | Fundo do menu mobile flutuante, botões secundários no banner escuro. | \- | 
| **Text Primary** | `#141414` | Títulos, textos principais em fundos claros. | \- | 
| **Text Secondary** | `#757A82` | Subtítulos, metadados (ano, duração), placeholders, links inativos. | \- | 
| **Overlay Gradient** | `#000000` | Usado com opacidade (ex: `rgba(0,0,0,0.7)`) sobre imagens do Banner e Cards. | \- | 

## 2. Tipografia

* **Família Primária:** `Inter`, `SF Pro Display`, `sans-serif` (tipografia neutra, altamente legível e moderna).

* **Pesos (Weights):**

  * *Regular (400):* Corpo de texto, categorias inativas, metadados.

  * *Medium (500):* Links de navegação, botões de ação secundária, itens da sidebar.

  * *SemiBold (600):* Títulos de seções ("You Might Like"), títulos de cards pequenos.

  * *Bold (700):* Títulos principais do Banner Hero, botão primário.

* **Escala de Tamanhos (App-like):**

  * `xs`: 12px (metadados, tags pequenas).

  * `sm`: 14px (itens de menu, botões de categorias).

  * `md`: 16px (corpo de texto, barra de busca).

  * `lg`: 20px (títulos de cards, títulos de seções secundárias).

  * `xl`: 24px (títulos de blocos principais).

  * `xxl`: 48px+ (Título do Banner tela inteira).

## 3. Tokens CSS

```css
:root {
  /* Cores */
  --color-primary: #E50914;
  --color-primary-hover: #B80710;
  --color-bg-base: #F5F6F8;
  --color-surface: #FFFFFF;
  --color-surface-dark: #1A1C20;
  --color-text-primary: #141414;
  --color-text-secondary: #757A82;
  --color-text-inverse: #FFFFFF;

  /* Tipografia */
  --font-family-base: 'Inter', sans-serif;
  
  /* Espaçamento */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;

  /* Raios de Borda (Soft UI) */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;   /* Usado em cards de vídeo */
  --radius-xl: 32px;   /* Usado na sidebar e modais */
  --radius-pill: 50px; /* Usado em botões e tags */

  /* Sombras (Soft Shadows) */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.08);
  --shadow-floating: 0 12px 32px rgba(0,0,0,0.15); /* Para o menu mobile flutuante */
}
```

## 4. Layout (Híbrido)

* **Hero Banner (Tela Inteira):** Ocupa 100% da largura (`100vw`) e grande parte da altura (`70vh` a `100vh`). Contém imagem de fundo com overlay em gradiente escuro na base para dar leitura ao título, sinopse e botões de ação ("Assistir").
* **Estrutura de Conteúdo (App-style):** 
  * Após o banner, o layout adota uma estrutura com Sidebar à esquerda (navegação, perfil) com fundo branco e bordas super arredondadas (`--radius-xl`), e o conteúdo principal à direita.
  * O fundo geral atrás da sidebar e conteúdo é o `--color-bg-base` (cinza muito claro), criando a sensação de elementos "flutuando" na tela.
* **Carrosséis / Listas:** Em vez de grids estritos, usar listas de rolagem horizontal (overflow-x) escondendo a barra de rolagem, típico de interfaces de streaming.

## 5. Componentes

* **Botões:**
  * *Pill Primary:* Fundo `--color-primary` ou `--color-surface` (no banner escuro), bordas `--radius-pill`, texto com ícone (ex: Play). 
  * *Categorias (Tags):* Formato de pílula (`--radius-pill`). Ativas recebem fundo vermelho e texto branco; Inativas recebem texto cinza e fundo transparente (ou branco).
* **Sidebar (Navegação):**
  * Fundo branco, margem ao redor (não encosta nas bordas da tela), cantos arredondados (`24px`).
  * Item ativo com bolinha vermelha lateral ou ícone e texto vermelhos.
* **Cards de Conteúdo (Thumbnails):**
  * Cantos bem arredondados (`--radius-lg`), sem bordas.
  * Imagem ocupa 100% do card, com um sutil gradiente preto na base.
  * Título e ano aplicados sobre o gradiente na parte inferior, em branco.
  * Botão de Play circular (vermelho com ícone branco) posicionado no canto inferior direito.
* **Barra de Pesquisa:** Formato de pílula (`--radius-pill`), fundo branco, ícone de lupa à esquerda, sombra muito sutil (`--shadow-sm`).

## 6. Responsividade

* **Mobile (Transformação Radical):**
  * O Banner de tela inteira se mantém, ajustando a tipografia para `--font-size-xl`.
  * **Bottom Navigation Flutuante:** A sidebar de desktop desaparece. Em seu lugar, entra uma barra de navegação inferior flutuante, escura (`--color-surface-dark`), em formato de pílula larga, centralizada no rodapé da tela, contendo apenas os ícones principais (Home, Favoritos, Download, Perfil).
  * Cards adotam rolagem horizontal tátil (swipe).
* **Tablet/Desktop:** Sidebar à esquerda fica visível, conteúdo organiza-se em fileiras horizontais com botão "See all" à direita dos títulos das seções.

## 7. Direção de Imagens e Estilo Visual

* **Glassmorphism e Soft UI:** Uso extensivo de formas arredondadas amigáveis e sombras difusas para separar camadas de informação, abandonando as linhas duras do design corporativo tradicional.
* **Overlays de Imagem:** Para garantir leitura sobre os banners e thumbnails, utiliza-se gradiente linear do preto (`rgba(0,0,0,0.8)`) na parte inferior para transparente no topo ou centro.
* **Ícones:** Estilo "Line" (vazados) para itens inativos, e preenchidos (solid) para o estado ativo na navegação, reforçando a linguagem visual de aplicativos mobile nativos.
