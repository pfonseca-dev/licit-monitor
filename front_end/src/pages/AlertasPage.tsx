import { AlertsPanel } from "../components/AlertsPanel";
import type { Alerta } from "../types/processo";
import { PageTitle } from "./PageTitle";
import "./pages.css";

function SummaryItem({ label, valor }: { label: string; valor: number }) {
    return <article><span>{label}</span><strong>{valor}</strong></article>;
}

export function AlertasPage({ alertas }: { alertas: Alerta[] }) {
    return (
        <>
            <PageTitle titulo="Alertas" descricao="Acompanhe mudanças importantes nos processos" />
            <section className="workspace-summary" aria-label="Resumo de alertas">
                <SummaryItem label="Alertas recentes" valor={alertas.length} />
                <SummaryItem label="Exigem atenção" valor={alertas.filter((alerta) => alerta.tipo === "ERRO" || alerta.tipo === "ATENCAO").length} />
            </section>
            <AlertsPanel alertas={alertas} />
        </>
    );
}
