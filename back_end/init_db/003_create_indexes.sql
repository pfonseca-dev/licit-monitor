CREATE INDEX idx_licitacoes_status
ON licitacoes (status_processo);

CREATE INDEX idx_licitacoes_modalidade
ON licitacoes (modalidade);

CREATE INDEX idx_licitacoes_data_abertura
ON licitacoes (data_abertura);