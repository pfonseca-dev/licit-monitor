from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.licitacao import Licitacao

class LicitacaoRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def buscar_todas_licitacoes(self) -> list[Licitacao]:
        statement =(select(Licitacao).order_by(Licitacao.id))

        resultado = self.session.scalars(statement)

        return list(resultado.all())

    def buscar_por_id(self, licitacao_id: int) -> Licitacao | None:
        statement =(select(Licitacao).where(Licitacao.id == licitacao_id))

        return self.session.scalar(statement)

    def atualizar_observacao(self, licitacao: Licitacao, observacao: str | None) -> Licitacao:
        licitacao.observacao = observacao

        self.session.commit()
        self.session.refresh(licitacao)

        return licitacao
