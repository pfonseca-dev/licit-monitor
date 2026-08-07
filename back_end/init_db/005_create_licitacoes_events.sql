CREATE OR REPLACE FUNCTION notify_processos_changed()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'processos_changed',
        '{"event":"processos_changed"}'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'processos_changed_licitacoes_trigger'
          AND tgrelid = 'licitacoes'::regclass
          AND NOT tgisinternal
    ) THEN
        CREATE TRIGGER processos_changed_licitacoes_trigger
        AFTER INSERT OR UPDATE ON licitacoes
        FOR EACH ROW
        EXECUTE FUNCTION notify_processos_changed();
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'processos_changed_dispensas_trigger'
          AND tgrelid = 'dispensas'::regclass
          AND NOT tgisinternal
    ) THEN
        CREATE TRIGGER processos_changed_dispensas_trigger
        AFTER INSERT OR UPDATE ON dispensas
        FOR EACH ROW
        EXECUTE FUNCTION notify_processos_changed();
    END IF;
END;
$$;
