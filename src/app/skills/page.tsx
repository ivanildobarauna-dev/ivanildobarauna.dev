'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaBook, FaCertificate } from 'react-icons/fa';

interface Formacao {
  instituicao: string;
  tipo: string;
  curso: string;
  periodo: string;
  atividades: string;
  assuntosAbordados: string[];
  logo?: string;
  website?: string;
}

interface Certificacao {
  nome: string;
  instituicao: string;
  credencialUrl?: string;
  logo?: string;
}

export default function Skills() {
  const formacoes: Formacao[] = [
    {
      instituicao: 'Universidade Anhembi Morumbi',
      tipo: 'Graduação',
      curso: 'BIG DATA & Inteligência Analítica',
      periodo: '2019 - 2021',
      atividades: 'Análise de dados, identificação de padrões para ETL, IA e Machine Learning.',
      assuntosAbordados: [
        'Análise de dados através de BIG Data, entendimento de IOT e como administrar grandes volumes de dados pertinentes pela total integração entre dispositivos.',
        'Computação em Nuvem e de que forma podemos extrair a melhor utilização de dados em nuvem para grande capacidade de escalonamento.',
        'Linguagens de Programação para Data Science como Python e R.'
      ],
      logo: '/images/instituicoes/uam.png',
      website: 'https://portal.anhembi.br/'
    }
  ];

  const certificacoes: Certificacao[] = [
    {
      nome: 'Programa de cursos integrados: Data Engineer, Big Data and ML on Google Cloud em Português',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Smart Analytics, Machine Learning, and AI on GCP',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'BigQuery: Qwik Start - Command Line',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Building Resilient Streaming Systems on GCP',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Cloud Composer: Qwik Start - Console',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Google Cloud Fundamentals: Core Infrastructure',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Working with JSON, Arrays, and Structs in BigQuery',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Building Batch Data Pipelines on GCP',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Modernizing Data Lakes and Data Warehouses with GCP',
      instituicao: 'Google Cloud Training Online',
      credencialUrl: 'https://www.cloudskillsboost.google/public_profiles/107aa737-d207-4a7e-a36d-5c4b7571f26b/badges/2516636',
      logo: '/images/certificacoes/google-cloud-training.png'
    },
    {
      nome: 'Amazon AWS - EC2/S3',
      instituicao: 'Udemy',
      credencialUrl: 'https://www.udemy.com/certificate/UC-85c95c88-83d3-420b-a66e-c820a4ca6b6f/',
      logo: '/images/certificacoes/udemy.png'
    },
    {
      nome: 'Business Intelligence SQL - ETL Integration Services',
      instituicao: 'Udemy',
      credencialUrl: 'https://www.udemy.com/certificate/UC-9c23fff6-e1e5-4f62-97c5-950126ea2a2a/',
      logo: '/images/certificacoes/udemy.png'
    },
    {
      nome: 'Pentaho: Estratégias para Soluções de ETL',
      instituicao: 'Udemy',
      credencialUrl: 'https://www.udemy.com/certificate/UC-0560a788-16dc-4737-9afc-4b216921501d/',
      logo: '/images/certificacoes/udemy.png'
    },
    {
      nome: 'PowerBI DataFlows',
      instituicao: 'Planilheiros',
      credencialUrl: 'https://www.planilheiros.com.br/certificado/f995cc7618f021e464cf7c0',
      logo: '/images/certificacoes/planilheiros.png'
    },
    {
      nome: 'Microsoft Power BI Módulo I',
      instituicao: 'DATAB',
      credencialUrl: 'https://www.datab.com.br/certificado/JYVUIX',
      logo: '/images/certificacoes/datab.png'
    },
    {
      nome: 'Microsoft Power BI Módulo II - Avançado',
      instituicao: 'DATAB',
      credencialUrl: 'https://www.datab.com.br/certificado/YSQQIC',
      logo: '/images/certificacoes/datab.png'
    },
    {
      nome: 'Linux Essentials',
      instituicao: '4Linux',
      credencialUrl: 'https://4linux.com.br/certificado/4LL45000018148',
      logo: '/images/certificacoes/4linux.png'
    },
    {
      nome: 'Montagem e Manutenção de Computadores e Redes',
      instituicao: 'Microlins',
      logo: '/images/certificacoes/microlins.png'
    },
    {
      nome: 'VIP: Windows, Internet, Word, Excel, Power Point',
      instituicao: 'Microlins',
      logo: '/images/certificacoes/microlins.png'
    }
  ];

  // Agrupar certificações por instituição
  const certificacoesPorInstituicao = certificacoes.reduce((acc, cert) => {
    if (!acc[cert.instituicao]) {
      acc[cert.instituicao] = [];
    }
    acc[cert.instituicao].push(cert);
    return acc;
  }, {} as Record<string, Certificacao[]>);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Formação Acadêmica</h1>
        <p className="text-gray-600 mb-4">
          Minha jornada acadêmica e qualificações que fundamentam minha expertise profissional.
        </p>
      </motion.div>

      <div className="space-y-6">
        {formacoes.map((formacao, index) => (
          <motion.div
            key={formacao.instituicao}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {formacao.logo && (
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={formacao.logo}
                        alt={`Logo ${formacao.instituicao}`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{formacao.instituicao}</h2>
                    <div className="flex items-center gap-2 text-blue-100">
                      <FaGraduationCap className="w-4 h-4" />
                      <span>{formacao.tipo}</span>
                    </div>
                  </div>
                </div>
                {formacao.website && (
                  <a
                    href={formacao.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaBook className="w-5 h-5" />
                  <h3 className="text-xl font-bold">{formacao.curso}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{formacao.periodo}</span>
                </div>
                <p className="text-gray-700">{formacao.atividades}</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">Assuntos Abordados:</h4>
                <ul className="space-y-2">
                  {formacao.assuntosAbordados.map((assunto, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{assunto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {Object.entries(certificacoesPorInstituicao).length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg mt-8"
          >
            <h2 className="text-4xl font-bold mb-4 text-blue-600">Certificações</h2>
            <p className="text-gray-600 mb-4">
              Certificações e cursos especializados que complementam minha formação.
            </p>
          </motion.div>

          <div className="space-y-8">
            {Object.entries(certificacoesPorInstituicao).map(([instituicao, certs], index) => (
              <motion.div
                key={instituicao}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-blue-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {certs[0].logo && (
                        <div className="w-12 h-12 bg-white rounded-lg p-2 flex items-center justify-center">
                          <img
                            src={certs[0].logo}
                            alt={`Logo ${instituicao}`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold">{instituicao}</h2>
                        <p className="text-blue-100 text-sm">
                          {certs.length} {certs.length === 1 ? 'certificação' : 'certificações'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certs.map((certificacao, certIndex) => (
                      <motion.div
                        key={`${certificacao.nome}-${certIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (certIndex * 0.05) }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-bold text-blue-600 mb-2">{certificacao.nome}</h3>
                        {certificacao.credencialUrl && (
                          <a
                            href={certificacao.credencialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                          >
                            <FaCertificate className="w-4 h-4" />
                            <span>Ver Credencial</span>
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}