# Frontend

Portfólio estático em Next.js. A aplicação lê os dados públicos de `public/data/portfolio.json` e pode ser publicada diretamente no Cloudflare Pages.

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

O build gera `out/`. No Cloudflare Pages, configure:

| Campo | Valor |
| --- | --- |
| Diretório raiz | `frontend` |
| Comando de build | `npm run build` |
| Diretório de saída | `out` |
| Branch de produção | `main` |

Pushes para `main` fazem o deploy de produção; pull requests recebem previews.
