# Architecture Overview

## Skill Design

Esta skill foi projetada para **automatizar completamente** o setup do ambiente local de desenvolvimento, abstraindo a complexidade de gerenciar SSH tunnels, Docker Compose e health checks.

## Componentes

### 1. **SKILL.md**
- Documentação da skill e metadata
- Descreve quando a skill deve ser acionada
- Guia de troubleshooting
- Instruções de como funciona

### 2. **setup-local-dev.sh**
Script bash que orquestra todo o processo:

```
setup-local-dev.sh
├── validate_prerequisites()
│   ├── Check .env exists
│   ├── Check POSTGRES_HOST defined
│   ├── Check Docker installed
│   ├── Check Docker Compose installed
│   ├── Check SSH available
│   └── Check docker-compose.yml exists
│
├── extract_postgres_host()
│   └── Read POSTGRES_HOST from .env
│
├── cleanup_existing_tunnel()
│   └── Kill any running SSH tunnels
│
├── open_ssh_tunnel()
│   ├── Run: ssh -g -L 0.0.0.0:5432:localhost:5432 root@$POSTGRES_HOST -N -f
│   ├── Wait for tunnel to establish
│   └── Verify tunnel is active
│
├── start_docker_compose()
│   └── Run: docker-compose up -d
│
├── wait_for_health_checks()
│   ├── Poll: curl http://localhost:8090/api/v1/ping
│   ├── Poll: curl http://localhost:3000
│   └── Timeout after 60 attempts (2 min)
│
└── display_status()
    ├── Show docker-compose ps
    ├── Show SSH tunnel status
    ├── Show access URLs
    ├── Show database connection info
    └── Show cleanup commands
```

### 3. **Evals** (evals/evals.json)
- 3 casos de teste para validar a skill
- Diferentes formas de solicitar o setup
- Verifica se a skill é acionada corretamente

## SSH Tunnel Mechanics

### Comando Usado
```bash
ssh -g -L 0.0.0.0:5432:localhost:5432 root@POSTGRES_HOST -N -f
```

**Explicação dos flags:**
- `-g`: Permite que outros hosts/containers se conectem ao port forward
- `-L 0.0.0.0:5432:localhost:5432`: Local port forwarding
  - `0.0.0.0:5432`: Listen on all interfaces, port 5432 (local)
  - `localhost:5432`: Forward to localhost:5432 on remote server
- `-N`: Don't execute a command (just forward ports)
- `-f`: Go to background (run as daemon)

### Fluxo da Conexão

```
┌──────────────────────┐
│   Docker Container   │
│   (Backend/Frontend) │
└──────────┬───────────┘
           │ Connects to: localhost:5432
           ↓
┌──────────────────────┐
│   SSH Tunnel (local) │
│   0.0.0.0:5432       │
└──────────┬───────────┘
           │ Forwards to: remote:5432
           ↓
┌──────────────────────────┐
│  VPS Remote Server       │
│  168.231.100.213:5432    │
│  PostgreSQL Running      │
└──────────────────────────┘
```

## Docker Compose Integration

A skill **não gerencia** os docker-compose files. Eles devem estar:
- Na raiz do projeto
- Nomeados como `docker-compose.yml` ou `docker-compose.yaml`
- Com os serviços que você quer iniciar (backend, frontend, redis, etc)

A skill apenas executa `docker-compose up -d` e aguarda health checks.

## Health Checks

A skill valida que tudo está funcionando antes de completar:

1. **Backend Health Check**
   - Endpoint: `http://localhost:8090/api/v1/ping`
   - Máximo: 60 tentativas (2 min)
   - Intervalo: 2 segundos

2. **Frontend Health Check**
   - Endpoint: `http://localhost:3000`
   - Máximo: 60 tentativas (2 min)
   - Intervalo: 2 segundos

Se algum health check falhar, a skill avisa mas continua anyway (graceful degradation).

## Error Handling

A skill valida em múltiplos pontos:

1. **Validação de pré-requisitos** (exit if failed)
   - `.env` exists
   - `POSTGRES_HOST` defined
   - Docker tools available
   - docker-compose file exists

2. **Validação de SSH**
   - Tunnel pode ser estabelecido
   - Avisa se SSH check command falha, mas continua

3. **Validação de Docker**
   - Serviços iniciam
   - Health checks completam (com timeout)

## Configuration from .env

A skill lê `POSTGRES_HOST` do `.env`:

```bash
POSTGRES_HOST=$(grep "^POSTGRES_HOST" ".env" | cut -d'=' -f2 | tr -d ' "'"'"'')
```

Este valor é injetado no comando SSH:
```bash
ssh -g -L 0.0.0.0:5432:localhost:5432 root@$POSTGRES_HOST -N -f
```

## Cleanup

Quando pronto, usuário executa:

```bash
# Para Docker
docker-compose down

# Para SSH Tunnel
pkill -f "ssh -g -L 0.0.0.0:5432"
```

Ou a skill pode ser expandida futuramente para oferecer comando de cleanup.

## Future Enhancements

Possíveis melhorias futuras:

1. **Cleanup command** - Adicionar função para parar tudo de uma vez
2. **Status monitoring** - Comando para verificar status sem reiniciar
3. **Logs aggregation** - Coletar logs de todos os serviços
4. **Database migrations** - Rodar migrations automaticamente
5. **Backup before setup** - Backup do database local antes de conectar ao remoto
6. **Multiple env configs** - Suportar diferentes `.env.production`, `.env.staging`, etc
7. **Service-specific control** - Poder iniciar/parar serviços individuais
8. **Performance monitoring** - Dashboard com CPU, memória, conexões

## Why This Approach?

1. **Simplicidade** - Um comando para tudo
2. **Repeatability** - Sempre o mesmo fluxo, sem erros manuais
3. **Debugging** - Logs coloridos e detalhados em cada passo
4. **Safety** - Valida pré-requisitos antes de começar
5. **Transparency** - Mostra exatamente o que está fazendo
6. **Reliability** - Health checks garantem que tudo está pronto

## Integration with Claude Code

A skill se integra com Claude Code através da descrição em SKILL.md:

- Quando usuário fala sobre "dev setup", "local development", "SSH tunnel", etc
- Claude detecta e carrega esta skill automaticamente
- Executa `setup-local-dev.sh` que já está pronto
- Mostra output colorido e formatado para o usuário

Não há necessidade de arquivos adicionais ou configuração - tudo é self-contained na skill.
