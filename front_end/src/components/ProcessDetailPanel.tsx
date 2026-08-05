import { useEffect } from "react";
import {Building2, CalendarDays, CircleCheckBig, FileText, Landmark, MessageSquareText, Scale, ShoppingCart, Tags, X,} from "lucide-react";
import type { Processo } from "../types/processo";
import "./ProcessDetailPanel.css";

interface ProcessDetailPanelProps {
    processo: Processo | null;
    aoFechar: () => void;
}

const rotulosTipo = {
    LICITACAO: "Licitação",
    LEILAO: "Leilão",
    REGISTRO_PRECO: "Registro de preço",
    ADESAO_REGISTRO_PRECO: "Adesão a registro de preço",
    COMPRA_DIRETA: "Compra direta",
    DISPENSA_ELETRONICA: "Dispensa eletrônica",
};

const rotulosStatus = {
    ABERTO: "Aberto",
    HOMOLOGADO: "Homologado",
    REVOGADO: "Revogado",
    FINALIZADO: "Finalizado",
};

export function ProcessDetailPanel({
                                       processo,
                                       aoFechar,
                                   }: ProcessDetailPanelProps) {
    useEffect(() => {
        const fecharComEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") aoFechar();
        };

        if (processo) window.addEventListener("keydown", fecharComEscape);
        return () => window.removeEventListener("keydown", fecharComEscape);
    }, [processo, aoFechar]);

    if (!processo) return null;

    const valor = processo.valorEstimado
        ? processo.valorEstimado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "Não informado";

    return (
        <>
            <button type="button" className="process-detail__overlay" onClick={aoFechar} aria-label="Fechar detalhes" />
            <aside className="process-detail" aria-label={`Detalhes do processo ${processo.numero}`}>
                <header className="process-detail__header">
                    <div><span>Processo</span><h2>{processo.numero}</h2></div>
                    <button type="button" onClick={aoFechar} aria-label="Fechar detalhes"><X size={21} /></button>
                </header>

                <div className="process-detail__status">
                    <span>{rotulosTipo[processo.tipo]}</span>
                    <strong className={`process-detail__status--${processo.status.toLowerCase()}`}>{rotulosStatus[processo.status]}</strong>
                </div>

                <section className="process-detail__content">
                    <div className="process-detail__object"><span>Objeto</span><p>{processo.objeto}</p></div>
                    <dl className="process-detail__data">
                        <div><dt><Landmark size={17} /> Modalidade</dt><dd>{processo.modalidade}</dd></div>
                        <div><dt><Building2 size={17} /> Órgãos responsáveis</dt><dd>{processo.orgaos.join(", ")}</dd></div>
                        <div><dt><CalendarDays size={17} /> Abertura / publicação</dt><dd>{processo.dataReferencia}</dd></div>
                        <div><dt><ShoppingCart size={17} /> Processo de compra</dt><dd>{processo.processoCompra}</dd></div>
                        <div><dt><Scale size={17} /> Lei</dt><dd>{processo.lei}</dd></div>
                        <div><dt><Tags size={17} /> Tipo de aquisição</dt><dd>{processo.tipoAquisicao}</dd></div>
                        <div><dt><FileText size={17} /> Valor estimado</dt><dd>{valor}</dd></div>
                        <div><dt><CircleCheckBig size={17} /> Data de homologação</dt><dd>{processo.dataHomologacao ?? "Ainda não homologado"}</dd></div>
                        <div className="process-detail__observation">
                            <dt><MessageSquareText size={17} /> Observação</dt>
                            <dd>{processo.observacao}</dd>
                        </div>
                    </dl>
                </section>
            </aside>
        </>
    );
}
