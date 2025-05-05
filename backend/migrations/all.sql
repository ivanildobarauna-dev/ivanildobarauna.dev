-- Script SQL para inserir redes sociais
INSERT INTO social_media (label, url, type, active)
VALUES
    ('GitHub', 'https://github.com/IvanildoBarauna', 'github', TRUE),
    ('LinkedIn', 'https://linkedin.com/in/ivanildobarauna', 'linkedin', TRUE),
    ('Stack Overflow', 'https://stackoverflow.com/users/24289987/ivanildo-barauna', 'stackoverflow', TRUE),
    ('Coursera', 'https://www.coursera.org/learner/ivanildobarauna', 'coursera', TRUE),
    ('Gravatar', 'https://gravatar.com/ivanildobarauna', 'gravatar', TRUE);

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

-- Script SQL para inserir formações acadêmicas
INSERT INTO formations (institution, type, course, period, description, logo, active)
VALUES
    ('Universidade Anhembi Morumbi', 'Graduação', 'BIG DATA & Inteligência Analítica', '2019 - 2021', 'Análise de dados através de BIG Data, entendimento de IOT e como administrar grandes volumes de dados pertinentes pela total integração entre dispositivos. Computação em Nuvem e de que forma podemos extrair a melhor utilização de dados em nuvem para grande capacidade de escalonamento. Linguagens de Programação para Data Science como Python e R.', '/images/instituicoes/uam.png', TRUE);


INSERT INTO companies (name, location, website, logo, active)
VALUES
  ('Mercado Livre', 'São Paulo, Brasil', 'https://www.mercadolivre.com.br', '/images/empresas/mercadolivre.png', TRUE),
  ('C6 Bank', 'São Paulo, Brasil', 'https://www.c6bank.com.br', '/images/empresas/c6bank.png', TRUE),
  ('Embracon Administradora de Consórcio Ltda', 'Santana de Parnaíba, São Paulo, Brasil', 'https://www.embracon.com.br', '/images/empresas/embracon.png', TRUE),
  ('Sitel Brasil | Foundever', 'São Paulo, Brasil', NULL, NULL, TRUE),
  ('Colégio e Curso Objetivo', 'São Paulo, Brasil', NULL, NULL, TRUE),
  ('Supermercados Rod & Raf', 'São Paulo e Região, Brasil', NULL, NULL, TRUE),
  ('Wave Internet', 'São Paulo, Brasil', NULL, NULL, TRUE),
  ('Horus Tech Informatica', 'São Paulo, Brasil', NULL, NULL, TRUE);

