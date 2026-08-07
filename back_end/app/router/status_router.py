from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_session


router = APIRouter(prefix="/status", tags=["status"])


@router.get("/ultima-atualizacao")
def get_ultima_atualizacao(
    session: Session = Depends(get_session),
) -> dict[str, datetime | None]:
    ultima_atualizacao = session.execute(
        text("SELECT MAX(realizada_em) FROM coletas")
    ).scalar_one_or_none()

    return {"ultima_atualizacao": ultima_atualizacao}
