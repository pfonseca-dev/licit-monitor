from fastapi import FastAPI

from app.router.licitacoes_router import router as licitacoes_router
from app.router.dispensas_router import router as dispensas_router

app = FastAPI(
    title="Licit Monitor API",
    version="1.0.0",
)

app.include_router(licitacoes_router)
app.include_router(dispensas_router)

@app.get("/")
def raiz() -> dict[str, str]:
    return {
        "message": "Licit Monitor API está funcionando"
    }