-- Script SQL para inserir experiências profissionais
INSERT INTO experiences (position, period, start_date, end_date, company_id, actual_job, description, skills, active)
VALUES
    ('Engenheiro de Dados Senior', 'outubro de 2023 - atual', '2023-10-01', NULL, 1, TRUE, 'Desenvolvimento de soluções de observabilidade de negócio entre microsserviços. Trabalho com tecnologias como Apache Beam, Google Cloud Platform, e Python', 'BigQuery;Python;Flask;Docker;Microservices;Observability', TRUE),
    ('Senior Data Analyst', 'setembro de 2023 - dezembro de 2023', '2023-09-01', '2023-12-01', 2, FALSE, 'Responsável por garantir a execução de pipelines e fornecimento de dados para Investimentos, Core Banking e outros assuntos de Corporate Banking. Desenvolvimento de processos de Data Quality. Suporte no desenvolvimento da plataforma de dados do banco', 'SQL;BigQuery;Python;Airflow;DataFlow;Looker Studio', TRUE),
    ('Data Analyst', 'janeiro de 2023 - setembro de 2023', '2023-01-01', '2023-09-01', 2, FALSE, 'Mapeamento, definição e planejamento de entrada/manutenção de pipelines de Dados no Data Lake. Estruturação e disponibilização de Data Marts e/ou Data Warehouses para as demais áreas do banco. Foco em otimização de custo e performance dos pipelines produtivos', 'SQL;BigQuery;Python;Airflow;DataFlow;Looker Studio', TRUE),
    ('Business Intelligence Analyst', 'fevereiro de 2022 - dezembro de 2022', '2022-02-01', '2022-12-01', 2, FALSE, 'Desenvolvimento de solução de ETL auto orquestrada para análise de grandes volumes de dados. Foco em redução de custo e criação de Data Mart para área de negócio. Implementação de processos automatizados de transformação de dados', 'SQL;BigQuery;Power BI;Looker Studio', TRUE),
    ('Analista de Business Intelligence', 'setembro de 2020 - fevereiro de 2022', '2020-09-01', '2022-02-01', 3, FALSE, 'Criação de indicadores de performance de negócio para suporte à tomada de decisão. Desenvolvimento de dashboards e relatórios para acompanhamento de resultados. Automatização de processos de ETL para carga de dados', 'SQL;Power BI;PL/SQL;MSSQL;SSIS;SSRS;Pentaho Data Integration', TRUE),
    ('Analista de Aplicações Digitais PL', 'dezembro de 2019 - setembro de 2020', '2019-12-01', '2020-09-01', 3, FALSE, 'Construção de Indicadores para tomada de decisão estratégica. Desenvolvimento de análises descritivas e preditivas. Suporte à decisão através de análise de dados', 'SQL;MSSQL', TRUE),
    ('Analista de Aplicações Digitais Jr', 'março de 2019 - dezembro de 2019', '2019-03-01', '2019-12-01', 3, FALSE, 'Construção de Indicadores para tomada de decisão estratégica. Foco em análise de dados para área comercial. Desenvolvimento de relatórios e dashboards', 'Excel;Power BI;VBA;DAX;M Language', TRUE),
    ('Analista de MIS', 'março de 2015 - abril de 2017', '2015-03-01', '2017-04-01', 4, FALSE, 'Desenvolvimento de Relatórios em MS-Excel com base nos dados do Salesforce. Automatização de processos manuais com VBA. Desenvolvimento de Dashboards com MS-Excel', 'Excel;VBA', TRUE),
    ('Professor de música', 'junho de 2014 - dezembro de 2014', '2014-06-01', '2014-12-01', 5, FALSE, 'Filial: ESCOLA DE INTEGRACAO E APRENDIZAGEM CRESCER LTDA. Atribuição: Ensino de teoria musical focada em ensino infantil', 'Ensino de teoria musical para crianças', TRUE),
    ('Técnico de suporte em TI', 'janeiro de 2013 - julho de 2013', '2013-01-01', '2013-07-01', 6, FALSE, 'Manutenção de Computadores. CFTV. Cabeamento estruturado de Redes. Manutenção supervisionada de servidores on premise', 'Linux;Redes;Oracle;PABX;Infraestrutura', TRUE),
    ('Técnico de suporte de redes', 'junho de 2012 - dezembro de 2012', '2012-06-01', '2012-12-01', 7, FALSE, 'Manutenção interna e externa de rádios transmissores e receptores de internet. Acompanhamento de saúde do ambiente com Microtik Router. Apoio na instalação de sistemas operacionais nos servidores centrais', 'Redes;Linux;Microtik;Ubiquiti Routers', TRUE),
    ('Jovem aprendiz', 'fevereiro de 2012 - abril de 2012', '2012-02-01', '2012-04-01', 8, FALSE, 'Suporte e manutenção de computadores', 'Windows;Redes;MacOS;Linux;Hardware', TRUE),
    ('Analista Administrativo', 'dezembro de 2018 - março de 2019', '2018-12-01', '2019-03-01', 3, FALSE, 'Desenvolvimento de relatórios no Excel usando ferramentas de SSBI (Power Query, Power Pivot e Power View). Automatização de tarefas manuais usando programação VBA', 'Excel;Power BI;VBA;SQL;Power Query;Power Pivot;Power View', TRUE);

