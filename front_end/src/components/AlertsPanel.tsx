import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
} from "lucide-react";
import type { Alerta } from "../types/processos.ts";

import "./AlertsPanel.css";

interface AlertsPanelProps {
    alertas: Alerta[];
    aoVerTodos?: () => void;
}

const icones = {
    ERRO: {
        icon: AlertCircle,
        classe: "alert-item__icon--error",
    },
    ATENCAO: {
        icon: TriangleAlert,
        classe: "alert-item__icon--warning",
    },
    INFORMACAO: {
        icon: Info,
        classe: "alert-item__icon--info",
    },
    SUCESSO: {
        icon: CheckCircle2,
        classe: "alert-item__icon--success",
    },
};

export function AlertsPanel({ alertas, aoVerTodos }: AlertsPanelProps) {
    return (
        <section className="alerts-panel">
            <div className="section-heading">
                <div>
                    <h2>Alertas recentes</h2>
                    <p>Alterações que exigem atenção</p>
                </div>

                {aoVerTodos && <button type="button" onClick={aoVerTodos}>Ver todos</button>}
            </div>

            <div className="alerts-panel__list">
                {alertas.map((alerta) => {
                    const config = icones[alerta.tipo];
                    const Icon = config.icon;

                    return (
                        <article key={alerta.id} className="alert-item">
              <span className={`alert-item__icon ${config.classe}`}>
                <Icon size={20} />
              </span>

                            <p>{alerta.mensagem}</p>
                            <time>{alerta.criadoEm}</time>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
