# Frontend

Portfólio estático em Next.js. A aplicação lê os dados públicos de `public/data/portfolio.json` e é publicada como Cloudflare Workers Static Assets.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`.

## Validação e publicação

```bash
npm test -- --run
npm run build
```

O build gera `out/`, configurado em `wrangler.jsonc`. No Workers Builds, configure:

| Campo | Valor |
| --- | --- |
| Diretório raiz | `frontend` |
| Comando de build | `npm run build` |
| Comando de deploy | `npx wrangler deploy` |
| Branch de produção | `main` |

Pushes para `main` fazem o deploy de produção; pull requests recebem previews.
