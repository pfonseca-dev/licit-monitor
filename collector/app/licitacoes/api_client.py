from app.config import URL_LICIT
from app.http_client import buscar_json


def buscar_dados():
    return buscar_json(URL_LICIT)