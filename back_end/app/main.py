import asyncio
import logging
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine
from app.core.config import get_settings
from app.events.processos import processos_event_broker, run_processos_listener
from app.router.events_router import router as events_router
from app.router.licitacoes_router import router as licitacoes_router
from app.router.dispensas_router import router as dispensas_router
from app.router.auth_router import router as auth_router
from app.router.usuario_router import router as usuario_router
from app.router.status_router import router as status_router


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def prepare_database() -> None:
    # Os scripts de /docker-entrypoint-initdb.d não rodam novamente em volumes
    # existentes, por isso esta tabela também é garantida no startup da API.
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS coletas (
                fonte VARCHAR(30) PRIMARY KEY,
                realizada_em TIMESTAMPTZ NOT NULL
            )
        """))
        connection.execute(text("""
            CREATE OR REPLACE FUNCTION notify_processos_changed()
            RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(
                    'processos_changed',
                    '{"event":"processos_changed"}'
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        """))
        connection.execute(text("""
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
            $$
        """))
        connection.execute(text(
            "DROP TRIGGER IF EXISTS licitacoes_changed_trigger ON licitacoes"
        ))
        connection.execute(text(
            "DROP FUNCTION IF EXISTS notify_licitacoes_changed()"
        ))


@asynccontextmanager
async def lifespan(_: FastAPI):
    await asyncio.to_thread(prepare_database)
    listener_task = asyncio.create_task(
        run_processos_listener(processos_event_broker),
        name="postgres-processos-listener",
    )

    logger.info("Escuta de alterações em processos iniciada")

    yield

    listener_task.cancel()
    with suppress(asyncio.CancelledError):
        await listener_task

app = FastAPI(
    title="Licit Monitor API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(licitacoes_router)
app.include_router(dispensas_router)
app.include_router(status_router)
app.include_router(events_router)

@app.get("/")
def raiz() -> dict[str, str]:
    return {
        "message": "Licit Monitor API está funcionando"
    }
