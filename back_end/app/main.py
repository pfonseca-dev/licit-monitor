from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.router.licitacoes_router import router as licitacoes_router
from app.router.dispensas_router import router as dispensas_router
from app.router.auth_router import router as auth_router
from app.router.usuario_router import router as usuario_router

app = FastAPI(
    title="Licit Monitor API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(licitacoes_router)
app.include_router(dispensas_router)

@app.get("/")
def raiz() -> dict[str, str]:
    return {
        "message": "Licit Monitor API está funcionando"
    }
