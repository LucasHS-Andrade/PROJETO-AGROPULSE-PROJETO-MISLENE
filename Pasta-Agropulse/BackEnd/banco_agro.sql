-- ============================================================
--  BANCO DE DADOS - EMPRESA AGRONEGÓCIO
--  Gerado a partir do diagrama ERD
--  MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS agropulse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agropulse;

-- ============================================================
-- MÓDULO 1: ESTRUTURA DA FAZENDA
-- ============================================================

CREATE TABLE fazenda (
  id            INT            NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(120)   NOT NULL,
  municipio     VARCHAR(100)   NOT NULL,
  estado        CHAR(2)        NOT NULL,
  area_ha       DECIMAL(10,2)  NOT NULL,
  cnpj          VARCHAR(18)    UNIQUE,
  cpf           VARCHAR(14)    UNIQUE,
  inscricao_est VARCHAR(20),
  telefone      VARCHAR(20),
  email         VARCHAR(120),
  criado_em     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_fazenda PRIMARY KEY (id),
  CONSTRAINT chk_fazenda_doc CHECK (cnpj IS NOT NULL OR cpf IS NOT NULL)
) ENGINE=InnoDB;

CREATE TABLE talhao (
  id            INT            NOT NULL AUTO_INCREMENT,
  fazenda_id    INT            NOT NULL,
  nome          VARCHAR(80)    NOT NULL,
  area_ha       DECIMAL(10,2)  NOT NULL,
  tipo_solo     VARCHAR(60),
  irrigacao     VARCHAR(60),
  coordenadas   TEXT,
  criado_em     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_talhao   PRIMARY KEY (id),
  CONSTRAINT fk_talhao_fazenda FOREIGN KEY (fazenda_id)
    REFERENCES fazenda(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 2: PESSOAS
-- ============================================================

CREATE TABLE funcionario (
  id            INT            NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(120)   NOT NULL,
  cpf           VARCHAR(14)    NOT NULL UNIQUE,
  cargo         VARCHAR(80)    NOT NULL,
  cnh           VARCHAR(20),
  salario       DECIMAL(10,2),
  data_admissao DATE,
  ativo         TINYINT(1)     NOT NULL DEFAULT 1,
  CONSTRAINT pk_funcionario PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE cliente (
  id             INT           NOT NULL AUTO_INCREMENT,
  razao_social   VARCHAR(150)  NOT NULL,
  cnpj_cpf       VARCHAR(18)   NOT NULL UNIQUE,
  tipo           ENUM('PF','PJ') NOT NULL DEFAULT 'PJ',
  municipio      VARCHAR(100),
  estado         CHAR(2),
  contato        VARCHAR(80),
  email          VARCHAR(120),
  limite_credito DECIMAL(14,2) DEFAULT 0.00,
  ativo          TINYINT(1)    NOT NULL DEFAULT 1,
  CONSTRAINT pk_cliente PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE fornecedor (
  id           INT            NOT NULL AUTO_INCREMENT,
  razao_social VARCHAR(150)   NOT NULL,
  cnpj         VARCHAR(18)    NOT NULL UNIQUE,
  municipio    VARCHAR(100),
  estado       CHAR(2),
  contato      VARCHAR(80),
  email        VARCHAR(120),
  ativo        TINYINT(1)     NOT NULL DEFAULT 1,
  CONSTRAINT pk_fornecedor PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 3: PRODUÇÃO AGRÍCOLA
-- ============================================================

CREATE TABLE safra (
  id                    INT            NOT NULL AUTO_INCREMENT,
  talhao_id             INT            NOT NULL,
  cultura               VARCHAR(80)    NOT NULL,
  variedade             VARCHAR(80),
  ano                   YEAR           NOT NULL,
  data_plantio          DATE,
  data_colheita_prevista DATE,
  producao_kg           DECIMAL(14,3),
  status                ENUM('planejada','em_andamento','colhida','cancelada')
                          NOT NULL DEFAULT 'planejada',
  CONSTRAINT pk_safra    PRIMARY KEY (id),
  CONSTRAINT fk_safra_talhao FOREIGN KEY (talhao_id)
    REFERENCES talhao(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tipo_atividade (
  id        INT          NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(80)  NOT NULL,
  categoria VARCHAR(60),
  CONSTRAINT pk_tipo_atividade PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE atividade_agricola (
  id             INT            NOT NULL AUTO_INCREMENT,
  safra_id       INT            NOT NULL,
  tipo_id        INT            NOT NULL,
  funcionario_id INT            NOT NULL,
  data           DATE           NOT NULL,
  area_ha        DECIMAL(10,2),
  custo          DECIMAL(12,2)  DEFAULT 0.00,
  observacao     TEXT,
  CONSTRAINT pk_atividade        PRIMARY KEY (id),
  CONSTRAINT fk_ativ_safra       FOREIGN KEY (safra_id)
    REFERENCES safra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ativ_tipo        FOREIGN KEY (tipo_id)
    REFERENCES tipo_atividade(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_ativ_funcionario FOREIGN KEY (funcionario_id)
    REFERENCES funcionario(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE colheita (
  id              INT            NOT NULL AUTO_INCREMENT,
  safra_id        INT            NOT NULL,
  data            DATE           NOT NULL,
  quantidade_kg   DECIMAL(14,3)  NOT NULL,
  umidade_pct     DECIMAL(5,2),
  impureza_pct    DECIMAL(5,2),
  destino         VARCHAR(120),
  CONSTRAINT pk_colheita         PRIMARY KEY (id),
  CONSTRAINT fk_colheita_safra   FOREIGN KEY (safra_id)
    REFERENCES safra(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 4: INSUMOS E ESTOQUE
-- ============================================================

CREATE TABLE insumo (
  id              INT            NOT NULL AUTO_INCREMENT,
  nome            VARCHAR(120)   NOT NULL,
  principio_ativo VARCHAR(120),
  categoria       ENUM('defensivo','fertilizante','semente','combustivel','outro')
                    NOT NULL,
  unidade_medida  VARCHAR(20)    NOT NULL,
  registro_mapa   VARCHAR(40),
  estoque_minimo  DECIMAL(12,3)  DEFAULT 0,
  CONSTRAINT pk_insumo PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE consumo_insumo (
  id           INT            NOT NULL AUTO_INCREMENT,
  atividade_id INT            NOT NULL,
  insumo_id    INT            NOT NULL,
  quantidade   DECIMAL(12,3)  NOT NULL,
  unidade      VARCHAR(20)    NOT NULL,
  CONSTRAINT pk_consumo_insumo  PRIMARY KEY (id),
  CONSTRAINT fk_cons_atividade  FOREIGN KEY (atividade_id)
    REFERENCES atividade_agricola(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cons_insumo     FOREIGN KEY (insumo_id)
    REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE deposito (
  id         INT            NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(80)    NOT NULL,
  tipo       ENUM('silo','tulha','galpao','tanque','outro') NOT NULL,
  capacidade DECIMAL(14,3),
  fazenda_id INT,
  CONSTRAINT pk_deposito          PRIMARY KEY (id),
  CONSTRAINT fk_deposito_fazenda  FOREIGN KEY (fazenda_id)
    REFERENCES fazenda(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE estoque_insumo (
  id          INT            NOT NULL AUTO_INCREMENT,
  insumo_id   INT            NOT NULL,
  deposito_id INT            NOT NULL,
  quantidade  DECIMAL(12,3)  NOT NULL DEFAULT 0,
  validade    DATE,
  custo_medio DECIMAL(12,4)  DEFAULT 0.00,
  CONSTRAINT pk_estoque_insumo   PRIMARY KEY (id),
  CONSTRAINT fk_estq_ins_insumo  FOREIGN KEY (insumo_id)
    REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_estq_ins_dep     FOREIGN KEY (deposito_id)
    REFERENCES deposito(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE estoque_produto (
  id          INT            NOT NULL AUTO_INCREMENT,
  safra_id    INT            NOT NULL,
  deposito_id INT            NOT NULL,
  quantidade_kg DECIMAL(14,3) NOT NULL DEFAULT 0,
  data_entrada DATE,
  qualidade   VARCHAR(60),
  CONSTRAINT pk_estoque_produto  PRIMARY KEY (id),
  CONSTRAINT fk_estq_prod_safra  FOREIGN KEY (safra_id)
    REFERENCES safra(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_estq_prod_dep    FOREIGN KEY (deposito_id)
    REFERENCES deposito(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pedido_compra (
  id            INT            NOT NULL AUTO_INCREMENT,
  fornecedor_id INT            NOT NULL,
  data_pedido   DATE           NOT NULL,
  data_entrega  DATE,
  valor_total   DECIMAL(14,2)  NOT NULL DEFAULT 0.00,
  status        ENUM('rascunho','enviado','recebido','cancelado')
                  NOT NULL DEFAULT 'rascunho',
  observacao    TEXT,
  CONSTRAINT pk_pedido_compra    PRIMARY KEY (id),
  CONSTRAINT fk_pedido_fornec    FOREIGN KEY (fornecedor_id)
    REFERENCES fornecedor(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE item_pedido_compra (
  id          INT            NOT NULL AUTO_INCREMENT,
  pedido_id   INT            NOT NULL,
  insumo_id   INT            NOT NULL,
  quantidade  DECIMAL(12,3)  NOT NULL,
  preco_unit  DECIMAL(12,4)  NOT NULL,
  desconto    DECIMAL(12,2)  DEFAULT 0.00,
  CONSTRAINT pk_item_pc        PRIMARY KEY (id),
  CONSTRAINT fk_ipc_pedido     FOREIGN KEY (pedido_id)
    REFERENCES pedido_compra(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ipc_insumo     FOREIGN KEY (insumo_id)
    REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 5: COMERCIAL E VENDAS
-- ============================================================

CREATE TABLE produto (
  id          INT            NOT NULL AUTO_INCREMENT,
  descricao   VARCHAR(120)   NOT NULL,
  ncm         VARCHAR(10),
  unidade     VARCHAR(20)    NOT NULL,
  preco_base  DECIMAL(12,4),
  CONSTRAINT pk_produto PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE contrato (
  id                INT            NOT NULL AUTO_INCREMENT,
  cliente_id        INT            NOT NULL,
  data_inicio       DATE           NOT NULL,
  data_fim          DATE,
  cultura           VARCHAR(80),
  quantidade_kg     DECIMAL(14,3),
  preco_kg          DECIMAL(12,4),
  condicao_pagamento VARCHAR(120),
  status            ENUM('ativo','encerrado','cancelado') NOT NULL DEFAULT 'ativo',
  CONSTRAINT pk_contrato          PRIMARY KEY (id),
  CONSTRAINT fk_contrato_cliente  FOREIGN KEY (cliente_id)
    REFERENCES cliente(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pedido_venda (
  id          INT            NOT NULL AUTO_INCREMENT,
  cliente_id  INT            NOT NULL,
  contrato_id INT,
  data        DATE           NOT NULL,
  quantidade_kg DECIMAL(14,3),
  preco_kg    DECIMAL(12,4),
  status      ENUM('rascunho','confirmado','faturado','cancelado')
                NOT NULL DEFAULT 'rascunho',
  CONSTRAINT pk_pedido_venda      PRIMARY KEY (id),
  CONSTRAINT fk_pv_cliente        FOREIGN KEY (cliente_id)
    REFERENCES cliente(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pv_contrato       FOREIGN KEY (contrato_id)
    REFERENCES contrato(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE item_pedido_venda (
  id          INT            NOT NULL AUTO_INCREMENT,
  pedido_id   INT            NOT NULL,
  produto_id  INT            NOT NULL,
  quantidade  DECIMAL(12,3)  NOT NULL,
  preco_unit  DECIMAL(12,4)  NOT NULL,
  CONSTRAINT pk_item_pv       PRIMARY KEY (id),
  CONSTRAINT fk_ipv_pedido    FOREIGN KEY (pedido_id)
    REFERENCES pedido_venda(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ipv_produto   FOREIGN KEY (produto_id)
    REFERENCES produto(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE nota_fiscal (
  id           INT            NOT NULL AUTO_INCREMENT,
  pedido_id    INT            NOT NULL,
  numero       VARCHAR(20)    NOT NULL,
  serie        VARCHAR(5),
  data_emissao DATE           NOT NULL,
  valor_total  DECIMAL(14,2)  NOT NULL,
  chave_acesso VARCHAR(44)    UNIQUE,
  status       ENUM('emitida','cancelada','inutilizada') NOT NULL DEFAULT 'emitida',
  CONSTRAINT pk_nota_fiscal   PRIMARY KEY (id),
  CONSTRAINT fk_nf_pedido     FOREIGN KEY (pedido_id)
    REFERENCES pedido_venda(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE item_nf (
  id          INT            NOT NULL AUTO_INCREMENT,
  nf_id       INT            NOT NULL,
  produto_id  INT            NOT NULL,
  quantidade  DECIMAL(12,3)  NOT NULL,
  valor_unit  DECIMAL(12,4)  NOT NULL,
  icms        DECIMAL(12,2)  DEFAULT 0.00,
  CONSTRAINT pk_item_nf       PRIMARY KEY (id),
  CONSTRAINT fk_inf_nf        FOREIGN KEY (nf_id)
    REFERENCES nota_fiscal(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_inf_produto   FOREIGN KEY (produto_id)
    REFERENCES produto(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 6: FINANCEIRO
-- ============================================================

CREATE TABLE conta_bancaria (
  id      INT            NOT NULL AUTO_INCREMENT,
  banco   VARCHAR(80)    NOT NULL,
  agencia VARCHAR(10)    NOT NULL,
  conta   VARCHAR(20)    NOT NULL,
  tipo    ENUM('corrente','poupanca','investimento') NOT NULL DEFAULT 'corrente',
  saldo   DECIMAL(14,2)  NOT NULL DEFAULT 0.00,
  CONSTRAINT pk_conta_bancaria PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE centro_custo (
  id        INT          NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(80)  NOT NULL,
  categoria VARCHAR(60),
  descricao TEXT,
  CONSTRAINT pk_centro_custo PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE conta_pagar (
  id            INT            NOT NULL AUTO_INCREMENT,
  fornecedor_id INT            NOT NULL,
  pedido_id     INT,
  valor         DECIMAL(14,2)  NOT NULL,
  vencimento    DATE           NOT NULL,
  pagamento     DATE,
  status        ENUM('aberta','paga','vencida','cancelada') NOT NULL DEFAULT 'aberta',
  descricao     VARCHAR(200),
  CONSTRAINT pk_conta_pagar       PRIMARY KEY (id),
  CONSTRAINT fk_cp_fornecedor     FOREIGN KEY (fornecedor_id)
    REFERENCES fornecedor(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cp_pedido         FOREIGN KEY (pedido_id)
    REFERENCES pedido_compra(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE conta_receber (
  id          INT            NOT NULL AUTO_INCREMENT,
  cliente_id  INT            NOT NULL,
  nf_id       INT,
  valor       DECIMAL(14,2)  NOT NULL,
  vencimento  DATE           NOT NULL,
  recebimento DATE,
  status      ENUM('aberta','recebida','vencida','cancelada') NOT NULL DEFAULT 'aberta',
  descricao   VARCHAR(200),
  CONSTRAINT pk_conta_receber     PRIMARY KEY (id),
  CONSTRAINT fk_cr_cliente        FOREIGN KEY (cliente_id)
    REFERENCES cliente(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cr_nf             FOREIGN KEY (nf_id)
    REFERENCES nota_fiscal(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE lancamento (
  id              INT            NOT NULL AUTO_INCREMENT,
  conta_banco_id  INT            NOT NULL,
  centro_custo_id INT,
  conta_pagar_id  INT,
  conta_receber_id INT,
  data            DATE           NOT NULL,
  valor           DECIMAL(14,2)  NOT NULL,
  tipo            ENUM('credito','debito') NOT NULL,
  descricao       VARCHAR(200),
  conciliado      TINYINT(1)     NOT NULL DEFAULT 0,
  CONSTRAINT pk_lancamento         PRIMARY KEY (id),
  CONSTRAINT fk_lanc_banco         FOREIGN KEY (conta_banco_id)
    REFERENCES conta_bancaria(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_lanc_cc            FOREIGN KEY (centro_custo_id)
    REFERENCES centro_custo(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_lanc_cp            FOREIGN KEY (conta_pagar_id)
    REFERENCES conta_pagar(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_lanc_cr            FOREIGN KEY (conta_receber_id)
    REFERENCES conta_receber(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- MÓDULO 7: MAQUINÁRIO
-- ============================================================

CREATE TABLE equipamento (
  id          INT            NOT NULL AUTO_INCREMENT,
  descricao   VARCHAR(120)   NOT NULL,
  tipo        VARCHAR(60)    NOT NULL,
  marca       VARCHAR(60),
  modelo      VARCHAR(60),
  ano         YEAR,
  placa_serie VARCHAR(30),
  horimetro   DECIMAL(10,1)  DEFAULT 0,
  status      ENUM('disponivel','em_uso','manutencao','inativo')
                NOT NULL DEFAULT 'disponivel',
  valor_atual DECIMAL(14,2),
  CONSTRAINT pk_equipamento PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE manutencao (
  id              INT            NOT NULL AUTO_INCREMENT,
  equipamento_id  INT            NOT NULL,
  funcionario_id  INT            NOT NULL,
  tipo            ENUM('preventiva','corretiva','revisao') NOT NULL,
  data            DATE           NOT NULL,
  horimetro       DECIMAL(10,1),
  custo           DECIMAL(12,2)  DEFAULT 0.00,
  descricao       TEXT,
  proxima_previsao DATE,
  CONSTRAINT pk_manutencao         PRIMARY KEY (id),
  CONSTRAINT fk_manut_equip        FOREIGN KEY (equipamento_id)
    REFERENCES equipamento(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_manut_func         FOREIGN KEY (funcionario_id)
    REFERENCES funcionario(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE alocacao_equipamento (
  id             INT            NOT NULL AUTO_INCREMENT,
  equipamento_id INT            NOT NULL,
  atividade_id   INT            NOT NULL,
  data_inicio    DATETIME       NOT NULL,
  data_fim       DATETIME,
  horas_uso      DECIMAL(8,2),
  CONSTRAINT pk_alocacao_equip    PRIMARY KEY (id),
  CONSTRAINT fk_aloc_equip        FOREIGN KEY (equipamento_id)
    REFERENCES equipamento(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_aloc_ativ         FOREIGN KEY (atividade_id)
    REFERENCES atividade_agricola(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE abastecimento (
  id             INT            NOT NULL AUTO_INCREMENT,
  equipamento_id INT            NOT NULL,
  insumo_id      INT            NOT NULL,
  data           DATE           NOT NULL,
  litros         DECIMAL(10,3)  NOT NULL,
  valor          DECIMAL(12,2),
  local          VARCHAR(80),
  CONSTRAINT pk_abastecimento     PRIMARY KEY (id),
  CONSTRAINT fk_abast_equip       FOREIGN KEY (equipamento_id)
    REFERENCES equipamento(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_abast_insumo      FOREIGN KEY (insumo_id)
    REFERENCES insumo(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================

CREATE INDEX idx_talhao_fazenda     ON talhao(fazenda_id);
CREATE INDEX idx_safra_talhao       ON safra(talhao_id);
CREATE INDEX idx_safra_ano          ON safra(ano);
CREATE INDEX idx_ativ_safra         ON atividade_agricola(safra_id);
CREATE INDEX idx_ativ_data          ON atividade_agricola(data);
CREATE INDEX idx_colheita_safra     ON colheita(safra_id);
CREATE INDEX idx_consumo_ativ       ON consumo_insumo(atividade_id);
CREATE INDEX idx_consumo_insumo     ON consumo_insumo(insumo_id);
CREATE INDEX idx_pedido_compra_forn ON pedido_compra(fornecedor_id);
CREATE INDEX idx_pedido_venda_cli   ON pedido_venda(cliente_id);
CREATE INDEX idx_nf_data            ON nota_fiscal(data_emissao);
CREATE INDEX idx_cp_vencimento      ON conta_pagar(vencimento);
CREATE INDEX idx_cr_vencimento      ON conta_receber(vencimento);
CREATE INDEX idx_lanc_data          ON lancamento(data);
CREATE INDEX idx_manut_equip        ON manutencao(equipamento_id);
CREATE INDEX idx_aloc_equip         ON alocacao_equipamento(equipamento_id);

-- ============================================================
-- DADOS INICIAIS (tipos de atividade)
-- ============================================================

INSERT INTO tipo_atividade (nome, categoria) VALUES
  ('Preparo do solo',       'Solo'),
  ('Plantio',               'Cultivo'),
  ('Adubação de base',      'Nutrição'),
  ('Adubação de cobertura', 'Nutrição'),
  ('Aplicação herbicida',   'Defensivo'),
  ('Aplicação fungicida',   'Defensivo'),
  ('Aplicação inseticida',  'Defensivo'),
  ('Irrigação',             'Manejo hídrico'),
  ('Colheita mecânica',     'Colheita'),
  ('Colheita manual',       'Colheita');

INSERT INTO centro_custo (nome, categoria) VALUES
  ('Produção - Soja',       'Produção'),
  ('Produção - Milho',      'Produção'),
  ('Produção - Cana',       'Produção'),
  ('Maquinário',            'Operacional'),
  ('Mão de obra',           'Pessoal'),
  ('Administrativo',        'Administração'),
  ('Comercial',             'Comercial');
