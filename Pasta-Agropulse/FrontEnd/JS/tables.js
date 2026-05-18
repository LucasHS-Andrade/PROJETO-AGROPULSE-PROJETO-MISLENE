/* =====================================================
   AgroPulse — Tables Module
   Handles table rendering, badge generation, and record deletion.
   ===================================================== */

const Tables = (() => {
  'use strict';

  /** Safely gets the trimmed value of an input by ID */
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /**
   * Generates a colored badge HTML string for status/category values.
   * Returns '—' for empty/null values.
   */
  function badge(value) {
    if (!value) return '—';

    const colorMap = {
      // Safras
      planejada:    'badge-yellow',
      em_andamento: 'badge-blue',
      colhida:      'badge-green',
      cancelada:    'badge-gray',
      // Equipamentos
      disponivel:   'badge-green',
      em_uso:       'badge-blue',
      manutencao:   'badge-yellow',
      inativo:      'badge-gray',
      // Clientes/Fornecedores
      PJ:           'badge-blue',
      PF:           'badge-green',
      // Insumos
      defensivo:    'badge-yellow',
      fertilizante: 'badge-green',
      semente:      'badge-blue',
      combustivel:  'badge-gray',
      outro:        'badge-gray',
    };

    const cls   = colorMap[value] || 'badge-gray';
    const label = value.replace(/_/g, ' ');
    return `<span class="badge ${cls}">${label}</span>`;
  }

  /**
   * Loads data from the API and renders it as a table inside
   * the element with id="table-{page}".
   */
  async function load(page) {
    const module = Dashboard.getModule(page);
    if (!module) return;

    const container = document.getElementById('table-' + page);
    if (!container) return;

    container.innerHTML = '<div class="loading">Carregando registros...</div>';

    try {
      const data = await Api.get(module.endpoint);

      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="empty">
            <span class="empty-icon">📭</span>
            <span class="empty-text">Nenhum registro encontrado.<br>Clique em <strong>+ Novo</strong> para adicionar.</span>
          </div>`;
        return;
      }

      const headerCells = module.cols.map(c => `<th>${c}</th>`).join('');
      const rows = data.map(record => {
        const cells = module.fields(record).map(f => `<td>${f ?? '—'}</td>`).join('');
        const actions = `
          <td>
            <button
              class="btn btn-danger btn-sm"
              onclick="Tables.deleteRecord('${module.endpoint}', ${record.id}, '${page}')"
              title="Excluir registro #${record.id}"
            >Excluir</button>
          </td>`;
        return `<tr>${cells}${actions}</tr>`;
      }).join('');

      container.innerHTML = `
        <div class="table-wrap">
          <table>
            <thead><tr>${headerCells}<th>Ações</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;

    } catch (error) {
      container.innerHTML = `
        <div class="empty">
          <span class="empty-icon">⚠️</span>
          <span class="empty-text">Erro ao carregar dados:<br><em>${error.message}</em></span>
        </div>`;
    }
  }

  /**
   * Deletes a record after user confirmation.
   */
  async function deleteRecord(endpoint, id, page) {
    if (!confirm(`Deseja excluir o registro #${id}? Esta ação não pode ser desfeita.`)) return;

    try {
      await Api.del(`${endpoint}/${id}`);
      Toast.show('✅ Registro excluído com sucesso!');
      load(page);
    } catch (error) {
      Toast.show('Erro ao excluir: ' + error.message, true);
    }
  }

  return { val, badge, load, deleteRecord };
})();
