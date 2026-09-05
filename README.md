# ivanildobarauna.dev | Personal Website

Código-fonte do site [ivanildobarauna.dev](https://ivanildobarauna.dev).

👉 Artigo no Medium: [Ter um site pessoal é o melhor projeto de engenharia que você vai fazer por você mesmo](https://medium.com/@IvanildoBarauna/ter-um-site-pessoal-%C3%A9-o-melhor-projeto-de-engenharia-que-voc%C3%AA-pode-fazer-por-voc%C3%AA-mesmo-ac21ddce01d7)

## Publicação

O projeto é um site estático Next.js preparado para Cloudflare Workers Static Assets. Todo o conteúdo público do portfólio é versionado em `frontend/public/data/portfolio.json`; não há backend, banco de dados, Docker ou variáveis de ambiente em produção.

Para atualizar informações do portfólio, edite o JSON e versione a alteração.

## Desenvolvimento e validação

```bash
cd frontend
npm ci
npm run dev
npm test -- --run
npm run build
```

O build gera `frontend/out`.

## Cloudflare Workers

Conecte este repositório ao Workers Builds com estas configurações:

| Campo | Valor |
| --- | --- |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | `main` |

O `wrangler.jsonc` aponta os assets para `out/`. Cada push para `main` publica a produção e pull requests recebem uma URL de preview. Após o primeiro deploy, associe `ivanildobarauna.dev` e `www.ivanildobarauna.dev` ao Worker, preservando os registros de e-mail no DNS.

## Estrutura

```
├── frontend/  # Site Next.js estático e dados públicos
└── README.md
```

Consulte também [frontend/README.md](./frontend/README.md).
