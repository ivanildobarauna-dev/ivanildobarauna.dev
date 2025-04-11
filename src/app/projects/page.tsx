'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function Projects() {
  const projects = [
    {
      title: 'apibrasil-py',
      description: 'SDK desenvolvido para simplificar e agilizar a integração com a plataforma APIBrasil.',
      tech: ['Python', 'API Integration', 'SDK', 'OpenSource'],
      github: 'https://github.com/ivanildobarauna-dev/apibrasil-py',
      live: null
    },
    {
      title: 'data-pipeline-sync-ingest',
      description: 'Solução completa para ETL de dados de cotações de moedas, utilizando técnicas avançadas e arquiteturas modernas.',
      tech: ['Python', 'ETL', 'Data Pipeline'],
      github: 'https://github.com/ivanildobarauna-dev/data-pipeline-sync-ingest',
      live: null
    },
    {
      title: 'data-pipeline-async-ingest',
      description: 'Pipeline para processamento e consumo de dados em streaming do Pub/Sub, integrando com Dataflow.',
      tech: ['Python', 'Pub/Sub', 'Dataflow'],
      github: 'https://github.com/ivanildobarauna-dev/data-pipeline-async-ingest',
      live: null
    },
    {
      title: 'api-to-dataframe',
      description: 'Python library that simplifies obtaining data from API endpoints by converting them directly into Pandas DataFrames. This library offers robust features, including retry strategies for failed requests.',
      tech: ['Python', 'SDK', 'OpenSource'],
      github: 'https://github.com/ivanildobarauna-dev/api-to-dataframe',
      live: null
    },
    {
      title: 'currency-quote',
      description: 'Complete solution for extracting currency pair quotes data with comprehensive testing, parameter validation, flexible configuration management, Hexagonal Architecture, CI/CD pipelines, code quality tools, and detailed documentation.',
      tech: ['Python', 'Hexagonal Architecture', 'CI/CD', 'Code Quality', 'OpenSource'],
      github: 'https://github.com/ivanildobarauna-dev/currency-quote',
      live: null
    },
    {
      title: 'open-o11y-wrapper',
      description: 'OpenTelemetry Wrapper to send traces, metrics and logs to my otel-proxy using OTLP Protocol',
      tech: ['Python', 'Hexagonal Architecture' ,'OpenTelemetry', 'OpenSource'],
      github: 'https://github.com/ivanildobarauna-dev/open-o11y-wrapper',
      live: null
    },
    {
      title: 'data-producer-api',
      description: 'FastAPI application for sending data to Pub/Sub, used for load testing and triggering pipelines',
      tech: ['Python', 'Hexagonal Architecture' ,'FastAPI', 'OpenSource', 'CI/CD'],
      github: 'https://github.com/ivanildobarauna-dev/data-producer-api',
      live: null
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Projetos Open Source</h1>
        <p className="text-gray-600 mb-4">
          Uma seleção dos meus projetos mais recentes e relevantes em engenharia de dados e desenvolvimento.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-xl font-bold">{project.title}</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaGithub className="w-5 h-5" />
                    <span>Ver Código</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    <span>Ver Demo</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Interessado em Colaborar?</h2>
        <p className="mb-6">
          Todos os projetos são open source e estão disponíveis no GitHub. Sinta-se à vontade para contribuir!
        </p>
        <a
          href="https://github.com/ivanildobarauna-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          <FaGithub className="w-5 h-5" />
          <span>Ver Mais Projetos</span>
        </a>
      </motion.div>
    </div>
  );
} 