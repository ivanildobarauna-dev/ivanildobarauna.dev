# ivanildobarauna.dev | Personal Website

Este repositório contempla o código fonte do site [ivanildobarauna.dev](https://ivanildobarauna.dev)

👉 Leia meu artigo no Medium: [Ter um site pessoal é o melhor projeto de engenharia que você vai fazer por você mesmo](https://medium.com/@IvanildoBarauna/ter-um-site-pessoal-%C3%A9-o-melhor-projeto-de-engenharia-que-voc%C3%AA-pode-fazer-por-voc%C3%AA-mesmo-ac21ddce01d7)


## Pergunte para a IA sobre este projeto
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/ivanildobarauna-dev/ivanildobarauna.dev)

 ## Componentes Principais

- **Backend**: API RESTful desenvolvida em Python (Flask), responsável por fornecer dados dinâmicos para o frontend através de storage local ou dados fornecidos por Fornecedores externos como o Github.
- **Frontend**: Aplicação Next.js que consome a API e exibe as informações do portfólio.

Ambos os projetos possuem Dockerfile próprio e podem ser executados de forma integrada via Docker Compose.

Para instalar todas as dependências em um único passo, utilize o script `setup.sh` na raiz do repositório:

```bash
./setup.sh
```

## Estrutura do repositório

```
├── backend/   # API Flask
├── frontend/  # Next.js
├── docker-compose.yaml
└── README.md  # Este arquivo
```

## Como executar com Docker Compose

Você pode usar o `docker-compose` na raiz do projeto. Isso irá subir tanto o backend quanto o frontend já integrados.

```bash
docker-compose up --build
```

- O frontend estará disponível em: http://localhost:8080
- O backend estará disponível em: http://localhost:8090

## Instruções específicas

Consulte os READMEs de cada projeto para detalhes de desenvolvimento, arquitetura e execução individual:

- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)

## Sistema de Cache do Frontend

O frontend implementa um **padrão cache-aside** usando localStorage do navegador para melhorar a performance e reduzir chamadas à API do backend em ~80%.

### Recursos do Cache

- **TTL de 30 dias** com expiração automática
- **Type-safe** com TypeScript genérico
- **Compatível com SSR** (Server-Side Rendering)
- **Tratamento de erros gracioso** (nunca lança exceções, sempre fallback)
- **Gerenciamento de quota** (limpeza automática quando storage está cheio)
- **Invalidação granular** (limpar cache completo ou recursos específicos)

### Comandos de Cache

#### Limpar todo o cache (console do navegador)

```javascript
window.clearPortfolioCache()
// Console: ✓ All portfolio cache cleared
```

#### Limpar cache de recurso específico (console do navegador)

```javascript
window.clearPortfolioCache('projects')    // Apenas projetos
window.clearPortfolioCache('experiences') // Apenas experiências
window.clearPortfolioCache('education')   // Apenas educação
// Console: ✓ Cache cleared for resource: projects
```

#### Ver estatísticas do cache (console do navegador)

```javascript
BrowserCache.getStats()
// Retorna: { totalKeys, totalSize, oldestEntry }
```

#### Invalidar cache via API

**Limpar todo o cache:**
```bash
curl -X DELETE http://localhost:3000/api/cache
```

**Limpar recurso específico:**
```bash
curl -X DELETE 'http://localhost:3000/api/cache?resource=projects'
```

**Obter informações do endpoint:**
```bash
curl http://localhost:3000/api/cache
```

### Recursos Disponíveis para Cache

- `experiences` - Dados de experiência profissional
- `company_durations` - Cálculos de duração por empresa
- `total_duration` - Duração total de carreira
- `projects` - Projetos do portfólio
- `education` - Formação acadêmica e certificações
- `social_links` - Links de redes sociais

### Comportamento do Cache

**Cache Hit (dados em cache)**:
- Console: `✓ Loading [resource] data from cache`
- 0 chamadas à API
- Exibição instantânea de dados
- ~50% mais rápido no carregamento da página

**Cache Miss (dados não estão em cache)**:
- Console: `✗ Cache miss - fetching [resource] data from API`
- Chamada à API é feita
- Cache é populado após fetch bem-sucedido
- Tempo de carregamento normal

### Testes do Cache

**Executar todos os testes de cache:**
```bash
cd frontend
npm run test -- src/test/cacheService.test.ts src/test/cacheIntegration.test.ts
```

**Resultado**: 46 testes (30 unitários + 16 integração) - 100% passando

### Melhorias de Performance

Comparação entre cache hit vs cache miss:
- **Tempo de carregamento**: 50% mais rápido
- **Redução de chamadas à API**: 80% (6 chamadas → 0 chamadas)
- **Time to Interactive**: Imediato com dados em cache

### Compatibilidade

| Navegador | Status | Observações |
|-----------|--------|-------------|
| Chrome/Edge | ✅ Suporte completo | localStorage 5-10 MB |
| Firefox | ✅ Suporte completo | localStorage 5-10 MB |
| Safari | ✅ Suporte completo | Limitação de 7 dias (tratada graciosamente) |

**Limitação do Safari**: Pode limpar localStorage após 7 dias de inatividade. O cache trata isso graciosamente com re-fetch automático.

### Documentação Adicional

- **Guia completo**: `frontend/CLAUDE.md` - Seção "Frontend Cache System"
- **Testes manuais**: `specs/001-frontend-cache/MANUAL_TESTING_GUIDE.md`
- **Resumo da implementação**: `specs/001-frontend-cache/IMPLEMENTATION_SUMMARY.md`

## Observações

- O frontend espera que a variável de ambiente `NEXT_PUBLIC_BACKEND_URL` aponte para o backend (já configurado no docker-compose).
- O backend expõe a documentação Swagger em `/docs`.
- O cache do frontend é armazenado no navegador do usuário (localStorage) e persiste entre sessões.

---
