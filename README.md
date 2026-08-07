<div align="center">

Português | [English](README.en.md)

# Licit Monitor

### Monitoramento inteligente de compras públicas

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-F7DF1E?style=flat-square&logo=jsonwebtokens&logoColor=black)](https://jwt.io/)

</div>

> Sistema desenvolvido para modernizar o acompanhamento de compras públicas, centralizando licitações, dispensas, usuários e indicadores em uma única plataforma.

💡 **Documentação da API:** <http://localhost:8000/docs>

O Licit Monitor coleta, centraliza e apresenta processos públicos em um painel com busca, filtros, indicadores e atualização automática.

## Funcionalidades

- coleta periódica de licitações e dispensas em APIs externas;
- armazenamento dos processos em PostgreSQL;
- painel com resumo dos processos por status;
- busca por número, modalidade, objeto ou órgão;
- filtros por tipo, status e órgão;
- páginas específicas por tipo de processo;
- visualização dos detalhes de cada processo;
- cadastro e autenticação de usuários;
- edição de observações por usuários com perfil `editor`;
- atualização da interface em tempo real por Server-Sent Events (SSE).

## Arquitetura

```text
APIs externas
     │
     ▼
Coletores Python ──────► PostgreSQL ◄────── API FastAPI
                              │                    │
                              └── NOTIFY/LISTEN ───┤
                                                   │ SSE/REST
                                                   ▼
                                             Frontend React
```

O projeto é dividido nos seguintes serviços:

| Serviço | Responsabilidade | Tecnologia | Porta local |
| --- | --- | --- | --- |
| `front_end` | Interface e painel de monitoramento | React, TypeScript e Vite | `5173` |
| `backend` | API REST, autenticação e eventos SSE | FastAPI e SQLAlchemy | `8000` |
| `collector_licitacao` | Coleta periódica de licitações | Python | — |
| `collector_dispensa` | Coleta periódica de dispensas | Python | — |
| `database` | Persistência dos dados | PostgreSQL 18 | `5433` |

## Pré-requisitos

Para executar todo o ambiente, instale:

- [Docker](https://docs.docker.com/get-docker/);
- Docker Compose (incluído nas versões atuais do Docker Desktop e Docker Engine).

## Configuração

1. Clone o repositório e entre na pasta do projeto.

2. Crie o arquivo local de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

3. Edite o `.env` e informe, no mínimo:

   - `URL_LICIT`: endpoint externo usado para coletar licitações;
   - `URL_DISPE`: endpoint externo usado para coletar dispensas;
   - `POSTGRES_PASSWORD` e `DB_PASSWORD`: use a mesma senha em ambos;
   - a senha presente em `DATABASE_URL` deve ser a mesma do PostgreSQL.

As principais variáveis disponíveis são:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `URL_LICIT` | URL da fonte de licitações | `https://exemplo/api/licitacoes` |
| `URL_DISPE` | URL da fonte de dispensas | `https://exemplo/api/dispensas` |
| `COLLECTOR_INTERVAL` | Intervalo entre coletas de licitações, em segundos | `300` |
| `INTERVALO_SEGUNDOS` | Intervalo entre coletas de dispensas, em segundos | `300` |
| `POSTGRES_DB` | Nome do banco criado pelo container | `licit_monitor` |
| `POSTGRES_USER` | Usuário do PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | uma senha segura |
| `POSTGRES_PORT` | Porta exposta apenas no computador local | `5433` |
| `DATABASE_URL` | URL SQLAlchemy usada pela API | `postgresql+psycopg://...` |
| `CORS_ORIGINS` | Origens autorizadas, separadas por vírgula | `http://localhost:5173` |
| `VITE_API_URL` | Endereço público da API para o navegador | `http://localhost:8000` |

Não versionar o arquivo `.env`, pois ele pode conter credenciais.

## Execução com Docker

Construa as imagens e inicie os serviços:

```bash
docker compose up --build
```

Depois que os containers estiverem prontos, acesse:

- aplicação: <http://localhost:5173>;
- documentação Swagger da API: <http://localhost:8000/docs>;
- documentação ReDoc da API: <http://localhost:8000/redoc>;
- verificação básica da API: <http://localhost:8000/>.

Para iniciar em segundo plano:

```bash
docker compose up --build -d
```

Para acompanhar os logs:

```bash
docker compose logs -f
```

Para encerrar o ambiente sem apagar os dados:

```bash
docker compose down
```

O PostgreSQL utiliza o volume `database_data`. Para reinicializar completamente o banco, remova o volume conscientemente com `docker compose down -v`; esse comando apaga os dados locais.

## API

Principais endpoints disponíveis:

| Método | Endpoint | Descrição | Autenticação |
| --- | --- | --- | --- |
| `GET` | `/` | Confirma que a API está ativa | Não |
| `GET` | `/licitacoes` | Lista as licitações | Não |
| `GET` | `/licitacoes/{id}` | Consulta uma licitação | Não |
| `PATCH` | `/licitacoes/{id}/observacao` | Atualiza uma observação | Editor |
| `GET` | `/dispensas` | Lista as dispensas | Não |
| `GET` | `/dispensas/{id}` | Consulta uma dispensa | Não |
| `PATCH` | `/dispensas/{id}/observacao` | Atualiza uma observação | Editor |
| `GET` | `/status/ultima-atualizacao` | Informa quando ocorreu a coleta mais recente | Não |
| `GET` | `/events/processos` | Mantém o stream SSE de alterações | Não |
| `POST` | `/usuarios` | Cadastra um usuário | Não |
| `GET` | `/usuarios/me` | Retorna o usuário autenticado | Bearer token |
| `POST` | `/auth/login` | Autentica e retorna um token JWT | Não |

O login recebe formulário no padrão OAuth2, usando o e-mail no campo `username` e a senha no campo `password`.

Exemplo:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=usuario@exemplo.com&password=senha-segura'
```

Consulte `/docs` para conferir os contratos completos de entrada e saída gerados pelos schemas da API.

## Atualização dos dados

Cada coletor consulta sua fonte externa, transforma os registros e realiza a persistência no PostgreSQL. Ao concluir, registra o horário na tabela `coletas`.

Alterações em licitações e dispensas acionam triggers do PostgreSQL. A API escuta essas notificações e publica o evento `processos_changed` pelo endpoint SSE. O frontend, ao receber o evento, consulta os dados novamente. Como contingência, a página também é recarregada a cada cinco minutos.

## Estrutura do repositório

```text
licit-monitor/
├── back_end/
│   ├── app/
│   │   ├── core/          # configuração, banco e segurança
│   │   ├── dependencies/  # dependências de autenticação
│   │   ├── events/        # integração PostgreSQL e SSE
│   │   ├── models/        # modelos SQLAlchemy
│   │   ├── repository/    # acesso aos dados
│   │   ├── router/        # rotas FastAPI
│   │   ├── schema/        # contratos Pydantic
│   │   └── service/       # regras da aplicação
│   └── init_db/           # scripts de inicialização do PostgreSQL
├── collector/
│   ├── app/licitacoes/    # coleta e transformação de licitações
│   ├── app/dispensas/     # coleta e transformação de dispensas
│   ├── main_licitacao.py
│   └── main_dispensa.py
├── front_end/
│   └── src/
│       ├── components/    # componentes visuais
│       ├── pages/         # páginas da aplicação
│       ├── services/      # comunicação com a API
│       └── types/         # tipos TypeScript
├── .env.example
└── compose.yaml
```

## Desenvolvimento do frontend

Com Node.js 22 ou uma versão compatível instalada:

```bash
cd front_end
npm install
npm run dev
```

Comandos úteis:

```bash
npm run build
npm run lint
npm run preview
```

O backend e o banco ainda precisam estar acessíveis nos endereços configurados.

## Solução de problemas

### O banco não aceita a conexão

Confirme se `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD` correspondem a `DB_NAME`, `DB_USER` e `DB_PASSWORD`. Confira também as credenciais em `DATABASE_URL`.

### Uma alteração nos scripts SQL não aparece

Os arquivos em `back_end/init_db` são executados pelo PostgreSQL somente na primeira criação do volume. Em um ambiente descartável de desenvolvimento, recrie o volume; em ambientes com dados importantes, aplique uma migração sem remover o volume.

### O navegador bloqueia chamadas à API

Inclua a origem exata do frontend em `CORS_ORIGINS` e confirme que `VITE_API_URL` aponta para um endereço que o navegador consegue acessar.

### Os coletores não trazem dados

Verifique as URLs das fontes no `.env` e acompanhe os logs individualmente:

```bash
docker compose logs -f collector_licitacao collector_dispensa
```

Atualmente, o coletor de licitações lê `COLLECTOR_INTERVAL`, enquanto o coletor de dispensas lê `INTERVALO_SEGUNDOS`. Quando não informados, ambos usam 300 segundos.

## Estado atual e segurança

O projeto está em desenvolvimento. Antes de utilizá-lo em produção, recomenda-se:

- retirar o modo `--reload` do backend;
- executar o frontend a partir de uma build de produção;
- configurar HTTPS e restringir CORS;
- substituir segredos temporários do JWT por configuração segura;
- adotar migrações versionadas para o banco;
- adicionar testes automatizados, observabilidade e uma política de backup.

## Licença

Este repositório ainda não possui um arquivo de licença. Adicione uma licença antes de distribuir ou aceitar contribuições externas.
