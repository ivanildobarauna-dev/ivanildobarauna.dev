-- Script SQL para inserir projetos
INSERT INTO projects (title, description, url, tags, active)
VALUES
    ('apibrasil-py', 'SDK desenvolvido para simplificar e agilizar a integração com a plataforma APIBrasil.', 'https://github.com/ivanildobarauna-dev/apibrasil-py', '["Python", "API Integration", "SDK", "OpenSource"]', TRUE),
    
    ('data-pipeline-sync-ingest', 'Solução completa para ETL de dados de cotações de moedas, utilizando técnicas avançadas e arquiteturas modernas.', 'https://github.com/ivanildobarauna-dev/data-pipeline-sync-ingest', '["Python", "ETL", "Data Pipeline"]', TRUE),
    
    ('data-pipeline-async-ingest', 'Pipeline para processamento e consumo de dados em streaming do Pub/Sub, integrando com Dataflow.', 'https://github.com/ivanildobarauna-dev/data-pipeline-async-ingest', '["Python", "Pub/Sub", "Dataflow"]', TRUE),
    
    ('api-to-dataframe', 'Python library that simplifies obtaining data from API endpoints by converting them directly into Pandas DataFrames. This library offers robust features, including retry strategies for failed requests.', 'https://github.com/ivanildobarauna-dev/api-to-dataframe', '["Python", "SDK", "OpenSource"]', TRUE),
    
    ('currency-quote', 'Complete solution for extracting currency pair quotes data with comprehensive testing, parameter validation, flexible configuration management, Hexagonal Architecture, CI/CD pipelines, code quality tools, and detailed documentation.', 'https://github.com/ivanildobarauna-dev/currency-quote', '["Python", "Hexagonal Architecture", "CI/CD", "Code Quality", "OpenSource"]', TRUE),
    
    ('open-o11y-wrapper', 'OpenTelemetry Wrapper to send traces, metrics and logs to my otel-proxy using OTLP Protocol', 'https://github.com/ivanildobarauna-dev/open-o11y-wrapper', '["Python", "Hexagonal Architecture", "OpenTelemetry", "OpenSource"]', TRUE),
    
    ('data-producer-api', 'FastAPI application for sending data to Pub/Sub, used for load testing and triggering pipelines', 'https://github.com/ivanildobarauna-dev/data-producer-api', '["Python", "Hexagonal Architecture", "FastAPI", "OpenSource", "CI/CD"]', TRUE);