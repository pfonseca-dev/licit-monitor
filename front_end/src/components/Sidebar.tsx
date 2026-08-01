import {
    Bell,
    CircleDollarSign,
    FileCheck2,
    FileSearch,
    Gavel,
    LayoutDashboard,
    ScrollText,
    X,
} from "lucide-react";

import { Logo } from "./Logo";
import "./Sidebar.css";

export type PaginaAtiva =
    | "painel"
    | "processos"
    | "licitacoes"
    | "registros"
    | "dispensas"
    | "inexigibilidades"
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
    { label: "Registros de preço", pagina: "registros", icon: CircleDollarSign },
    { label: "Dispensas", pagina: "dispensas", icon: FileCheck2 },
    { label: "Inexigibilidades", pagina: "inexigibilidades", icon: ScrollText },
    { label: "Alertas", pagina: "alertas", icon: Bell },
] satisfies { label: string; pagina: PaginaAtiva; icon: typeof LayoutDashboard }[];

export function Sidebar({
                            aberta,
                            aoFechar,
                            paginaAtiva,
                            aoNavegar,
                        }: SidebarProps) {
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
