'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Experience {
  position: string;
  company: string;
  period: string;
  location: string;
  activities: string[];
  website?: string;
  logo?: string;
  currentJob?: boolean;
  skills?: string[];
}

interface DuracaoTotal {
  anos: number;
  meses: number;
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        const response = await fetch(`${backendUrl}/experiences`, {
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
          throw new Error(`Falha ao carregar as experiências. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Resposta inválida: os dados não são um array');
        }
        
        setExperiences(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar as experiências');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
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
        <p>Erro ao carregar experiências: {error}</p>
      </div>
    );
  }

  // Função para calcular a duração total em uma empresa
  const calcularDuracaoTotal = (experiences: Experience[]): DuracaoTotal => {
    let duracaoTotal: DuracaoTotal = {anos: 0, meses: 0};
    
    experiences.forEach((exp: Experience) => {
      const periodos = exp.period.split(' - ');
      const inicio = new Date(periodos[0].replace('março', 'March')
        .replace('abril', 'April')
        .replace('maio', 'May')
        .replace('junho', 'June')
        .replace('julho', 'July')
        .replace('agosto', 'August')
        .replace('setembro', 'September')
        .replace('outubro', 'October')
        .replace('novembro', 'November')
        .replace('dezembro', 'December')
        .replace('janeiro', 'January')
        .replace('fevereiro', 'February'));
      
      const fim = periodos[1] === 'atual' 
        ? new Date() 
        : new Date(periodos[1].replace('março', 'March')
            .replace('abril', 'April')
            .replace('maio', 'May')
            .replace('junho', 'June')
            .replace('julho', 'July')
            .replace('agosto', 'August')
            .replace('setembro', 'September')
            .replace('outubro', 'October')
            .replace('novembro', 'November')
            .replace('dezembro', 'December')
            .replace('janeiro', 'January')
            .replace('fevereiro', 'February'));

      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
      
      duracaoTotal.anos += Math.floor(diffMonths / 12);
      duracaoTotal.meses += diffMonths % 12;
    });

    // Ajustar meses excedentes
    if (duracaoTotal.meses >= 12) {
      duracaoTotal.anos += Math.floor(duracaoTotal.meses / 12);
      duracaoTotal.meses = duracaoTotal.meses % 12;
    }

    return duracaoTotal;
  };

  // Calcular tempo total de todas as experiências
  const calcularTempoTotalCarreira = (experiences: Experience[]): string => {
    const duracaoTotal = calcularDuracaoTotal(experiences);
    if (duracaoTotal.anos > 0) {
      return `${duracaoTotal.anos} ${duracaoTotal.anos === 1 ? 'ano' : 'anos'}`;
    }
    return `${duracaoTotal.meses} ${duracaoTotal.meses === 1 ? 'mês' : 'meses'}`;
  };

  // Agrupar experiências por empresa
  const experienciasPorEmpresa: Record<string, Experience[]> = experiences.reduce((acc: Record<string, Experience[]>, exp: Experience) => {
    if (!acc[exp.company]) {
      acc[exp.company] = [];
    }
    acc[exp.company].push(exp);
    return acc;
  }, {});

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-blue-600"
      >
        Experiência Profissional - {calcularTempoTotalCarreira(experiences)}
      </motion.h1>

      <div className="space-y-8 md:space-y-12">
        {Object.entries(experienciasPorEmpresa).map(([empresa, exps], empresaIndex) => {
          const duracao = calcularDuracaoTotal(exps);
          const duracaoTexto = `${duracao.anos > 0 ? duracao.anos + (duracao.anos === 1 ? ' ano' : ' anos') : ''}${
            duracao.meses > 0 ? (duracao.anos > 0 ? ' e ' : '') + duracao.meses + (duracao.meses === 1 ? ' mês' : ' meses') : ''
          }${exps[0].currentJob ? ' (Emprego Atual)' : ''}`;

          return (
            <motion.section
              key={empresa}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: empresaIndex * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-blue-600 p-4 md:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    {exps[0].logo && (
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center">
                        <Image
                          src={exps[0].logo}
                          alt={`Logo ${empresa}`}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold break-words">{empresa}</h2>
                      <p className="text-blue-100 text-sm md:text-base">Tempo total: {duracaoTexto}</p>
                    </div>
                  </div>
                  {exps[0].website && (
                    <a
                      href={exps[0].website}
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
                {exps.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (empresaIndex * 0.2) + (index * 0.1) }}
                    className="border-l-4 border-blue-600 pl-3 md:pl-4"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2">{exp.position}</h3>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                      <span className="flex items-center">
                        <span className="mr-2">🗓️</span>
                        {exp.period}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-2">📍</span>
                        {exp.location}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
                      {exp.activities.map((atividade, idx) => (
                        <li key={idx}>{atividade}</li>
                      ))}
                    </ul>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="mt-3 md:mt-4">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Habilidades Técnicas:</h4>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {exp.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
} 