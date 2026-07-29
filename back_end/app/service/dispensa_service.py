from fastapi import HTTPException
from starlette import status

from app.repository.dispensas_repository import DispensasRepository
from app.models.dispensas import Dispensas

class DispensaService:
    def __init__(self, repository: DispensasRepository):
        self.repository = repository

    def get_dispensas(self) -> list[Dispensas]:
        return self.repository.buscar_todas_dispensas()

    def get_dispensas_id(self, dispensa_id: int) -> Dispensas:
        dispensa = self.repository.buscar_por_id(dispensa_id)

        if dispensa is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dispensa não encontrada")
        return dispensa

    def atualizar_observacao(self, dispensa_id: int, observacao: str | None):
        dispensa = self.repository.buscar_por_id(dispensa_id)

        if dispensa is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dispensa, não encontrada")

        if observacao is not None:
            observacao = observacao.strip()

            if not observacao:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A observacao não pode conter apenas espaços")

        return self.repository.atualizar_observacao(dispensa=dispensa, observacao=observacao)