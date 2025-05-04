# ivanildobarauna.dev

Este repositório contém o portfólio profissional de Ivanildo Barauna, composto por dois projetos principais:

- **Backend**: API RESTful desenvolvida em Python (Flask), responsável por fornecer dados dinâmicos para o frontend.
- **Frontend**: Aplicação Next.js que consome a API e exibe as informações do portfólio.

Ambos os projetos possuem Dockerfile próprio e podem ser executados de forma integrada via Docker Compose.

## Estrutura do repositório

```
├── backend/   # API Flask
├── frontend/  # Next.js
├── docker-compose.yaml
└── README.md  # Este arquivo
```

## Como executar tudo com Docker Compose

O modo mais simples de rodar todo o sistema é usando o `docker-compose` na raiz do projeto. Isso irá subir tanto o backend quanto o frontend já integrados.

```bash
docker-compose up --build
```

- O frontend estará disponível em: http://localhost:8080
- O backend estará disponível em: http://localhost:8090

## Instruções específicas

Consulte os READMEs de cada projeto para detalhes de desenvolvimento, arquitetura e execução individual:

- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)

## Observações

- O frontend espera que a variável de ambiente `NEXT_PUBLIC_BACKEND_URL` aponte para o backend (já configurado no docker-compose).
- O backend expõe a documentação Swagger em `/docs`.

---

Dúvidas ou sugestões? Abra uma issue ou consulte os arquivos de cada projeto para mais detalhes. 