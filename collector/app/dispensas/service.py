import logging

from psycopg import Connection

from app.dispensas.api_client import buscar_dados
from app.dispensas.repository import salvar_dispensas
from app.dispensas.transformer import extrair_dispensas

logger = logging.getLogger(__name__)

def executar(connection: Connection) -> int:
    dados = buscar_dados()

    dispensas = extrair_dispensas(dados)

    logger.info(
        "%d dispensas válidas foram transformadas.",
        len(dispensas)
    )

    return salvar_dispensas(
        connection=connection,
        dispensas=dispensas,
    )