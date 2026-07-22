import logging
from typing import Any

import requests

from app.config import API_URL


logger = logging.getLogger(__name__)


def buscar_dados() -> dict[str, Any]:
    response = requests.get(
        url=API_URL,
        timeout=30,
    )

    logger.info(
        "A API respondeu com o status %d.",
        response.status_code,
    )

    response.raise_for_status()

    dados = response.json()

    if not isinstance(dados, dict):
        raise ValueError(
            "A resposta da API deveria ser um objeto JSON."
        )

    return dados