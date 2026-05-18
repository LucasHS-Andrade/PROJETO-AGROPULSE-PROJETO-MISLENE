# AgroPulse — Guia Completo de Arquitetura Frontend Profissional

> Documento técnico: estrutura, organização, boas práticas e escalabilidade.

---

## 1. Estrutura Final do Projeto

```
AgroPulse/
│
├── index.html                  ← Ponto de entrada (redireciona para login)
├── login.html                  ← Tela de autenticação
│
├── pages/                      ← Páginas independentes da aplicação
│   ├── painel.html             ← Dashboard principal (SPA com stats)
│   ├── fazendas.html           ← CRUD de fazendas
│   ├── talhoes.html            ← CRUD de talhões
│   ├── safras.html             ← CRUD de safras
│   ├── colheitas.html          ← CRUD de colheitas
│   ├── funcionarios.html       ← CRUD de funcionários
│   ├── clientes.html           ← CRUD de clientes
│   ├── estoque.html            ← Controle de insumos/estoque
│   ├── financeiro.html         ← Módulo financeiro
│   ├── relatorios.html         ← Central de relatórios
│   ├── configuracoes.html      ← Configurações do sistema
│   └── perfil.html             ← Perfil do usuário
│
├── css/                        ← Estilos separados por responsabilidade
│   ├── global.css              ← Variáveis CSS, reset, base
│   ├── login.css               ← Estilos exclusivos da tela de login
│   ├── sidebar.css             ← Sidebar e navegação lateral
│   ├── topbar.css              ← Topbar, API bar, botões
│   ├── dashboard.css           ← Layout principal (app-shell, main, content)
│   ├── cards.css               ← Cards, stat cards, badges
│   ├── tables.css              ← Tabelas, formulários, empty/loading states
│   ├── modal.css               ← Modal e toast notifications
│   └── responsive.css          ← Todos os media queries
│
├── js/                         ← JavaScript separado por módulo
│   ├── api.js                  ← Comunicação com a API REST
│   ├── app.js                  ← Bootstrap da aplicação + Toast utility
│   ├── dashboard.js            ← Config dos módulos + navegação + stats
│   ├── login.js                ← Lógica da tela de login
│   ├── modal.js                ← Controle do modal
│   ├── router.js               ← Roteamento hash-based
│   ├── sidebar.js              ← Comportamento da sidebar
│   └── tables.js               ← Renderização de tabelas + CRUD helpers
│
├── partials/                   ← Componentes HTML reutilizáveis (referência)
│   ├── sidebar.html            ← HTML da sidebar isolado
│   ├── topbar.html             ← HTML da topbar isolado
│   └── modal.html              ← HTML do modal isolado
│
├── assets/                     ← Recursos estáticos
│   ├── images/                 ← Imagens gerais
│   ├── icons/                  ← Ícones customizados
│   └── backgrounds/            ← Imagens de fundo
│       └── background.jpg      ← Background do login
│
└── data/
    └── mock.json               ← Dados de exemplo para desenvolvimento
```

---

## 2. Como Implementar do Zero no VSCode

### Passo 1 — Instalar as Ferramentas

1. Baixe e instale o **VSCode**: https://code.visualstudio.com
2. Abra o VSCode → Extensions (Ctrl+Shift+X)
3. Instale a extensão **Live Server** (por Ritwick Dey)
4. Opcional: instale **Prettier** para formatação automática

### Passo 2 — Criar a Estrutura de Pastas

