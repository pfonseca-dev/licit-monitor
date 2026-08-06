import { api } from "./api";

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: "visualizador" | "editor";
    ativo: boolean;
}

interface TokenResponse {
    access_token: string;
    token_type: string;
}

interface CadastroInput {
    nome: string;
    email: string;
    senha: string;
}

export async function cadastrar(
    dados: CadastroInput,
): Promise<Usuario> {
    const resposta = await api.post<Usuario>("/usuarios", dados);
    return resposta.data;
}

export async function entrar(
    email: string,
    senha: string,
): Promise<TokenResponse> {
    const formulario = new URLSearchParams();

    formulario.set("username", email);
    formulario.set("password", senha);

    const resposta = await api.post<TokenResponse>(
        "/auth/login",
        formulario,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    );

    localStorage.setItem("access_token", resposta.data.access_token);

    return resposta.data;
}

export async function buscarUsuarioAtual(): Promise<Usuario> {
    const resposta = await api.get<Usuario>("/usuarios/me");
    return resposta.data;
}

export function sair(): void {
    localStorage.removeItem("access_token");
}
