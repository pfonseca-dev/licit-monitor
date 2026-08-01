import {
    Landmark,
    Moon,
    Search,
    SlidersHorizontal,
    Sun,
} from "lucide-react";

import "./Header.css";

interface HeaderProps {
    temaEscuro: boolean;
    aoAlternarTema: () => void;
    aoAbrirMenu: () => void;
    menuAberto: boolean;
    filtrosAbertos: boolean;
    aoAlternarFiltros: () => void;
    busca: string;
    aoBuscar: (valor: string) => void;
}

export function Header({
                           temaEscuro,
                           aoAlternarTema,
                           aoAbrirMenu,
                           menuAberto,
                           filtrosAbertos,
                           aoAlternarFiltros,
                           busca,
                           aoBuscar,
                       }: HeaderProps) {
    return (
        <header className="header">
            <div className="header__content">
                <button
                    type="button"
                    onClick={aoAbrirMenu}
                    className="header__brand-button"
                    aria-label="Abrir navegação do LicitMonitor"
                    aria-expanded={menuAberto}
                >
                    <Landmark size={22} strokeWidth={2.2} />
                </button>

                <div className="header__update">
                    <span />
                    Dados atualizados às 15:37
                </div>

                <div className="header__actions">
                    <label className="header__search">
                        <Search size={18} />
                        <input
                            value={busca}
                            onChange={(event) => aoBuscar(event.target.value)}
                            placeholder="Buscar processo, órgão ou objeto..."
                        />
                    </label>

                    <button
                        type="button"
                        className={`header__filter ${filtrosAbertos ? "header__filter--active" : ""}`}
                        onClick={aoAlternarFiltros}
                        aria-expanded={filtrosAbertos}
                    >
                        <SlidersHorizontal size={18} />
                        Filtros
                    </button>

                    <button
                        type="button"
                        onClick={aoAlternarTema}
                        className="header__icon-button"
                        aria-label="Alternar tema"
                    >
                        {temaEscuro ? <Sun size={19} /> : <Moon size={19} />}
                    </button>

                </div>
            </div>
        </header>
    );
}