Abra o terminal integrado no VSCode (Ctrl+`) e execute:

```bash
# Crie a pasta raiz
mkdir AgroPulse
cd AgroPulse

# Crie as subpastas
mkdir pages css js partials data
mkdir -p assets/images assets/icons assets/backgrounds
```

Ou use a interface do VSCode: clique com o botão direito no Explorer → "New Folder".

### Passo 3 — Criar os Arquivos

Na barra lateral do VSCode, clique com o botão direito na pasta de destino e escolha **"New File"**. Nomeie seguindo exatamente a estrutura acima.

**Regras de nomenclatura profissional:**
- Sempre **minúsculas**: `sidebar.css`, não `Sidebar.css`
- **Sem espaços**: use hifens (`meu-arquivo.js`) ou camelCase (`meuArquivo.js`)
- **Sem acentos** nos nomes de arquivo
- **Extensões corretas**: `.html`, `.css`, `.js`, `.json`

### Passo 4 — Importar CSS Corretamente

Cada página importa os CSS na `<head>`. O caminho é **relativo** à localização do arquivo HTML.

**Dentro de `/pages/*.html`** (um nível dentro da raiz):
```html
<link rel="stylesheet" href="../css/global.css">
<link rel="stylesheet" href="../css/sidebar.css">
```
O `../` sobe um nível de pasta.

**Na raiz (`login.html`):**
```html
<link rel="stylesheet" href="css/global.css">
<link rel="stylesheet" href="css/login.css">
```
Sem `../` porque já está na raiz.

**Ordem de importação importa:**
```html
<!-- 1. Variáveis e reset (base de tudo) -->
<link rel="stylesheet" href="../css/global.css">

<!-- 2. Componentes específicos -->
<link rel="stylesheet" href="../css/sidebar.css">
<link rel="stylesheet" href="../css/topbar.css">
<link rel="stylesheet" href="../css/dashboard.css">
<link rel="stylesheet" href="../css/cards.css">
<link rel="stylesheet" href="../css/tables.css">
<link rel="stylesheet" href="../css/modal.css">

<!-- 3. Responsive sempre por último (sobrescreve os anteriores) -->
<link rel="stylesheet" href="../css/responsive.css">
```

### Passo 5 — Importar JavaScript Corretamente

Scripts vão **antes de `</body>`** (nunca no `<head>` sem `defer`).

```html
<!-- Ordem correta: dependências antes de quem depende -->
<script src="../js/api.js"></script>       <!-- sem dependências externas -->
<script src="../js/tables.js"></script>    <!-- usa Api -->
<script src="../js/modal.js"></script>     <!-- usa Dashboard, Api, Toast -->
<script src="../js/sidebar.js"></script>   <!-- usa Dashboard -->
<script src="../js/dashboard.js"></script"><!-- usa Api, Tables -->
<script src="../js/router.js"></script>    <!-- usa Dashboard -->
<script src="../js/app.js"></script>       <!-- usa tudo, roda por último -->
```

### Passo 6 — Usar Caminhos Relativos Corretamente

| Localização do arquivo | Para acessar `/css/global.css` | Para acessar `/assets/backgrounds/bg.jpg` |
|------------------------|-------------------------------|-------------------------------------------|
| `/login.html` (raiz)   | `css/global.css`              | `assets/backgrounds/bg.jpg`               |
| `/pages/painel.html`   | `../css/global.css`           | `../assets/backgrounds/bg.jpg`            |
| `/pages/sub/file.html` | `../../css/global.css`        | `../../assets/backgrounds/bg.jpg`         |

**Regra:** `../` = "suba um nível de pasta"

### Passo 7 — Rodar com Live Server

1. Clique com o botão direito no arquivo `index.html` ou `login.html`
2. Selecione **"Open with Live Server"**
3. O navegador abrirá automaticamente em `http://127.0.0.1:5500`

> ⚠️ Nunca abra os arquivos `.html` diretamente com duplo clique no explorador de arquivos. O protocolo `file://` bloqueia requests fetch. Use sempre o Live Server.

---

## 3. Diferença Entre os Arquivos CSS

### `global.css` — A Fundação
Define as **variáveis CSS (design tokens)** e o **reset universal**. É importado em TODAS as páginas e carregado PRIMEIRO.

```css
:root {
  --c-primary: #1e6e3e;   /* cor primária usada em todo o sistema */
  --font-ui: 'DM Sans';   /* tipografia padrão */
  --radius: 6px;          /* borda arredondada padrão */
}
```

**Por que separar?** Qualquer mudança aqui afeta o sistema inteiro. Se quiser mudar a cor primária de verde para azul, muda apenas UMA linha no `global.css`.

### `sidebar.css` — Navegação Lateral
Contém APENAS os estilos da sidebar: `.sidebar`, `.nav-item`, `.logo-area`, `.user-area`. Não deve ter nenhuma referência a tabelas ou modais.

### `dashboard.css` — Shell da Aplicação
Define o **layout estrutural**: `.app-shell`, `.main`, `.content`. São os containers que posicionam sidebar + área principal lado a lado. Não deve ter cores ou tipografia específica.

### `responsive.css` — Adaptações Mobile
Contém TODOS os `@media (max-width: ...)` do projeto. Carregado por ÚLTIMO para ter prioridade sobre os outros arquivos. Isso evita duplicação de media queries espalhadas em vários arquivos.

**Analogia:** `global.css` é o DNA do projeto. `sidebar.css` é o órgão específico. `dashboard.css` é o esqueleto. `responsive.css` é a adaptação ao ambiente.

---

## 4. Diferença Entre os Arquivos JavaScript

### `api.js` — Camada de Dados
Única responsabilidade: **falar com o backend**. Encapsula `fetch()`, tratamento de erros HTTP, e configuração da URL base. Nenhum outro arquivo deveria fazer `fetch()` diretamente.

```javascript
// Correto: toda comunicação passa por api.js
const data = await Api.get('/api/v1/fazendas');

