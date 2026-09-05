# ivanildobarauna.dev

Este repositório contém um portfólio estático em Next.js, publicado no Cloudflare Pages. Os dados públicos ficam em `frontend/public/data/portfolio.json`; não há backend, banco de dados, Docker ou variáveis de ambiente necessários para executar o site.

## Comandos

```bash
cd frontend
npm ci
npm run dev
npm test -- --run
npm run build
```

O build gera o diretório `frontend/out`, que é a saída configurada para o Cloudflare Pages.

## Convenções

- Mantenha os dados do portfólio em `frontend/public/data/portfolio.json`.
- Use componentes funcionais, TypeScript e Tailwind CSS.
- Valide alterações com testes e build estático.
- Não adicione serviços de servidor, Docker, API routes ou variáveis de ambiente sem uma necessidade explícita de produto.
