CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil perfil_usuario NOT NULL DEFAULT 'visualizador',
    ativo BOOLEAN NOT NULL DEFAULT TRUE;

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_email UNIQUE (email)
);

CREATE TABLE licitacoes (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    id_externo BIGINT NOT NULL,

    processo_compra VARCHAR(100) NOT NULL,
    numero_edital VARCHAR(100),
    numero_modalidade VARCHAR(100),
    lei VARCHAR(100),

    modalidade VARCHAR(150),
    tipo_aquisicao VARCHAR(150),

    status_processo TEXT,
    orgao TEXT,
    objeto TEXT,
    observacoes TEXT,

    valor_estimado NUMERIC(15,2),

    data_abertura TIMESTAMPTZ,
    data_homologacao TIMESTAMPTZ,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_licitacoes PRIMARY KEY (id),
    CONSTRAINT uq_licitacoes_id_externo UNIQUE (id_externo)
);

CREATE TABLE dispensas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    id_externo BIGINT NOT NULL,

    processo_compra VARCHAR(100) NOT NULL,
    modalidade VARCHAR(100),
    contratos VARCHAR(100),

    lei VARCHAR(150),
    artigo VARCHAR(150),
    tipo_aquisicao VARCHAR(150),

    objeto TEXT,
    orgao TEXT,
    fornecedor TEXT,
    status_processo TEXT,

    valor_total NUMERIC(15,2),

    data_abertura TIMESTAMPTZ,
    data_homologacao TIMESTAMPTZ,
    data_encerramento TIMESTAMPTZ,

    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_dispensas PRIMARY KEY (id),
    CONSTRAINT uq_dispensas_id_externo UNIQUE (id_externo)
)
