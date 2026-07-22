CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil perfil_usuario NOT NULL DEFAULT 'visualizador',
    criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_nome UNIQUE (nome),
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