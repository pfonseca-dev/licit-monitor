from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.usuario import PerfilUsuario


class UsuarioCreate(BaseModel):
    nome: str = Field(
        min_length=2,
        max_length=255,
    )

    email: EmailStr

    senha: str = Field(
        min_length=8,
        max_length=128,
    )

    perfil: PerfilUsuario = PerfilUsuario.VISITANTE


class UsuarioResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    nome: str
    email: EmailStr
    perfil: PerfilUsuario
    ativo: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str