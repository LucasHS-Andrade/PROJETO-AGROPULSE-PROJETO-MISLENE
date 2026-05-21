/* ============================================================
   AgroPulse — shared.js
   Funções comuns a todas as páginas
   ============================================================ */

let API = localStorage.getItem('agropulse_api') || 'http://localhost:8000';

/* ── API ── */
function updateApi() {
  const el = document.getElementById('apiUrl');
  if (!el) return;
  API = el.value.replace(/\/$/, '');
  localStorage.setItem('agropulse_api', API);
}

async function testApi() {
  const dot    = document.getElementById('apiDot');
  const status = document.getElementById('apiStatus');
  if (!dot || !status) return;
  try {
    await fetch(API + '/');
    dot.className   = 'api-dot on';
    status.textContent = 'conectado';
  } catch {
    dot.className   = 'api-dot';
    status.textContent = 'sem conexão';
  }
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}

/* ── UI HELPERS ── */
function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function badge(val) {
  if (!val) return '—';
  const map = {
    planejada:    'badge-yellow',
    em_andamento: 'badge-blue',
    colhida:      'badge-green',
    cancelada:    'badge-gray',
    disponivel:   'badge-green',
    em_uso:       'badge-blue',
    manutencao:   'badge-yellow',
    inativo:      'badge-gray',
    PJ:           'badge-blue',
    PF:           'badge-green',
    defensivo:    'badge-yellow',
    fertilizante: 'badge-green',
    semente:      'badge-blue',
    combustivel:  'badge-gray',
    outro:        'badge-gray',
    ativo:        'badge-green',
    inativo2:     'badge-gray',
    pago:         'badge-green',
    pendente:     'badge-yellow',
    vencido:      'badge-gray'
  };
  return `<span class="badge ${map[val] || 'badge-gray'}">${val.replace(/_/g, ' ')}</span>`;
}

function toast(msg, err = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className   = 'toast show' + (err ? ' error' : '');
  setTimeout(() => { t.className = 'toast'; }, 3000);
}

/* ── MODAL ── */
function closeModal() {
  const o = document.getElementById('modalOverlay');
  if (o) o.classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target.id === 'modalOverlay') closeModal();
}

/* ── SIDEBAR ── */
function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('open');
  document.getElementById('sidebarOverlay')?.classList.toggle('open');
}

function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

/* ── USER ── */
function loadUserDisplay() {
  const user   = JSON.parse(localStorage.getItem('agropulse_user') || '{}');
  const name   = user.name || 'Usuário';
  const role   = user.role || 'Administrador';
  const avatar = name[0].toUpperCase();

  const nameEl   = document.getElementById('userName');
  const roleEl   = document.getElementById('userRole');
  const avatarEl = document.getElementById('userAvatar');
  if (nameEl)   nameEl.textContent   = name;
  if (roleEl)   roleEl.textContent   = role;
  if (avatarEl) avatarEl.textContent = avatar;
}

/* ── TABLE HELPER ── */
async function loadTable(module, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Carregando...</div>';
  try {
    const data = await apiFetch(module.endpoint);
    if (!data || !data.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📭</div><div class="empty-text">Nenhum registro encontrado</div></div>';
      return;
    }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr>${module.cols.map(c => `<th>${c}</th>`).join('')}<th>Ações</th></tr></thead>
      <tbody>${data.map(r => `<tr>
        ${module.fields(r).map(f => `<td>${f}</td>`).join('')}
        <td><button class="btn btn-danger btn-sm" onclick="del('${module.endpoint}',${r.id})">Excluir</button></td>
      </tr>`).join('')}</tbody>
    </table></div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar: ${e.message}</div></div>`;
  }
}

async function del(endpoint, id) {
  if (!confirm('Excluir este registro?')) return;
  try {
    await apiFetch(endpoint + '/' + id, { method: 'DELETE' });
    toast('Registro excluído!');
    if (typeof reloadPage === 'function') reloadPage();
  } catch (e) {
    toast('Erro ao excluir: ' + e.message, true);
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Set API input value
  const apiInput = document.getElementById('apiUrl');
  if (apiInput) apiInput.value = API;

  // Close sidebar on overlay click
  document.getElementById('sidebarOverlay')?.addEventListener('click', closeSidebar);

  loadUserDisplay();
  testApi();
});
