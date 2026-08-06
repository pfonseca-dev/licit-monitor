from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()

ALGORITHM = "HS256"


def gerar_hash_senha(
    senha: str,
) -> str:
    return password_hash.hash(senha)


def verificar_senha(
    senha: str,
    senha_hash: str,
) -> bool:
    return password_hash.verify(
        senha,
        senha_hash,
    )


def criar_access_token(
    usuario_id: int,
    secret_key: str,
    minutos_expiracao: int,
) -> str:
    agora = datetime.now(timezone.utc)

    payload = {
        "sub": str(usuario_id),
        "iat": agora,
        "exp": agora + timedelta(
            minutes=minutos_expiracao
        ),
    }

    return jwt.encode(
        payload,
        secret_key,
        algorithm=ALGORITHM,
    )