import logging

from psycopg import Connection

from app.licitacoes.api_client import buscar_dados
from app.licitacoes.repository import salvar_licitacoes
from app.licitacoes.transformer import extrair_licitacoes


logger = logging.getLogger(__name__)


def executar(connection: Connection,) -> int:
    dados = buscar_dados()

    licitacoes_transformadas = extrair_licitacoes(dados)

    logger.info(
        "%d licitações válidas foram transformadas.",
        len(licitacoes_transformadas),
    )

    return salvar_licitacoes(
        connection=connection,
        licitacoes=licitacoes_transformadas,
    )