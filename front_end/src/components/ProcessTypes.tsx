import {
    BadgeDollarSign,
    FileCheck2,
    Gavel,
    UserRoundSearch,
} from "lucide-react";
import type { Processo, TipoProcesso } from "../types/processos.ts";

import "./ProcessTypes.css";

const configuracoes = [
    {
        titulo: "Licitações",
        descricao: "Pregão, leilão e concorrência eletrônica",
        icon: Gavel,
        classe: "process-type-card--licitacao",
        tipo: "LICITACAO",
    },
    {
        titulo: "Registros de preço",
        descricao: "Atas, fornecedores e itens registrados",
        icon: BadgeDollarSign,
        classe: "process-type-card--registro",
        tipo: "REGISTRO_PRECO",
    },
    {
        titulo: "Dispensas",
        descricao: "Processos de dispensa de licitação",
        icon: FileCheck2,
        classe: "process-type-card--dispensa",
        tipo: "DISPENSA_LICITACAO",
    },
    {
        titulo: "Inexigibilidades",
        descricao: "Contratações por inviabilidade de competição",
        icon: UserRoundSearch,
        classe: "process-type-card--inexigibilidade",
        tipo: "INEXIGIBILIDADE",
    },
] satisfies { tipo: TipoProcesso; titulo: string; descricao: string; icon: typeof Gavel; classe: string }[];

interface ProcessTypesProps {
    processos: Processo[];
    aoSelecionar?: (tipo: TipoProcesso) => void;
}

export function ProcessTypes({ processos, aoSelecionar }: ProcessTypesProps) {
    const total = processos.length;
    const itens = configuracoes.flatMap((configuracao) => {
        const quantidade = processos.filter((processo) => processo.tipo === configuracao.tipo).length;

        if (quantidade === 0) return [];

        const porcentagem = Math.round((quantidade / total) * 100);
        return [{...configuracao, quantidade, porcentagem}];
    });

    if (itens.length === 0) return null;

    return (
        <section className="process-types">
            <div className="section-heading">
                <div>
                    <h2>Tipos de processos</h2>
                    <p>Distribuição geral dos registros monitorados</p>
                </div>

            </div>

            <div className="process-types__grid">
                {itens.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            type="button"
                            key={item.titulo}
                            className={`process-type-card ${item.classe}`}
                            onClick={() => aoSelecionar?.(item.tipo)}
                            aria-label={`Ver ${item.titulo}`}
                        >
                            <div className="process-type-card__header">
                <span className="process-type-card__icon">
                  <Icon size={23}/>
                </span>

                                <div>
                                    <p>{item.titulo}</p>

                                    <div className="process-type-card__number">
                                        <strong>{item.quantidade}</strong>
                                        <span>{item.porcentagem}% do total</span>
                                    </div>
                                </div>
                            </div>

                            <div className="process-type-card__progress">
                                <span style={{width: `${item.porcentagem}%`}}/>
                            </div>

                            <p className="process-type-card__description">
                                {item.descricao}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
