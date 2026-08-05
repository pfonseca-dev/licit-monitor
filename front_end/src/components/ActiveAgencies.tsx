import { Building2, ChevronRight } from "lucide-react";
import type { Processo } from "../types/processo";
import "./ActiveAgencies.css";

interface ActiveAgenciesProps {
    processos: Processo[];
}

export function ActiveAgencies({ processos }: ActiveAgenciesProps) {
    const atividade = new Map<string, { total: number; abertos: number }>();

    for (const processo of processos) {
        for (const orgao of processo.orgaos) {
            const atual = atividade.get(orgao) ?? { total: 0, abertos: 0 };
            atual.total += 1;
            if (processo.status === "ABERTO") atual.abertos += 1;
            atividade.set(orgao, atual);
        }
    }

    const orgaos = [...atividade.entries()]
        .sort(([, orgaoA], [, orgaoB]) =>
            orgaoB.total - orgaoA.total || orgaoB.abertos - orgaoA.abertos)
        .slice(0, 3);

    if (orgaos.length === 0) return null;

    return (
        <section className="active-agencies">
            <div className="section-heading">
                <div>
                    <h2>Órgãos com maior atividade</h2>
                    <p>Maior volume de processos monitorados</p>
                </div>
                <Building2 aria-hidden="true" />
            </div>

            <ol className="active-agencies__list">
                {orgaos.map(([nome, resumo], indice) => (
                    <li key={nome}>
                        <span className="active-agencies__position">{indice + 1}</span>
                        <span className="active-agencies__name">
              <strong>{nome}</strong>
              <small>{resumo.abertos} em aberto</small>
            </span>
                        <span className="active-agencies__total">
              <strong>{resumo.total}</strong>
              <small>processos</small>
            </span>
                        <ChevronRight aria-hidden="true" />
                    </li>
                ))}
            </ol>
        </section>
    );
}
