/* ============================================================
   AgroPulse — sidebar.js
   Injeta a sidebar e a topbar em cada página
   ============================================================ */

/* ── SVG ICONS ── */
const icons = {
  painel:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  fazendas:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  talhoes:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  safras:        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V7"/><path d="M5 12C5 8 8 5 12 5c0 4-3 7-7 7z"/><path d="M19 12C19 8 16 5 12 5c0 4 3 7 7 7z"/><path d="M5 18C5 14 8 11 12 11c0 4-3 7-7 7z"/><path d="M19 18C19 14 16 11 12 11c0 4 3 7 7 7z"/></svg>`,
  colheitas:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  funcionarios:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  estoque:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  clientes:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
  financeiro:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  relatorios:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  configuracoes: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`
};

/* ── NAV STRUCTURE ── */
const NAV_ITEMS = [
  { section: 'Principal' },
  { id: 'painel',        label: 'Painel',         href: 'painel.html',         icon: icons.painel },
  { section: 'Produção' },
  { id: 'fazendas',      label: 'Fazendas',        href: 'fazendas.html',       icon: icons.fazendas },
  { id: 'talhoes',       label: 'Talhões',         href: 'talhoes.html',        icon: icons.talhoes },
  { id: 'safras',        label: 'Safras',          href: 'safras.html',         icon: icons.safras },
  { id: 'colheitas',     label: 'Colheitas',       href: 'colheitas.html',      icon: icons.colheitas },
  { section: 'Recursos' },
  { id: 'funcionarios',  label: 'Funcionários',    href: 'funcionarios.html',   icon: icons.funcionarios },
  { id: 'estoque',       label: 'Estoque',         href: 'estoque.html',        icon: icons.estoque },
  { section: 'Comercial' },
  { id: 'clientes',      label: 'Clientes',        href: 'clientes.html',       icon: icons.clientes },
  { section: 'Gestão' },
  { id: 'financeiro',    label: 'Financeiro',      href: 'financeiro.html',     icon: icons.financeiro },
  { id: 'relatorios',    label: 'Relatórios',      href: 'relatorios.html',     icon: icons.relatorios },
  { id: 'configuracoes', label: 'Configurações',   href: 'configuracoes.html',  icon: icons.configuracoes },
];

/* ── BUILD HELPERS ── */
function buildNav(activePage) {
  return NAV_ITEMS.map(item => {
    if (item.section) {
      return `<div class="nav-section">${item.section}</div>`;
    }
    const active = item.id === activePage ? ' active' : '';
    return `<a class="nav-item${active}" href="${item.href}">
      <span class="nav-icon">${item.icon}</span>${item.label}
    </a>`;
  }).join('');
}

/* ── PUBLIC: renderLayout ── */
window.renderLayout = function (activePage, pageTitle, showNewBtn) {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const pageContent = appEl.innerHTML;

  const sidebarHTML = `
  <aside class="sidebar" id="sidebar">
    <div class="logo-area">
      <div class="logo-row">
        <div class="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22V12M12 12C12 7 7 4 2 4c0 5 3 8 10 8zM12 12c0-5 5-8 10-8-1 5-4 8-10 8"/>
          </svg>
        </div>
        <div>
          <div class="logo-text">AgroPulse</div>
          <div class="logo-sub">Gestão Inteligente</div>
        </div>
      </div>
    </div>
    <nav class="nav">${buildNav(activePage)}</nav>
    <a class="user-area" href="perfil.html">
      <div class="user-avatar" id="userAvatar">U</div>
      <div>
        <div class="user-name" id="userName">Usuário</div>
        <div class="user-role" id="userRole">Administrador</div>
      </div>
    </a>
  </aside>`;

  const apiBarHTML = `
  <div class="api-bar">
    <div class="api-dot" id="apiDot"></div>
    <span>API:</span>
    <input type="text" id="apiUrl" value="${localStorage.getItem('agropulse_api') || 'http://localhost:8000'}" onchange="updateApi()" onblur="testApi()"/>
    <span id="apiStatus">verificando...</span>
  </div>`;

  const topbarHTML = `
  <div class="sidebar-overlay" id="sidebarOverlay"></div>
  <div class="topbar">
    <div class="topbar-left">
      <button class="menu-toggle" onclick="toggleSidebar()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="page-title">${pageTitle}</div>
    </div>
    <div class="topbar-actions">
      <button class="btn btn-ghost" onclick="reloadPage()">↻ Atualizar</button>
      ${showNewBtn ? '<button class="btn btn-primary" id="btnNovo" onclick="openModal()">+ Novo</button>' : ''}
    </div>
  </div>`;

  // Replace #app with full layout
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:contents';
  wrapper.innerHTML = sidebarHTML;

  const main = document.createElement('div');
  main.className = 'main';
  main.innerHTML = apiBarHTML + topbarHTML + `<div class="content" id="pageContent">${pageContent}</div>`;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.id = 'toast';

  appEl.replaceWith(...wrapper.childNodes, main, toast);
};
