import re

from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any


def normalizar_texto(valor: Any) -> str | None:
    if valor is None:
        return None

    texto = str(valor).strip()

    if not texto:
        return None

    return texto


def normalizar_texto_multilinha(valor: Any) -> str | None:
    texto = normalizar_texto(valor)

    if texto is None:
        return None

    return re.sub(r"\s+", " ", texto)


def converter_inteiro(valor: Any) -> int | None:
    if valor is None:
        return None

    texto = str(valor).strip()

    if not texto:
        return None

    try:
        return int(texto)
    except (TypeError, ValueError):
        return None


def converter_decimal_brasileiro(valor: Any) -> Decimal | None:
    if valor is None:
        return None

    if isinstance(valor, Decimal):
        return valor

    if isinstance(valor, (int, float)):
        return Decimal(str(valor))

    texto = str(valor).strip()

    if not texto:
        return None

    texto_normalizado = (
        texto
        .replace("R$", "")
        .replace(" ", "")
        .replace(".", "")
        .replace(",", ".")
    )

    try:
        return Decimal(texto_normalizado)
    except InvalidOperation:
        return None


def converter_data(valor: Any) -> date | None:
    texto = normalizar_texto(valor)

    if texto is None:
        return None

    formatos = (
        "%d/%m/%Y",
        "%Y-%m-%d",
        "%d/%m/%Y %H:%M",
        "%Y-%m-%dT%H:%M:%S",
    )

    for formato in formatos:
        try:
            return datetime.strptime(texto, formato).date()
        except ValueError:
            continue

    return None


def transformar_licitacao(licitacao: dict[str, Any],) -> dict[str, Any]:
    return {

        "id_externo": converter_inteiro(
            licitacao.get("id_processo_compra")
        ),
        "tipo_aquisicao": normalizar_texto(
            licitacao.get("ds_tp_aquisicao")
        ),
        "modalidade": normalizar_texto(
            licitacao.get("ds_modalidade")
        ),
        "lei": normalizar_texto(
            licitacao.get("lei")
        ),
        "orgao": normalizar_texto(
            licitacao.get("ds_unidade_adm")
        ),
        "processo_compra": normalizar_texto(
            licitacao.get("nr_processo_compra")
        ),
        "numero_modalidade": normalizar_texto(
            licitacao.get("nr_modalidade")
        ),
        "numero_edital": normalizar_texto(
            licitacao.get("nr_edital")
        ),
        "data_abertura": converter_data(
            licitacao.get("dt_abertura")
        ),
        "data_homologacao": converter_data(
            licitacao.get("dt_homologacao")
        ),
        "valor_estimado": converter_decimal_brasileiro(
            licitacao.get("vl_estimado")
        ),
        "status_processo": normalizar_texto(
            licitacao.get("ds_st_processo_compra")
        ),
        "objeto": normalizar_texto_multilinha(
            licitacao.get("objeto")
        ),
    }


def licitacao_valida(licitacao: dict[str, Any]) -> bool:
    campos_obrigatorios = (
        "id_externo",
        "processo_compra",
        "orgao",
        "objeto",
        "status_processo",
    )

    return all(
        licitacao.get(campo) is not None
        for campo in campos_obrigatorios
    )


def extrair_licitacoes(dados: dict[str, Any],) -> list[dict[str, Any]]:
    licitacoes = dados.get("licitacoes", [])

    if not isinstance(licitacoes, list):
        raise ValueError(
            "O campo 'licitacoes' deveria conter uma lista."
        )

    resultados: list[dict[str, Any]] = []

    for licitacao in licitacoes:
        if not isinstance(licitacao, dict):
            continue

        licitacao_transformada = transformar_licitacao(
            licitacao
        )

        if not licitacao_valida(licitacao_transformada):
            continue

        resultados.append(licitacao_transformada)

    return resultados