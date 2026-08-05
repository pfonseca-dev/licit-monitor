import type { StatusProcesso, TipoProcesso } from "../types/processo";
import "./ProcessFilters.css";

export interface FiltrosProcesso {
    tipo: TipoProcesso | "";
    status: StatusProcesso | "";
    orgao: string;
}

interface ProcessFiltersProps {
    filtros: FiltrosProcesso;
    orgaos: string[];
    aoAlterar: (filtros: FiltrosProcesso) => void;
    aoFechar: () => void;
}

export function ProcessFilters({ filtros, orgaos, aoAlterar, aoFechar }: ProcessFiltersProps) {
    const alterar = (campo: keyof FiltrosProcesso, valor: string) => {
        aoAlterar({ ...filtros, [campo]: valor });
    };

    return (
        <section className="process-filters" aria-label="Filtros de processos">
            <div className="process-filters__fields">
                <label>Tipo
                    <select value={filtros.tipo} onChange={(event) => alterar("tipo", event.target.value)}>
                        <option value="">Todos os tipos</option>
                        <option value="LICITACAO">Licitação</option>
                        <option value="LEILAO">Leilão</option>
                        <option value="REGISTRO_PRECO">Registro de preço</option>
                        <option value="ADESAO_REGISTRO_PRECO">Adesão a registro de preço</option>
                        <option value="COMPRA_DIRETA">Compra direta</option>
                        <option value="DISPENSA_ELETRONICA">Dispensa eletrônica</option>
                    </select>
                </label>
                <label>Status
                    <select value={filtros.status} onChange={(event) => alterar("status", event.target.value)}>
                        <option value="">Todos os status</option>
                        <option value="ABERTO">Aberto</option>
                        <option value="HOMOLOGADO">Homologado</option>
                        <option value="REVOGADO">Revogado</option>
                        <option value="FINALIZADO">Finalizado</option>
                    </select>
                </label>
                <label>Órgão
                    <select value={filtros.orgao} onChange={(event) => alterar("orgao", event.target.value)}>
                        <option value="">Todos os órgãos</option>
                        {orgaos.map((orgao) => <option key={orgao} value={orgao}>{orgao}</option>)}
                    </select>
                </label>
            </div>
            <div className="process-filters__actions">
                <button type="button" onClick={() => aoAlterar({ tipo: "", status: "", orgao: "" })}>Limpar</button>
                <button type="button" onClick={aoFechar}>Concluído</button>
            </div>
        </section>
    );
}
