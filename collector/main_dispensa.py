import logging

from app.database import abrir_conexao, testar_conexao
from app.dispensas.service import executar

logger = logging.getLogger(__name__)

def main() -> None:
    testar_conexao()

    with abrir_conexao() as connection:
        total_processado = executar(connection=connection)

    logger.info(
        "%d dispensas foram processadas.",
        total_processado
    )

if __name__ == "__main__":
    main()