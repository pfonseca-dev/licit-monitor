from enum import Enum
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Boolean, Enum as SqlEnum, String

from app.models.base import Base

class PerfilUsuario(str, Enum):
    EDITOR = "editor"
    VISITANTE = "visualizador"

class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    nome: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    senha_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    perfil: Mapped[PerfilUsuario] = mapped_column(
        SqlEnum(
            PerfilUsuario,
            name="perfil_usuario",
            values_callable=lambda enum: [
                item.value for item in enum
            ],
        ),
        nullable=False,
        default=PerfilUsuario.VISITANTE,
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )
