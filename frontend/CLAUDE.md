# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev: `npm run dev --turbo`
- Lint: `npm run lint`
- Test: `npm run test`
- Single test: `npm run test src/test/path/to/test.ts`
- Test health check: `npm run test:health`

## Code Style
- **Imports**: Group by 1) React/Next, 2) external libraries, 3) local components/hooks
- **Types**: Use TypeScript interfaces for component props and explicit return types for hooks
- **Error Handling**: Try/catch with type checking (e.g., `if (error instanceof Error)`)
- **Components**: Use functional components with hooks
- **Hooks**: Custom hooks for data fetching and state management
- **Styling**: Use Tailwind CSS classes directly in components
- **File Structure**: Group related components with their hooks and interfaces
- **Naming**: PascalCase for components, camelCase for functions and variables

## Backend Endpoint Configuration

The application has been configured to connect to the backend API with the following settings:

- In development mode (local): `http://localhost:8090/api/v1`
- In production mode (Docker): `http://backend:8090/api/v1`

This configuration is stored in `src/utils/backend_endpoint.tsx` and automatically detects the environment.

## Common Issues and Solutions

1. **404 API Errors**: If you see errors like `GET http://localhost:8080/undefined/projects 404 (Not Found)`, it means:
   - The frontend can't find the backend API
   - Ensure the backend service is running on port 8090
   - Check that all hooks are using the `getBackendEndpoint()` function

2. **Running in Docker**: When using Docker Compose, the services communicate using container names

3. **Local Development**: When running outside Docker, ensure the backend is accessible at `http://localhost:8090`
