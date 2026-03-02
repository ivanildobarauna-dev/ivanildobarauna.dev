#!/bin/bash

##############################################################################
# Local Development Setup Script
#
# This script automates the setup of the local development environment by:
# 1. Reading remote PostgreSQL host from .env
# 2. Opening an SSH tunnel in the background
# 3. Starting Docker Compose
# 4. Waiting for health checks
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env"
SSH_TUNNEL_PORT="5432"
BACKEND_HEALTH_URL="http://localhost:8090/api/v1/ping"
FRONTEND_HEALTH_URL="http://localhost:3000"
MAX_HEALTH_CHECK_ATTEMPTS=60
HEALTH_CHECK_INTERVAL=2

# Determine skill asset location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SKILL_COMPOSE_FILE="$SCRIPT_DIR/../assets/docker-compose.yaml"

##############################################################################
# Helper Functions
##############################################################################

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

##############################################################################
# Step 1: Validate Prerequisites
##############################################################################

validate_prerequisites() {
    log_info "Validating prerequisites..."

    # Check if .env file exists
    if [ ! -f "$ENV_FILE" ]; then
        log_error ".env file not found in current directory"
        exit 1
    fi
    log_success ".env file found"

    # Check if POSTGRES_HOST is defined in .env
    if ! grep -q "POSTGRES_HOST" "$ENV_FILE"; then
        log_error "POSTGRES_HOST not found in .env"
        exit 1
    fi
    log_success "POSTGRES_HOST found in .env"

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    log_success "Docker is installed"

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    log_success "Docker Compose is installed"

    # Check if SSH is available
    if ! command -v ssh &> /dev/null; then
        log_error "SSH is not installed"
        exit 1
    fi
    log_success "SSH is available"

    # Check if docker-compose.yml exists in skill assets
    if [ ! -f "$SKILL_COMPOSE_FILE" ]; then
        log_error "docker-compose.yaml not found in skill assets ($SKILL_COMPOSE_FILE)"
        exit 1
    fi
    log_success "docker-compose file found in skill assets"
}

##############################################################################
# Step 2: Extract PostgreSQL Host from .env
##############################################################################

extract_postgres_host() {
    log_info "Extracting PostgreSQL host from .env..."

    # Read POSTGRES_HOST from .env (handles spaces and different quote styles)
    POSTGRES_HOST=$(grep "^POSTGRES_HOST" "$ENV_FILE" | cut -d'=' -f2 | tr -d ' "'"'"'')

    if [ -z "$POSTGRES_HOST" ]; then
        log_error "Failed to extract POSTGRES_HOST from .env"
        exit 1
    fi

    log_success "PostgreSQL host: $POSTGRES_HOST"
}

##############################################################################
# Step 3: Check and Kill Existing SSH Tunnel
##############################################################################

cleanup_existing_tunnel() {
    log_info "Checking for existing SSH tunnels..."

    # Kill any existing SSH tunnel on port 5432
    if pgrep -f "ssh -g -L 0.0.0.0:$SSH_TUNNEL_PORT" > /dev/null 2>&1; then
        log_warning "Found existing SSH tunnel, killing it..."
        pkill -f "ssh -g -L 0.0.0.0:$SSH_TUNNEL_PORT" || true
        sleep 1
    fi

    log_success "SSH tunnel cleanup complete"
}

##############################################################################
# Step 4: Open SSH Tunnel
##############################################################################

open_ssh_tunnel() {
    log_info "Opening SSH tunnel to $POSTGRES_HOST:$SSH_TUNNEL_PORT..."

    # Open SSH tunnel in background
    # -g: allow connections from other hosts
    # -L: local port forwarding
    # -N: don't execute command
    # -f: go to background
    ssh -g -L 0.0.0.0:$SSH_TUNNEL_PORT:localhost:$SSH_TUNNEL_PORT root@$POSTGRES_HOST -N -f

    # Give the tunnel a moment to establish
    sleep 2

    # Verify tunnel is active
    if ssh -O check root@$POSTGRES_HOST 2>/dev/null; then
        log_success "SSH tunnel established successfully"
    else
        log_warning "SSH tunnel status check returned warning, but it may still be working"
    fi
}

##############################################################################
# Step 5: Start Docker Compose
##############################################################################