-- Script SQL para inserir certificações
INSERT INTO certifications (name, institution, credential_url, logo, active)
VALUES
    ('Programa de cursos integrados: Data Engineer, Big Data and ML on Google Cloud em Português', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Smart Analytics, Machine Learning, and AI on GCP', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('BigQuery: Qwik Start - Command Line', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Building Resilient Streaming Systems on GCP', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Cloud Composer: Qwik Start - Console', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Google Cloud Fundamentals: Core Infrastructure', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Working with JSON, Arrays, and Structs in BigQuery', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Building Batch Data Pipelines on GCP', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Modernizing Data Lakes and Data Warehouses with GCP', 'Google Cloud Training Online', 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636', '/images/certificacoes/google-cloud-training.png', TRUE),
    ('Amazon AWS - EC2/S3', 'Udemy', 'https://www.udemy.com/certificate/UC-85c95c88-83d3-420b-a66e-c820a4ca6b6f/', '/images/certificacoes/udemy.png', TRUE),
    ('Business Intelligence SQL - ETL Integration Services', 'Udemy', 'https://www.udemy.com/certificate/UC-9c23fff6-e1e5-4f62-97c5-950126ea2a2a/', '/images/certificacoes/udemy.png', TRUE),
    ('Pentaho: Estratégias para Soluções de ETL', 'Udemy', 'https://www.udemy.com/certificate/UC-0560a788-16dc-4737-9afc-4b216921501d/', '/images/certificacoes/udemy.png', TRUE),
    ('PowerBI DataFlows', 'Planilheiros', 'https://www.planilheiros.com.br/certificado/f995cc7618f021e464cf7c0', '/images/certificacoes/planilheiros.png', TRUE),
    ('Microsoft Power BI Módulo I', 'DATAB', 'https://www.datab.com.br/certificado/JYVUIX', '/images/certificacoes/datab.png', TRUE),
    ('Microsoft Power BI Módulo II - Avançado', 'DATAB', 'https://www.datab.com.br/certificado/YSQQIC', '/images/certificacoes/datab.png', TRUE),
    ('Linux Essentials', '4Linux', 'https://4linux.com.br/certificado/4LL45000018148', '/images/certificacoes/4linux.png', TRUE),
    ('Montagem e Manutenção de Computadores e Redes', 'Microlins', NULL, '/images/certificacoes/microlins.png', TRUE),
    ('VIP: Windows, Internet, Word, Excel, Power Point', 'Microlins', NULL, '/images/certificacoes/microlins.png', TRUE);

CREATE VIEW "VW_EDUCATION" AS
SELECT
    position,
    company,
    location,
    website,
    logo,
    description,
    skills,
  CASE
    WHEN total_months < 12 THEN
      total_months || ' meses'
    WHEN total_months % 12 = 0 THEN
      (total_months / 12) || ' anos'
    ELSE
      (total_months / 12) || ' anos e ' || (total_months % 12) || ' meses'
  END AS duration

FROM (
  SELECT
    position,
    c.name as company,
    c.location as location,
    c.website as website,
    c.logo as logo,
    description,
    skills,
    (CAST(strftime('%Y', IFNULL(end_date, DATE('now')) ) AS INTEGER) - CAST(strftime('%Y', start_date) AS INTEGER)) * 12 +
    (CAST(strftime('%m', IFNULL(end_date, DATE('now'))) AS INTEGER) - CAST(strftime('%m', start_date) AS INTEGER)) AS total_months
  FROM experiences
  inner join main.companies c on c.id = experiences.company_id
);

CREATE VIEW 'VW_COMPANIES_DURATION' AS
SELECT
    name,
    CASE
        WHEN total_months < 12 THEN
      total_months || ' meses'
        WHEN total_months % 12 = 0 THEN
      (total_months / 12) || ' anos'
        ELSE
      (total_months / 12) || ' anos e ' || (total_months % 12) || ' meses'
    END AS duration
FROM (
    SELECT
        name,
        (
            CAST(strftime('%Y', IFNULL(LastExperience, DATE('now'))) AS INTEGER) -
            CAST(strftime('%Y', FirstExperience) AS INTEGER)
        ) * 12 +
        (
            CAST(strftime('%m', IFNULL(LastExperience, DATE('now'))) AS INTEGER) -
            CAST(strftime('%m', FirstExperience) AS INTEGER)
        ) AS total_months
    FROM (
        SELECT
            c.name,
            MIN(e.start_date) AS FirstExperience,
            MAX(IFNULL(e.end_date, DATE('now'))) AS LastExperience
        FROM companies c
        INNER JOIN main.experiences e ON c.id = e.company_id
        GROUP BY c.name
    )
);
