---
name: local-dev-setup
description: Set up the entire local development environment with SSH tunnel to remote PostgreSQL and Docker Compose stack. Use this skill when the user wants to start developing locally, run the full application stack, connect to a remote database via SSH tunnel, or initialize the development environment. Automatically handles opening the SSH tunnel in the background, starting all Docker services (backend, frontend, database), and verifying health checks. Also use this skill when the user wants to tear down, stop, or shut down the local environment — phrases like "derrubar a aplicação", "parar o ambiente local", "desligar os containers", "encerrar o stack" should trigger the Teardown flow described in this skill.
compatibility: bash, docker, ssh, .env file
---

# Local Development Setup

This skill automates the entire local development environment setup by:
1. Reading the remote PostgreSQL server IP from `.env`
2. Opening an SSH tunnel in the background to forward database connections
3. Starting the Docker Compose stack (backend, frontend, Redis, etc.)
4. Waiting for health checks to ensure all services are running

## Prerequisites

Before using this skill, ensure you have:
- Docker and Docker Compose installed
- SSH access configured to the remote server
- A `.env` file in your project root with `POSTGRES_HOST` variable containing the VPS IP address
- SSH keys properly configured (the skill will use your system's SSH configuration)

## Execution Steps

### Step 0: Teardown de ambiente existente

Antes de qualquer coisa, verifique se há containers ou SSH tunnels em execução e encerre tudo para garantir um rebuild limpo do zero. O objetivo é sempre subir uma stack fresca — nunca reaproveitar containers ou tunnels anteriores.

**0a. Verificar porta 5432**

Execute `lsof -i :5432` para checar se há algum processo usando a porta.

- Se houver **apenas o SSH tunnel do próprio projeto** (`ssh -g -L 0.0.0.0:5432`): encerre-o automaticamente com `pkill -f "ssh -g -L 0.0.0.0:5432"`.
- Se houver **qualquer outro processo** (ex: PostgreSQL local, outro tunnel, outro serviço): **pergunte ao usuário** antes de agir:

  > "Há um processo de terceiros usando a porta 5432 (PID: X, comando: Y). Deseja que eu encerre esse processo automaticamente para prosseguir, ou prefere resolver manualmente e me avisar quando estiver pronto?"

  Aguarde a resposta antes de continuar. Se o usuário optar por resolver manualmente, pause e retome a partir do Step 1 quando ele confirmar que a porta está livre.

**0b. Teardown dos containers do projeto**

Pare e remova apenas os containers deste projeto — outros containers no sistema não são afetados:

```bash
# Encerrar SSH tunnel do projeto (se ainda estiver rodando)
pkill -f "ssh -g -L 0.0.0.0:5432" 2>/dev/null
sleep 1

# Parar e remover apenas os containers deste projeto
docker stop portfolio-backend portfolio-frontend 2>/dev/null
docker rm portfolio-backend portfolio-frontend 2>/dev/null
```

Confirme que após esse passo:
- `lsof -i :5432` retorna vazio
- `docker ps -a --filter name=portfolio` retorna vazio

Só avance para o Step 1 após essa confirmação.

### Step 1: Validate Environment

The skill first checks that:
- `.env` file exists
- `POSTGRES_HOST` variable is defined in `.env`
- Docker and Docker Compose are available
- SSH is accessible

### Step 2: Read SSH Configuration

The SSH tunnel will use:
- Remote host: Read from `POSTGRES_HOST` in `.env`
- Tunnel command: `ssh -g -L 0.0.0.0:5432:localhost:5432 root@{POSTGRES_HOST}`
- The `-g` flag allows other containers to connect to the forwarded port
- The tunnel runs in the background and persists for the entire development session

### Step 3: Start Docker Compose

The skill will:
- Use Docker Compose files from the project (looking for `docker-compose.yml` or `docker-compose.yaml` in the project root)
- Start all services: backend, frontend, PostgreSQL client setup, Redis, etc.
- Services will be able to connect to the remote database via the SSH tunnel on port 5432

### Step 4: Health Checks

After starting services, the skill waits for:
- Backend API to respond at `http://localhost:8090/api/v1/ping`
- Frontend to be available at `http://localhost:3000`
- All containers to be in a healthy state

## What Happens

When you ask Claude Code to "Set up the local development environment" or "Start the application locally with the SSH tunnel", this skill:

```bash
# 0a. Verificar porta 5432 — se for processo de terceiros, perguntar ao usuário antes de encerrar
lsof -i :5432

# 0b. Teardown: encerrar SSH tunnel e containers do projeto
pkill -f "ssh -g -L 0.0.0.0:5432" 2>/dev/null
sleep 1
docker stop portfolio-backend portfolio-frontend 2>/dev/null
docker rm portfolio-backend portfolio-frontend 2>/dev/null

# 1. Extracts POSTGRES_HOST from .env
POSTGRES_HOST=$(grep POSTGRES_HOST .env | cut -d'=' -f2)

# 2. Opens SSH tunnel in background
ssh -g -L 0.0.0.0:5432:localhost:5432 root@$POSTGRES_HOST -N &

# 3. Starts Docker Compose (always with --build for a clean rebuild)
PROJECT_ROOT=$(pwd) docker compose -f .claude/skills/local-dev-setup/assets/docker-compose.yaml up --build -d

# 4. Waits for services to be healthy
# Monitors logs and health checks until everything is ready
```

## Output

The skill will display:
- ✅ SSH tunnel status and PID
- ✅ Docker Compose services starting
- ✅ Real-time logs from services
- ✅ Health check progress
- ✅ Final status with URLs to access the application:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:8090`
  - API Docs: `http://localhost:8090/docs`

## Troubleshooting

**SSH tunnel fails to connect:**
- Verify the IP address in `.env` is correct
- Check SSH key permissions: `chmod 600 ~/.ssh/id_rsa`
- Test SSH manually: `ssh root@{POSTGRES_HOST} -v`

**Docker Compose fails:**
- Ensure Docker daemon is running
- Check port availability (3000, 8090, 5432 should be free)
- Run `docker-compose logs` to see detailed error messages

**Health checks timeout:**
- Services may be slower on first startup
- Check individual service logs: `docker-compose logs backend`
- Ensure database migration completed: `docker-compose logs postgres` or similar

**Port already in use:**
- Kill existing SSH tunnel: `pkill -f "ssh -g -L 0.0.0.0:5432"`
- Kill existing containers: `docker-compose down`
- Check port usage: `lsof -i :5432`, `lsof -i :3000`

## Teardown (derrubar o ambiente local)

Quando o usuário disser que quer derrubar, parar ou encerrar a aplicação local — frases como "derrubar a aplicação", "parar o ambiente", "desligar os containers", "encerrar o stack" — execute o teardown completo abaixo, sem necessidade de passar pelo fluxo de setup:

```bash
# 1. Parar e remover apenas os containers deste projeto
docker stop portfolio-backend portfolio-frontend 2>/dev/null
docker rm portfolio-backend portfolio-frontend 2>/dev/null

# 2. Encerrar o SSH tunnel do projeto
pkill -f "ssh -g -L 0.0.0.0:5432" 2>/dev/null
```

Confirme ao usuário o resultado:
- `docker ps --filter name=portfolio` → deve retornar vazio
- `lsof -i :5432` → deve retornar vazio (ou mostrar apenas processos de terceiros, caso existam)

Informe ao usuário que o ambiente foi encerrado e que as portas 3000, 8090 e 5432 foram liberadas.

## Notes

- The SSH tunnel uses the `-g` flag to allow container-to-host networking
- The `-N` flag in SSH means "don't execute a command" - just forward the port
- The tunnel runs in the background, so you can close the terminal and it persists
- All services are orchestrated via Docker Compose defined in your project repository
