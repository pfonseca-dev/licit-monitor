import re

from datetime import datetime, timezone
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

    texto = re.sub(r"<br\s*/?>"," - ", texto, flags=re.IGNORECASE)

    return re.sub(r"\s+", " ", texto).strip()

def converter_inteiro(valor: Any) -> int | None:
    texto = normalizar_texto(valor)

    if texto is None:
        return None

    try:
        return int(texto)
    except (TypeError, ValueError):
        return None

def converter_decimal_br(valor: Any) -> Decimal | None:
    if valor is None:
        return None

    if isinstance(valor, Decimal):
        return valor

    if isinstance(valor, (int, float)):
        return Decimal(str(valor))

    texto = normalizar_texto(valor)

    if texto is None:
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

def converter_data(valor: Any) -> datetime | None:
    texto = normalizar_texto(valor)

    if texto is None:
        return None

    texto_iso = texto.replace("Z", "+00:00")

    try:
        data_hora = datetime.fromisoformat(texto_iso)
        if data_hora.tzinfo is None:
            data_hora = data_hora.replace(tzinfo=timezone.utc)

        return data_hora

    except ValueError:
        pass

    formatos = (
        "%d/%m/%Y %H:%M",
        "%d/%m/%Y",
        "%Y-%m-%d",
    )

    for formato in formatos:
        try:
            valor_convertido = datetime.strptime(
                texto,
                formato,
            )

            return valor_convertido.replace(tzinfo=timezone.utc)

        except ValueError:
            continue

    return None

def transformar_dispensas(dispensas: dict[str, Any]) -> dict[str, Any]:
    return {
        "id_externo": converter_inteiro(
            dispensas.get("id_processo_compra")
        ),
        "processo_compra": normalizar_texto(
            dispensas.get("nr_processo_compra")
        ),
        "modalidade": normalizar_texto(
            dispensas.get("nr_modalidade")
        ),
        "contratos": normalizar_texto(
            dispensas.get("contratos")
        ),
        "lei": normalizar_texto(
            dispensas.get("ds_modalidade")
        ),
        "artigo": normalizar_texto(
            dispensas.get("ds_artigo")
        ),
        "tipo_aquisicao": normalizar_texto(
            dispensas.get("ds_tp_aquisicao")
        ),
        "objeto": normalizar_texto_multilinha(
            dispensas.get("objeto")
        ),
        "orgao": normalizar_texto(
            dispensas.get("ds_unidade_adm")
        ),
        "fornecedor": normalizar_texto(
            dispensas.get("fornecedor")
        ),
        "status_processo": normalizar_texto(
            dispensas.get("ds_st_processo_compra")
        ),
        "valor_total": converter_decimal_br(
            dispensas.get("vl_total")
        ),
        "data_abertura": converter_data(
            dispensas.get("dt_abertura_proposta")
        ),
        "data_homologacao": converter_data(
            dispensas.get("dt_homologacao")
        ),
        "data_encerramento": converter_data(
            dispensas.get("dt_encerramento_proposta")
        )
    }

def dispensas_valida(dispensas: dict[str, Any]) -> bool:
    campos_obrigatorios = (
        "id_externo",
        "processo_compra",
        "orgao",
        "objeto",
        "status_processo",
    )

    return all(
        dispensas.get(campo) is not None
        for campo in campos_obrigatorios
    )

def extrair_dispensas(dados: dict[str, Any]) -> list[dict[str, Any]]:
    dispensas = dados.get("dispensas", [])

    if not isinstance(dispensas, list):
        raise ValueError(
            "O campo 'dispensas' deveria conter uma lista."
        )

    resultados: list[dict[str, Any]] = []

    for dispensa in dispensas:
        if not isinstance(dispensa, dict):
            continue

        dispensa_transformada = transformar_dispensas(dispensa)

        if not dispensas_valida(dispensa_transformada):
            continue

        resultados.append(dispensa_transformada)
    return resultados