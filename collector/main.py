import json
import logging
from typing import Any

from app.api_client import buscar_dados
from app.config import ARQUIVO_DADOS, DATA_DIR
from app.database import abrir_conexao, testar_conexao
from app.repository import salvar_licitacoes
from app.transformer import extrair_licitacoes


logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(message)s"
    ),
)

logger = logging.getLogger(__name__)


def salvar_json(dados: dict[str, Any]) -> None:
    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    with ARQUIVO_DADOS.open(
        mode="w",
        encoding="utf-8",
    ) as arquivo:
        json.dump(
            dados,
            arquivo,
            ensure_ascii=False,
            indent=4,
            default=str,
        )

    logger.info(
        "JSON bruto salvo em %s.",
        ARQUIVO_DADOS,
    )


def main() -> None:
    try:
        testar_conexao()

        dados_brutos = buscar_dados()

        salvar_json(dados_brutos)

        licitacoes_transformadas = extrair_licitacoes(
            dados_brutos
        )

        logger.info(
            "%d licitações válidas foram transformadas.",
            len(licitacoes_transformadas),
        )

        if not licitacoes_transformadas:
            logger.info(
                "Nenhuma licitação foi encontrada para salvar."
            )
            return

        with abrir_conexao() as connection:
            total_salvo = salvar_licitacoes(
                connection=connection,
                licitacoes=licitacoes_transformadas,
            )

        logger.info(
            "%d licitações foram inseridas ou atualizadas.",
            total_salvo,
        )

    except Exception:
        logger.exception(
            "O collector foi encerrado devido a um erro."
        )

        raise


if __name__ == "__main__":
    main()