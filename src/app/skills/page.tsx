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
  credencialUrl: string;
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
    // Aqui você pode adicionar suas certificações
  ];

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

      {certificacoes.length > 0 && (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificacoes.map((certificacao, index) => (
              <motion.div
                key={`${certificacao.nome}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  {certificacao.logo && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                      <img
                        src={certificacao.logo}
                        alt={`Logo ${certificacao.instituicao}`}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">{certificacao.nome}</h3>
                    <p className="text-gray-600">{certificacao.instituicao}</p>
                  </div>
                </div>
                <a
                  href={certificacao.credencialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaCertificate className="w-4 h-4" />
                  <span>Ver Credencial</span>
                </a>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}