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
