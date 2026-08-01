import type { Processo, TipoProcesso } from "../types/processos.ts";
import { ProcessTable } from "../components/ProcessTable";
import { PageTitle } from "./PageTitle";
import "./pages.css";

export type PaginaProcesso =
    | "processos"
    | "licitacoes"
    | "registros"
    | "dispensas"
    | "inexigibilidades";

interface ProcessosPageProps {
    pagina: PaginaProcesso;
    processos: Processo[];
    aoSelecionarProcesso: (processo: Processo) => void;
}

const configuracoes: Record<PaginaProcesso, { titulo: string; descricao: string; tipo?: TipoProcesso }> = {
    processos: { titulo: "Processos", descricao: "Acompanhe todos os processos cadastrados" },
    licitacoes: { titulo: "Licitações", descricao: "Editais e oportunidades em acompanhamento", tipo: "LICITACAO" },
    registros: { titulo: "Registros de preço", descricao: "Atas e registros disponíveis para consulta", tipo: "REGISTRO_PRECO" },
    dispensas: { titulo: "Dispensas", descricao: "Processos por dispensa de licitação", tipo: "DISPENSA_LICITACAO" },
    inexigibilidades: { titulo: "Inexigibilidades", descricao: "Contratações por inviabilidade de competição", tipo: "INEXIGIBILIDADE" },
};

function SummaryItem({ label, valor }: { label: string; valor: number }) {
    return <article><span>{label}</span><strong>{valor}</strong></article>;
}

export function ProcessosPage({
                                  pagina,
                                  processos: processosDisponiveis,
                                  aoSelecionarProcesso,
                              }: ProcessosPageProps) {
    const configuracao = configuracoes[pagina];
    const processos = configuracao.tipo
        ? processosDisponiveis.filter((processo) => processo.tipo === configuracao.tipo)
        : processosDisponiveis;
    const abertos = processos.filter((processo) => processo.status === "ABERTO").length;
    const orgaos = new Set(processos.flatMap((processo) => processo.orgaos)).size;

    return (
        <>
            <PageTitle {...configuracao} />
            <section className="workspace-summary" aria-label="Resumo da página">
                <SummaryItem label="Processos encontrados" valor={processos.length} />
                <SummaryItem label="Em aberto" valor={abertos} />
                <SummaryItem label="Órgãos envolvidos" valor={orgaos} />
            </section>
            <ProcessTable processos={processos} aoSelecionar={aoSelecionarProcesso} />
        </>
    );
}
