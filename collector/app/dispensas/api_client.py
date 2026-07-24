from app.config import URL_DISPE
from app.http_client import buscar_json

def buscar_dados():
    return buscar_json(URL_DISPE)