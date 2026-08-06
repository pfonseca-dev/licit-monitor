import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Landmark, LogIn, UserPlus, X } from "lucide-react";

import { buscarUsuarioAtual, cadastrar, entrar, type Usuario } from "../services/auth";

import "./AuthModal.css";

type Etapa = "escolha" | "login" | "cadastro";

interface AuthModalProps {
    aoFechar: () => void;
    aoAutenticar: (usuario: Usuario) => void;
}

export function AuthModal({ aoFechar, aoAutenticar }: AuthModalProps) {
    const [etapa, setEtapa] = useState<Etapa>("escolha");
    const modalRef = useRef<HTMLDivElement>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        modalRef.current?.focus();

        const fecharComEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") aoFechar();
        };

        window.addEventListener("keydown", fecharComEscape);
        return () => {
            document.body.style.overflow = overflowAnterior;
            window.removeEventListener("keydown", fecharComEscape);
        };
    }, [aoFechar]);

    async function enviar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setCarregando(true);
        setErro("");

        const form = new FormData(event.currentTarget);
        const senha = String(form.get("senha") ?? "");

        try {
            if (etapa === "login") {
                const email = String(form.get("email") ?? "");
                await entrar(email, senha);
            } else {
                const nome = String(form.get("nome") ?? "");
                const email = String(form.get("email") ?? "");

                await cadastrar({ nome, email, senha });

                await entrar(email, senha);
            }

            const usuario = await buscarUsuarioAtual();
            aoAutenticar(usuario);
            aoFechar();
        } catch {
            setErro(
                etapa === "login"
                    ? "E-mail ou senha inválidos."
                    : "Não foi possível criar a conta.",
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="auth" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) aoFechar();
        }}>
            <div
                ref={modalRef}
                className="auth__card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                tabIndex={-1}
            >
                <button className="auth__close" type="button" onClick={aoFechar} aria-label="Fechar">
                    <X size={21} />
                </button>

                <div className="auth__brand" aria-hidden="true">
                    <Landmark size={28} />
                </div>

                {etapa === "escolha" ? (
                    <>
                        <p className="auth__eyebrow">LicitMonitor</p>
                        <h2 id="auth-title">Acesse sua conta</h2>
                        <p className="auth__description">
                            Entre para acompanhar seus processos ou crie uma conta gratuitamente.
                        </p>

                        <div className="auth__choices">
                            <button type="button" className="auth__primary" onClick={() => setEtapa("login")}>
                                <LogIn size={19} />
                                Fazer login
                            </button>
                            <button type="button" className="auth__secondary" onClick={() => setEtapa("cadastro")}>
                                <UserPlus size={19} />
                                Criar conta
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <button type="button" className="auth__back" onClick={() => setEtapa("escolha")}>
                            <ArrowLeft size={17} /> Voltar
                        </button>
                        <p className="auth__eyebrow">{etapa === "login" ? "Bem-vindo de volta" : "Comece agora"}</p>
                        <h2 id="auth-title">{etapa === "login" ? "Fazer login" : "Criar sua conta"}</h2>

                        <form className="auth__form" onSubmit={enviar}>
                            {etapa === "cadastro" && (
                                <label>
                                    Nome completo
                                    <input
                                        name="nome"
                                        autoComplete="name"
                                        placeholder="Digite seu nome"
                                        required
                                    />
                                </label>
                            )}
                            <label>
                                E-mail
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="voce@empresa.com"
                                    required
                                />
                            </label>
                            <label>
                                Senha
                                <input
                                    name="senha"
                                    type="password"
                                    minLength={8}
                                    required
                                />
                            </label>
                            {erro && <p role="alert">{erro}</p>}

                            <button type="submit" className="auth__primary" disabled={carregando}>
                                {etapa === "login" ? <LogIn size={19} /> : <UserPlus size={19} />}
                                {carregando
                                    ? "Aguarde..."
                                    : etapa === "login"
                                        ? "Entrar"
                                        : "Cadastrar"}
                            </button>
                        </form>

                        <p className="auth__switch">
                            {etapa === "login" ? "Ainda não tem uma conta?" : "Já possui uma conta?"}{" "}
                            <button type="button" onClick={() => setEtapa(etapa === "login" ? "cadastro" : "login")}>
                                {etapa === "login" ? "Cadastre-se" : "Faça login"}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
