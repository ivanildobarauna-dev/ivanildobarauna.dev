# ivanildobarauna.dev

Este projeto é um portfólio pessoal desenvolvido com Next.js, consumindo dados de um backend próprio. O frontend pode ser executado isoladamente ou em conjunto com o backend via Docker Compose.

## Como executar com Docker

Este frontend possui um `Dockerfile` próprio e pode ser executado isoladamente ou em conjunto com o backend via `docker-compose` na raiz do projeto.

### Executando apenas o frontend

```bash
docker build -t frontend .
docker run -p 8080:8080 -e NEXT_PUBLIC_BACKEND_URL=http://localhost:8090 frontend
```

### Executando com docker-compose (recomendado)

Na raiz do projeto:

```bash
docker-compose up --build
```

Isso irá subir tanto o frontend quanto o backend integrados.

## Instalação

Para configurar o ambiente local e instalar as dependências execute:

```bash
npm install
```

## Desenvolvimento local

```bash
PORT=8080 NEXT_PUBLIC_BACKEND_URL=http://localhost:8090 npm run dev
```

Abra [http://localhost:8080](http://localhost:8080) no navegador para ver o resultado.

## Sistema de Cache

O frontend implementa um sistema de cache usando localStorage do navegador para melhorar a performance e reduzir chamadas à API.

### Recursos do Cache

- ✅ **Cache-aside pattern** (verifica cache antes de chamar API)
- ✅ **TTL de 30 dias** com expiração automática
- ✅ **Type-safe** com TypeScript
- ✅ **Compatível com SSR** (Server-Side Rendering)
- ✅ **Invalidação manual** via console ou API
- ✅ **Invalidação granular** (por recurso específico)
- ✅ **Tratamento de erros** (nunca quebra, sempre fallback para API)

### Comandos Rápidos

#### No Console do Navegador (F12)

```javascript
// Limpar todo o cache
window.clearPortfolioCache()

// Limpar cache de recurso específico
window.clearPortfolioCache('projects')      // Apenas projetos
window.clearPortfolioCache('experiences')   // Apenas experiências
window.clearPortfolioCache('education')     // Apenas educação
window.clearPortfolioCache('social_links')  // Apenas links sociais

// Ver estatísticas do cache
BrowserCache.getStats()
// Retorna: { totalKeys, totalSize, oldestEntry }
```

#### Via API REST

```bash
# Limpar todo o cache
curl -X DELETE http://localhost:3000/api/cache

# Limpar recurso específico
curl -X DELETE 'http://localhost:3000/api/cache?resource=projects'

# Informações do endpoint
curl http://localhost:3000/api/cache
```

### Recursos Disponíveis

| Recurso | Descrição | Cache Key |
|---------|-----------|-----------|
| Experiências | Dados de carreira profissional | `experiences` |
| Durações | Tempo em cada empresa | `company_durations` |
| Tempo Total | Duração total de carreira | `total_duration` |
| Projetos | Projetos do portfólio | `projects` |
| Educação | Formação e certificações | `education` |
| Redes Sociais | Links das redes sociais | `social_links` |

### Performance

**Melhorias esperadas com cache:**
- 🚀 **50% mais rápido** no carregamento da página (cache hit)
- 📉 **80% menos chamadas** à API (6 chamadas → 0 com cache)
- ⚡ **Instantâneo** - dados exibidos sem loading

**Logs no console:**
```
✓ Loading experience data from cache    // Cache hit
✗ Cache miss - fetching data from API   // Cache miss
```

### Testes

```bash
# Executar todos os testes de cache
npm run test -- src/test/cacheService.test.ts src/test/cacheIntegration.test.ts

# Resultado esperado: 46 testes passando (30 unitários + 16 integração)
```

### Arquitetura do Cache

**Arquivos principais:**
```
src/
├── utils/
│   ├── cacheService.ts      # Serviço principal do cache
│   └── cacheTypes.ts         # Definições TypeScript
├── test/
│   ├── cacheService.test.ts     # 30 testes unitários
│   └── cacheIntegration.test.ts # 16 testes de integração
└── app/
    └── api/cache/route.ts    # Endpoint de invalidação
```

**Hooks modificados (com cache-aside pattern):**
- `app/experience/hooks/useExperience.ts`
- `app/projects/hooks/useProjects.ts`
- `app/education/hooks/useEducation.ts`
- `app/social-links/hooks/useSocialLinks.ts`

### Documentação Completa

- **Guia de desenvolvimento**: `CLAUDE.md` - Seção "Frontend Cache System"
- **Testes manuais**: `../specs/001-frontend-cache/MANUAL_TESTING_GUIDE.md`
- **Resumo técnico**: `../specs/001-frontend-cache/IMPLEMENTATION_SUMMARY.md`
- **Especificação**: `../specs/001-frontend-cache/spec.md`

### Compatibilidade

| Navegador | Versão | Status | Notas |
|-----------|--------|--------|-------|
| Chrome | Latest | ✅ | localStorage 5-10 MB |
| Firefox | Latest | ✅ | localStorage 5-10 MB |
| Safari | Latest | ✅ | Limpeza após 7 dias* |
| Edge | Latest | ✅ | localStorage 5-10 MB |

*Safari pode limpar localStorage após 7 dias. O sistema trata isso graciosamente com re-fetch automático.

### Troubleshooting

**Cache não está funcionando?**
1. Verifique se localStorage está habilitado no navegador
2. Abra o console (F12) e procure por logs de cache (✓ ou ✗)
3. Limpe o cache e tente novamente: `window.clearPortfolioCache()`
4. Verifique as estatísticas: `BrowserCache.getStats()`

**Dados desatualizados no cache?**
1. Limpe o cache manualmente: `window.clearPortfolioCache()`
2. Ou limpe apenas o recurso específico: `window.clearPortfolioCache('projects')`
3. O cache expira automaticamente após 30 dias

**Erro de quota (localStorage cheio)?**
- O sistema limpa automaticamente caches expirados e tenta novamente
- Manualmente: `BrowserCache.clearExpired()`
