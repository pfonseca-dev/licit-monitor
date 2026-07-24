from typing import Any
from psycopg import Connection

SQL_SALVAR_DISPENSA = """
    INSERT INTO dispensas(
        id_externo,
        processo_compra,
        modalidade,
        contratos,
        lei,
        artigo,
        tipo_aquisicao,
        objeto,
        orgao,
        fornecedor,
        status_processo,
        valor_total,
        data_abertura,
        data_homologacao,
        data_encerramento
    )
    VALUES(
        %(id_externo)s,
        %(processo_compra)s,
        %(modalidade)s,
        %(contratos)s,
        %(lei)s,
        %(artigo)s,
        %(tipo_aquisicao)s,
        %(objeto)s,
        %(orgao)s,
        %(fornecedor)s,
        %(status_processo)s,
        %(valor_total)s,
        %(data_abertura)s,
        %(data_homologacao)s,
        %(data_encerramento)s
    )
    ON CONFLICT (id_externo) 
    DO UPDATE SET 
        processo_compra = EXCLUDED.processo_compra,
        modalidade = EXCLUDED.modalidade,
        contratos = EXCLUDED.contratos,
        lei = EXCLUDED.lei,
        artigo = EXCLUDED.artigo,
        tipo_aquisicao = EXCLUDED.tipo_aquisicao,
        objeto = EXCLUDED.objeto,
        orgao = EXCLUDED.orgao,
        fornecedor = EXCLUDED.fornecedor,
        status_processo = EXCLUDED.status_processo,
        valor_total = EXCLUDED.valor_total,
        data_abertura = EXCLUDED.data_abertura,
        data_homologacao = EXCLUDED.data_homologacao,
        data_encerramento = EXCLUDED.data_encerramento,
        atualizado_em = CURRENT_TIMESTAMP
    WHERE (
        dispensas.processo_compra,
        dispensas.modalidade,
        dispensas.contratos,
        dispensas.lei,
        dispensas.artigo,
        dispensas.tipo_aquisicao,
        dispensas.objeto,
        dispensas.orgao,
        dispensas.fornecedor,
        dispensas.status_processo,
        dispensas.valor_total,
        dispensas.data_abertura,
        dispensas.data_homologacao,
        dispensas.data_encerramento
    )
    IS DISTINCT FROM (
        EXCLUDED.processo_compra,
        EXCLUDED.modalidade,
        EXCLUDED.contratos,
        EXCLUDED.lei,
        EXCLUDED.artigo,
        EXCLUDED.tipo_aquisicao,
        EXCLUDED.objeto,
        EXCLUDED.orgao,
        EXCLUDED.fornecedor,
        EXCLUDED.status_processo,
        EXCLUDED.valor_total,
        EXCLUDED.data_abertura,
        EXCLUDED.data_homologacao,
        EXCLUDED.data_encerramento
    );
"""

def salvar_dispensas(
        connection: Connection,
        dispensas: list[dict[str, Any]],
) -> int:
    if not dispensas:
        return 0

    with connection.cursor() as cursor:
        cursor.executemany(
            SQL_SALVAR_DISPENSA,
            dispensas
        )
    return len(dispensas)