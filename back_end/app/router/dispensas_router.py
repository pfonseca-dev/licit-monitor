from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.service.dispensa_service import DispensaService
from app.core.database import get_session
from app.repository.dispensas_repository import DispensasRepository
from app.schema.dispensa_schema import DispensasResponse, DispensaObservacaoUpdate
from app.models.usuario import Usuario
from app.dependencies.auth import get_current_editor

router = APIRouter(
    prefix="/dispensas",
    tags=["dispensas"],
)

@router.get("", response_model=list[DispensasResponse])
def get_dispensas(session: Session = Depends(get_session)) -> list[DispensasResponse]:
    repository = DispensasRepository(session)
    service = DispensaService(repository)

    return service.get_dispensas()

@router.get("/{dispensa_id}", response_model=DispensasResponse)
def get_dispensas_id(dispensa_id: int, session: Session = Depends(get_session)):
    repository = DispensasRepository(session)
    service = DispensaService(repository)

    return service.get_dispensas_id(dispensa_id)

@router.patch("/{dispensa_id}/observacao", response_model=DispensasResponse)
def atualizar_observacao(dispensa_id: int,
                         dados: DispensaObservacaoUpdate,
                         session: Session = Depends(get_session),
                         usuario: Usuario = Depends(get_current_editor),
                         ):
    repository = DispensasRepository(session)
    service = DispensaService(repository)

    return service.atualizar_observacao(dispensa_id=dispensa_id, observacao=dados.observacao)