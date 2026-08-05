import type { Processo, TipoProcesso } from "../types/processo";
import { ProcessTable } from "../components/ProcessTable";
import { PageTitle } from "./PageTitle";
import "./pages.css";

export type PaginaProcesso =
    | "processos"
    | "licitacoes"
    | "leiloes"
    | "registros"
    | "adesoes"
    | "compras-diretas"
    | "dispensas-eletronicas";

interface ProcessosPageProps {
    pagina: PaginaProcesso;
    processos: Processo[];
    aoSelecionarProcesso: (processo: Processo) => void;
}

const configuracoes: Record<PaginaProcesso, { titulo: string; descricao: string; tipo?: TipoProcesso }> = {
    processos: { titulo: "Processos", descricao: "Acompanhe todos os processos cadastrados" },
    licitacoes: { titulo: "Licitações", descricao: "Editais e oportunidades em acompanhamento", tipo: "LICITACAO" },
    leiloes: { titulo: "Leilões", descricao: "Processos de alienação de bens em acompanhamento", tipo: "LEILAO" },
    registros: { titulo: "Registros de preço", descricao: "Atas e registros disponíveis para consulta", tipo: "REGISTRO_PRECO" },
    adesoes: { titulo: "Adesões a registro de preço", descricao: "Adesões a atas e registros de outros órgãos", tipo: "ADESAO_REGISTRO_PRECO" },
    "compras-diretas": { titulo: "Compras diretas", descricao: "Contratações realizadas de forma direta", tipo: "COMPRA_DIRETA" },
    "dispensas-eletronicas": { titulo: "Dispensas eletrônicas", descricao: "Processos de dispensa realizados em meio eletrônico", tipo: "DISPENSA_ELETRONICA" },
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
