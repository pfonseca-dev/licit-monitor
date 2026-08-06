from fastapi import HTTPException, status

from app.core.security import (
    criar_access_token,
    verificar_senha,
)
from app.repository.usuario_repository import UsuarioRepository


class AuthService:

    def __init__(
        self,
        repository: UsuarioRepository,
        secret_key: str,
        token_expire_minutes: int,
    ):
        self.repository = repository
        self.secret_key = secret_key
        self.token_expire_minutes = token_expire_minutes

    def autenticar(
        self,
        email: str,
        senha: str,
    ) -> str:
        usuario = self.repository.buscar_por_email(
            email
        )

        if usuario is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha inválidos.",
            )

        senha_valida = verificar_senha(
            senha,
            usuario.senha_hash,
        )

        if not senha_valida:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha inválidos.",
            )

        if not usuario.ativo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuário desativado.",
            )

        return criar_access_token(
            usuario_id=usuario.id,
            secret_key=self.secret_key,
            minutos_expiracao=self.token_expire_minutes,
        )