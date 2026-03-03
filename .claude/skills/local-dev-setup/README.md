# Local Dev Setup Skill

Uma skill que automatiza completamente a configuração do ambiente de desenvolvimento local com SSH tunnel para PostgreSQL remoto e orquestração de Docker Compose.

## 📋 O que a skill faz

1. ✅ Valida pré-requisitos (Docker, Docker Compose, SSH)
2. ✅ Lê `POSTGRES_HOST` do arquivo `.env`
3. ✅ Abre tunnel SSH em background para o servidor remoto
4. ✅ Inicia todos os serviços via Docker Compose
5. ✅ Aguarda health checks do backend e frontend
6. ✅ Exibe status final com URLs de acesso

## 🔧 Como Usar

Simplesmente diga ao Claude Code:

```
"Suba a aplicação localmente"
"Configure o ambiente de desenvolvimento"
"Inicie o dev stack com a conexão SSH ao banco"
"Start my development environment"
```

A skill será acionada automaticamente quando você mencionar:
- "suba a aplicação localmente"
- "dev stack"
- "ambiente de desenvolvimento"
- "SSH tunnel"
- "desenvolvimento"

## 📁 Estrutura da Skill

```
local-dev-setup/
├── SKILL.md                 # Instruções e documentação
├── README.md               # Este arquivo
├── evals/
│   └── evals.json          # Casos de teste
└── scripts/
    └── setup-local-dev.sh  # Script bash que faz a orquestração
```

## 🔐 Pré-requisitos

Antes de usar, certifique-se de ter:

1. **Docker e Docker Compose instalados**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **SSH configurado**
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519
   ssh-copy-id root@168.231.100.213
   ```

3. **Arquivo `.env` na raiz do projeto**
   ```env
   POSTGRES_HOST=168.231.100.213
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=your_database
   ```

4. **Docker Compose file**
   - Deve estar em `docker-compose.yml` ou `docker-compose.yaml` na raiz

## 🚀 Fluxo de Execução

```
┌─────────────────────────────────────────┐
│  Validar Pré-requisitos                 │
│  ✓ .env existe                          │
│  ✓ POSTGRES_HOST definido               │
│  ✓ Docker/Docker Compose instalados     │
│  ✓ SSH disponível                       │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Extrair POSTGRES_HOST do .env          │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Limpar SSH tunnels antigos              │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Abrir SSH Tunnel (background)          │
│  ssh -g -L 0.0.0.0:5432:localhost:5432 │
│  root@{POSTGRES_HOST}                   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Iniciar Docker Compose                 │
│  docker-compose up -d                   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Aguardar Health Checks                 │
│  ✓ Backend: http://localhost:8090/...   │
│  ✓ Frontend: http://localhost:3000      │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  Exibir Status Final                    │
│  URLs, services, conexão SSH            │
└─────────────────────────────────────────┘
```

## 📊 Output da Skill

A skill exibe:

```
╔════════════════════════════════════════════════════════════╗
║              🚀 Local Development Environment Ready        ║
╠════════════════════════════════════════════════════════════╣
║ Docker Services:
║   NAME                  COMMAND              STATUS
║   backend               python -m app        Up 2s
║   frontend              npm run dev          Up 2s
║   postgres-tunnel       ...                  Up 2s
║   redis                 redis-server         Up 2s
╠════════════════════════════════════════════════════════════╣
║ SSH Tunnel:
║   ✓ Connected to 168.231.100.213:5432
╠════════════════════════════════════════════════════════════╣
║ Access URLs:
║   Frontend:   http://localhost:3000
║   Backend:    http://localhost:8090
║   API Docs:   http://localhost:8090/docs
║   Admin:      http://localhost:8090/admin
╠════════════════════════════════════════════════════════════╣
║ Database:
║   PostgreSQL tunnel: localhost:5432
║   Remote server:    168.231.100.213:5432
╠════════════════════════════════════════════════════════════╣
║ Cleanup:
║   docker-compose down                    # Stop services
║   pkill -f "ssh -g -L 0.0.0.0:5432"    # Kill tunnel
╚════════════════════════════════════════════════════════════╝
```

## 🛑 Parar Tudo

Quando terminar de desenvolver:

```bash
# Para os serviços Docker
docker-compose down

# Mata o tunnel SSH
pkill -f "ssh -g -L 0.0.0.0:5432"
```

## 🐛 Troubleshooting

### SSH tunnel falha
```bash
# Teste SSH manualmente
ssh -v root@168.231.100.213

# Verifique permissões
chmod 600 ~/.ssh/id_rsa
chmod 700 ~/.ssh
```

### Porta já em uso
```bash
# Mate SSH tunnels existentes
pkill -f "ssh -g -L 0.0.0.0:5432"

# Verifique quem está usando a porta
lsof -i :5432
```

### Docker Compose falha
```bash
# Veja logs
docker-compose logs

# Verifique serviço específico
docker-compose logs backend
```

### Health checks timeout
```bash
# Verifique os logs dos serviços
docker-compose logs -f

# Aguarde mais tempo - primeira inicialização é lenta
```

## 📝 Notas

- O flag `-g` permite conexões de containers para o host
- O flag `-N` em SSH significa "não execute comando" - apenas forward porta
- O tunnel roda em background, você pode fechar o terminal
- Todos os serviços são orquestrados via Docker Compose
- O IP remoto é lido do `.env` para flexibilidade

## 🧪 Teste a Skill

Depois de instalada, teste com:

```bash
# Coloque-se na raiz do seu projeto
cd /caminho/para/seu/projeto

# Diga ao Claude Code:
"Suba a aplicação localmente"

# Ou:
"Set up my development environment"

# Ou:
"Initialize the local dev stack with SSH tunnel"
```

## 📦 Requisitos da Skill

- **Ferramentas**: bash, docker, docker-compose, ssh, curl
- **Arquivos**: `.env` com `POSTGRES_HOST`
- **Acesso**: SSH sem senha configurado para o servidor remoto
