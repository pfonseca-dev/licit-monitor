from datetime import datetime
from decimal import Decimal
from sqlalchemy import BigInteger, CheckConstraint, Numeric, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base

class Dispensas(Base):
    __tablename__ = "dispensas"

    __table_args__ = (
        CheckConstraint(
            "valor_total IS NULL OR valor_total >= 0",
            name="ck_dispensas_valor_total",
        ),
    )

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    id_externo: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        unique=True,
    )

    processo_compra: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    modalidade: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    contratos: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    lei: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    artigo: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    tipo_aquisicao: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    objeto: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    orgao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    fornecedor: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status_processo: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    observacao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    valor_total: Mapped[Decimal | None] = mapped_column(
        Numeric(15,2),
        nullable=True,
    )

    data_abertura: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    data_homologacao: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    data_encerramento: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    def __repr__(self) -> str:
        return (
            f"Dispensas("
            f"id: {self.id!r}, "
            f"id_externo: {self.id_externo!r}, "
            f"processo_compra: {self.processo_compra!r}, "
            f")"
        )