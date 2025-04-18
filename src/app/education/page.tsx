'use client';

import { motion } from 'framer-motion';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaBook, FaCertificate } from 'react-icons/fa';
import { useState, useEffect } from 'react';

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

export default function Education() {
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "10.128.0.6:8080/api/v1";

        const response = await fetch(`${backendUrl}/education`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          console.error(`Erro na requisição: Status ${response.status}`);
          const responseText = await response.text();
          console.error('Resposta do servidor:', responseText);
          throw new Error(`Falha ao carregar os dados de educação. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.formations || !data.certifications || !Array.isArray(data.formations) || !Array.isArray(data.certifications)) {
          throw new Error('Resposta inválida: os dados não estão no formato esperado');
        }
        
        setFormacoes(data.formations);
        setCertificacoes(data.certifications);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar os dados de educação');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Erro ao carregar dados de educação: {error}</p>
      </div>
    );
  }

  // Agrupar certificações por instituição
  const certificacoesPorInstituicao = certificacoes.reduce((acc, cert) => {
    if (!acc[cert.instituicao]) {
      acc[cert.instituicao] = [];
    }
    acc[cert.instituicao].push(cert);
    return acc;
  }, {} as Record<string, Certificacao[]>);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
      >
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-blue-600">Formação Acadêmica</h1>
        <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
          Minha jornada acadêmica e qualificações que fundamentam minha expertise profissional.
        </p>
      </motion.div>

      <div className="space-y-4 md:space-y-6">
        {formacoes.map((formacao, index) => (
          <motion.div
            key={formacao.instituicao}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 p-4 md:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4">
                  {formacao.logo && (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center">
                      <img
                        src={formacao.logo}
                        alt={`Logo ${formacao.instituicao}`}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{formacao.instituicao}</h2>
                    <div className="flex items-center gap-2 text-blue-100 text-sm md:text-base">
                      <FaGraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{formacao.tipo}</span>
                    </div>
                  </div>
                </div>
                {formacao.website && (
                  <a
                    href={formacao.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors text-sm md:text-base"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaBook className="w-4 h-4 md:w-5 md:h-5" />
                  <h3 className="text-lg md:text-xl font-bold">{formacao.curso}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  <FaCalendarAlt className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{formacao.periodo}</span>
                </div>
                <p className="text-sm md:text-base text-gray-700">{formacao.atividades}</p>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-semibold text-blue-600 mb-2 md:mb-3">Assuntos Abordados:</h4>
                <ul className="space-y-1 md:space-y-2">
                  {formacao.assuntosAbordados.map((assunto, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
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
            className="bg-white rounded-2xl p-4 md:p-6 shadow-lg mt-6 md:mt-8"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-blue-600">Certificações</h2>
            <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">
              Certificações e cursos especializados que complementam minha formação.
            </p>
          </motion.div>

          <div className="space-y-4 md:space-y-8">
            {Object.entries(certificacoesPorInstituicao).map(([instituicao, certs], index) => (
              <motion.div
                key={instituicao}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-blue-600 p-3 md:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      {certs[0].logo && (
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center">
                          <img
                            src={certs[0].logo}
                            alt={`Logo ${instituicao}`}
                            className="w-6 h-6 md:w-8 md:h-8 object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg md:text-xl font-bold">{instituicao}</h2>
                        <p className="text-blue-100 text-xs md:text-sm">
                          {certs.length} {certs.length === 1 ? 'certificação' : 'certificações'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    {certs.map((certificacao, certIndex) => (
                      <motion.div
                        key={`${certificacao.nome}-${certIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (certIndex * 0.05) }}
                        className="bg-gray-50 rounded-lg p-3 md:p-4"
                      >
                        <h3 className="text-base md:text-lg font-bold text-blue-600 mb-2">{certificacao.nome}</h3>
                        {certificacao.credencialUrl && (
                          <a
                            href={certificacao.credencialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 transition-colors text-xs md:text-sm"
                          >
                            <FaCertificate className="w-3 h-3 md:w-4 md:h-4" />
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