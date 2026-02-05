<!--
Sync Impact Report:
- Version change: (initial) → 1.0.0
- Modified principles: N/A (initial creation)
- Added sections: All sections (initial constitution)
- Removed sections: N/A
- Templates requiring updates:
  ✅ plan-template.md - Reviewed, constitution check section aligns
  ✅ spec-template.md - Reviewed, requirements align with principles
  ✅ tasks-template.md - Reviewed, task phases align with testing principles
- Follow-up TODOs: None
- Rationale: MINOR version (1.0.0) for initial constitution establishment
-->

# ivanildobarauna.dev Constitution

## Core Principles

### I. Hexagonal Architecture (Backend)

The backend MUST follow hexagonal architecture (ports and adapters) with strict separation between domain logic and infrastructure. All implementations MUST adhere to this layered structure:

- **Domain Layer** (`src/domain/dto/`): Data transfer objects only - no business logic
- **Ports** (`src/infrastructure/ports/`): Repository interfaces defining contracts
- **Adapters** (`src/infrastructure/adapters/`): Concrete implementations (database, file storage, external APIs)
- **Services** (`src/infrastructure/services/`): Business logic orchestration
- **Routes** (`src/infrastructure/routes/`): REST API endpoints organized by domain

**Rationale**: Hexagonal architecture ensures testability, maintainability, and allows swapping infrastructure implementations (e.g., SQLite → PostgreSQL) without changing business logic.

### II. Test Coverage (NON-NEGOTIABLE)

All backend code MUST maintain minimum 90% test coverage enforced by pytest-cov. Tests MUST follow the AAA (Arrange, Act, Assert) pattern and be organized in `tests/` mirroring the `src/` structure.

**Required test types**:
- Unit tests for services and business logic
- Integration tests for repository implementations
- Contract tests for API endpoints
- Frontend health checks for backend connectivity

**Rationale**: High test coverage prevents regressions in a personal portfolio site that showcases professional work. The 90% threshold is enforced by CI/CD and must not be bypassed.

### III. Type Safety & Code Quality

All code MUST be type-safe and pass quality gates before commit:

**Backend (Python)**:
- Type hints REQUIRED for all function parameters and return types
- Black (formatting), Ruff (linting), mypy (type checking) MUST pass
- Line length: 88 characters (Black standard)

**Frontend (TypeScript/React)**:
- TypeScript interfaces REQUIRED for component props
- Explicit return types for hooks
- ESLint MUST pass
- Functional components with hooks only (no class components)

**Rationale**: Type safety catches errors at development time rather than runtime. Code quality tools ensure consistent, maintainable codebase.

### IV. Docker-First Deployment

All services MUST be containerized with Docker and orchestrated via Docker Compose. Services MUST be independently runnable but designed for integrated deployment.

**Required**:
- Individual Dockerfiles for backend and frontend
- docker-compose.yaml for full stack orchestration
- Health checks for all services
- Dependency ordering (frontend depends on backend health)

**Rationale**: Docker ensures consistent environments across development, testing, and production. Portfolio site requires reliable deployment for professional credibility.

### V. API-First Design

Backend MUST expose RESTful API with:
- OpenAPI/Swagger documentation at `/docs`
- Versioned endpoints (`/api/v1/...`)
- Admin panel at `/admin`
- Health check endpoint at `/api/v1/ping`

Frontend MUST consume backend through environment-aware configuration (`getBackendEndpoint()` utility).

**Rationale**: Clear API contracts enable independent frontend/backend development and provide documentation for API consumers.

## Architecture Constraints

### Backend Technology Stack

**REQUIRED**:
- Python 3.11+ with Poetry for dependency management
- Flask with Flask-RESTX (Swagger/OpenAPI)
- SQLAlchemy ORM with Flask-Migrate for migrations
- PostgreSQL for production, SQLite for development
- Redis for caching
- pytest with pytest-cov for testing

**FORBIDDEN**:
- Direct database access bypassing repository pattern
- Business logic in routes or models
- Mixing infrastructure concerns in domain layer

### Frontend Technology Stack

**REQUIRED**:
- Next.js with App Router
- TypeScript (strict mode)
- Tailwind CSS for styling
- Vitest with Testing Library
- React hooks (functional components only)

**FORBIDDEN**:
- Class components
- Direct backend URL hardcoding (must use `getBackendEndpoint()`)
- Inline styles or CSS-in-JS (Tailwind only)

### File Organization

**Backend**:
```
backend/
├── app/              # Entry point and admin panel
├── src/
│   ├── domain/dto/   # Data transfer objects
│   ├── infrastructure/
│   │   ├── adapters/ # DB, file storage implementations
│   │   ├── ports/    # Repository interfaces
│   │   ├── routes/   # API endpoints
│   │   └── services/ # Business logic
├── tests/            # Mirrors src/ structure
└── pyproject.toml    # Poetry dependencies
```

**Frontend**:
```
frontend/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Shared components
│   ├── test/         # Vitest tests
│   └── utils/        # Backend endpoint config
└── public/           # Static assets
```

## Development Workflow

### Pre-Commit Requirements

1. **Code Quality**: All formatters and linters MUST pass
   - Backend: `poetry run black .`, `poetry run ruff check .`, `poetry run mypy .`
   - Frontend: `npm run lint`

2. **Tests**: All tests MUST pass with 90%+ coverage (backend)
   - Backend: `poetry run pytest --cov=src`
   - Frontend: `npm run test`

3. **Integration**: Docker Compose MUST build and run successfully
   - `docker-compose up --build` MUST start all services

### New Feature Process

1. Make changes in appropriate architectural layer (never bypass layers)
2. Add/update tests (backend MUST maintain 90% coverage)
3. Run code quality tools
4. Test locally with Docker Compose
5. Update Swagger docs for new API endpoints (if applicable)
6. Commit with descriptive message following conventional commits

### Documentation Requirements

**REQUIRED**:
- Docstrings for all Python modules, classes, and functions
- TypeScript JSDoc comments for complex logic
- Swagger/OpenAPI for all API endpoints
- README.md updates for new setup requirements

**FORBIDDEN**:
- Committing code without documentation
- Creating features without updating API documentation
- Breaking existing documentation without updates

## Governance

### Amendment Procedure

Constitution amendments require:
1. Documented justification for change
2. Impact analysis on existing code and templates
3. Version bump following semantic versioning
4. Update to all dependent templates (plan, spec, tasks)
5. Commit message: `docs: amend constitution to vX.Y.Z (brief description)`

### Versioning Policy

- **MAJOR**: Breaking changes to architecture principles (e.g., removing hexagonal architecture requirement)
- **MINOR**: New principles or section additions (e.g., adding security principle)
- **PATCH**: Clarifications, wording improvements, non-semantic changes

### Compliance Review

All feature specifications, implementation plans, and tasks MUST reference constitution principles and verify compliance. Any violations (e.g., complexity requiring deviation) MUST be explicitly justified in the "Complexity Tracking" section of the implementation plan.

**Version**: 1.0.0 | **Ratified**: 2025-04-11 | **Last Amended**: 2026-02-05
