# 🧪 Testing the Data-Driven Brutalism Redesign

## Como Visualizar o Redesign

### Opção 1: Local Development

```bash
cd frontend

# Install dependencies (se necessário)
npm install

# Run development server
PORT=3000 NEXT_PUBLIC_BACKEND_URL=http://localhost:8090 npm run dev --turbo
```

Acesse: `http://localhost:3000`

### Opção 2: Docker Compose (Full Stack)

```bash
# Na raiz do projeto
docker-compose up --build

# Frontend: http://localhost:3000
# Backend: http://localhost:8090
```

### Opção 3: Production Build

```bash
cd frontend

npm run build
npm start

# Acesse: http://localhost:3000
```

---

## O Que Observar

### 1. **Hero Section** ✨
- [ ] Partículas cyan flutuando (animação suave)
- [ ] Nome com gradient cyan→magenta
- [ ] Frame do terminal (close buttons red/yellow/cyan)
- [ ] Botões com glow effect cyan
- [ ] Imagem em grayscale→color no hover

### 2. **Experience Section** 📊
- [ ] Linha timeline vertical conectando cards
- [ ] Cards com border esquerdo cyan
- [ ] Ponto indicador branco/cyan na esquerda
- [ ] Nomes de empresas com `$ Empresa` syntax
- [ ] Skills com prefixo `#` (hashtag)
- [ ] Data e localização em cores: cyan (data) e magenta (local)

### 3. **Projects Section** 🚀
- [ ] Featured project com border esquerdo cyan
- [ ] Cards normais com border topo magenta
- [ ] Data-point (ponto pulsando) no center dos placeholders
- [ ] Hover effect: glow e border mais visível
- [ ] Botões uppercase: `CÓDIGO`, `DEMO`, `GIT`
- [ ] Tags com prefixo `#`

### 4. **Education Section** 🎓
- [ ] Linha timeline vertical (gradient cyan→magenta)
- [ ] Timeline dots em cada card
- [ ] Formações com border esquerdo cyan
- [ ] Certificações com border topo magenta
- [ ] Icons com background colorido
- [ ] Monospace syntax nos subtítulos

### 5. **Global Effects**
- [ ] Dark background (#0f0f0f) - muito escuro
- [ ] Alto contraste geral
- [ ] Transições smooth (não abruptas)
- [ ] Responsivo em mobile/tablet/desktop

---

## Colors Visual Check

```
Background:     #0f0f0f (muito escuro)
Text Primary:   #f2f2f2 (branco)
Text Secondary: #e0e0e0 (cinza claro)

Primary Accent (Cyan):     #00d4ff
  - Borders, glow effects, primary CTAs
  - Box-shadow: 0 0 20px rgba(0, 212, 255, 0.3)

Secondary Accent (Magenta): #ff006e
  - Alternative borders, secondary elements
  - Box-shadow: 0 0 20px rgba(255, 0, 110, 0.3)

Text/Icons:
  - Cyan (#00d4ff) - primary actions
  - Magenta (#ff006e) - secondary info
  - Gray (#999999) - tertiary text
```

---

## Typography Check

### Headings
- [ ] JetBrains Mono (monospace)
- [ ] Bold/Black weight
- [ ] Tamanho large (48px+)
- [ ] Prefix symbols: `$`, `>`, `#`

### Body Text
- [ ] Sans-serif (Inter fallback)
- [ ] Medium/Regular weight
- [ ] Tamanho 16px+
- [ ] Line-height 1.5+

### Code/Terminal
- [ ] Monospace everywhere
- [ ] Uppercase em CTAs
- [ ] Prefixes naturais

---

## Animation Checks

### On Page Load
- [ ] Hero particles floating smoothly
- [ ] Content fading in (fade-in class)
- [ ] Cards sliding up (slide-up class)

### On Hover
- [ ] Cards lift up (translateY -4px)
- [ ] Buttons glow intensify
- [ ] Underlines appear (gradient)
- [ ] Data-points pulse

### On Scroll
- [ ] Cards animate in view
- [ ] Timeline dots appear
- [ ] Smooth scroll behavior

---

## Responsive Design Check

### Desktop (1024px+)
- [ ] 3-column grid para projetos
- [ ] 2-column para educação
- [ ] Timeline line visível
- [ ] Terminal frame full size

### Tablet (768px-1024px)
- [ ] 2-column grid para projetos
- [ ] Cards legíveis
- [ ] Layout adapta bem
- [ ] Timeline ainda funciona

### Mobile (320px-768px)
- [ ] 1-column stack
- [ ] Texto legível sem zoom
- [ ] Buttons acessíveis (tap targets)
- [ ] Terminal frame responsivo
- [ ] Timeline simplificada

---

## Performance Check

```bash
# Lighthouse score
npm run build

# Esperado:
# Performance: >90
# Accessibility: >95
# Best Practices: >95
# SEO: >95
```

---

## Browser Compatibility

- [x] Chrome 90+
- [x] Firefox 88+
- [x] Safari 14+
- [x] Edge 90+
- [x] Mobile Safari (iOS 14+)

---

## Visual Comparison Tool

Para comparar com o design anterior, use:

```bash
# Ver git diff
git diff HEAD~1 frontend/src/components/

# Ver colors específicas
grep -n "cyan\|magenta\|glow" frontend/src/app/globals.css
```

---

## Common Issues & Solutions

### Problema: Cores não aparecem vibrantes
**Solução**: Verificar modo escuro está ativado. O design é dark-first.

### Problema: Animações travando
**Solução**: Desabilitar extensões de browser, limpar cache
```bash
npm run build  # Rebuild
npm start      # Test production
```

### Problema: Terminal frame não aparece
**Solução**: Verificar se tailwind está compilando custom classes

### Problema: Timeline line não aparece
**Solução**: Verificar viewport width (desktop only)

---

## Feedback Checklist

Após testar, verifique:

- [ ] Gosto do novo aesthetic?
- [ ] Cores são legíveis?
- [ ] Animações são suaves?
- [ ] Design reflete minha personalidade (Data Engineer)?
- [ ] Mobile experience é boa?
- [ ] Performance é aceitável?

---

## Próximas Customizações (Opcional)

Se quiser ajustar:

1. **Mudar cores**: Edit `--primary` e `--secondary` em `globals.css`
2. **Ajustar tamanho de fonte**: Edit Tailwind config
3. **Adicionar mais animações**: Add `@keyframes` em `globals.css`
4. **Customizar componentes**: Edit component files diretamente

---

**Status**: 🚀 Pronto para produção!
