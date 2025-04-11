# CLAUDE.md - Project Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code Style
- **Framework**: Next.js 14.1.0 with React 18
- **TypeScript**: Strict mode enabled with ES2017 target
- **Styling**: Tailwind CSS for all styling
- **Path Aliases**: Use `@/*` imports to reference files in `src/`
- **Component Pattern**: React functional components with TypeScript types
- **State Management**: React hooks (useState, useEffect)
- **Animations**: Framer Motion for transitions/animations
- **Icons**: react-icons package
- **Imports**: Group imports by type (React, Next.js, third-party, local)
- **File Structure**: 'use client' directive at top when needed

## Error Handling
- Use TypeScript to prevent type errors
- Follow Next.js Error Boundary patterns for runtime errors