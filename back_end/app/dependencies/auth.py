import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.models.usuario import PerfilUsuario, Usuario
from app.repository.usuario_repository import UsuarioRepository


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
)


def get_current_usuario(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={
            "WWW-Authenticate": "Bearer",
        },
    )

    try:
        payload = jwt.decode(
            token,
            "TEMPORARIO",
            algorithms=["HS256"],
        )

        usuario_id = payload.get("sub")

        if usuario_id is None:
            raise credentials_exception

        usuario_id = int(usuario_id)

    except (InvalidTokenError, ValueError):
        raise credentials_exception

    repository = UsuarioRepository(session)

    usuario = repository.buscar_por_id(
        usuario_id
    )

    if usuario is None:
        raise credentials_exception

    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário desativado.",
        )

    return usuario


def get_current_editor(
    usuario: Usuario = Depends(
        get_current_usuario
    ),
) -> Usuario:
    if usuario.perfil != PerfilUsuario.EDITOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso permitido somente para Editores.",
        )

    return usuario