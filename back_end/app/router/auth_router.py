from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.repository.usuario_repository import UsuarioRepository
from app.schema.usuario_schema import TokenResponse
from app.service.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    dados: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    repository = UsuarioRepository(session)

    service = AuthService(
        repository=repository,
        secret_key="TEMPORARIO",
        token_expire_minutes=60,
    )

    token = service.autenticar(
        email=dados.username,
        senha=dados.password,
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }