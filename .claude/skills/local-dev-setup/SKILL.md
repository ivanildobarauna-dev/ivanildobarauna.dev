---
name: local-dev-setup
description: Set up the entire local development environment with SSH tunnel to remote PostgreSQL and Docker Compose stack. Use this skill when the user wants to start developing locally, run the full application stack, connect to a remote database via SSH tunnel, or initialize the development environment. Automatically handles opening the SSH tunnel in the background, starting all Docker services (backend, frontend, database), and verifying health checks.
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
# 1. Extracts POSTGRES_HOST from .env
POSTGRES_HOST=$(grep POSTGRES_HOST .env | cut -d'=' -f2)

# 2. Opens SSH tunnel in background
ssh -g -L 0.0.0.0:5432:localhost:5432 root@$POSTGRES_HOST -N &

# 3. Starts Docker Compose
docker-compose up -d

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

## Clean Up

When done developing, to stop everything:
```bash
# Stop Docker Compose
docker-compose down

# Kill SSH tunnel
pkill -f "ssh -g -L 0.0.0.0:5432"
```

## Notes

- The SSH tunnel uses the `-g` flag to allow container-to-host networking
- The `-N` flag in SSH means "don't execute a command" - just forward the port
- The tunnel runs in the background, so you can close the terminal and it persists
- All services are orchestrated via Docker Compose defined in your project repository
