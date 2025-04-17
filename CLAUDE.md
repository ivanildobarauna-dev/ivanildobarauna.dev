# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server (with --turbo flag)
- `npm run build` - Build production bundle 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `docker build -t ivanildobarauna-web .` - Build Docker image
- `docker run -p 8080:8080 ivanildobarauna-web` - Run Docker container

## Code Style
- **Framework**: Next.js 15.3.0 with React 19.1.0 (App Router)
- **TypeScript**: Strict mode with ES2017 target
- **Styling**: Tailwind CSS for all styling
- **Path Aliases**: Use `@/*` imports for src/ directory files
- **Components**: React functional components with TypeScript types
- **State Management**: React hooks (useState, useEffect)
- **Animations**: Framer Motion for transitions/animations
- **Icons**: react-icons and heroicons packages
- **File Structure**: 'use client' directive at top when needed

## Imports & Formatting
- Group imports by: 1) React, 2) Next.js, 3) third-party libraries, 4) local
- ESLint follows Next.js core-web-vitals and TypeScript configurations
- Add blank line between import groups
- Keep components focused with single responsibility

## Naming Conventions
- PascalCase for components, interfaces, and type definitions
- camelCase for variables, functions, and instances
- kebab-case for file/image assets in public directory

## Error Handling
- Use TypeScript's type safety to prevent common errors
- Follow Next.js Error Boundary patterns for runtime errors
- Use optional chaining (?.) and nullish coalescing (??) operators
- Validate all user inputs and API data

## Docker Deployment
- Uses NGINX as reverse proxy (port 8080→3000)
- Production-optimized builds with multi-stage Dockerfile
- Follows security best practices (non-root user)