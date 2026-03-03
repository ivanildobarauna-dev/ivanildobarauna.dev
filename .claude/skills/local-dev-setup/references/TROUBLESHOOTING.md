# Troubleshooting Guide

## Common Issues and Solutions

### 1. SSH Tunnel Connection Failures

#### Issue: "ssh: connect to host X.X.X.X port 22: Connection refused"

**Causes:**
- Server IP is wrong
- Server is down
- Firewall blocking SSH port 22

**Solution:**
```bash
# Test SSH manually with verbose output
ssh -vvv root@168.231.100.213

# Check if server is reachable
ping 168.231.100.213

# Check if port 22 is open
nc -zv 168.231.100.213 22
```

#### Issue: "Permission denied (publickey,password)"

**Causes:**
- SSH keys not configured
- User doesn't have access
- Wrong key permissions

**Solution:**
```bash
# Check SSH key permissions (must be 600)
ls -la ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
chmod 700 ~/.ssh

# Test with specific key
ssh -i ~/.ssh/id_rsa root@168.231.100.213

# Copy your key to server if not already done
ssh-copy-id -i ~/.ssh/id_rsa.pub root@168.231.100.213

# Test after copy
ssh root@168.231.100.213
```

#### Issue: "Too many authentication failures"

**Causes:**
- Too many failed attempts
- SSH agent has too many keys

**Solution:**
```bash
# Clear SSH agent
ssh-add -D

# Add specific key
ssh-add ~/.ssh/id_rsa

# Try again
ssh root@168.231.100.213

# Wait before retrying (SSH has cooldown)
sleep 60
```

#### Issue: "Tunnel established but can't connect to PostgreSQL"

**Causes:**
- Firewall on remote server blocking port 5432
- PostgreSQL not listening on localhost
- Wrong port mapping

**Solution:**
```bash
# Test tunnel is working
ssh -g -L 5432:localhost:5432 root@168.231.100.213 -N &

# In another terminal, test connection
psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1;"

# Check remote PostgreSQL is listening
ssh root@168.231.100.213 "netstat -tlnp | grep 5432"
```

---

### 2. Docker and Docker Compose Issues

#### Issue: "docker: command not found"

**Solution:**
```bash
# Install Docker
brew install docker  # macOS
# or
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh  # Linux

# Start Docker daemon
docker ps
```

#### Issue: "docker-compose: command not found"

**Solution:**
```bash
# Install Docker Compose (v2)
brew install docker-compose  # macOS
# or
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose --version
```

#### Issue: "docker: Cannot connect to Docker daemon"

**Causes:**
- Docker daemon not running
- Wrong permissions

**Solution:**
```bash
# Start Docker daemon
docker ps

# If still fails, check socket permissions
ls -la /var/run/docker.sock

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### Issue: "Port 5432 already in use"

**Causes:**
- Another tunnel already running
- PostgreSQL running locally
- Container already exists

**Solution:**
```bash
# Kill existing SSH tunnels
pkill -f "ssh -g -L 0.0.0.0:5432"

# Check what's using the port
lsof -i :5432

# Stop local PostgreSQL if running
brew services stop postgresql  # macOS
# or
sudo systemctl stop postgresql  # Linux

# Remove existing containers
docker-compose down
```

#### Issue: "docker-compose up fails with permission denied"

**Solution:**
```bash
# Check docker socket access
docker ps

# If fails, add to docker group
sudo usermod -aG docker $(whoami)

# Log out and back in for group changes to take effect
exit

# Or use newgrp
newgrp docker
```

#### Issue: "Container exits immediately with error"

**Solution:**
```bash
# Check container logs
docker-compose logs backend

# Check specific service
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check environment variables
docker-compose config
```

---

### 3. Health Check Issues

#### Issue: "Backend health check timeout"

**Causes:**
- Service not started yet
- Port 8090 not exposed
- Backend not healthy
- Database not connected

**Solution:**
```bash
# Check if backend container is running
docker-compose ps backend

# Check backend logs
docker-compose logs -f backend

# Check if port 8090 is listening
curl -v http://localhost:8090/api/v1/ping

# Check if all databases are healthy
docker-compose ps

# Wait longer on first startup
# Services take 30-60s to fully start
```

#### Issue: "Frontend health check timeout"

**Causes:**
- Frontend build taking too long
- Port 3000 not exposed
- Frontend not healthy

**Solution:**
```bash
# Check frontend container
docker-compose ps frontend

# Check frontend logs (build logs are here)
docker-compose logs -f frontend

# Test manually
curl -v http://localhost:3000

# Check if port 3000 is available
lsof -i :3000
```

#### Issue: "Both health checks timeout but docker-compose ps shows running"

**Causes:**
- Services not fully initialized
- Network issues between containers
- Slow machine

**Solution:**
```bash
# This is normal on first startup - services can take 2-3 minutes
# Wait and check again

docker-compose ps

# Check if you can exec into container and verify manually
docker-compose exec backend curl http://localhost:8090/api/v1/ping

