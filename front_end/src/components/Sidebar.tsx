import { useState } from "react";
import { Bell, ChevronDown, CircleDollarSign, ClipboardCheck, FileCheck2, FileSearch, Gavel, HandCoins, LayoutDashboard, LockKeyhole, LogIn, ShoppingCart, User, X,} from "lucide-react";
import { Logo } from "./Logo";
import "./Sidebar.css";

export type PaginaAtiva =
    | "painel"
    | "processos"
    | "licitacoes"
    | "leiloes"
    | "registros"
    | "adesoes"
    | "compras-diretas"
    | "dispensas-eletronicas"
    | "alertas";

interface SidebarProps {
    aberta: boolean;
    aoFechar: () => void;
    paginaAtiva: PaginaAtiva;
    aoNavegar: (pagina: PaginaAtiva) => void;
}

const navegacao = [
    { label: "Painel", pagina: "painel", icon: LayoutDashboard },
    { label: "Processos", pagina: "processos", icon: FileSearch },
    { label: "Licitações", pagina: "licitacoes", icon: Gavel },
    { label: "Leilões", pagina: "leiloes", icon: HandCoins },
    { label: "Registros de preço", pagina: "registros", icon: CircleDollarSign },
    { label: "Adesões a registros", pagina: "adesoes", icon: ClipboardCheck },
    { label: "Compras diretas", pagina: "compras-diretas", icon: ShoppingCart },
    { label: "Dispensas eletrônicas", pagina: "dispensas-eletronicas", icon: FileCheck2 },
    { label: "Alertas", pagina: "alertas", icon: Bell },
] satisfies { label: string; pagina: PaginaAtiva; icon: typeof LayoutDashboard }[];

export function Sidebar({
                            aberta,
                            aoFechar,
                            paginaAtiva,
                            aoNavegar,
                        }: SidebarProps) {
    const [loginAberto, setLoginAberto] = useState(false);

    return (
        <>
            {aberta && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={aoFechar}
                    className="sidebar-overlay"
                />
            )}

            <aside className={`sidebar ${aberta ? "sidebar--open" : ""}`}>
                <div className="sidebar__header">
                    <Logo />

                    <button
                        type="button"
                        onClick={aoFechar}
                        className="sidebar__close"
                        aria-label="Fechar navegação"
                    >
                        <X size={21} />
                    </button>
                </div>

                <nav className="sidebar__nav">
                    {navegacao.map(({ label, pagina, icon: Icon }) => (
                        <button
                            type="button"
                            key={label}
                            className={`sidebar__nav-item ${
                                paginaAtiva === pagina ? "sidebar__nav-item--active" : ""
                            }`}
                            onClick={() => {
                                aoNavegar(pagina);
                                aoFechar();
                            }}
                        >
                            <Icon size={19} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className={`sidebar__login ${loginAberto ? "sidebar__login--open" : ""}`}>
                    <button
                        type="button"
                        className="sidebar__login-trigger"
                        onClick={() => setLoginAberto((aberto) => !aberto)}
                        aria-expanded={loginAberto}
                        aria-controls="sidebar-login-form"
                    >
                        <LogIn size={18} />
                        <span>Login do editor</span>
                        <ChevronDown className="sidebar__login-chevron" size={18} />
                    </button>

                    {loginAberto && (
                        <form
                            id="sidebar-login-form"
                            className="sidebar__login-form"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <p>Entre para gerenciar o painel</p>

                            <label className="sidebar__login-field">
                                <span>Usuário</span>
                                <div>
                                    <User size={16} aria-hidden="true" />
                                    <input
                                        type="text"
                                        name="usuario"
                                        autoComplete="username"
                                        placeholder="Digite seu usuário"
                                        required
                                    />
                                </div>
                            </label>

                            <label className="sidebar__login-field">
                                <span>Senha</span>
                                <div>
                                    <LockKeyhole size={16} aria-hidden="true" />
                                    <input
                                        type="password"
                                        name="senha"
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                </div>
                            </label>

                            <button type="submit" className="sidebar__login-button">
                                Entrar
                            </button>
                        </form>
                    )}
                </div>

                <div className="sidebar__status">
                    <p>Atualização automática</p>

                    <div>
                        <span />
                        Sistema em execução
                    </div>
                </div>

            </aside>
        </>
    );
}
