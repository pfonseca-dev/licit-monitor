export interface LicitacaoApiResponse {
    id: number;
    id_externo: number;
    processo_compra: string;
    numero_edital: string | null;
    modalidade: string | null;
    tipo_aquisicao: string | null;
    orgao: string | null;
    objeto: string | null;
    lei: string | null;
    status_processo: string | null;
    observacao: string | null;
    valor_estimado: string | number | null;
    data_abertura: string | null;
    data_homologacao: string | null;
}

export interface DispensaApiResponse {
    id: number;
    id_externo: number;
    processo_compra: string;
    modalidade: string | null;
    contratos: string | null;
    lei: string | null;
    artigo: string | null;
    tipo_aquisicao: string | null;
    objeto: string | null;
    orgao: string | null;
    fornecedor: string | null;
    status_processo: string | null;
    observacao: string | null;
    valor_total: string | number | null;
    data_abertura: string | null;
    data_homologacao: string | null;
    data_encerramento: string | null;
}