// Errado: fetch direto espalhado pelo código
const data = await fetch('http://localhost:8000/api/v1/fazendas');
```

**Por que?** Se a URL mudar, o método de autenticação mudar (ex: adicionar JWT token), ou você quiser adicionar retry/cache, muda APENAS em `api.js`.

### `app.js` — Ponto de Entrada
Roda quando a página carrega (`DOMContentLoaded`). Conecta os módulos: restaura sessão do usuário, vincula eventos de botões, e chama `Router.init()`. É o "maestro" que liga tudo.

### `dashboard.js` — Conhecimento do Domínio
É o módulo mais "inteligente". Sabe quais módulos existem (fazendas, safras, etc.), quais colunas cada tabela tem, como é o formulário de cada um, e como transformar os dados da API em linhas de tabela. Se você adicionar um novo módulo (ex: "contratos"), é aqui que você configura.

### `router.js` — Endereço na URL
Lê o hash da URL (`painel.html#fazendas`) e navega para a página correta. Permite que o usuário possa favoritar uma URL específica e ela funcione. Sem o router, o hash seria ignorado.

---

## 5. Por Que Esta Arquitetura é Profissional

### Separação de Responsabilidades (SoC)
Cada arquivo tem UM propósito. `api.js` fala com o servidor. `modal.js` gerencia o modal. Isso significa que você pode **mudar o modal sem tocar na API**, e vice-versa. Em times, duas pessoas podem trabalhar em partes diferentes sem conflito.

### Design System com CSS Variables
```css
:root { --c-primary: #1e6e3e; }
```
Um sistema de variáveis CSS é a base de qualquer design system profissional (como o da Shopify, GitHub, Stripe). Você garante que o verde do botão e o verde do badge são **exatamente** o mesmo verde.

### Módulos JavaScript com IIFE/Namespace
```javascript
const Api = (() => { /* ... */ return { get, post }; })();
```
Evita poluição do escopo global. As funções internas são privadas. Apenas o que está no `return {}` é público. Isso é o padrão **Module Pattern**, precursor dos ES Modules e CommonJS.

### Como Empresas SaaS Organizam Isso
Empresas como Notion, Linear, e Vercel usam exatamente esses princípios, porém com ferramentas modernas (React, TypeScript, Vite). A estrutura mental é a mesma:

| Princípio | Este projeto | React/TypeScript |
|-----------|-------------|-----------------|
| Componentes | `partials/*.html` | `.tsx` components |
| Estilos scoped | `sidebar.css` | CSS Modules / Tailwind |
| Camada de dados | `api.js` | React Query / SWR |
| Roteamento | `router.js` | React Router / Next.js |
| Estado global | `sessionStorage` | Zustand / Redux |

---

## 6. Como Evitar Erros Comuns

### ❌ `<button>` dentro de `<a>` (HTML inválido)
```html
<!-- ERRADO -->
<a href="painel.html"><button>Entrar</button></a>

<!-- CORRETO -->
<button onclick="location.href='painel.html'">Entrar</button>
<!-- ou -->
<a href="painel.html" class="btn btn-primary">Entrar</a>
```