# Increase health check timeout in the skill
# Edit wait_for_health_checks function to increase MAX_HEALTH_CHECK_ATTEMPTS
```

---

### 4. Environment Variable Issues

#### Issue: ".env file not found"

**Causes:**
- Working directory is wrong
- .env doesn't exist

**Solution:**
```bash
# Check if .env exists
ls -la .env

# Create from example if missing
cp .env.example .env

# Edit with correct values
nano .env
```

#### Issue: "POSTGRES_HOST not found in .env"

**Causes:**
- Variable spelled wrong
- .env file is empty
- Formatting issue

**Solution:**
```bash
# Check .env format
cat .env | grep POSTGRES_HOST

# Must be exactly like this (no spaces):
# POSTGRES_HOST=168.231.100.213

# Fix if needed
sed -i 's/POSTGRES_HOST = .*/POSTGRES_HOST=168.231.100.213/' .env

# Verify
grep POSTGRES_HOST .env
```

#### Issue: "IP extracted from .env is empty or wrong"

**Causes:**
- Extra spaces or quotes
- Variable on multiple lines
- Wrong separator

**Solution:**
```bash
# Debug the extraction
grep "^POSTGRES_HOST" .env

# Should show exactly:
# POSTGRES_HOST=168.231.100.213

# If has quotes or spaces, fix it
nano .env

# Test extraction
POSTGRES_HOST=$(grep "^POSTGRES_HOST" ".env" | cut -d'=' -f2 | tr -d ' "'"'"'')
echo "Extracted: [$POSTGRES_HOST]"
```

---

### 5. docker-compose.yml Issues

#### Issue: "docker-compose.yml not found"

**Causes:**
- File not in correct location
- Wrong filename
- Working directory is wrong

**Solution:**
```bash
# Check if file exists
ls -la docker-compose.yml
# or
ls -la docker-compose.yaml

# Create one if missing using project structure
# Should be in repository root

# Verify location
pwd  # Should be /path/to/your/project
```

#### Issue: "Error: service ... has neither an image nor a build context"

**Causes:**
- docker-compose.yml syntax error
- Service not properly configured

**Solution:**
```bash
# Validate docker-compose.yml
docker-compose config

# Check for YAML syntax errors
yamllint docker-compose.yml

# Example correct format:
# version: '3.8'
# services:
#   backend:
#     build: ./backend
#     ports:
#       - "8090:8090"
```

---

### 6. Skill-Specific Issues

#### Issue: "Skill not being triggered when I ask for setup"

**Causes:**
- Skill description doesn't match your phrasing
- Skill not installed
- Claude hasn't loaded the skill

**Solution:**
```bash
# Check if skill is installed
ls -la .claude/skills/local-dev-setup/

# Try explicit phrasing from skill description:
# - "Set up the local development environment"
# - "Start developing locally"
# - "Initialize the dev environment"
```

#### Issue: "Script permission denied"

**Causes:**
- setup-local-dev.sh not executable

**Solution:**
```bash
# Make script executable
chmod +x .claude/skills/local-dev-setup/scripts/setup-local-dev.sh

# Verify
ls -la .claude/skills/local-dev-setup/scripts/setup-local-dev.sh
```

---

### 7. Cleanup Issues

#### Issue: "Can't kill SSH tunnel - it comes back"

**Causes:**
- Multiple tunnels running
- SSH options causing auto-reconnect

**Solution:**
```bash
# Kill all SSH tunnels
pkill -9 -f "ssh.*5432"

# Verify no tunnels
ps aux | grep ssh | grep 5432

# Alternative: kill by port
lsof -i :5432
kill -9 <PID>
```

#### Issue: "Docker containers won't stop"

**Causes:**
- Containers stuck
- Permissions issue

**Solution:**
```bash
# Force stop
docker-compose down -v

# Kill specific container
docker kill <container_id>

# Clean all Docker
docker-compose down
docker system prune -a
```

---

## Debugging Checklist

When something goes wrong, systematically check:

```bash
# 1. Environment
cat .env | grep POSTGRES_HOST

# 2. Docker status
docker ps -a
docker-compose ps

# 3. Network connectivity
ping 168.231.100.213
nc -zv 168.231.100.213 22

# 4. SSH access
ssh -v root@168.231.100.213 "echo OK"

# 5. Tunnel status
ps aux | grep "ssh -g -L"

# 6. Port availability
lsof -i :5432
lsof -i :8090
lsof -i :3000

# 7. Logs
docker-compose logs --tail=50

# 8. Services health
curl -v http://localhost:8090/api/v1/ping
curl -v http://localhost:3000
```

## Getting Help

If you're still stuck:

1. **Run with verbose logging**
   ```bash
   bash -x .claude/skills/local-dev-setup/scripts/setup-local-dev.sh
   ```

2. **Check full logs**
   ```bash
   docker-compose logs
   ```

3. **Test components individually**
   ```bash
   # Test SSH
   ssh -vvv root@168.231.100.213

   # Test Docker
   docker ps

   # Test compose
   docker-compose config
   ```

4. **Ask Claude Code with details**
   - Include the error message
   - Share the .env (without passwords)
   - Share docker-compose.yml structure
   - Share OS info: `uname -a`
