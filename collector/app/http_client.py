import logging
from typing import Any

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


logger = logging.getLogger(__name__)


def criar_sessao() -> requests.Session:
    retry = Retry(
        total=3,
        connect=3,
        read=3,
        backoff_factor=2,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("GET",),
    )

    adapter = HTTPAdapter(max_retries=retry)

    session = requests.Session()
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    return session


def buscar_json(url: str) -> dict[str, Any]:
    logger.info("Iniciando requisição para a API.")

    try:
        with criar_sessao() as session:
            response = session.get(
                url=url,
                timeout=(10, 90),
            )

        logger.info(
            "A API respondeu com o status %d.",
            response.status_code,
        )

        response.raise_for_status()

    except requests.exceptions.ConnectTimeout as error:
        raise RuntimeError(
            "Não foi possível conectar à API dentro do tempo limite."
        ) from error

    except requests.exceptions.ReadTimeout as error:
        raise RuntimeError(
            "A API demorou mais de 90 segundos para responder."
        ) from error

    except requests.exceptions.ConnectionError as error:
        raise RuntimeError(
            "Falha de conexão com a API."
        ) from error

    except requests.exceptions.HTTPError as error:
        raise RuntimeError(
            f"A API retornou um erro HTTP: {error}."
        ) from error

    dados = response.json()

    if not isinstance(dados, dict):
        raise ValueError(
            "A resposta da API deveria ser um objeto JSON."
        )

    return dados