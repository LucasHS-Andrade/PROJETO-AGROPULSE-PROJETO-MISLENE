from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


# ── Fazenda ──────────────────────────────────────────────
class FazendaBase(BaseModel):
    nome: str
    municipio: str
    estado: str
    area_ha: Decimal
    cnpj: Optional[str] = None
    cpf: Optional[str] = None

class FazendaCreate(FazendaBase):
    pass

class FazendaOut(FazendaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    criado_em: Optional[datetime] = None


# ── Talhão ───────────────────────────────────────────────
class TalhaoBase(BaseModel):
    fazenda_id: int
    nome: str
    area_ha: Decimal
    tipo_solo: Optional[str] = None
    irrigacao: Optional[str] = None

class TalhaoCreate(TalhaoBase):
    pass

class TalhaoOut(TalhaoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ── Safra ────────────────────────────────────────────────
class SafraBase(BaseModel):
    talhao_id: int
    cultura: str
    variedade: Optional[str] = None
    ano: int
    data_plantio: Optional[date] = None
    data_colheita_prevista: Optional[date] = None
    status: Optional[str] = "planejada"

class SafraCreate(SafraBase):
    pass

class SafraOut(SafraBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    producao_kg: Optional[Decimal] = None


# ── Funcionário ──────────────────────────────────────────
class FuncionarioBase(BaseModel):
    nome: str
    cpf: str
    cargo: str
    cnh: Optional[str] = None
    salario: Optional[Decimal] = None
    data_admissao: Optional[date] = None

class FuncionarioCreate(FuncionarioBase):
    pass

class FuncionarioOut(FuncionarioBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ativo: int


# ── Atividade Agrícola ───────────────────────────────────
class AtividadeBase(BaseModel):
    safra_id: int
    tipo_id: int
    funcionario_id: int
    data: date
    area_ha: Optional[Decimal] = None
    custo: Optional[Decimal] = None
    observacao: Optional[str] = None

class AtividadeCreate(AtividadeBase):
    pass

class AtividadeOut(AtividadeBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ── Colheita ─────────────────────────────────────────────
class ColheitaBase(BaseModel):
    safra_id: int
    data: date
    quantidade_kg: Decimal
    umidade_pct: Optional[Decimal] = None
    impureza_pct: Optional[Decimal] = None
    destino: Optional[str] = None

class ColheitaCreate(ColheitaBase):
    pass

class ColheitaOut(ColheitaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ── Cliente ──────────────────────────────────────────────
class ClienteBase(BaseModel):
    razao_social: str
    cnpj_cpf: str
    tipo: Optional[str] = "PJ"
    municipio: Optional[str] = None
    estado: Optional[str] = None
    contato: Optional[str] = None
    email: Optional[str] = None
    limite_credito: Optional[Decimal] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteOut(ClienteBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ativo: int


# ── Fornecedor ───────────────────────────────────────────
class FornecedorBase(BaseModel):
    razao_social: str
    cnpj: str
    municipio: Optional[str] = None
    estado: Optional[str] = None
    contato: Optional[str] = None
    email: Optional[str] = None

class FornecedorCreate(FornecedorBase):
    pass

class FornecedorOut(FornecedorBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ativo: int


# ── Insumo ───────────────────────────────────────────────
class InsumoBase(BaseModel):
    nome: str
    categoria: str
    unidade_medida: str
    principio_ativo: Optional[str] = None
    registro_mapa: Optional[str] = None
    estoque_minimo: Optional[Decimal] = None

class InsumoCreate(InsumoBase):
    pass

class InsumoOut(InsumoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ── Equipamento ──────────────────────────────────────────
class EquipamentoBase(BaseModel):
    descricao: str
    tipo: str
    marca: Optional[str] = None
    modelo: Optional[str] = None
    ano: Optional[int] = None
    placa_serie: Optional[str] = None
    horimetro: Optional[Decimal] = None
    status: Optional[str] = "disponivel"
    valor_atual: Optional[Decimal] = None

class EquipamentoCreate(EquipamentoBase):
    pass

class EquipamentoOut(EquipamentoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
