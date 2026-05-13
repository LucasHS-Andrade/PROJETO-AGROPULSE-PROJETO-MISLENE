from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

router = APIRouter()


# ════════════════════════════════════════════════════════
# FAZENDAS
# ════════════════════════════════════════════════════════
@router.get("/fazendas", response_model=List[schemas.FazendaOut], tags=["Fazendas"])
def listar_fazendas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Fazenda).offset(skip).limit(limit).all()

@router.get("/fazendas/{id}", response_model=schemas.FazendaOut, tags=["Fazendas"])
def buscar_fazenda(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Fazenda).filter(models.Fazenda.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fazenda não encontrada")
    return obj

@router.post("/fazendas", response_model=schemas.FazendaOut, status_code=201, tags=["Fazendas"])
def criar_fazenda(data: schemas.FazendaCreate, db: Session = Depends(get_db)):
    obj = models.Fazenda(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/fazendas/{id}", response_model=schemas.FazendaOut, tags=["Fazendas"])
def atualizar_fazenda(id: int, data: schemas.FazendaCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Fazenda).filter(models.Fazenda.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fazenda não encontrada")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/fazendas/{id}", status_code=204, tags=["Fazendas"])
def deletar_fazenda(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Fazenda).filter(models.Fazenda.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fazenda não encontrada")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# TALHÕES
# ════════════════════════════════════════════════════════
@router.get("/talhoes", response_model=List[schemas.TalhaoOut], tags=["Talhões"])
def listar_talhoes(fazenda_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Talhao)
    if fazenda_id: q = q.filter(models.Talhao.fazenda_id == fazenda_id)
    return q.all()

@router.get("/talhoes/{id}", response_model=schemas.TalhaoOut, tags=["Talhões"])
def buscar_talhao(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Talhao).filter(models.Talhao.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Talhão não encontrado")
    return obj

@router.post("/talhoes", response_model=schemas.TalhaoOut, status_code=201, tags=["Talhões"])
def criar_talhao(data: schemas.TalhaoCreate, db: Session = Depends(get_db)):
    obj = models.Talhao(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/talhoes/{id}", response_model=schemas.TalhaoOut, tags=["Talhões"])
def atualizar_talhao(id: int, data: schemas.TalhaoCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Talhao).filter(models.Talhao.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Talhão não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/talhoes/{id}", status_code=204, tags=["Talhões"])
def deletar_talhao(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Talhao).filter(models.Talhao.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Talhão não encontrado")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# SAFRAS
# ════════════════════════════════════════════════════════
@router.get("/safras", response_model=List[schemas.SafraOut], tags=["Safras"])
def listar_safras(talhao_id: Optional[int] = None, ano: Optional[int] = None,
                  status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Safra)
    if talhao_id: q = q.filter(models.Safra.talhao_id == talhao_id)
    if ano:       q = q.filter(models.Safra.ano == ano)
    if status:    q = q.filter(models.Safra.status == status)
    return q.all()

@router.get("/safras/{id}", response_model=schemas.SafraOut, tags=["Safras"])
def buscar_safra(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Safra).filter(models.Safra.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Safra não encontrada")
    return obj

@router.post("/safras", response_model=schemas.SafraOut, status_code=201, tags=["Safras"])
def criar_safra(data: schemas.SafraCreate, db: Session = Depends(get_db)):
    obj = models.Safra(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/safras/{id}", response_model=schemas.SafraOut, tags=["Safras"])
def atualizar_safra(id: int, data: schemas.SafraCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Safra).filter(models.Safra.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Safra não encontrada")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/safras/{id}", status_code=204, tags=["Safras"])
def deletar_safra(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Safra).filter(models.Safra.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Safra não encontrada")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# FUNCIONÁRIOS
# ════════════════════════════════════════════════════════
@router.get("/funcionarios", response_model=List[schemas.FuncionarioOut], tags=["Funcionários"])
def listar_funcionarios(ativo: Optional[int] = 1, db: Session = Depends(get_db)):
    return db.query(models.Funcionario).filter(models.Funcionario.ativo == ativo).all()

@router.get("/funcionarios/{id}", response_model=schemas.FuncionarioOut, tags=["Funcionários"])
def buscar_funcionario(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Funcionario).filter(models.Funcionario.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    return obj

@router.post("/funcionarios", response_model=schemas.FuncionarioOut, status_code=201, tags=["Funcionários"])
def criar_funcionario(data: schemas.FuncionarioCreate, db: Session = Depends(get_db)):
    obj = models.Funcionario(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/funcionarios/{id}", response_model=schemas.FuncionarioOut, tags=["Funcionários"])
def atualizar_funcionario(id: int, data: schemas.FuncionarioCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Funcionario).filter(models.Funcionario.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/funcionarios/{id}", status_code=204, tags=["Funcionários"])
def deletar_funcionario(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Funcionario).filter(models.Funcionario.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# ATIVIDADES AGRÍCOLAS
# ════════════════════════════════════════════════════════
@router.get("/atividades", response_model=List[schemas.AtividadeOut], tags=["Atividades"])
def listar_atividades(safra_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.AtividadeAgricola)
    if safra_id: q = q.filter(models.AtividadeAgricola.safra_id == safra_id)
    return q.all()

@router.get("/atividades/{id}", response_model=schemas.AtividadeOut, tags=["Atividades"])
def buscar_atividade(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.AtividadeAgricola).filter(models.AtividadeAgricola.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return obj

@router.post("/atividades", response_model=schemas.AtividadeOut, status_code=201, tags=["Atividades"])
def criar_atividade(data: schemas.AtividadeCreate, db: Session = Depends(get_db)):
    obj = models.AtividadeAgricola(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/atividades/{id}", response_model=schemas.AtividadeOut, tags=["Atividades"])
def atualizar_atividade(id: int, data: schemas.AtividadeCreate, db: Session = Depends(get_db)):
    obj = db.query(models.AtividadeAgricola).filter(models.AtividadeAgricola.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Atividade não encontrada")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/atividades/{id}", status_code=204, tags=["Atividades"])
def deletar_atividade(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.AtividadeAgricola).filter(models.AtividadeAgricola.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Atividade não encontrada")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# COLHEITAS
# ════════════════════════════════════════════════════════
@router.get("/colheitas", response_model=List[schemas.ColheitaOut], tags=["Colheitas"])
def listar_colheitas(safra_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Colheita)
    if safra_id: q = q.filter(models.Colheita.safra_id == safra_id)
    return q.all()

@router.get("/colheitas/{id}", response_model=schemas.ColheitaOut, tags=["Colheitas"])
def buscar_colheita(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Colheita).filter(models.Colheita.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Colheita não encontrada")
    return obj

@router.post("/colheitas", response_model=schemas.ColheitaOut, status_code=201, tags=["Colheitas"])
def criar_colheita(data: schemas.ColheitaCreate, db: Session = Depends(get_db)):
    obj = models.Colheita(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/colheitas/{id}", response_model=schemas.ColheitaOut, tags=["Colheitas"])
def atualizar_colheita(id: int, data: schemas.ColheitaCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Colheita).filter(models.Colheita.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Colheita não encontrada")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/colheitas/{id}", status_code=204, tags=["Colheitas"])
def deletar_colheita(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Colheita).filter(models.Colheita.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Colheita não encontrada")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# CLIENTES
# ════════════════════════════════════════════════════════
@router.get("/clientes", response_model=List[schemas.ClienteOut], tags=["Clientes"])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).filter(models.Cliente.ativo == 1).all()

@router.get("/clientes/{id}", response_model=schemas.ClienteOut, tags=["Clientes"])
def buscar_cliente(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return obj

@router.post("/clientes", response_model=schemas.ClienteOut, status_code=201, tags=["Clientes"])
def criar_cliente(data: schemas.ClienteCreate, db: Session = Depends(get_db)):
    obj = models.Cliente(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/clientes/{id}", response_model=schemas.ClienteOut, tags=["Clientes"])
def atualizar_cliente(id: int, data: schemas.ClienteCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Cliente não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/clientes/{id}", status_code=204, tags=["Clientes"])
def deletar_cliente(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Cliente não encontrado")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# FORNECEDORES
# ════════════════════════════════════════════════════════
@router.get("/fornecedores", response_model=List[schemas.FornecedorOut], tags=["Fornecedores"])
def listar_fornecedores(db: Session = Depends(get_db)):
    return db.query(models.Fornecedor).filter(models.Fornecedor.ativo == 1).all()

@router.get("/fornecedores/{id}", response_model=schemas.FornecedorOut, tags=["Fornecedores"])
def buscar_fornecedor(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Fornecedor).filter(models.Fornecedor.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    return obj

@router.post("/fornecedores", response_model=schemas.FornecedorOut, status_code=201, tags=["Fornecedores"])
def criar_fornecedor(data: schemas.FornecedorCreate, db: Session = Depends(get_db)):
    obj = models.Fornecedor(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/fornecedores/{id}", response_model=schemas.FornecedorOut, tags=["Fornecedores"])
def atualizar_fornecedor(id: int, data: schemas.FornecedorCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Fornecedor).filter(models.Fornecedor.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/fornecedores/{id}", status_code=204, tags=["Fornecedores"])
def deletar_fornecedor(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Fornecedor).filter(models.Fornecedor.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# INSUMOS
# ════════════════════════════════════════════════════════
@router.get("/insumos", response_model=List[schemas.InsumoOut], tags=["Insumos"])
def listar_insumos(categoria: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Insumo)
    if categoria: q = q.filter(models.Insumo.categoria == categoria)
    return q.all()

@router.get("/insumos/{id}", response_model=schemas.InsumoOut, tags=["Insumos"])
def buscar_insumo(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Insumo).filter(models.Insumo.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Insumo não encontrado")
    return obj

@router.post("/insumos", response_model=schemas.InsumoOut, status_code=201, tags=["Insumos"])
def criar_insumo(data: schemas.InsumoCreate, db: Session = Depends(get_db)):
    obj = models.Insumo(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/insumos/{id}", response_model=schemas.InsumoOut, tags=["Insumos"])
def atualizar_insumo(id: int, data: schemas.InsumoCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Insumo).filter(models.Insumo.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Insumo não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/insumos/{id}", status_code=204, tags=["Insumos"])
def deletar_insumo(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Insumo).filter(models.Insumo.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Insumo não encontrado")
    db.delete(obj); db.commit()


# ════════════════════════════════════════════════════════
# EQUIPAMENTOS
# ════════════════════════════════════════════════════════
@router.get("/equipamentos", response_model=List[schemas.EquipamentoOut], tags=["Equipamentos"])
def listar_equipamentos(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Equipamento)
    if status: q = q.filter(models.Equipamento.status == status)
    return q.all()

@router.get("/equipamentos/{id}", response_model=schemas.EquipamentoOut, tags=["Equipamentos"])
def buscar_equipamento(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Equipamento).filter(models.Equipamento.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    return obj

@router.post("/equipamentos", response_model=schemas.EquipamentoOut, status_code=201, tags=["Equipamentos"])
def criar_equipamento(data: schemas.EquipamentoCreate, db: Session = Depends(get_db)):
    obj = models.Equipamento(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/equipamentos/{id}", response_model=schemas.EquipamentoOut, tags=["Equipamentos"])
def atualizar_equipamento(id: int, data: schemas.EquipamentoCreate, db: Session = Depends(get_db)):
    obj = db.query(models.Equipamento).filter(models.Equipamento.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    for k, v in data.model_dump().items(): setattr(obj, k, v)
    db.commit(); db.refresh(obj); return obj

@router.delete("/equipamentos/{id}", status_code=204, tags=["Equipamentos"])
def deletar_equipamento(id: int, db: Session = Depends(get_db)):
    obj = db.query(models.Equipamento).filter(models.Equipamento.id == id).first()
    if not obj: raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    db.delete(obj); db.commit()
