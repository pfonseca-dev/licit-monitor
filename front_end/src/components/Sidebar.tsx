import {
    CircleDollarSign,
    ClipboardCheck,
    FileCheck2,
    FileSearch,
    Gavel,
    HandCoins,
    LayoutDashboard,
    ShoppingCart,
    X,
} from "lucide-react";

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
    | "dispensas-eletronicas";

interface SidebarProps {
    aberta: boolean;
    aoFechar: () => void;
    paginaAtiva: PaginaAtiva;
    aoNavegar: (pagina: PaginaAtiva) => void;
}

export const navegacao = [
    { label: "Painel", labelMobile: "Painel", pagina: "painel", icon: LayoutDashboard },
    { label: "Processos", labelMobile: "Processos", pagina: "processos", icon: FileSearch },
    { label: "Licitações", labelMobile: "Licitações", pagina: "licitacoes", icon: Gavel },
    { label: "Leilões", labelMobile: "Leilões", pagina: "leiloes", icon: HandCoins },
    { label: "Registros de preço", labelMobile: "Registros", pagina: "registros", icon: CircleDollarSign },
    { label: "Adesões a registros", labelMobile: "Adesões", pagina: "adesoes", icon: ClipboardCheck },
    { label: "Compras diretas", labelMobile: "Compras", pagina: "compras-diretas", icon: ShoppingCart },
    { label: "Dispensas eletrônicas", labelMobile: "Dispensas", pagina: "dispensas-eletronicas", icon: FileCheck2 },
] satisfies {
    label: string;
    labelMobile: string;
    pagina: PaginaAtiva;
    icon: typeof LayoutDashboard;
}[];

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
