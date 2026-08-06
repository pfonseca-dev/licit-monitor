from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_session
from app.core.security import gerar_hash_senha
from app.dependencies.auth import get_current_usuario
from app.models.usuario import Usuario
from app.repository.usuario_repository import UsuarioRepository
from app.schema.usuario_schema import UsuarioCreate, UsuarioResponse


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"],
)


@router.post(
    "",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_usuario(
    dados: UsuarioCreate,
    session: Session = Depends(get_session),
):
    repository = UsuarioRepository(session)

    if repository.buscar_por_email(dados.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário com esse e-mail.",
        )

    usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha_hash=gerar_hash_senha(dados.senha),
    )

    return repository.criar(usuario)


@router.get(
    "/me",
    response_model=UsuarioResponse,
)
def usuario_logado(
    usuario: Usuario = Depends(get_current_usuario),
):
    return usuario