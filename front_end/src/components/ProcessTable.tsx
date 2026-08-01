import { ChevronRight } from "lucide-react";
import type {
    Processo,
    StatusProcesso,
    TipoProcesso,
} from "../types/processos.ts";

import "./ProcessTable.css";

interface ProcessTableProps {
    processos: Processo[];
    aoSelecionar?: (processo: Processo) => void;
    aoVerTodos?: () => void;
}

const tipos: Record<TipoProcesso, { label: string; classe: string }> = {
    LICITACAO: {
        label: "Licitação",
        classe: "process-type--licitacao",
    },
    REGISTRO_PRECO: {
        label: "Registro de preço",
        classe: "process-type--registro",
    },
    DISPENSA_LICITACAO: {
        label: "Dispensa",
        classe: "process-type--dispensa",
    },
    INEXIGIBILIDADE: {
        label: "Inexigibilidade",
        classe: "process-type--inexigibilidade",
    },
};

const status: Record<StatusProcesso, { label: string; classe: string }> = {
    ABERTO: { label: "Aberto", classe: "process-status--aberto" },
    HOMOLOGADO: {
        label: "Homologado",
        classe: "process-status--homologado",
    },
    REVOGADO: {
        label: "Revogado",
        classe: "process-status--revogado",
    },
    FINALIZADO: {
        label: "Finalizado",
        classe: "process-status--finalizado",
    },
};

export function ProcessTable({
                                 processos,
                                 aoSelecionar,
                                 aoVerTodos,
                             }: ProcessTableProps) {
    return (
        <section className="process-table-card">
            <div className="section-heading">
                <div>
                    <h2>Processos em acompanhamento</h2>
                    <p>Informações mais importantes para consulta rápida</p>
                </div>

                {aoVerTodos && <button type="button" onClick={aoVerTodos}>Ver todos</button>}
            </div>

            <div className="process-table-card__desktop">
                <table className="process-table">
                    <thead>
                    <tr>
                        <th>Processo</th>
                        <th>Tipo</th>
                        <th>Modalidade / objeto</th>
                        <th>Abertura / publicação</th>
                        <th>Status</th>
                        <th aria-label="Ações" />
                    </tr>
                    </thead>

                    <tbody>
                    {processos.map((processo) => {
                        const tipo = tipos[processo.tipo];
                        const estado = status[processo.status];

                        return (
                            <tr
                                key={processo.id}
                                className={aoSelecionar ? "process-table__row--interactive" : ""}
                                onClick={() => aoSelecionar?.(processo)}
                                onKeyDown={(event) => {
                                    if (aoSelecionar && (event.key === "Enter" || event.key === " ")) {
                                        event.preventDefault();
                                        aoSelecionar(processo);
                                    }
                                }}
                                tabIndex={aoSelecionar ? 0 : undefined}
                            >
                                <td className="process-table__number">
                                    {processo.numero}
                                </td>

                                <td>
                    <span className={`process-type ${tipo.classe}`}>
                      {tipo.label}
                    </span>
                                </td>

                                <td className="process-table__description">
                                    <strong>{processo.modalidade}</strong>
                                    <span>{processo.objeto}</span>
                                </td>

                                <td className="process-table__date">
                                    {processo.dataReferencia}
                                </td>

                                <td>
                    <span className="process-status">
                      <span
                          className={`process-status__dot ${estado.classe}`}
                      />
                        {estado.label}
                    </span>
                                </td>

                                <td>
                                    <ChevronRight
                                        size={18}
                                        className="process-table__arrow"
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="process-table-card__mobile">
                {processos.map((processo) => {
                    const tipo = tipos[processo.tipo];
                    const estado = status[processo.status];

                    return (
                        <article
                            key={processo.id}
                            className={`process-mobile-card ${aoSelecionar ? "process-mobile-card--interactive" : ""}`}
                            onClick={() => aoSelecionar?.(processo)}
                            onKeyDown={(event) => {
                                if (aoSelecionar && (event.key === "Enter" || event.key === " ")) {
                                    event.preventDefault();
                                    aoSelecionar(processo);
                                }
                            }}
                            tabIndex={aoSelecionar ? 0 : undefined}
                        >
                            <div className="process-mobile-card__top">
                                <div>
                                    <strong>{processo.numero}</strong>
                                    <span className={`process-type ${tipo.classe}`}>
                    {tipo.label}
                  </span>
                                </div>

                                <span className="process-status">
                  <span
                      className={`process-status__dot ${estado.classe}`}
                  />
                                    {estado.label}
                </span>
                            </div>

                            <h3>{processo.modalidade}</h3>
                            <p>{processo.objeto}</p>

                            <div className="process-mobile-card__footer">
                                <span>{processo.dataReferencia}</span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
