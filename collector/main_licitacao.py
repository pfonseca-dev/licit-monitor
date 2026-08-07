import logging
import os
import time

from app.database import abrir_conexao, registrar_coleta, testar_conexao
from app.licitacoes.service import executar


logger = logging.getLogger(__name__)

INTERVALO_SEGUNDOS = int (
    os.getenv("COLLECTOR_INTERVAL", "300")
)

def executar_coleta() -> None:
    testar_conexao()

    with abrir_conexao() as connection:
        total_processado = executar(connection=connection)
        registrar_coleta(connection, "licitacoes")

    logger.info(
        "%d licitações foram processadas.",
        total_processado,
    )
def main() -> None:
    while True:
        try:
            executar_coleta()
        except Exception:
            logger.exception("Erro ao executar coleta.")
        logger.info("Próxima coleta em %d segundos.", INTERVALO_SEGUNDOS)

        time.sleep(INTERVALO_SEGUNDOS)

if __name__ == "__main__":
    main()
