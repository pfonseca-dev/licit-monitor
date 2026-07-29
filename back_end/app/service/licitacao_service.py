from fastapi import HTTPException
from starlette import status

from app.repository.licitacoes_repository import LicitacaoRepository
from app.models.licitacao import Licitacao


class LicitacaoService:
    def __init__(self, repository: LicitacaoRepository) -> None:
        self.repository = repository

    def get_licitacoes(self) -> list[Licitacao]:
        return self.repository.buscar_todas_licitacoes()

    def get_licitacao_id(self, licitacao_id: int) -> Licitacao:
        licitacao = self.repository.buscar_por_id(licitacao_id)

        if licitacao is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licitação não encontrada")
        return licitacao

    def atualizar_observacao(self, licitacao_id: int, observacao: str | None):
        licitacao = self.repository.buscar_por_id(licitacao_id)

        if licitacao is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licitação não encontrada")

        if observacao is not None:
            observacao = observacao.strip()

            if not observacao:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A observacao não pode conter apenas espaços")

        return self.repository.atualizar_observacao(licitacao=licitacao, observacao=observacao)