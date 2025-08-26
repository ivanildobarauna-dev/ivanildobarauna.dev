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

## Observações

- O frontend espera que a variável de ambiente `NEXT_PUBLIC_BACKEND_URL` aponte para o backend (já configurado no docker-compose).
- O backend expõe a documentação Swagger em `/docs`.

---