start_docker_compose() {
    log_info "Starting Docker Compose services..."

    # Start services in detached mode using the skill's docker-compose file
    docker-compose -f "$SKILL_COMPOSE_FILE" up -d

    log_success "Docker Compose services started"
}

##############################################################################
# Step 6: Wait for Health Checks
##############################################################################

wait_for_health_checks() {
    log_info "Waiting for services to be healthy..."

    attempt=0

    # Wait for backend to be ready
    log_info "Checking backend health at $BACKEND_HEALTH_URL..."
    while [ $attempt -lt $MAX_HEALTH_CHECK_ATTEMPTS ]; do
        if curl -s "$BACKEND_HEALTH_URL" > /dev/null 2>&1; then
            log_success "Backend is healthy"
            break
        fi

        attempt=$((attempt + 1))
        if [ $((attempt % 5)) -eq 0 ]; then
            log_warning "Still waiting for backend... ($attempt/$MAX_HEALTH_CHECK_ATTEMPTS)"
        fi
        sleep $HEALTH_CHECK_INTERVAL
    done

    if [ $attempt -ge $MAX_HEALTH_CHECK_ATTEMPTS ]; then
        log_warning "Backend health check timed out, but continuing..."
    fi

    # Wait for frontend to be ready
    attempt=0
    log_info "Checking frontend health at $FRONTEND_HEALTH_URL..."
    while [ $attempt -lt $MAX_HEALTH_CHECK_ATTEMPTS ]; do
        if curl -s "$FRONTEND_HEALTH_URL" > /dev/null 2>&1; then
            log_success "Frontend is healthy"
            break
        fi

        attempt=$((attempt + 1))
        if [ $((attempt % 5)) -eq 0 ]; then
            log_warning "Still waiting for frontend... ($attempt/$MAX_HEALTH_CHECK_ATTEMPTS)"
        fi
        sleep $HEALTH_CHECK_INTERVAL
    done

    if [ $attempt -ge $MAX_HEALTH_CHECK_ATTEMPTS ]; then
        log_warning "Frontend health check timed out, but continuing..."
    fi
}

##############################################################################
# Step 7: Display Final Status
##############################################################################

display_status() {
    log_info "Getting final service status..."

    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}              🚀 Local Development Environment Ready        ${BLUE}║${NC}"
    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"

    # Show Docker Compose status
    echo -e "${BLUE}║${NC} ${GREEN}Docker Services:${NC}"
    docker-compose ps | tail -n +2 | while read line; do
        echo -e "${BLUE}║${NC}   $line"
    done

    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${GREEN}SSH Tunnel:${NC}"
    if ssh -O check root@$POSTGRES_HOST 2>/dev/null; then
        echo -e "${BLUE}║${NC}   ✓ Connected to $POSTGRES_HOST:$SSH_TUNNEL_PORT"
    else
        echo -e "${BLUE}║${NC}   Port forwarding active on 0.0.0.0:$SSH_TUNNEL_PORT"
    fi

    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${GREEN}Access URLs:${NC}"
    echo -e "${BLUE}║${NC}   Frontend:   http://localhost:3000"
    echo -e "${BLUE}║${NC}   Backend:    http://localhost:8090"
    echo -e "${BLUE}║${NC}   API Docs:   http://localhost:8090/docs"
    echo -e "${BLUE}║${NC}   Admin:      http://localhost:8090/admin"

    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${GREEN}Database:${NC}"
    echo -e "${BLUE}║${NC}   PostgreSQL tunnel: localhost:$SSH_TUNNEL_PORT"
    echo -e "${BLUE}║${NC}   Remote server:    $POSTGRES_HOST:5432"

    echo -e "${BLUE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BLUE}║${NC} ${YELLOW}Cleanup:${NC}"
    echo -e "${BLUE}║${NC}   docker-compose down                    # Stop services"
    echo -e "${BLUE}║${NC}   pkill -f \"ssh -g -L 0.0.0.0:5432\"    # Kill tunnel"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

##############################################################################
# Main Execution
##############################################################################

main() {
    echo ""
    log_info "Starting local development environment setup..."
    echo ""

    validate_prerequisites
    extract_postgres_host
    cleanup_existing_tunnel
    open_ssh_tunnel
    start_docker_compose
    wait_for_health_checks
    display_status

    log_success "Setup complete! Happy developing! 🎉"
}

# Run main function
main "$@"
