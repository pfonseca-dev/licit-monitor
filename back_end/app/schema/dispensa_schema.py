from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

class DispensasResponse(BaseModel):
    id: int
    id_externo: int
    processo_compra: str
    modalidade: str | None
    contratos: str | None
    lei: str | None
    artigo: str | None
    tipo_aquisicao: str | None
    objeto: str | None
    orgao: str | None
    fornecedor: str | None
    status_processo: str | None
    observacao: str | None
    valor_total: Decimal | None
    data_abertura: datetime | None
    data_homologacao: datetime | None
    data_encerramento: datetime | None

    model_config = ConfigDict(from_attributes=True)

class DispensaObservacaoUpdate(BaseModel):
    observacao: str | None = Field(default=None, max_length=5000)