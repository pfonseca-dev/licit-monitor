import { navegacao, type PaginaAtiva } from "./Sidebar";

import "./MobileNavigation.css";

interface MobileNavigationProps {
    paginaAtiva: PaginaAtiva;
    aoNavegar: (pagina: PaginaAtiva) => void;
}

export function MobileNavigation({
    paginaAtiva,
    aoNavegar,
}: MobileNavigationProps) {
    return (
        <nav className="mobile-navigation" aria-label="Navegação principal">
            <div className="mobile-navigation__items">
                {navegacao.map(({ label, labelMobile, pagina, icon: Icon }) => (
                    <button
                        type="button"
                        key={pagina}
                        className={`mobile-navigation__item ${
                            paginaAtiva === pagina ? "mobile-navigation__item--active" : ""
                        }`}
                        aria-current={paginaAtiva === pagina ? "page" : undefined}
                        aria-label={label}
                        onClick={() => aoNavegar(pagina)}
                    >
                        <Icon size={21} />
                        <span>{labelMobile}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
