# API Agronegócio — Python + FastAPI + MySQL

## Pré-requisitos
- Python 3.10+
- MySQL rodando com o banco `agro` criado (use o script `banco_agro.sql`)

## Estrutura
```
agro_api/
├── main.py              ← ponto de entrada
├── requirements.txt     ← dependências
├── .env                 ← configurações do banco
└── app/
    ├── database.py      ← conexão com MySQL
    ├── models.py        ← tabelas mapeadas (SQLAlchemy)
    ├── schemas.py       ← validação de dados (Pydantic)
    └── routers/
        └── routes.py    ← todos os endpoints
```

## Instalação

```bash
# 1. Entrar na pasta
cd agro_api

# 2. Criar ambiente virtual
python -m venv venv

# 3. Ativar (Windows)
venv\Scripts\activate

# 4. Instalar dependências
pip install -r requirements.txt

# 5. Configurar o banco no arquivo .env
# Edite o arquivo .env com seu usuário e senha do MySQL

# 6. Rodar a API
uvicorn main:app --reload
```

## Acessar

- API:  http://localhost:8000
- Docs: http://localhost:8000/docs  ← Swagger UI interativo
- JSON: http://localhost:8000/openapi.json

## Endpoints disponíveis

| Método | Rota                      | Descrição                  |
|--------|---------------------------|----------------------------|
| GET    | /api/v1/fazendas          | Listar fazendas            |
| POST   | /api/v1/fazendas          | Criar fazenda              |
| GET    | /api/v1/fazendas/{id}     | Buscar fazenda             |
| PUT    | /api/v1/fazendas/{id}     | Atualizar fazenda          |
| DELETE | /api/v1/fazendas/{id}     | Deletar fazenda            |
| GET    | /api/v1/talhoes           | Listar talhões             |
| POST   | /api/v1/talhoes           | Criar talhão               |
| GET    | /api/v1/safras            | Listar safras              |
| POST   | /api/v1/safras            | Criar safra                |
| GET    | /api/v1/funcionarios      | Listar funcionários        |
| POST   | /api/v1/funcionarios      | Criar funcionário          |
| GET    | /api/v1/atividades        | Listar atividades          |
| POST   | /api/v1/atividades        | Registrar atividade        |
| GET    | /api/v1/colheitas         | Listar colheitas           |
| POST   | /api/v1/colheitas         | Registrar colheita         |
| GET    | /api/v1/clientes          | Listar clientes            |
| POST   | /api/v1/clientes          | Criar cliente              |
| GET    | /api/v1/fornecedores      | Listar fornecedores        |
| POST   | /api/v1/fornecedores      | Criar fornecedor           |
| GET    | /api/v1/insumos           | Listar insumos             |
| POST   | /api/v1/insumos           | Criar insumo               |
| GET    | /api/v1/equipamentos      | Listar equipamentos        |
| POST   | /api/v1/equipamentos      | Criar equipamento          |

## Exemplo de uso

```bash
# Criar uma fazenda
curl -X POST http://localhost:8000/api/v1/fazendas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Fazenda Boa Vista","municipio":"Patos de Minas","estado":"MG","area_ha":450.5,"cnpj":"12.345.678/0001-99"}'

# Listar safras de 2025
curl http://localhost:8000/api/v1/safras?ano=2025
```
