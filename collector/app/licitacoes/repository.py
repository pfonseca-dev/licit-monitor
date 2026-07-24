from typing import Any
from psycopg import Connection


SQL_SALVAR_LICITACAO = """
    INSERT INTO licitacoes (
        id_externo,
        tipo_aquisicao,
        modalidade,
        lei,
        orgao,
        processo_compra,
        numero_modalidade,
        numero_edital,
        data_abertura,
        data_homologacao,
        valor_estimado,
        status_processo,
        objeto
    )
    VALUES (
        %(id_externo)s,
        %(tipo_aquisicao)s,
        %(modalidade)s,
        %(lei)s,
        %(orgao)s,
        %(processo_compra)s,
        %(numero_modalidade)s,
        %(numero_edital)s,
        %(data_abertura)s,
        %(data_homologacao)s,
        %(valor_estimado)s,
        %(status_processo)s,
        %(objeto)s
    )
    ON CONFLICT (id_externo)
    DO UPDATE SET
        tipo_aquisicao = EXCLUDED.tipo_aquisicao,
        modalidade = EXCLUDED.modalidade,
        lei = EXCLUDED.lei,
        orgao = EXCLUDED.orgao,
        processo_compra = EXCLUDED.processo_compra,
        numero_modalidade = EXCLUDED.numero_modalidade,
        numero_edital = EXCLUDED.numero_edital,
        data_abertura = EXCLUDED.data_abertura,
        data_homologacao = EXCLUDED.data_homologacao,
        valor_estimado = EXCLUDED.valor_estimado,
        status_processo = EXCLUDED.status_processo,
        objeto = EXCLUDED.objeto,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE (
        licitacoes.tipo_aquisicao,
        licitacoes.modalidade,
        licitacoes.lei,
        licitacoes.orgao,
        licitacoes.processo_compra,
        licitacoes.numero_modalidade,
        licitacoes.numero_edital,
        licitacoes.data_abertura,
        licitacoes.data_homologacao,
        licitacoes.valor_estimado,
        licitacoes.status_processo,
        licitacoes.objeto
    )
    IS DISTINCT FROM (
        EXCLUDED.tipo_aquisicao,
        EXCLUDED.modalidade,
        EXCLUDED.lei,
        EXCLUDED.orgao,
        EXCLUDED.processo_compra,
        EXCLUDED.numero_modalidade,
        EXCLUDED.numero_edital,
        EXCLUDED.data_abertura,
        EXCLUDED.data_homologacao,
        EXCLUDED.valor_estimado,
        EXCLUDED.status_processo,
        EXCLUDED.objeto
    );
"""


def salvar_licitacoes(
    connection: Connection,
    licitacoes: list[dict[str, Any]],
) -> int:
    if not licitacoes:
        return 0

    with connection.cursor() as cursor:
        cursor.executemany(
            SQL_SALVAR_LICITACAO,
            licitacoes,
        )

    return len(licitacoes)