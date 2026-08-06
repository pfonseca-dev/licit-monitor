import { api } from "./api";
import type { DispensaApiResponse, LicitacaoApiResponse } from "../types/api";
import type { Processo, StatusProcesso, TipoProcesso } from "../types/processo";


function formatarData(data: string | null): string {
    if (!data) {
        return "Não informado";
    }

    return new Intl.DateTimeFormat("pt-BR").format(
        new Date(data),
    );
}


function converterStatus(status: string | null): StatusProcesso {
    if (!status) {
        return "ABERTO";
    }

    const statusNormalizado = status
        .trim()
        .toUpperCase();

    switch (statusNormalizado) {
        case "HOMOLOGADO":
            return "HOMOLOGADO";

        case "REVOGADO":
            return "REVOGADO";

        case "FINALIZADO":
            return "FINALIZADO";

        default:
            return "ABERTO";
    }
}

function converterTipoProcesso(tipoAquisicao: string | null): TipoProcesso {
    if (!tipoAquisicao) {
        return "LICITACAO";
    }

    const tipo = tipoAquisicao
        .trim()
        .toLowerCase();

    switch (tipo) {
        case "licitação":
            return "LICITACAO";

        case "leilão":
            return "LEILAO";

        case "registro de preço":
            return "REGISTRO_PRECO";

        case "adesão a registro de preço":
            return "ADESAO_REGISTRO_PRECO";

        case "compra direta":
            return "COMPRA_DIRETA";

        case "dispensa eletrônica":
            return "DISPENSA_ELETRONICA";

        default:
            return "LICITACAO";
    }
}

function transformarOrgaoEmLista(orgao: string | null): string[] {
    if (!orgao) {
        return ["Não informado"];
    }

    return [orgao];
}


function mapearLicitacao(licitacao: LicitacaoApiResponse,): Processo {
    return {
        id: licitacao.id,
        fonte: "licitacao",

        numero:
            licitacao.numero_edital
            ?? licitacao.processo_compra,

        tipo: converterTipoProcesso(
            licitacao.tipo_aquisicao
        ),

        modalidade:
            licitacao.modalidade
            ?? "Não informado",

        objeto:
            licitacao.objeto
            ?? "Objeto não informado",

        orgaos: transformarOrgaoEmLista(
            licitacao.orgao,
        ),

        dataReferencia: formatarData(
            licitacao.data_abertura,
        ),

        processoCompra:
        licitacao.processo_compra,

        lei:
            licitacao.lei
            ?? "Não informado",

        tipoAquisicao:
            licitacao.tipo_aquisicao
            ?? "Não informado",

        observacao:
            licitacao.observacao
            ?? "Sem observações",

        dataHomologacao: licitacao.data_homologacao
            ? formatarData(licitacao.data_homologacao)
            : null,

        status: converterStatus(
            licitacao.status_processo,
        ),

        valorEstimado:
            licitacao.valor_estimado !== null
                ? Number(licitacao.valor_estimado)
                : null,
    };
}


function mapearDispensa(
    dispensa: DispensaApiResponse,
): Processo {
    return {
        id: dispensa.id,
        fonte: "dispensa",

        numero:
        dispensa.processo_compra,

        tipo: converterTipoProcesso(
            dispensa.tipo_aquisicao
        ),

        modalidade:
            dispensa.modalidade
            ?? "Dispensa",

        objeto:
            dispensa.objeto
            ?? "Objeto não informado",

        orgaos: transformarOrgaoEmLista(
            dispensa.orgao,
        ),

        dataReferencia: formatarData(
            dispensa.data_abertura,
        ),

        processoCompra:
        dispensa.processo_compra,

        lei:
            dispensa.lei
            ?? "Não informado",

        tipoAquisicao:
            dispensa.tipo_aquisicao
            ?? "Não informado",

        observacao:
            dispensa.observacao
            ?? "Sem observações",

        dataHomologacao: dispensa.data_homologacao
            ? formatarData(dispensa.data_homologacao)
            : null,

        status: converterStatus(
            dispensa.status_processo,
        ),

        valorEstimado:
            dispensa.valor_total !== null
                ? Number(dispensa.valor_total)
                : null,
    };
}


export async function listarProcessos(): Promise<Processo[]> {
    const [
        respostaLicitacoes,
        respostaDispensas,
    ] = await Promise.all([
        api.get<LicitacaoApiResponse[]>("/licitacoes"),
        api.get<DispensaApiResponse[]>("/dispensas"),
    ]);

    const licitacoes = respostaLicitacoes.data.map(
        mapearLicitacao,
    );

    const dispensas = respostaDispensas.data.map(
        mapearDispensa,
    );

    return [
        ...licitacoes,
        ...dispensas,
    ];
}

export async function atualizarObservacao(
    processo: Processo,
    observacao: string,
): Promise<void> {
    const recurso = processo.fonte === "licitacao" ? "licitacoes" : "dispensas";
    await api.patch(`/${recurso}/${processo.id}/observacao`, { observacao });
}
