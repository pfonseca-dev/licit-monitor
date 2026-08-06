from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dispensas import Dispensas

class DispensasRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def buscar_todas_dispensas(self) -> list[Dispensas]:
        statement = (select(Dispensas).order_by(Dispensas.id))

        resultado = self.session.scalars(statement)

        return list(resultado.all())

    def buscar_por_id(self, dispensa_id: int) -> Dispensas:
        statement = (select(Dispensas).where(Dispensas.id == dispensa_id))

        return self.session.scalar(statement)

    def atualizar_observacao(self, dispensa: Dispensas, observacao: str | None) -> Dispensas:
        dispensa.observacao = observacao

        self.session.commit()
        self.session.refresh(dispensa)

        return dispensa
