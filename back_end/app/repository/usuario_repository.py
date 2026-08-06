from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.usuario import Usuario


class UsuarioRepository:

    def __init__(self, session: Session):
        self.session = session

    def buscar_por_id(
        self,
        usuario_id: int,
    ) -> Usuario | None:
        statement = (
            select(Usuario)
            .where(Usuario.id == usuario_id)
        )

        return self.session.scalar(statement)

    def buscar_por_email(
        self,
        email: str,
    ) -> Usuario | None:
        statement = (
            select(Usuario)
            .where(Usuario.email == email)
        )

        return self.session.scalar(statement)

    def criar(
        self,
        usuario: Usuario,
    ) -> Usuario:
        self.session.add(usuario)
        self.session.commit()
        self.session.refresh(usuario)

        return usuario