from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

class LicitacaoResponse(BaseModel):
    id: int
    id_externo: int
    processo_compra: str
    numero_edital: str | None
    modalidade: str | None
    tipo_aquisicao: str | None
    orgao: str | None
    objeto: str | None
    lei: str | None
    status_processo: str | None
    observacao: str | None
    valor_estimado: Decimal | None
    data_abertura: datetime | None
    data_homologacao: datetime | None

    model_config = ConfigDict(from_attributes=True)

class LicitacaoObservacaoUpdate(BaseModel):
    observacao: str | None = Field(default=None, max_length=5000,)