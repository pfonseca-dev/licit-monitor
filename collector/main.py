import logging
import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

from main_licitacao import main as main_licitacao
from main_dispensa import main as main_dispensa


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

logger = logging.getLogger(__name__)


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/health"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(
                b'{"status":"ok","service":"licit-monitor-collector"}'
            )
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        return


def iniciar_collectors() -> None:
    logger.info("Iniciando collector de licitacoes...")
    thread_licitacoes = threading.Thread(
        target=main_licitacao,
        name="collector-licitacoes",
        daemon=True,
    )

    logger.info("Iniciando collector de dispensas...")
    thread_dispensas = threading.Thread(
        target=main_dispensa,
        name="collector-dispensas",
        daemon=True,
    )

    thread_licitacoes.start()
    thread_dispensas.start()


def iniciar_servidor() -> None:
    port = int(os.getenv("PORT", "10000"))

    server = HTTPServer(
        ("0.0.0.0", port),
        HealthHandler,
    )

    logger.info(
        "Health check disponivel na porta %d.",
        port,
    )

    server.serve_forever()


def main() -> None:
    iniciar_collectors()
    iniciar_servidor()


if __name__ == "__main__":
    main()