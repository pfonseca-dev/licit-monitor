import json

from pprint import pprint
from typing import Any

from app.api_client import buscar_dados
from app.config import ARQUIVOS_DADOS, DATA_DIR
from app.transformer import extrair_licitacoes


def salvar_json(dados: dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with ARQUIVOS_DADOS.open(
        mode="w",
        encoding="utf-8",
    ) as arquivo:
        json.dump(
            dados,
            arquivo,
            ensure_ascii=False,
            indent=4,
        )

    print(f"JSON bruto salvo com sucesso em: {ARQUIVOS_DADOS}")


def main() -> None:
    dados_brutos = buscar_dados()

    salvar_json(dados_brutos)

    licitacoes_transformadas = extrair_licitacoes(
        dados_brutos
    )

    print(
        f"Total de licitações transformadas: "
        f"{len(licitacoes_transformadas)}"
    )

    if not licitacoes_transformadas:
        print("Nenhuma licitação foi encontrada.")
        return

    print("\nPrimeira licitação transformada:")

    primeira_licitacao = licitacoes_transformadas[0]

    pprint(primeira_licitacao)

    print("\nTipos dos campos:")

    for campo, valor in primeira_licitacao.items():
        print(
            f"{campo}: "
            f"{type(valor).__name__} "
            f"- {valor!r}"
        )


if __name__ == "__main__":
    main()