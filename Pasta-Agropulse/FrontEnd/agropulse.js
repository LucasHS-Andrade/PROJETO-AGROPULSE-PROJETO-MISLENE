let API = 'http://localhost:8000';
let currentPage = 'painel';

// ── Config de cada módulo ──────────────────────────────
const modules = {
  fazendas: {
    title: 'Fazendas', endpoint: '/api/v1/fazendas',
    cols: ['ID','Nome','Município','Estado','Área (ha)','CNPJ'],
    fields: r => [r.id, r.nome, r.municipio, r.estado, r.area_ha, r.cnpj||'—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Nome</label><input id="f_nome" placeholder="Fazenda Boa Vista"/></div>
        <div class="form-group"><label>Município</label><input id="f_municipio" placeholder="Patos de Minas"/></div>
        <div class="form-group"><label>Estado</label><input id="f_estado" maxlength="2" placeholder="MG"/></div>
        <div class="form-group"><label>Área (ha)</label><input id="f_area_ha" type="number" step="0.01" placeholder="450.5"/></div>
        <div class="form-group"><label>CNPJ</label><input id="f_cnpj" placeholder="00.000.000/0001-00"/></div>
        <div class="form-group"><label>CPF (pessoa física)</label><input id="f_cpf" placeholder="000.000.000-00"/></div>
      </div>`,
    payload: () => ({
      nome: v('f_nome'), municipio: v('f_municipio'), estado: v('f_estado'),
      area_ha: parseFloat(v('f_area_ha')), cnpj: v('f_cnpj')||null, cpf: v('f_cpf')||null
    })
  },
  talhoes: {
    title: 'Talhões', endpoint: '/api/v1/talhoes',
    cols: ['ID','Nome','Fazenda ID','Área (ha)','Solo','Irrigação'],
    fields: r => [r.id, r.nome, r.fazenda_id, r.area_ha, r.tipo_solo||'—', r.irrigacao||'—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Fazenda ID</label><input id="f_fazenda_id" type="number" placeholder="1"/></div>
        <div class="form-group"><label>Nome</label><input id="f_nome" placeholder="Talhão A1"/></div>
        <div class="form-group"><label>Área (ha)</label><input id="f_area_ha" type="number" step="0.01" placeholder="50"/></div>
        <div class="form-group"><label>Tipo de Solo</label><input id="f_tipo_solo" placeholder="Latossolo Vermelho"/></div>
        <div class="form-group"><label>Irrigação</label><input id="f_irrigacao" placeholder="Pivô Central"/></div>
      </div>`,
    payload: () => ({
      fazenda_id: parseInt(v('f_fazenda_id')), nome: v('f_nome'),
      area_ha: parseFloat(v('f_area_ha')), tipo_solo: v('f_tipo_solo')||null,
      irrigacao: v('f_irrigacao')||null
    })
  },
  safras: {
    title: 'Safras', endpoint: '/api/v1/safras',
    cols: ['ID','Cultura','Variedade','Talhão','Ano','Plantio','Status'],
    fields: r => [r.id, r.cultura, r.variedade||'—', r.talhao_id, r.ano, r.data_plantio||'—', badge(r.status)],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Talhão ID</label><input id="f_talhao_id" type="number" placeholder="1"/></div>
        <div class="form-group"><label>Cultura</label><input id="f_cultura" placeholder="Soja"/></div>
        <div class="form-group"><label>Variedade</label><input id="f_variedade" placeholder="TMG 7062 IPRO"/></div>
        <div class="form-group"><label>Ano</label><input id="f_ano" type="number" placeholder="2026"/></div>
        <div class="form-group"><label>Data de Plantio</label><input id="f_data_plantio" type="date"/></div>
        <div class="form-group"><label>Status</label>
          <select id="f_status"><option value="planejada">Planejada</option><option value="em_andamento">Em andamento</option><option value="colhida">Colhida</option><option value="cancelada">Cancelada</option></select>
        </div>
      </div>`,
    payload: () => ({
      talhao_id: parseInt(v('f_talhao_id')), cultura: v('f_cultura'),
      variedade: v('f_variedade')||null, ano: parseInt(v('f_ano')),
      data_plantio: v('f_data_plantio')||null, status: v('f_status')
    })
  },
  colheitas: {
    title: 'Colheitas', endpoint: '/api/v1/colheitas',
    cols: ['ID','Safra ID','Data','Qtd (kg)','Umidade %','Impureza %','Destino'],
    fields: r => [r.id, r.safra_id, r.data, r.quantidade_kg, r.umidade_pct||'—', r.impureza_pct||'—', r.destino||'—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Safra ID</label><input id="f_safra_id" type="number" placeholder="1"/></div>
        <div class="form-group"><label>Data</label><input id="f_data" type="date"/></div>
        <div class="form-group"><label>Quantidade (kg)</label><input id="f_quantidade_kg" type="number" step="0.001" placeholder="15000"/></div>
        <div class="form-group"><label>Umidade (%)</label><input id="f_umidade_pct" type="number" step="0.01" placeholder="13.5"/></div>
        <div class="form-group"><label>Impureza (%)</label><input id="f_impureza_pct" type="number" step="0.01" placeholder="1.2"/></div>
        <div class="form-group"><label>Destino</label><input id="f_destino" placeholder="Cooperativa XYZ"/></div>
      </div>`,
    payload: () => ({
      safra_id: parseInt(v('f_safra_id')), data: v('f_data'),
      quantidade_kg: parseFloat(v('f_quantidade_kg')),
      umidade_pct: v('f_umidade_pct')||null, impureza_pct: v('f_impureza_pct')||null,
      destino: v('f_destino')||null
    })
  },
  funcionarios: {
    title: 'Funcionários', endpoint: '/api/v1/funcionarios',
    cols: ['ID','Nome','CPF','Cargo','CNH','Salário','Admissão'],
    fields: r => [r.id, r.nome, r.cpf, r.cargo, r.cnh||'—', r.salario ? 'R$ '+parseFloat(r.salario).toLocaleString('pt-BR') : '—', r.data_admissao||'—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Nome</label><input id="f_nome" placeholder="João Silva"/></div>
        <div class="form-group"><label>CPF</label><input id="f_cpf" placeholder="000.000.000-00"/></div>
        <div class="form-group"><label>Cargo</label><input id="f_cargo" placeholder="Operador de Máquinas"/></div>
        <div class="form-group"><label>CNH</label><input id="f_cnh" placeholder="12345678900"/></div>
        <div class="form-group"><label>Salário (R$)</label><input id="f_salario" type="number" step="0.01" placeholder="2500.00"/></div>
        <div class="form-group"><label>Data de Admissão</label><input id="f_data_admissao" type="date"/></div>
      </div>`,
    payload: () => ({
      nome: v('f_nome'), cpf: v('f_cpf'), cargo: v('f_cargo'),
      cnh: v('f_cnh')||null, salario: parseFloat(v('f_salario'))||null,
      data_admissao: v('f_data_admissao')||null
    })
  },
  equipamentos: {
    title: 'Equipamentos', endpoint: '/api/v1/equipamentos',
    cols: ['ID','Descrição','Tipo','Marca','Modelo','Ano','Horímetro','Status'],
    fields: r => [r.id, r.descricao, r.tipo, r.marca||'—', r.modelo||'—', r.ano||'—', r.horimetro||'0', badge(r.status)],
    form: `
      <div class="form-grid">
        <div class="form-group full"><label>Descrição</label><input id="f_descricao" placeholder="Trator John Deere 6110J"/></div>
        <div class="form-group"><label>Tipo</label><input id="f_tipo" placeholder="Trator"/></div>
        <div class="form-group"><label>Marca</label><input id="f_marca" placeholder="John Deere"/></div>
        <div class="form-group"><label>Modelo</label><input id="f_modelo" placeholder="6110J"/></div>
        <div class="form-group"><label>Ano</label><input id="f_ano" type="number" placeholder="2022"/></div>
        <div class="form-group"><label>Status</label>
          <select id="f_status"><option value="disponivel">Disponível</option><option value="em_uso">Em Uso</option><option value="manutencao">Manutenção</option><option value="inativo">Inativo</option></select>
        </div>
      </div>`,
    payload: () => ({
      descricao: v('f_descricao'), tipo: v('f_tipo'), marca: v('f_marca')||null,
      modelo: v('f_modelo')||null, ano: parseInt(v('f_ano'))||null, status: v('f_status')
    })
  },
  insumos: {
    title: 'Insumos', endpoint: '/api/v1/insumos',
    cols: ['ID','Nome','Categoria','Unidade','Registro MAPA','Estq. Mín.'],
    fields: r => [r.id, r.nome, badge(r.categoria), r.unidade_medida, r.registro_mapa||'—', r.estoque_minimo||'0'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Nome</label><input id="f_nome" placeholder="Glifosato 480"/></div>
        <div class="form-group"><label>Categoria</label>
          <select id="f_categoria"><option value="defensivo">Defensivo</option><option value="fertilizante">Fertilizante</option><option value="semente">Semente</option><option value="combustivel">Combustível</option><option value="outro">Outro</option></select>
        </div>
        <div class="form-group"><label>Unidade de Medida</label><input id="f_unidade_medida" placeholder="L"/></div>
        <div class="form-group"><label>Registro MAPA</label><input id="f_registro_mapa" placeholder="12345"/></div>
        <div class="form-group"><label>Estoque Mínimo</label><input id="f_estoque_minimo" type="number" step="0.001" placeholder="50"/></div>
      </div>`,
    payload: () => ({
      nome: v('f_nome'), categoria: v('f_categoria'), unidade_medida: v('f_unidade_medida'),
      registro_mapa: v('f_registro_mapa')||null, estoque_minimo: parseFloat(v('f_estoque_minimo'))||null
    })
  },
  clientes: {
    title: 'Clientes', endpoint: '/api/v1/clientes',
    cols: ['ID','Razão Social','CNPJ/CPF','Tipo','Cidade','Estado','Limite Crédito'],
    fields: r => [r.id, r.razao_social, r.cnpj_cpf, badge(r.tipo), r.municipio||'—', r.estado||'—', r.limite_credito ? 'R$ '+parseFloat(r.limite_credito).toLocaleString('pt-BR') : '—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Razão Social</label><input id="f_razao_social" placeholder="Empresa XYZ Ltda"/></div>
        <div class="form-group"><label>CNPJ/CPF</label><input id="f_cnpj_cpf" placeholder="00.000.000/0001-00"/></div>
        <div class="form-group"><label>Tipo</label><select id="f_tipo"><option value="PJ">Pessoa Jurídica</option><option value="PF">Pessoa Física</option></select></div>
        <div class="form-group"><label>Município</label><input id="f_municipio" placeholder="Uberlândia"/></div>
        <div class="form-group"><label>Estado</label><input id="f_estado" maxlength="2" placeholder="MG"/></div>
        <div class="form-group"><label>Limite de Crédito (R$)</label><input id="f_limite_credito" type="number" step="0.01" placeholder="50000"/></div>
      </div>`,
    payload: () => ({
      razao_social: v('f_razao_social'), cnpj_cpf: v('f_cnpj_cpf'), tipo: v('f_tipo'),
      municipio: v('f_municipio')||null, estado: v('f_estado')||null,
      limite_credito: parseFloat(v('f_limite_credito'))||null
    })
  },
  fornecedores: {
    title: 'Fornecedores', endpoint: '/api/v1/fornecedores',
    cols: ['ID','Razão Social','CNPJ','Município','Estado','Contato'],
    fields: r => [r.id, r.razao_social, r.cnpj, r.municipio||'—', r.estado||'—', r.contato||'—'],
    form: `
      <div class="form-grid">
        <div class="form-group"><label>Razão Social</label><input id="f_razao_social" placeholder="Agroquímica Sul Ltda"/></div>
        <div class="form-group"><label>CNPJ</label><input id="f_cnpj" placeholder="00.000.000/0001-00"/></div>
        <div class="form-group"><label>Município</label><input id="f_municipio" placeholder="Sorriso"/></div>
        <div class="form-group"><label>Estado</label><input id="f_estado" maxlength="2" placeholder="MT"/></div>
        <div class="form-group"><label>Contato</label><input id="f_contato" placeholder="(66) 99999-9999"/></div>
        <div class="form-group"><label>E-mail</label><input id="f_email" type="email" placeholder="contato@empresa.com"/></div>
      </div>`,
    payload: () => ({
      razao_social: v('f_razao_social'), cnpj: v('f_cnpj'),
      municipio: v('f_municipio')||null, estado: v('f_estado')||null,
      contato: v('f_contato')||null, email: v('f_email')||null
    })
  }
};

// ── Helpers ───────────────────────────────────────────
function v(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

function badge(val) {
  if (!val) return '—';
  const map = {
    planejada:'badge-yellow', em_andamento:'badge-blue', colhida:'badge-green', cancelada:'badge-gray',
    disponivel:'badge-green', em_uso:'badge-blue', manutencao:'badge-yellow', inativo:'badge-gray',
    PJ:'badge-blue', PF:'badge-green',
    defensivo:'badge-yellow', fertilizante:'badge-green', semente:'badge-blue', combustivel:'badge-gray', outro:'badge-gray'
  };
  return `<span class="badge ${map[val]||'badge-gray'}">${val.replace('_',' ')}</span>`;
}

function toast(msg, err=false) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast show' + (err?' error':'');
  setTimeout(() => t.className = 'toast', 3000);
}

function updateApi() { API = document.getElementById('apiUrl').value.replace(/\/$/, ''); }
function closeModalOutside(e) { if (e.target.id === 'modalOverlay') closeModal(); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

// ── Navegação ────────────────────────────────────────
function goTo(page, el) {
  closeSidebar();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (el) el.classList.add('active');
  currentPage = page;
  const titles = {painel:'Painel', fazendas:'Fazendas', talhoes:'Talhões', safras:'Safras',
    colheitas:'Colheitas', funcionarios:'Funcionários', equipamentos:'Equipamentos',
    insumos:'Insumos', clientes:'Clientes', fornecedores:'Fornecedores'};
  document.getElementById('pageTitle').textContent = titles[page] || page;
  document.getElementById('btnNovo').style.display = page === 'painel' ? 'none' : '';
  if (page !== 'painel') loadTable(page);
}

function refreshPage() {
  if (currentPage === 'painel') loadStats();
  else loadTable(currentPage);
}

// ── API calls ────────────────────────────────────────
async function apiFetch(path, opts={}) {
  const res = await fetch(API + path, { headers: {'Content-Type':'application/json'}, ...opts });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}

async function testApi() {
  const dot = document.getElementById('apiDot');
  const status = document.getElementById('apiStatus');
  try {
    await fetch(API + '/');
    dot.className = 'api-dot on';
    status.textContent = 'conectado';
  } catch {
    dot.className = 'api-dot';
    status.textContent = 'sem conexão';
  }
}

// ── Tabela ───────────────────────────────────────────
async function loadTable(page) {
  const m = modules[page];
  const el = document.getElementById('table-' + page);
  el.innerHTML = '<div class="loading">Carregando...</div>';
  try {
    const data = await apiFetch(m.endpoint);
    if (!data.length) {
      el.innerHTML = '<div class="empty"><div class="empty-icon">📭</div><div class="empty-text">Nenhum registro encontrado</div></div>';
      return;
    }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr>${m.cols.map(c=>`<th>${c}</th>`).join('')}<th>Ações</th></tr></thead>
      <tbody>${data.map(r => `<tr>${m.fields(r).map(f=>`<td>${f}</td>`).join('')}<td><button class="btn btn-danger btn-sm" onclick="del('${m.endpoint}',${r.id},'${page}')">Excluir</button></td></tr>`).join('')}</tbody>
    </table></div>`;
  } catch(e) {
    el.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-text">Erro ao carregar: ' + e.message + '</div></div>';
  }
}

// ── Delete ───────────────────────────────────────────
async function del(endpoint, id, page) {
  if (!confirm('Excluir este registro?')) return;
  try {
    await apiFetch(endpoint + '/' + id, { method: 'DELETE' });
    toast('Registro excluído!');
    loadTable(page);
  } catch(e) { toast('Erro ao excluir: ' + e.message, true); }
}

// ── Modal ────────────────────────────────────────────
function openModal() {
  const m = modules[currentPage];
  if (!m) return;
  document.getElementById('modalTitle').textContent = 'Novo — ' + m.title;
  document.getElementById('modalBody').innerHTML = m.form;
  document.getElementById('modalOverlay').classList.add('open');
}

async function submitForm() {
  const m = modules[currentPage];
  if (!m) return;
  try {
    await apiFetch(m.endpoint, { method: 'POST', body: JSON.stringify(m.payload()) });
    toast('✅ Salvo com sucesso!');
    closeModal();
    loadTable(currentPage);
  } catch(e) { toast('Erro: ' + e.message, true); }
}

// ── Stats painel ─────────────────────────────────────
async function loadStats() {
  const map = { fazendas:'stat-fazendas', safras:'stat-safras', funcionarios:'stat-funcionarios', clientes:'stat-clientes' };
  for (const [ep, elId] of Object.entries(map)) {
    try {
      const data = await apiFetch('/api/v1/' + ep);
      document.getElementById(elId).textContent = data.length;
    } catch { document.getElementById(elId).textContent = '—'; }
  }
}

// ── Usuário ───────────────────────────────────────────
function setUser() {
  const name = prompt('Qual o seu nome?', 'Administrador');
  if (!name) return;
  document.getElementById('userName').textContent = name;
  document.getElementById('userAvatar').textContent = name[0].toUpperCase();
}

// ── Sidebar mobile ──────────────────────────────────
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ── Init ─────────────────────────────────────────────
testApi();
loadStats();
document.getElementById('btnNovo').style.display = 'none';
