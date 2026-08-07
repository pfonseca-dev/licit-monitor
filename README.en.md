<div align="center">

[Português](README.md) | English

# Licit Monitor

### Smart public procurement monitoring

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-F7DF1E?style=flat-square&logo=jsonwebtokens&logoColor=black)](https://jwt.io/)

</div>

> A system designed to modernize public procurement monitoring by centralizing bids, direct awards, users, and indicators on a single platform.

💡 **API documentation:** <http://localhost:8000/docs>

Licit Monitor collects, centralizes, and displays public procurement processes on a dashboard with search, filters, indicators, and automatic updates.

## Features

- periodic collection of bids and direct awards from external APIs;
- process storage in PostgreSQL;
- dashboard with process summaries by status;
- search by number, procurement method, description, or agency;
- filters by type, status, and agency;
- dedicated pages for each process type;
- detailed process view;
- user registration and authentication;
- notes editing by users with the `editor` role;
- real-time UI updates through Server-Sent Events (SSE).

## Architecture

```text
External APIs
     │
     ▼
Python collectors ─────► PostgreSQL ◄────── FastAPI API
                              │                   │
                              └─ NOTIFY/LISTEN ───┤
                                                  │ SSE/REST
                                                  ▼
                                             React frontend
```

The project consists of the following services:

| Service | Responsibility | Technology | Local port |
| --- | --- | --- | --- |
| `front_end` | Monitoring dashboard and user interface | React, TypeScript, and Vite | `5173` |
| `backend` | REST API, authentication, and SSE events | FastAPI and SQLAlchemy | `8000` |
| `collector_licitacao` | Periodic collection of bids | Python | — |
| `collector_dispensa` | Periodic collection of direct awards | Python | — |
| `database` | Data persistence | PostgreSQL 18 | `5433` |

## Prerequisites

To run the complete environment, install:

- [Docker](https://docs.docker.com/get-docker/);
- Docker Compose, included with current versions of Docker Desktop and Docker Engine.

## Configuration

1. Clone the repository and enter the project directory.

2. Create the local environment file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and provide at least:

   - `URL_LICIT`: external endpoint used to collect bids;
   - `URL_DISPE`: external endpoint used to collect direct awards;
   - `POSTGRES_PASSWORD` and `DB_PASSWORD`: use the same password for both;
   - the password in `DATABASE_URL` must match the PostgreSQL password.

The main available variables are:

| Variable | Description | Example |
| --- | --- | --- |
| `URL_LICIT` | Bid data source URL | `https://example/api/licitacoes` |
| `URL_DISPE` | Direct-award data source URL | `https://example/api/dispensas` |
| `COLLECTOR_INTERVAL` | Interval between bid collections, in seconds | `300` |
| `INTERVALO_SEGUNDOS` | Interval between direct-award collections, in seconds | `300` |
| `POSTGRES_DB` | Database created by the container | `licit_monitor` |
| `POSTGRES_USER` | PostgreSQL user | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | a secure password |
| `POSTGRES_PORT` | Port exposed only on the local machine | `5433` |
| `DATABASE_URL` | SQLAlchemy URL used by the API | `postgresql+psycopg://...` |
| `CORS_ORIGINS` | Allowed origins, separated by commas | `http://localhost:5173` |
| `VITE_API_URL` | Public API address used by the browser | `http://localhost:8000` |

Do not commit the `.env` file because it may contain credentials.

## Running with Docker

Build the images and start all services:

```bash
docker compose up --build
```

Once the containers are ready, open:

- application: <http://localhost:5173>;
- Swagger API documentation: <http://localhost:8000/docs>;
- ReDoc API documentation: <http://localhost:8000/redoc>;
- basic API health check: <http://localhost:8000/>.

To start in the background:

```bash
docker compose up --build -d
```

To follow the logs:

```bash
docker compose logs -f
```

To stop the environment without deleting data:

```bash
docker compose down
```

PostgreSQL uses the `database_data` volume. To fully reset the database, deliberately remove the volume with `docker compose down -v`; this command deletes local data.

## API

Main endpoints:

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `GET` | `/` | Confirms that the API is running | No |
| `GET` | `/licitacoes` | Lists bids | No |
| `GET` | `/licitacoes/{id}` | Retrieves a bid | No |
| `PATCH` | `/licitacoes/{id}/observacao` | Updates a note | Editor |
| `GET` | `/dispensas` | Lists direct awards | No |
| `GET` | `/dispensas/{id}` | Retrieves a direct award | No |
| `PATCH` | `/dispensas/{id}/observacao` | Updates a note | Editor |
| `GET` | `/status/ultima-atualizacao` | Returns the most recent collection time | No |
| `GET` | `/events/processos` | Keeps the process SSE stream open | No |
| `POST` | `/usuarios` | Registers a user | No |
| `GET` | `/usuarios/me` | Returns the authenticated user | Bearer token |
| `POST` | `/auth/login` | Authenticates a user and returns a JWT | No |

Login uses an OAuth2-compatible form: provide the email in `username` and the password in `password`.

Example:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=user@example.com&password=secure-password'
```

Open `/docs` to inspect the complete request and response contracts generated from the API schemas.

## Data updates

Each collector queries its external source, transforms the records, and persists them in PostgreSQL. After completing a run, it stores the timestamp in the `coletas` table.

Changes to bids and direct awards trigger PostgreSQL notifications. The API listens for these notifications and publishes a `processos_changed` event through the SSE endpoint. The frontend fetches the data again when it receives the event. As a fallback, the page also reloads every five minutes.

## Repository structure

```text
licit-monitor/
├── back_end/
│   ├── app/
│   │   ├── core/          # configuration, database, and security
│   │   ├── dependencies/  # authentication dependencies
│   │   ├── events/        # PostgreSQL and SSE integration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── repository/    # data access
│   │   ├── router/        # FastAPI routes
│   │   ├── schema/        # Pydantic contracts
│   │   └── service/       # application rules
│   └── init_db/           # PostgreSQL initialization scripts
├── collector/
│   ├── app/licitacoes/    # bid collection and transformation
│   ├── app/dispensas/     # direct-award collection and transformation
│   ├── main_licitacao.py
│   └── main_dispensa.py
├── front_end/
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # application pages
│       ├── services/      # API communication
│       └── types/         # TypeScript types
├── .env.example
└── compose.yaml
```

## Frontend development

With Node.js 22 or a compatible version installed:

```bash
cd front_end
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

The backend and database must still be reachable at their configured addresses.

## Troubleshooting

### The database rejects the connection

Make sure `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` match `DB_NAME`, `DB_USER`, and `DB_PASSWORD`. Also verify the credentials in `DATABASE_URL`.

### SQL script changes do not take effect

Files in `back_end/init_db` run only when PostgreSQL creates the volume for the first time. In a disposable development environment, recreate the volume. If the volume contains important data, apply a migration without removing it.

### The browser blocks API calls

Add the exact frontend origin to `CORS_ORIGINS` and confirm that `VITE_API_URL` points to an address reachable by the browser.

### The collectors do not retrieve data

Check the source URLs in `.env` and follow the collector logs:

```bash
docker compose logs -f collector_licitacao collector_dispensa
```

The bid collector currently reads `COLLECTOR_INTERVAL`, while the direct-award collector reads `INTERVALO_SEGUNDOS`. Both default to 300 seconds when the variable is not provided.

## Current status and security

This project is under development. Before using it in production, you should:

- remove the backend `--reload` option;
- serve the frontend from a production build;
- configure HTTPS and restrict CORS;
- replace temporary JWT secrets with secure configuration;
- adopt versioned database migrations;
- add automated tests, observability, and a backup policy.

## License

This repository does not have a license file yet. Add a license before distributing the project or accepting external contributions.
