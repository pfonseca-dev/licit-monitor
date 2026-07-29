from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, CheckConstraint, Numeric, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Licitacao(Base):
    __tablename__ = "licitacoes"

    __table_args__ = (
        CheckConstraint(
            "valor_estimado IS NULL OR valor_estimado >= 0",
            name="ck_licitacoes_valor_estimado",
        ),
    )

    id: Mapped[int] = mapped_column(
        BigInteger,
        autoincrement=True,
        primary_key=True,
    )

    id_externo: Mapped[int] = mapped_column(
        BigInteger,
        unique=True,
        nullable=False,
    )

    processo_compra: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    numero_edital: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    numero_modalidade: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    lei: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    modalidade: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    tipo_aquisicao: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    status_processo: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    orgao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    objeto: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    observacao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    valor_estimado: Mapped[Decimal | None] = mapped_column(
        Numeric(15,2),
        nullable=True,
    )

    data_abertura: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    data_homologacao: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    def __rep__(self) -> str:
        return (
            f"Licitacao ("
            f"id: {self.id!r}, "
            f"id_externo: {self.id_externo!r}, "
            f"processo_compra: {self.processo_compra!r}, "
            f")"
        )