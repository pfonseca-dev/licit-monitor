import asyncio
import logging

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.events.processos import processos_event_broker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/events", tags=["events"])


@router.get("/processos")
async def stream_processos_events(request: Request) -> StreamingResponse:
    async def event_stream():
        logger.info("Cliente SSE conectado")
        try:
            async for queue in processos_event_broker.subscribe():
                while not await request.is_disconnected():
                    try:
                        payload = await asyncio.wait_for(queue.get(), timeout=15)
                        yield f"event: processos_changed\ndata: {payload}\n\n"
                    except TimeoutError:
                        yield ": keep-alive\n\n"
        finally:
            logger.info("Cliente SSE desconectado")

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
