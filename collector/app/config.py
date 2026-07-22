import os
from pathlib import Path


COLLECTOR_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = COLLECTOR_DIR / "data"
ARQUIVO_DADOS = DATA_DIR / "dados.json"


def obter_variavel_obrigatoria(nome: str) -> str:
    valor = os.getenv(nome)

    if valor is None or not valor.strip():
        raise RuntimeError(
            f"A variável de ambiente {nome} não foi definida."
        )

    return valor.strip()


def obter_inteiro(nome: str, valor_padrao: int) -> int:
    valor = os.getenv(nome)

    if valor is None or not valor.strip():
        return valor_padrao

    try:
        return int(valor)
    except ValueError as erro:
        raise RuntimeError(
            f"A variável {nome} deve conter um número inteiro."
        ) from erro


API_URL = obter_variavel_obrigatoria("API_URL")

DB_HOST = obter_variavel_obrigatoria("DB_HOST")
DB_PORT = obter_inteiro("DB_PORT", 5432)
DB_NAME = obter_variavel_obrigatoria("DB_NAME")
DB_USER = obter_variavel_obrigatoria("DB_USER")
DB_PASSWORD = obter_variavel_obrigatoria("DB_PASSWORD")
DB_CONNECT_TIMEOUT = obter_inteiro(
    "DB_CONNECT_TIMEOUT",
    10,
)