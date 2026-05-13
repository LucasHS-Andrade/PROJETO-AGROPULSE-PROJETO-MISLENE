from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, Enum, ForeignKey, Text, SmallInteger, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Fazenda(Base):
    __tablename__ = "fazenda"
    id         = Column(Integer, primary_key=True, index=True)
    nome       = Column(String(120), nullable=False)
    municipio  = Column(String(100), nullable=False)
    estado     = Column(String(2), nullable=False)
    area_ha    = Column(Numeric(10, 2), nullable=False)
    cnpj       = Column(String(18), unique=True)
    cpf        = Column(String(14), unique=True)
    criado_em  = Column(DateTime, server_default=func.now())
    talhoes    = relationship("Talhao", back_populates="fazenda")


class Talhao(Base):
    __tablename__ = "talhao"
    id         = Column(Integer, primary_key=True, index=True)
    fazenda_id = Column(Integer, ForeignKey("fazenda.id"), nullable=False)
    nome       = Column(String(80), nullable=False)
    area_ha    = Column(Numeric(10, 2), nullable=False)
    tipo_solo  = Column(String(60))
    irrigacao  = Column(String(60))
    fazenda    = relationship("Fazenda", back_populates="talhoes")
    safras     = relationship("Safra", back_populates="talhao")


class Safra(Base):
    __tablename__ = "safra"
    id                     = Column(Integer, primary_key=True, index=True)
    talhao_id              = Column(Integer, ForeignKey("talhao.id"), nullable=False)
    cultura                = Column(String(80), nullable=False)
    variedade              = Column(String(80))
    ano                    = Column(Integer, nullable=False)
    data_plantio           = Column(Date)
    data_colheita_prevista = Column(Date)
    producao_kg            = Column(Numeric(14, 3))
    status                 = Column(
        Enum("planejada", "em_andamento", "colhida", "cancelada"),
        nullable=False, default="planejada"
    )
    talhao      = relationship("Talhao", back_populates="safras")
    atividades  = relationship("AtividadeAgricola", back_populates="safra")
    colheitas   = relationship("Colheita", back_populates="safra")


class Funcionario(Base):
    __tablename__ = "funcionario"
    id            = Column(Integer, primary_key=True, index=True)
    nome          = Column(String(120), nullable=False)
    cpf           = Column(String(14), nullable=False, unique=True)
    cargo         = Column(String(80), nullable=False)
    cnh           = Column(String(20))
    salario       = Column(Numeric(10, 2))
    data_admissao = Column(Date)
    ativo         = Column(SmallInteger, default=1)


class TipoAtividade(Base):
    __tablename__ = "tipo_atividade"
    id        = Column(Integer, primary_key=True, index=True)
    nome      = Column(String(80), nullable=False)
    categoria = Column(String(60))


class AtividadeAgricola(Base):
    __tablename__ = "atividade_agricola"
    id             = Column(Integer, primary_key=True, index=True)
    safra_id       = Column(Integer, ForeignKey("safra.id"), nullable=False)
    tipo_id        = Column(Integer, ForeignKey("tipo_atividade.id"), nullable=False)
    funcionario_id = Column(Integer, ForeignKey("funcionario.id"), nullable=False)
    data           = Column(Date, nullable=False)
    area_ha        = Column(Numeric(10, 2))
    custo          = Column(Numeric(12, 2), default=0)
    observacao     = Column(Text)
    safra          = relationship("Safra", back_populates="atividades")


class Colheita(Base):
    __tablename__ = "colheita"
    id            = Column(Integer, primary_key=True, index=True)
    safra_id      = Column(Integer, ForeignKey("safra.id"), nullable=False)
    data          = Column(Date, nullable=False)
    quantidade_kg = Column(Numeric(14, 3), nullable=False)
    umidade_pct   = Column(Numeric(5, 2))
    impureza_pct  = Column(Numeric(5, 2))
    destino       = Column(String(120))
    safra         = relationship("Safra", back_populates="colheitas")


class Cliente(Base):
    __tablename__ = "cliente"
    id             = Column(Integer, primary_key=True, index=True)
    razao_social   = Column(String(150), nullable=False)
    cnpj_cpf       = Column(String(18), nullable=False, unique=True)
    tipo           = Column(Enum("PF", "PJ"), default="PJ")
    municipio      = Column(String(100))
    estado         = Column(String(2))
    contato        = Column(String(80))
    email          = Column(String(120))
    limite_credito = Column(Numeric(14, 2), default=0)
    ativo          = Column(SmallInteger, default=1)


class Fornecedor(Base):
    __tablename__ = "fornecedor"
    id           = Column(Integer, primary_key=True, index=True)
    razao_social = Column(String(150), nullable=False)
    cnpj         = Column(String(18), nullable=False, unique=True)
    municipio    = Column(String(100))
    estado       = Column(String(2))
    contato      = Column(String(80))
    email        = Column(String(120))
    ativo        = Column(SmallInteger, default=1)


class Insumo(Base):
    __tablename__ = "insumo"
    id              = Column(Integer, primary_key=True, index=True)
    nome            = Column(String(120), nullable=False)
    principio_ativo = Column(String(120))
    categoria       = Column(
        Enum("defensivo", "fertilizante", "semente", "combustivel", "outro"),
        nullable=False
    )
    unidade_medida  = Column(String(20), nullable=False)
    registro_mapa   = Column(String(40))
    estoque_minimo  = Column(Numeric(12, 3), default=0)


class Equipamento(Base):
    __tablename__ = "equipamento"
    id          = Column(Integer, primary_key=True, index=True)
    descricao   = Column(String(120), nullable=False)
    tipo        = Column(String(60), nullable=False)
    marca       = Column(String(60))
    modelo      = Column(String(60))
    ano         = Column(Integer)
    placa_serie = Column(String(30))
    horimetro   = Column(Numeric(10, 1), default=0)
    status      = Column(
        Enum("disponivel", "em_uso", "manutencao", "inativo"),
        default="disponivel"
    )
    valor_atual = Column(Numeric(14, 2))
