from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.routes import router

app = FastAPI(
    title="API Agronegócio",
    description="API REST para gestão agrícola — fazendas, safras, colheitas, estoque e comercial.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/", tags=["Status"])
def root():
    return {"status": "online", "docs": "/docs"}
