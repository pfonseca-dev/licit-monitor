export type StatusProcesso =
    | "ABERTO"
    | "HOMOLOGADO"
    | "REVOGADO"
    | "FINALIZADO";

export type TipoProcesso =
    | "LICITACAO"
    | "LEILAO"
    | "REGISTRO_PRECO"
    | "ADESAO_REGISTRO_PRECO"
    | "COMPRA_DIRETA"
    | "DISPENSA_ELETRONICA";

export interface Processo {
    id: number;
    fonte: "licitacao" | "dispensa";
    numero: string;
    tipo: TipoProcesso;
    modalidade: string;
    objeto: string;
    orgaos: string[];
    dataReferencia: string;
    processoCompra: string;
    lei: string;
    tipoAquisicao: string;
    observacao: string;
    atualizadoEm?: string | null;
    dataHomologacao: string | null;
    status: StatusProcesso;
    valorEstimado: number | null;
}