### ❌ JavaScript inline no HTML
```html
<!-- ERRADO: difícil de manter -->
<button onclick="fetch('http://localhost:8000/api/fazendas').then(...)">Salvar</button>

<!-- CORRETO: JS separado -->
<button id="saveBtn">Salvar</button>
<script> document.getElementById('saveBtn').onclick = () => Api.post(...); </script>
```

### ❌ Carregar scripts no `<head>` sem `defer`
```html
<!-- ERRADO: bloqueia renderização da página -->
<head><script src="app.js"></script></head>

<!-- CORRETO: carrega após o HTML -->
<body>
  <!-- conteúdo... -->
  <script src="../js/app.js"></script>
</body>

<!-- TAMBÉM CORRETO: com defer -->
<head><script src="../js/app.js" defer></script></head>
```

### ❌ Caminhos absolutos que quebram em produção
```html
<!-- ERRADO: só funciona na sua máquina -->
<link href="C:\Users\joao\AgroPulse\css\global.css">

<!-- CORRETO: caminho relativo -->
<link href="../css/global.css">
```

### ❌ Duplicação de CSS
```css
/* ERRADO: mesmo estilo em 3 arquivos diferentes */
/* sidebar.css */ .btn { padding: 7px 16px; }
/* modal.css   */ .btn { padding: 7px 16px; }
/* tables.css  */ .btn { padding: 7px 16px; }

/* CORRETO: centralizado em topbar.css ou global.css */
/* topbar.css  */ .btn { padding: 7px 16px; }
```

---

## 7. Como Escalar o Projeto Futuramente

### Etapa 1 — Adicionar Novo Módulo (ex: Contratos)

1. Em `js/dashboard.js`, adicione o objeto na constante `modules`:
```javascript
contratos: {
  title: 'Contratos',
  endpoint: '/api/v1/contratos',
  cols: ['ID', 'Cliente', 'Valor', 'Status'],
  fields: r => [r.id, r.cliente_nome, 'R$ '+r.valor, Tables.badge(r.status)],
  form: `<div class="form-grid">...</div>`,
  payload: () => ({ ... }),
}
```

2. Em `pages/painel.html`, adicione o nav-item na sidebar e a section `.page`:
```html
<div class="nav-item" data-page="contratos" onclick="location.href='contratos.html'">Contratos</div>
<!-- E a page section: -->
<section class="page" id="page-contratos">...</section>
```

3. Crie `pages/contratos.html` copiando o template de `fazendas.html`.

### Etapa 2 — Integrar Backend Real

Quando o backend FastAPI (ou qualquer outro) estiver rodando:

1. Configure a URL na **API Bar** do dashboard
2. Os endpoints esperados seguem o padrão REST:
   ```
   GET    /api/v1/fazendas        → lista todos
   POST   /api/v1/fazendas        → cria novo
   GET    /api/v1/fazendas/{id}   → busca um
   PUT    /api/v1/fazendas/{id}   → atualiza
   DELETE /api/v1/fazendas/{id}   → exclui
   ```
3. Para adicionar **autenticação JWT**, modifique apenas `api.js`:
```javascript
async request(path, options = {}) {
  const token = sessionStorage.getItem('jwt_token');
  const response = await fetch(_baseUrl + path, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    ...options,
  });
  // ...
}
```
**Uma mudança em um arquivo protege toda a aplicação.**

### Etapa 3 — Migrar para React

A arquitetura atual já reflete os conceitos do React. A migração é didática:

| Vanilla JS (atual) | React equivalente |
|-------------------|------------------|
| `partials/sidebar.html` | `components/Sidebar.tsx` |
| `css/sidebar.css` | `Sidebar.module.css` ou `tw` classes |
| `const Api = ...` | `src/lib/api.ts` |
| `const Dashboard = ...` | `useQuery` + contexto React |
| `router.js` | `React Router` / `Next.js App Router` |
| `sessionStorage` | `useState` + `localStorage` / Zustand |
| `modules` config | Dados em `types.ts` + componentes dinâmicos |

**Migrar gradualmente:**
1. Instale Vite: `npm create vite@latest agropulse-react -- --template react-ts`
2. Copie `css/global.css` para o novo projeto como design tokens
3. Recrie cada `partial` como componente React
4. Substitua `Api.*` por `useQuery` do TanStack Query
5. Substitua `router.js` por `<BrowserRouter>` do React Router

