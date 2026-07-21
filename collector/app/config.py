import os

from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE)

API_URL = os.getenv("URL")

if not API_URL:
    raise ValueError(f"A variável API_URL não foi encontrada no arquivo: {ENV_FILE}")

DATA_DIR = BASE_DIR / "data"
ARQUIVOS_DADOS = DATA_DIR / "dados.json"
