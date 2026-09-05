# Frontend

## Comandos

- Desenvolvimento: `npm run dev`
- Testes: `npm test -- --run`
- Build estático: `npm run build`

## Dados

Os hooks carregam o snapshot público em `public/data/portfolio.json` por `src/utils/portfolioData.ts`. Mantenha o contrato desse arquivo ao alterar componentes ou hooks.

## Convenções

- Componentes funcionais com hooks e TypeScript.
- Tailwind CSS para estilos.
- Não use API routes, rewrites, Docker nem dependências de backend: o output deve permanecer compatível com exportação estática.
