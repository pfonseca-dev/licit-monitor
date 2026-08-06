from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_session
from app.service.licitacao_service import LicitacaoService
from app.repository.licitacoes_repository import LicitacaoRepository
from app.schema.licitacao_schema import LicitacaoResponse, LicitacaoObservacaoUpdate
from app.models.usuario import Usuario
from app.dependencies.auth import get_current_editor

router = APIRouter(
    prefix="/licitacoes",
    tags=["licitacoes"],
)

@router.get("", response_model=list[LicitacaoResponse])
def get_licitacoes(session: Session = Depends(get_session)) -> list[LicitacaoResponse]:
    repository = LicitacaoRepository(session)
    service = LicitacaoService(repository)

    return service.get_licitacoes()

@router.get("/{licitacao_id}", response_model=LicitacaoResponse,)
def get_licitacao_id(licitacao_id: int, session: Session = Depends(get_session)) -> list[LicitacaoResponse]:
    repository = LicitacaoRepository(session)
    service = LicitacaoService(repository)

    return service.get_licitacao_id(licitacao_id)

@router.patch("/{licitacao_id}/observacao", response_model=LicitacaoResponse,)
def atualiza_observacao(licitacao_id: int,
                        dados: LicitacaoObservacaoUpdate,
                        session: Session = Depends(get_session),
                        usuario: Usuario = Depends(get_current_editor),):
    repository = LicitacaoRepository(session)
    service = LicitacaoService(repository)

    return service.atualizar_observacao(licitacao_id=licitacao_id, observacao=dados.observacao,)
