import requests

from app.config import API_URL

def buscar_dados() -> dict:
    response = requests.get(
        url=API_URL,
        timeout=30,
    )

    print(f"Status da requisição: {response.status_code}")

    response.raise_for_status()

    return response.json()