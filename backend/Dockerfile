FROM python:3.11-slim

# Instala dependências do sistema
RUN apt-get update && apt-get install -y build-essential curl && rm -rf /var/lib/apt/lists/*

# Instala Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

WORKDIR /app

# Copia arquivos de dependências
COPY pyproject.toml poetry.lock ./

# Instala dependências
RUN poetry config virtualenvs.create false && poetry install --no-root --no-interaction --no-ansi --only main

# Copia o restante do código
COPY . .

EXPOSE 8090

CMD ["ddtrace-run" ,"gunicorn", "-b", "0.0.0.0:8090", "--workers=2", "--threads=2", "app.__main__:app"]