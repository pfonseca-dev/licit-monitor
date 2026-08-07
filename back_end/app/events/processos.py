import asyncio
import logging
from collections.abc import AsyncIterator

import psycopg

from app.core.config import get_settings

logger = logging.getLogger(__name__)
CHANNEL = "processos_changed"


class ProcessosEventBroker:
    def __init__(self) -> None:
        self._clients: set[asyncio.Queue[str]] = set()

    async def subscribe(self) -> AsyncIterator[asyncio.Queue[str]]:
        queue: asyncio.Queue[str] = asyncio.Queue(maxsize=1)
        self._clients.add(queue)
        try:
            yield queue
        finally:
            self._clients.discard(queue)

    def publish(self, payload: str) -> int:
        delivered = 0
        for queue in tuple(self._clients):
            if queue.full():
                continue
            queue.put_nowait(payload)
            delivered += 1
        return delivered


processos_event_broker = ProcessosEventBroker()


async def run_processos_listener(broker: ProcessosEventBroker) -> None:
    retry_delay = 1
    database_url = get_settings().database_url.replace(
        "postgresql+psycopg://",
        "postgresql://",
        1,
    )

    while True:
        try:
            connection = await psycopg.AsyncConnection.connect(
                database_url,
                autocommit=True,
                application_name="licit_monitor_events",
            )
            async with connection:
                await connection.execute(f"LISTEN {CHANNEL}")
                logger.info("Conectado ao PostgreSQL e escutando o canal %s", CHANNEL)
                retry_delay = 1
                clients = broker.publish('{"event":"processos_changed"}')
                if clients:
                    logger.info(
                        "Sincronização após conexão enviada a %d cliente(s) SSE",
                        clients,
                    )

                async for notification in connection.notifies():
                    logger.info("Alteração em processos recebida do PostgreSQL")
                    clients = broker.publish(notification.payload)
                    logger.info("Evento enviado a %d cliente(s) SSE", clients)
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception(
                "Falha na conexão LISTEN; nova tentativa em %d segundo(s)",
                retry_delay,
            )
            await asyncio.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 30)
