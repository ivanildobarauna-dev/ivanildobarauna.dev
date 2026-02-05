# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website with a Python Flask backend (API) and Next.js frontend. Both services run independently with Docker support and are orchestrated via Docker Compose.

- **Backend**: RESTful API built with Flask using Hexagonal Architecture
- **Frontend**: Next.js application consuming the backend API
- **Infrastructure**: Docker Compose with PostgreSQL and Redis

## Quick Start Commands

### Full Stack (Docker Compose)
```bash
# Setup all dependencies
./setup.sh

# Run entire stack (backend + frontend + redis)
docker-compose up --build

# Services available at:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8090
# - Backend API docs: http://localhost:8090/docs
# - Backend admin panel: http://localhost:8090/admin
```

### Backend Development
```bash
cd backend

# Install dependencies
poetry install

# Run locally
poetry run python -m app
# or with debug mode
poetry run flask --app app.__main__:app --debug run --port 8090

# Tests
poetry run pytest                          # Run all tests
poetry run pytest tests/path/to/test.py    # Run specific test
poetry run pytest --cov=src                # With coverage report

# Code quality
poetry run black .                         # Format code
poetry run ruff check .                    # Lint code
poetry run mypy .                          # Type checking
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Run locally
PORT=3000 NEXT_PUBLIC_BACKEND_URL=http://localhost:8090 npm run dev --turbo

# Tests
npm run test                    # Run all tests
npm run test src/test/path/to/test.ts  # Run specific test
npm run test:health             # Health check test

# Build and production
npm run build                   # Build for production
npm start                       # Start production server
npm run lint                    # Lint code
```

## Architecture

### Backend: Hexagonal Architecture (Ports and Adapters)

The backend follows hexagonal architecture principles with clear separation between domain logic and infrastructure:

**Core Layers:**
- **Domain** (`src/domain/dto/`): DTOs for data transfer (Experience, Project, Formation, Certification, SocialMedia)
- **Ports** (`src/infrastructure/ports/`): Repository interfaces defining contracts
- **Adapters** (`src/infrastructure/adapters/`): Concrete implementations (SQLite, PostgreSQL, file storage)
- **Services** (`src/infrastructure/services/`): Business logic orchestration via `portfolio_data_service.py`
- **Routes** (`src/infrastructure/routes/`): REST API endpoints organized by domain

**Key Components:**
- Entry point: `app/__main__.py`
- Database models: `src/infrastructure/adapters/database/models.py` (SQLAlchemy ORM)
- Admin panel: `app/admin/` (Flask-Admin with custom templates)
- API documentation: Swagger at `/docs` (Flask-RESTX)

**API Endpoints:**
- `GET /api/v1/ping` - Health check
- `GET /api/v1/experiences` - Professional experiences
- `GET /api/v1/education` - Academic formation
- `GET /api/v1/projects` - Portfolio projects
- `GET /api/v1/social-media-links` - Social media links

### Frontend: Next.js with App Router

**Structure:**
- **Pages** (`src/app/`): Route-based pages (experience, projects, education, contact)
  - Each section has its own hooks, components, and interfaces
  - Uses Next.js App Router convention
- **Shared Components** (`src/components/`): Sidebar, Footer, AlertMessage, Loading
- **Utils** (`src/utils/`): Backend endpoint configuration
- **Tests** (`src/test/`): Vitest tests
- **Public** (`public/`): Static assets organized by type (images, profile, companies, institutions)

**Backend Integration:**
- Development: `http://localhost:8090/api/v1`
- Docker: `http://backend:8090/api/v1`
- Configuration: `src/utils/backend_endpoint.tsx` auto-detects environment

## Code Standards

### Backend (Python)
- **Line length**: 88 characters (Black)
- **Naming**: snake_case for functions/variables, PascalCase for classes, UPPER_SNAKE_CASE for constants
- **Imports**: Standard library → third-party → local (alphabetical within groups)
- **Type hints**: Required for all function parameters and return types
- **Docstrings**: Required for modules, classes, and functions
- **Error handling**: Use specific exceptions with try/except blocks
- **Test coverage**: Minimum 90% (enforced by pytest-cov)
- **Tools**: Black (format), Ruff (lint), mypy (type check)

### Frontend (TypeScript/React)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: React/Next → external libraries → local components/hooks
- **Types**: TypeScript interfaces for component props, explicit return types for hooks
- **Components**: Functional components with hooks only
- **Error handling**: Try/catch with type checking (`if (error instanceof Error)`)
- **Styling**: Tailwind CSS classes directly in components
- **File organization**: Group related components with their hooks and interfaces

## Environment Variables

### Backend
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: PostgreSQL connection
- `DD_*`: Datadog monitoring configuration (optional)

### Frontend
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL (auto-configured in utils)
- `NODE_ENV`: Environment (development/production)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis cache configuration
- `DD_*`: Datadog monitoring configuration (optional)

## Database

- **Development**: SQLite (local file)
- **Production**: PostgreSQL (Docker Compose or external)
- **ORM**: SQLAlchemy with Flask-Migrate for migrations
- **Admin**: Flask-Admin panel at `/admin`

## Testing

### Backend
- **Framework**: pytest with pytest-cov
- **Structure**: `tests/` mirrors `src/` structure
- **Pattern**: AAA (Arrange, Act, Assert)
- **Coverage requirement**: 90% minimum

### Frontend
- **Framework**: Vitest with Testing Library
- **Location**: `src/test/`
- **Health check**: Dedicated test for backend connectivity

## Common Issues

**Backend API not responding:**
- Ensure PostgreSQL is running (or SQLite file exists)
- Check port 8090 is not in use
- Verify environment variables in docker-compose.yaml

**Frontend 404 errors:**
- Backend must be running on port 8090
- Check `getBackendEndpoint()` function is used in all hooks
- Verify NEXT_PUBLIC_BACKEND_URL if manually set

**Docker Compose networking:**
- Services communicate via container names (e.g., `backend:8090`)
- Frontend depends on backend health check passing
- Redis must be healthy before frontend starts

## Development Workflow

1. **New feature**: Make changes in appropriate layer (domain/infrastructure/routes for backend, pages/components for frontend)
2. **Add tests**: Follow AAA pattern, maintain 90% coverage on backend
3. **Code quality**: Run formatters/linters before committing
4. **Test locally**: Use Docker Compose to test full integration
5. **Documentation**: Update Swagger docs for new API endpoints

## Active Technologies
- TypeScript 5.8.3, Next.js 16.1.6, React 19.2.1 + Next.js App Router, React hooks, Vitest for testing, Tailwind CSS (001-frontend-cache)

## Recent Changes
- 001-frontend-cache: Added TypeScript 5.8.3, Next.js 16.1.6, React 19.2.1 + Next.js App Router, React hooks, Vitest for testing, Tailwind CSS