### Etapa 4 — Transformar em SaaS Multi-tenant

Quando o sistema crescer para múltiplos clientes (tenants):

1. **Backend**: adicione coluna `organization_id` em cada tabela
2. **Autenticação**: implemente OAuth2 + refresh tokens
3. **Frontend**: salve o `tenant` no contexto de sessão
4. **API**: todos os requests incluem o tenant no header:
   ```javascript
   headers: { 'X-Tenant-ID': sessionStorage.getItem('tenant_id') }
   ```
5. **Deploy**: Vercel, Netlify, ou AWS S3 + CloudFront para o frontend

---

## 8. Boas Práticas para Manutenção Futura

### Convenção de Nomenclatura
```
Arquivos:      kebab-case     → global.css, login.js
Classes CSS:   kebab-case     → .nav-item, .modal-title
IDs HTML:      camelCase      → #pageTitle, #apiUrl
Funções JS:    camelCase      → loadTable(), openModal()
Constantes JS: PascalCase     → Api, Dashboard, Modal
Variáveis CSS: --prefixo-nome → --c-primary, --sidebar-w
```

### Quando Criar um Novo Arquivo CSS
- Quando um componente tiver **mais de 30 linhas** de CSS próprio
- Quando for reutilizado em **mais de uma página**
- Quando tiver **responsabilidade diferente** dos arquivos existentes

### Quando Criar um Novo Arquivo JS
- Quando a lógica **não se encaixa** nos módulos existentes
- Quando houver mais de **50 linhas** de funções relacionadas a um mesmo tema
- Quando você quiser que a funcionalidade seja **opcionalmente carregada** (ex: só em páginas de relatório)

### Comentários no Código
```javascript
// ── Correto: explica o POR QUÊ, não o O QUÊ ────────
// AbortSignal.timeout evita que requests penduradas bloqueiem
// a UI em conexões lentas. Timeout conservador de 4 segundos.
await fetch(url, { signal: AbortSignal.timeout(4000) });

// ── Errado: descreve o óbvio ────────────────────────
// Faz um fetch para a URL
await fetch(url);
```

### Estrutura de Commit (Git)
```
feat: adiciona módulo de contratos
fix: corrige erro 404 na exclusão de talhão
style: ajusta padding dos stat-cards no mobile
refactor: extrai lógica de badge para tables.js
docs: atualiza README com instruções de setup
```

---

## 9. Fluxo Completo de uma Requisição

```
Usuário clica "Fazendas" na sidebar
        ↓
onclick → location.href = 'fazendas.html'
        ↓
Navegador carrega fazendas.html
        ↓
<link> carrega CSS (global → sidebar → ... → responsive)
        ↓
<script> carrega JS (api → tables → modal → sidebar → dashboard → router → app)
        ↓
DOMContentLoaded dispara app.js → restaura sessão, vincula eventos
        ↓
loadData() é chamado → PageApi.get('/api/v1/fazendas')
        ↓
api.js faz fetch('http://localhost:8000/api/v1/fazendas')
        ↓
Backend retorna JSON com array de fazendas
        ↓
tables.js renderiza <table> com os dados
        ↓
Usuário vê a tabela
```

---

## 10. Checklist de Qualidade

Antes de considerar uma página pronta, verifique:

- [ ] HTML válido (sem `<button>` dentro de `<a>`)
- [ ] CSS com variáveis (sem cores hardcoded como `#1e6e3e` no HTML)
- [ ] JavaScript sem funções globais desnecessárias
- [ ] Caminhos relativos corretos (`../css/` de dentro de `/pages/`)
- [ ] Responsive: testado em 320px, 768px e 1280px
- [ ] Estados de loading e erro implementados nas tabelas
- [ ] Modal com foco automático no primeiro campo
- [ ] Tecla Escape fecha o modal
- [ ] Toast de confirmação após ações (salvar, excluir)
- [ ] Sem `console.log()` no código de produção
- [ ] Sem inline styles desnecessários (`style="..."` no HTML)
- [ ] Sem IDs duplicados na mesma página
- [ ] Scripts carregados antes de `</body>`
- [ ] Atributos `aria-label` em botões sem texto visível
