# 🚀 Testes de Carga com k6 e StatsD

Este diretório contém configurações e scripts para execução de testes de carga utilizando [k6](https://k6.io/) com saída para [StatsD](https://github.com/statsd/statsd).

## 📋 Pré-requisitos

- [Go](https://golang.org/doc/install) (para compilar o k6 com o plugin StatsD)
- [k6](https://k6.io/docs/getting-started/installation/) instalado
- Servidor StatsD rodando (padrão: `localhost:8125`)

## 🔧 Configuração

### 1. Construir k6 com suporte a StatsD

```bash
# Instalar xk6 (se ainda não tiver)
go install go.k6.io/xk6/cmd/xk6@latest

# Construir o k6 com o plugin StatsD
xk6 build --with github.com/LeonAdato/xk6-output-statsd@latest
```

### 2. Instalar o binário (opcional)

Para facilitar o uso, você pode instalar o binário personalizado:

```bash
# Mover para o diretório de binários
sudo mv k6 /usr/local/bin/k6-statsd

# Verificar a instalação
k6-statsd version
```

## 🚀 Executando os Testes

### Opção 1: Usando o binário local

```bash
./k6 run -o output-statsd normal_test.js
```

### Opção 2: Usando o binário instalado

```bash
k6-statsd run -o output-statsd normal_test.js
```

## ⚙️ Configuração do Teste

O arquivo `normal_test.js` contém um cenário de teste com as seguintes características:

- **Duração padrão**: 10 minutos
- **Ramp-up**: 30 segundos
- **Usuários virtuais**: 10
- **Think time**: Configurável via variável de ambiente

### Variáveis de Ambiente

| Variável  | Padrão | Descrição |
|-----------|--------|-----------|
| DURATION  | 10m    | Duração total do teste |
| RAMP_UP   | 30s    | Tempo de rampa inicial |
| THINK     | 0s     | Tempo de espera entre requisições |

### Métricas Coletadas

- Taxa de erros HTTP
- Tempo de resposta (p95 < 2s)
- Verificação de status 200
- Verificação de conteúdo HTML

## 📊 Visualização dos Resultados

Os resultados são enviados para um servidor StatsD em `localhost:8125`. Certifique-se de ter um coletor de métricas configurado para visualizar os resultados.