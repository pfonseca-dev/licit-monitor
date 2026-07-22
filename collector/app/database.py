from collections.abc import Iterator
from contextlib import contextmanager

import psycopg
from psycopg import Connection
from psycopg.rows import dict_row

from app.config import (
    DB_CONNECT_TIMEOUT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
)


@contextmanager
def abrir_conexao() -> Iterator[Connection]:
    connection: Connection | None = None

    try:
        connection = psycopg.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=DB_CONNECT_TIMEOUT,
            row_factory=dict_row,
            application_name="licit_monitor_collector",
        )

        yield connection
        connection.commit()

    except Exception:
        if connection is not None:
            connection.rollback()

        raise

    finally:
        if connection is not None:
            connection.close()


def testar_conexao() -> None:
    with abrir_conexao() as connection:
        resultado = connection.execute(
            """
            SELECT
                current_database() AS banco,
                current_user AS usuario;
            """
        ).fetchone()

        if resultado is None:
            raise RuntimeError(
                "O PostgreSQL não retornou os dados da conexão."
            )

        print(
            "Conexão estabelecida com sucesso: "
            f"banco={resultado['banco']}, "
            f"usuario={resultado['usuario']}"
        )