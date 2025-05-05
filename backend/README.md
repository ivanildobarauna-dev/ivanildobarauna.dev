# ivanildobarauna.dev Backend

API de portfólio profissional que fornece dados para o site ivanildobarauna.dev, construída com arquitetura hexagonal, seguindo boas práticas de desenvolvimento e design de software.

![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.1.0+-green.svg)
![SQLAlchemy](https://img.shields.io/badge/sqlalchemy-2.0.0+-orange.svg)
![Coverage](https://img.shields.io/badge/test_coverage-90%25-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

![Tests](https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev/actions/workflows/tests.yml/badge.svg)
![Docker Deploy](https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev/actions/workflows/packages-deploy.yml/badge.svg)
![Release](https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev/actions/workflows/release.yml/badge.svg)

## Como executar com Docker

Este backend possui um `Dockerfile` próprio e pode ser executado isoladamente ou em conjunto com o frontend via `docker-compose` na raiz do projeto.

### Executando apenas o backend

```bash
docker build -t backend .
docker run -p 8090:8090 backend
```

### Executando com docker-compose (recomendado)

Na raiz do projeto:

```bash
docker-compose up --build
```

Isso irá subir tanto o backend quanto o frontend integrados.

## Arquitetura

Este projeto utiliza a **Arquitetura Hexagonal** (também conhecida como Ports and Adapters), que separa claramente o domínio da aplicação de suas dependências externas:

- **Domínio**: Contém DTOs e regras de negócio independentes da infraestrutura
- **Portas**: Interfaces que definem como a aplicação interage com o mundo externo
- **Adaptadores**: Implementações concretas das portas (SQLite, sistemas de arquivos)
- **Serviços**: Orquestram casos de uso utilizando os repositórios

```
┌─────────────────────────────────────────────────────────┐
│                    API (Flask + RESTX)                  │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                        Serviços                         │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                  Portas (Interfaces)                    │
└───┬───────────────────────┬────────────────────────┬────┘
    │                       │                        │
┌───▼──────────┐     ┌──────▼─────────┐     ┌───────▼───────┐
│  Adaptador   │     │   Adaptador    │     │   Adaptador   │
│   SQLite     │     │ Armazenamento  │     │    Outros     │
└──────────────┘     └────────────────┘     └───────────────┘
```

## Funcionalidades

- **API RESTful**: Endpoints para experiências profissionais, educação, projetos e redes sociais
- **Documentação Swagger**: Interface interativa para testar a API
- **Painel Administrativo**: Interface gráfica para gerenciar dados
- **Sistema de Logs**: Registro detalhado de eventos e erros
- **Migrações de Banco**: Versionamento do esquema do banco de dados

## Tecnologias

- **Backend**: Python 3.11+, Flask 3.1.0+
- **API**: Flask-RESTX para endpoints RESTful e documentação Swagger
- **ORM**: SQLAlchemy com padrão Repository para acesso a dados
- **Banco de Dados**: SQLite (desenvolvimento), PostgreSQL (produção)
- **Admin**: Flask-Admin com templates Bootstrap 4
- **Testes**: pytest com +90% de cobertura
- **Garantia de Qualidade**: 
  - Typing estático com mypy
  - Formatação com Black (88 caracteres)
  - Linting com Ruff
- **Deployment**: Docker, Gunicorn, NGINX

## Instalação

### Requisitos

- Python 3.11 ou superior
- Poetry para gerenciamento de dependências

### Configuração do Ambiente

```bash
# Clone o repositório
git clone https://github.com/ivanildobarauna-dev/api.ivanildobarauna.dev.git
cd api.ivanildobarauna.dev

# Instale as dependências
poetry install

# Ative o ambiente virtual
poetry shell
```

## Rodando o Projeto

### Desenvolvimento Local

```bash
# Executar a API em modo de desenvolvimento
python -m app
# ou
poetry run python -m app

# Modo de debug com Flask
poetry run flask --app app.__main__:app --debug run --port 8090
```

### Docker

```bash
# Construir a imagem
docker build -t api-portfolio .

# Executar o container
docker run -p 8090:8090 api-portfolio
```

## Estrutura do Projeto

```
├── app/                  # Ponto de entrada da aplicação
│   ├── __main__.py       # Inicialização da aplicação
│   ├── admin/            # Configuração do painel administrativo
│   └── templates/        # Templates HTML para o admin
├── assets/               # Arquivos JSON estáticos
├── docs/                 # Documentação Swagger
├── migrations/           # Migrações do banco de dados
├── src/                  # Código fonte principal
│   ├── domain/           # Camada de domínio (DTOs)
│   └── infrastructure/   # Implementação da infraestrutura
│       ├── adapters/     # Adaptadores concretos
│       ├── ports/        # Interfaces (portas)
│       ├── routes/       # Endpoints da API
│       ├── services/     # Lógica de negócio
│       └── utils/        # Utilitários
└── tests/                # Testes unitários e de integração
```

## API Endpoints

A API segue princípios RESTful e expõe os seguintes endpoints:

- `GET /api/v1/ping` - Verificação de saúde do serviço
- `GET /api/v1/experiences` - Experiências profissionais
- `GET /api/v1/education` - Formação acadêmica
- `GET /api/v1/projects` - Projetos do portfólio
- `GET /api/v1/social-media-links` - Links de redes sociais

A documentação completa da API está disponível em `/docs` após a inicialização do serviço.

## Painel Administrativo

O painel administrativo permite gerenciar todos os dados da API através de uma interface gráfica.

- Acesso: `/admin`
- Funcionalidades:
  - CRUD completo para todas as entidades
  - Visualização de modelos de dados
  - Customização de formulários

## Testes

```bash
# Executar todos os testes
pytest

# Executar testes específicos
pytest tests/path/to/test_file.py::test_name

# Verificar cobertura de testes
pytest --cov=src
```

## Comandos de Desenvolvimento

```bash
# Formatar o código
black .

# Verificar problemas de linting
ruff check .

# Verificar tipos
mypy .
```

## Padrões de Código

- **Imports**: Biblioteca padrão primeiro, depois terceiros, depois locais (agrupados e alfabetizados)
- **Formatação**: Black com limite de 88 caracteres por linha
- **Tipos**: Uso de type hints para parâmetros e retornos de funções
- **Docstrings**: Uso de triple quotes para módulos, classes e funções
- **Tratamento de Erros**: Blocos try/except explícitos com tipos específicos de exceção
- **Nomenclatura**: snake_case para funções/variáveis, PascalCase para classes, ALL_CAPS para constantes

## Contribuindo

Agradecemos seu interesse em contribuir para o projeto! Consulte nosso guia detalhado de contribuição:

[CONTRIBUTING.md](CONTRIBUTING.md)

Para uma visão rápida do processo:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Adicione sua implementação seguindo os padrões do projeto
4. Execute testes e linting
5. Faça commit das mudanças (`git commit -am 'feat: implementa nova funcionalidade'`)
6. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
7. Abra um Pull Request

## Segurança

Leia nossa política de segurança para entender como lidamos com vulnerabilidades e como reportá-las de forma responsável:

[SECURITY.md](SECURITY.md)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
