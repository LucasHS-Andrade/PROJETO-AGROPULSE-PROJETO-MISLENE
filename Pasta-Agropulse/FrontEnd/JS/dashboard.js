/* =====================================================
   AgroPulse — Dashboard Module
   Module definitions, page navigation, and stats loading.
   ===================================================== */

const Dashboard = (() => {
  'use strict';

  let _currentPage = 'painel';

  /* --------------------------------------------------
     Module Definitions
     Each key maps to a sidebar page. Properties:
       title    — Display title
       endpoint — API REST endpoint (relative)
       cols     — Table column headers
       fields   — Function(record) → array of cell values/HTML
       form     — HTML string for the "New Record" form
       payload  — Function() → object to POST
  -------------------------------------------------- */
  const modules = {

    fazendas: {
      title: 'Fazendas',
      endpoint: '/api/v1/fazendas',
      cols: ['ID', 'Nome', 'Município', 'Estado', 'Área (ha)', 'CNPJ'],
      fields: r => [r.id, r.nome, r.municipio, r.estado, r.area_ha, r.cnpj || '—'],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Nome</label>
            <input id="f_nome" placeholder="Fazenda Boa Vista" required/>
          </div>
          <div class="form-group">
            <label>Município</label>
            <input id="f_municipio" placeholder="Patos de Minas"/>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <input id="f_estado" maxlength="2" placeholder="MG"/>
          </div>
          <div class="form-group">
            <label>Área (ha)</label>
            <input id="f_area_ha" type="number" step="0.01" placeholder="450.5"/>
          </div>
          <div class="form-group">
            <label>CNPJ</label>
            <input id="f_cnpj" placeholder="00.000.000/0001-00"/>
          </div>
          <div class="form-group">
            <label>CPF (pessoa física)</label>
            <input id="f_cpf" placeholder="000.000.000-00"/>
          </div>
        </div>`,
      payload: () => ({
        nome:      Tables.val('f_nome'),
        municipio: Tables.val('f_municipio'),
        estado:    Tables.val('f_estado'),
        area_ha:   parseFloat(Tables.val('f_area_ha')) || null,
        cnpj:      Tables.val('f_cnpj')  || null,
        cpf:       Tables.val('f_cpf')   || null,
      }),
    },

    talhoes: {
      title: 'Talhões',
      endpoint: '/api/v1/talhoes',
      cols: ['ID', 'Nome', 'Fazenda ID', 'Área (ha)', 'Solo', 'Irrigação'],
      fields: r => [r.id, r.nome, r.fazenda_id, r.area_ha, r.tipo_solo || '—', r.irrigacao || '—'],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Fazenda ID</label>
            <input id="f_fazenda_id" type="number" placeholder="1"/>
          </div>
          <div class="form-group">
            <label>Nome</label>
            <input id="f_nome" placeholder="Talhão A1"/>
          </div>
          <div class="form-group">
            <label>Área (ha)</label>
            <input id="f_area_ha" type="number" step="0.01" placeholder="50"/>
          </div>
          <div class="form-group">
            <label>Tipo de Solo</label>
            <input id="f_tipo_solo" placeholder="Latossolo Vermelho"/>
          </div>
          <div class="form-group">
            <label>Irrigação</label>
            <input id="f_irrigacao" placeholder="Pivô Central"/>
          </div>
        </div>`,
      payload: () => ({
        fazenda_id: parseInt(Tables.val('f_fazenda_id')) || null,
        nome:       Tables.val('f_nome'),
        area_ha:    parseFloat(Tables.val('f_area_ha')) || null,
        tipo_solo:  Tables.val('f_tipo_solo') || null,
        irrigacao:  Tables.val('f_irrigacao') || null,
      }),
    },

    safras: {
      title: 'Safras',
      endpoint: '/api/v1/safras',
      cols: ['ID', 'Cultura', 'Variedade', 'Talhão', 'Ano', 'Plantio', 'Status'],
      fields: r => [r.id, r.cultura, r.variedade || '—', r.talhao_id, r.ano, r.data_plantio || '—', Tables.badge(r.status)],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Talhão ID</label>
            <input id="f_talhao_id" type="number" placeholder="1"/>
          </div>
          <div class="form-group">
            <label>Cultura</label>
            <input id="f_cultura" placeholder="Soja"/>
          </div>
          <div class="form-group">
            <label>Variedade</label>
            <input id="f_variedade" placeholder="TMG 7062 IPRO"/>
          </div>
          <div class="form-group">
            <label>Ano</label>
            <input id="f_ano" type="number" placeholder="2026"/>
          </div>
          <div class="form-group">
            <label>Data de Plantio</label>
            <input id="f_data_plantio" type="date"/>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="f_status">
              <option value="planejada">Planejada</option>
              <option value="em_andamento">Em andamento</option>
              <option value="colhida">Colhida</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>`,
      payload: () => ({
        talhao_id:    parseInt(Tables.val('f_talhao_id')) || null,
        cultura:      Tables.val('f_cultura'),
        variedade:    Tables.val('f_variedade') || null,
        ano:          parseInt(Tables.val('f_ano')) || null,
        data_plantio: Tables.val('f_data_plantio') || null,
        status:       Tables.val('f_status'),
      }),
    },

    colheitas: {
      title: 'Colheitas',
      endpoint: '/api/v1/colheitas',
      cols: ['ID', 'Safra ID', 'Data', 'Qtd (kg)', 'Umidade %', 'Impureza %', 'Destino'],
      fields: r => [
        r.id, r.safra_id, r.data,
        r.quantidade_kg,
        r.umidade_pct   != null ? r.umidade_pct   : '—',
        r.impureza_pct  != null ? r.impureza_pct  : '—',
        r.destino || '—',
      ],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Safra ID</label>
            <input id="f_safra_id" type="number" placeholder="1"/>
          </div>
          <div class="form-group">
            <label>Data</label>
            <input id="f_data" type="date"/>
          </div>
          <div class="form-group">
            <label>Quantidade (kg)</label>
            <input id="f_quantidade_kg" type="number" step="0.001" placeholder="15000"/>
          </div>
          <div class="form-group">
            <label>Umidade (%)</label>
            <input id="f_umidade_pct" type="number" step="0.01" placeholder="13.5"/>
          </div>
          <div class="form-group">
            <label>Impureza (%)</label>
            <input id="f_impureza_pct" type="number" step="0.01" placeholder="1.2"/>
          </div>
          <div class="form-group">
            <label>Destino</label>
            <input id="f_destino" placeholder="Cooperativa XYZ"/>
          </div>
        </div>`,
      payload: () => ({
        safra_id:      parseInt(Tables.val('f_safra_id'))          || null,
        data:          Tables.val('f_data'),
        quantidade_kg: parseFloat(Tables.val('f_quantidade_kg'))   || null,
        umidade_pct:   Tables.val('f_umidade_pct')  ? parseFloat(Tables.val('f_umidade_pct'))  : null,
        impureza_pct:  Tables.val('f_impureza_pct') ? parseFloat(Tables.val('f_impureza_pct')) : null,
        destino:       Tables.val('f_destino') || null,
      }),
    },

    funcionarios: {
      title: 'Funcionários',
      endpoint: '/api/v1/funcionarios',
      cols: ['ID', 'Nome', 'CPF', 'Cargo', 'CNH', 'Salário', 'Admissão'],
      fields: r => [
        r.id, r.nome, r.cpf, r.cargo,
        r.cnh || '—',
        r.salario ? 'R$\u00a0' + parseFloat(r.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '—',
        r.data_admissao || '—',
      ],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Nome</label>
            <input id="f_nome" placeholder="João Silva"/>
          </div>
          <div class="form-group">
            <label>CPF</label>
            <input id="f_cpf" placeholder="000.000.000-00"/>
          </div>
          <div class="form-group">
            <label>Cargo</label>
            <input id="f_cargo" placeholder="Operador de Máquinas"/>
          </div>
          <div class="form-group">
            <label>CNH</label>
            <input id="f_cnh" placeholder="12345678900"/>
          </div>
          <div class="form-group">
            <label>Salário (R$)</label>
            <input id="f_salario" type="number" step="0.01" placeholder="2500.00"/>
          </div>
          <div class="form-group">
            <label>Data de Admissão</label>
            <input id="f_data_admissao" type="date"/>
          </div>
        </div>`,
      payload: () => ({
        nome:           Tables.val('f_nome'),
        cpf:            Tables.val('f_cpf'),
        cargo:          Tables.val('f_cargo'),
        cnh:            Tables.val('f_cnh')            || null,
        salario:        Tables.val('f_salario')        ? parseFloat(Tables.val('f_salario')) : null,
        data_admissao:  Tables.val('f_data_admissao')  || null,
      }),
    },

    equipamentos: {
      title: 'Equipamentos',
      endpoint: '/api/v1/equipamentos',
      cols: ['ID', 'Descrição', 'Tipo', 'Marca', 'Modelo', 'Ano', 'Horímetro', 'Status'],
      fields: r => [
        r.id, r.descricao, r.tipo,
        r.marca   || '—',
        r.modelo  || '—',
        r.ano     || '—',
        r.horimetro != null ? r.horimetro : '0',
        Tables.badge(r.status),
      ],
      form: `
        <div class="form-grid">
          <div class="form-group full">
            <label>Descrição</label>
            <input id="f_descricao" placeholder="Trator John Deere 6110J"/>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <input id="f_tipo" placeholder="Trator"/>
          </div>
          <div class="form-group">
            <label>Marca</label>
            <input id="f_marca" placeholder="John Deere"/>
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <input id="f_modelo" placeholder="6110J"/>
          </div>
          <div class="form-group">
            <label>Ano</label>
            <input id="f_ano" type="number" placeholder="2022"/>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="f_status">
              <option value="disponivel">Disponível</option>
              <option value="em_uso">Em Uso</option>
              <option value="manutencao">Manutenção</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>`,
      payload: () => ({
        descricao: Tables.val('f_descricao'),
        tipo:      Tables.val('f_tipo'),
        marca:     Tables.val('f_marca')  || null,
        modelo:    Tables.val('f_modelo') || null,
        ano:       Tables.val('f_ano')    ? parseInt(Tables.val('f_ano')) : null,
        status:    Tables.val('f_status'),
      }),
    },

    insumos: {
      title: 'Insumos',
      endpoint: '/api/v1/insumos',
      cols: ['ID', 'Nome', 'Categoria', 'Unidade', 'Registro MAPA', 'Estq. Mín.'],
      fields: r => [r.id, r.nome, Tables.badge(r.categoria), r.unidade_medida, r.registro_mapa || '—', r.estoque_minimo ?? '0'],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Nome</label>
            <input id="f_nome" placeholder="Glifosato 480"/>
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select id="f_categoria">
              <option value="defensivo">Defensivo</option>
              <option value="fertilizante">Fertilizante</option>
              <option value="semente">Semente</option>
              <option value="combustivel">Combustível</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label>Unidade de Medida</label>
            <input id="f_unidade_medida" placeholder="L"/>
          </div>
          <div class="form-group">
            <label>Registro MAPA</label>
            <input id="f_registro_mapa" placeholder="12345"/>
          </div>
          <div class="form-group">
            <label>Estoque Mínimo</label>
            <input id="f_estoque_minimo" type="number" step="0.001" placeholder="50"/>
          </div>
        </div>`,
      payload: () => ({
        nome:             Tables.val('f_nome'),
        categoria:        Tables.val('f_categoria'),
        unidade_medida:   Tables.val('f_unidade_medida'),
        registro_mapa:    Tables.val('f_registro_mapa')    || null,
        estoque_minimo:   Tables.val('f_estoque_minimo')   ? parseFloat(Tables.val('f_estoque_minimo')) : null,
      }),
    },

    clientes: {
      title: 'Clientes',
      endpoint: '/api/v1/clientes',
      cols: ['ID', 'Razão Social', 'CNPJ/CPF', 'Tipo', 'Cidade', 'Estado', 'Limite Crédito'],
      fields: r => [
        r.id, r.razao_social, r.cnpj_cpf,
        Tables.badge(r.tipo),
        r.municipio || '—',
        r.estado    || '—',
        r.limite_credito
          ? 'R$\u00a0' + parseFloat(r.limite_credito).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
          : '—',
      ],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Razão Social</label>
            <input id="f_razao_social" placeholder="Empresa XYZ Ltda"/>
          </div>
          <div class="form-group">
            <label>CNPJ/CPF</label>
            <input id="f_cnpj_cpf" placeholder="00.000.000/0001-00"/>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select id="f_tipo">
              <option value="PJ">Pessoa Jurídica</option>
              <option value="PF">Pessoa Física</option>
            </select>
          </div>
          <div class="form-group">
            <label>Município</label>
            <input id="f_municipio" placeholder="Uberlândia"/>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <input id="f_estado" maxlength="2" placeholder="MG"/>
          </div>
          <div class="form-group">
            <label>Limite de Crédito (R$)</label>
            <input id="f_limite_credito" type="number" step="0.01" placeholder="50000.00"/>
          </div>
          <div class="form-group">
            <label>Contato</label>
            <input id="f_contato" placeholder="(34) 99999-9999"/>
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input id="f_email" type="email" placeholder="contato@empresa.com"/>
          </div>
        </div>`,
      payload: () => ({
        razao_social:   Tables.val('f_razao_social'),
        cnpj_cpf:       Tables.val('f_cnpj_cpf'),
        tipo:           Tables.val('f_tipo'),
        municipio:      Tables.val('f_municipio')      || null,
        estado:         Tables.val('f_estado')         || null,
        limite_credito: Tables.val('f_limite_credito') ? parseFloat(Tables.val('f_limite_credito')) : null,
        contato:        Tables.val('f_contato')        || null,
        email:          Tables.val('f_email')          || null,
      }),
    },

    fornecedores: {
      title: 'Fornecedores',
      endpoint: '/api/v1/fornecedores',
      cols: ['ID', 'Razão Social', 'CNPJ/CPF', 'Tipo', 'Cidade', 'Estado', 'Contato'],
      fields: r => [
        r.id, r.razao_social, r.cnpj_cpf,
        Tables.badge(r.tipo),
        r.municipio || '—',
        r.estado    || '—',
        r.contato   || '—',
      ],
      form: `
        <div class="form-grid">
          <div class="form-group">
            <label>Razão Social</label>
            <input id="f_razao_social" placeholder="Fornecedor Agro Ltda"/>
          </div>
          <div class="form-group">
            <label>CNPJ/CPF</label>
            <input id="f_cnpj_cpf" placeholder="00.000.000/0001-00"/>
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select id="f_tipo">
              <option value="PJ">Pessoa Jurídica</option>
              <option value="PF">Pessoa Física</option>
            </select>
          </div>
          <div class="form-group">
            <label>Município</label>
            <input id="f_municipio" placeholder="Uberlândia"/>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <input id="f_estado" maxlength="2" placeholder="MG"/>
          </div>
          <div class="form-group">
            <label>Contato</label>
            <input id="f_contato" placeholder="(34) 99999-9999"/>
          </div>
          <div class="form-group full">
            <label>E-mail</label>
            <input id="f_email" type="email" placeholder="contato@fornecedor.com"/>
          </div>
        </div>`,
      payload: () => ({
        razao_social: Tables.val('f_razao_social'),
        cnpj_cpf:     Tables.val('f_cnpj_cpf'),
        tipo:         Tables.val('f_tipo'),
        municipio:    Tables.val('f_municipio') || null,
        estado:       Tables.val('f_estado')    || null,
        contato:      Tables.val('f_contato')   || null,
        email:        Tables.val('f_email')     || null,
      }),
    },

  }; // end modules

  /* --------------------------------------------------
     Page Titles Map
  -------------------------------------------------- */
  const PAGE_TITLES = {
    painel:       'Painel',
    fazendas:     'Fazendas',
    talhoes:      'Talhões',
    safras:       'Safras',
    colheitas:    'Colheitas',
    funcionarios: 'Funcionários',
    equipamentos: 'Equipamentos',
    insumos:      'Insumos',
    clientes:     'Clientes',
    fornecedores: 'Fornecedores',
  };

  /* --------------------------------------------------
     Navigation
  -------------------------------------------------- */

  /**
   * Shows the given page section and updates the topbar + nav state.
   * @param {string} page - page slug
   * @param {HTMLElement|null} navElement - clicked nav-item (optional)
   */
  function goTo(page, navElement) {
    // Deactivate all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Activate target page
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    // Update nav highlight
    Sidebar.setActive(page);
    if (navElement) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      navElement.classList.add('active');
    }

    // Update page title
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = PAGE_TITLES[page] || page;

    // Show/hide "Novo" button
    const newBtn = document.getElementById('btnNovo');
    if (newBtn) newBtn.style.display = (page === 'painel') ? 'none' : '';

    _currentPage = page;

    // Load data for non-panel pages
    if (page !== 'painel') {
      Tables.load(page);
    }
  }

  /** Refreshes the current page's data. */
  function refresh() {
    if (_currentPage === 'painel') {
      loadStats();
    } else {
      Tables.load(_currentPage);
    }
  }

  /* --------------------------------------------------
     Stats
  -------------------------------------------------- */

  /** Loads summary counts into the dashboard stat cards. */
  async function loadStats() {
    const statEndpoints = {
      fazendas:     'stat-fazendas',
      safras:       'stat-safras',
      funcionarios: 'stat-funcionarios',
      clientes:     'stat-clientes',
    };

    for (const [resource, elementId] of Object.entries(statEndpoints)) {
      const el = document.getElementById(elementId);
      if (!el) continue;
      el.textContent = '…';
      try {
        const data = await Api.get('/api/v1/' + resource);
        el.textContent = Array.isArray(data) ? data.length : '—';
      } catch {
        el.textContent = '—';
      }
    }
  }

  /* --------------------------------------------------
     Public Accessors
  -------------------------------------------------- */
  function getCurrentPage() { return _currentPage; }
  function getModule(page)  { return modules[page] || null; }

  return { goTo, refresh, loadStats, getCurrentPage, getModule };
})();
