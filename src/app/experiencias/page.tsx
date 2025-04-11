'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
  localizacao: string;
  atividades: string[];
  website?: string;
  logo?: string;
  actualJob?: boolean;
  habilidades?: string[];
}

interface DuracaoTotal {
  anos: number;
  meses: number;
}

export default function Experiencias() {
  // Função para calcular a duração total em uma empresa
  const calcularDuracaoTotal = (experiencias: Experiencia[]): DuracaoTotal => {
    let duracaoTotal: DuracaoTotal = {anos: 0, meses: 0};
    
    experiencias.forEach((exp: Experiencia) => {
      const periodos = exp.periodo.split(' - ');
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

  const experiences: Experiencia[] = [
    {
      cargo: "Engenheiro de Dados Senior",
      empresa: "Mercado Livre",
      periodo: "outubro de 2023 - atual",
      localizacao: "São Paulo, Brasil",
      website: "https://www.mercadolivre.com.br",
      logo: "/images/empresas/mercadolivre.png",
      actualJob: true,
      habilidades: ['BigQuery', 'Python', 'Flask', 'Docker', 'Microservices', 'Observability'],
      atividades: [
        "Desenvolvimento de soluções de observabilidade de negócio entre microsserviços",
        "Trabalho com tecnologias como Apache Beam, Google Cloud Platform, e Python"
      ]
    },
    {
      cargo: "Senior Data Analyst",
      empresa: "C6 Bank",
      periodo: "setembro de 2023 - dezembro de 2023",
      localizacao: "São Paulo, Brasil",
      website: "https://www.c6bank.com.br",
      logo: "/images/empresas/c6bank.png",
      actualJob: false,
      habilidades: ['SQL', 'BigQuery', 'Python', 'Airflow', 'DataFlow', 'Looker Studio'],
      atividades: [
        "Responsável por garantir a execução de pipelines e fornecimento de dados para Investimentos, Core Banking e outros assuntos de Corporate Banking",
        "Desenvolvimento de processos de Data Quality",
        "Suporte no desenvolvimento da plataforma de dados do banco"
      ]
    },
    {
      cargo: "Data Analyst",
      empresa: "C6 Bank",
      periodo: "janeiro de 2023 - setembro de 2023",
      localizacao: "São Paulo, Brasil",
      website: "https://www.c6bank.com.br",
      logo: "/images/empresas/c6bank.png",
      actualJob: false,
      habilidades: ['SQL', 'BigQuery', 'Python', 'Airflow', 'DataFlow', 'Looker Studio'],
      atividades: [
        "Mapeamento, definição e planejamento de entrada/manutenção de pipelines de Dados no Data Lake",
        "Estruturação e disponibilização de Data Marts e/ou Data Warehouses para as demais áreas do banco",
        "Foco em otimização de custo e performance dos pipelines produtivos"
      ]
    },
    {
      cargo: "Business Intelligence Analyst",
      empresa: "C6 Bank",
      periodo: "fevereiro de 2022 - dezembro de 2022",
      localizacao: "São Paulo, Brasil",
      website: "https://www.c6bank.com.br",
      logo: "/images/empresas/c6bank.png",
      actualJob: false,
      habilidades: ['SQL', 'BigQuery', 'Power BI', 'Looker Studio'],
      atividades: [
        "Desenvolvimento de solução de ETL auto orquestrada para análise de grandes volumes de dados",
        "Foco em redução de custo e criação de Data Mart para área de negócio",
        "Implementação de processos automatizados de transformação de dados"
      ]
    },
    {
      cargo: "Analista de Business Intelligence",
      empresa: "Embracon Administradora de Consórcio Ltda",
      periodo: "setembro de 2020 - fevereiro de 2022",
      localizacao: "Santana de Parnaíba, São Paulo, Brasil",
      website: "https://www.embracon.com.br",
      logo: "/images/empresas/embracon.png",
      actualJob: false,
      habilidades: ['SQL', 'Power BI', 'PL/SQL', 'MSSQL', 'SSIS', 'SSRS', 'Pentaho Data Integration'],
      atividades: [
        "Criação de indicadores de performance de negócio para suporte à tomada de decisão",
        "Desenvolvimento de dashboards e relatórios para acompanhamento de resultados",
        "Automatização de processos de ETL para carga de dados"
      ]
    },
    {
      cargo: "Analista de Aplicações Digitais PL",
      empresa: "Embracon Administradora de Consórcio Ltda",
      periodo: "dezembro de 2019 - setembro de 2020",
      localizacao: "Santana de Parnaíba, São Paulo, Brasil",
      website: "https://www.embracon.com.br",
      logo: "/images/empresas/embracon.png",
      actualJob: false,
      habilidades: ['SQL', 'MSSQL'],
      atividades: [
        "Construção de Indicadores para tomada de decisão estratégica",
        "Desenvolvimento de análises descritivas e preditivas",
        "Suporte à decisão através de análise de dados"
      ]
    },
    {
      cargo: "Analista de Aplicações Digitais Jr",
      empresa: "Embracon Administradora de Consórcio Ltda",
      periodo: "março de 2019 - dezembro de 2019",
      localizacao: "Santana de Parnaíba, São Paulo, Brasil",
      website: "https://www.embracon.com.br",
      logo: "/images/empresas/embracon.png",
      actualJob: false,
      habilidades: ['Excel', 'Power BI', 'VBA', 'DAX', 'M Language'],
      atividades: [
        "Construção de Indicadores para tomada de decisão estratégica",
        "Foco em análise de dados para área comercial",
        "Desenvolvimento de relatórios e dashboards"
      ]
    },
    {
      cargo: "Analista de MIS",
      empresa: "Sitel Brasil | Foundever",
      periodo: "março de 2015 - abril de 2017",
      localizacao: "São Paulo, Brasil",
      habilidades: ['Excel', 'VBA'],
      atividades: [
        "Desenvolvimento de Relatórios em MS-Excel com base nos dados do Salesforce",
        "Automatização de processos manuais com VBA",
        "Desenvolvimento de Dashboards com MS-Excel"
      ]
    },
    {
      cargo: "Professor de música",
      empresa: "Colégio e Curso Objetivo",
      periodo: "junho de 2014 - dezembro de 2014",
      localizacao: "São Paulo, Brasil",
      atividades: [
        "Filial: ESCOLA DE INTEGRACAO E APRENDIZAGEM CRESCER LTDA",
        "Atribuição: Ensino de teoria musical focada em ensino infantil"
      ]
    },
    {
      cargo: "Técnico de suporte em TI",
      empresa: "Supermercados Rod & Raf",
      periodo: "janeiro de 2013 - julho de 2013",
      localizacao: "São Paulo e Região, Brasil",
      habilidades: ['Linux', 'Redes', 'Oracle', 'PABX', 'Infraestrutura'],
      atividades: [
        "Manutenção de Computadores",
        "CFTV",
        "Cabeamento estruturado de Redes",
        "Manutenção supervisionada de servidores on premise"
      ]
    },
    {
      cargo: "Técnico de suporte de redes",
      empresa: "Wave Internet",
      periodo: "junho de 2012 - dezembro de 2012",
      localizacao: "São Paulo, Brasil",
      habilidades: ['Redes', 'Linux', 'Microtik', 'Ubiquiti Routers'],
      atividades: [
        "Manutenção interna e externa de rádios transmissores e receptores de internet",
        "Acompanhamento de saúde do ambiente com Microtik Router",
        "Apoio na instalação de sistemas operacionais nos servidores centrais"
      ]
    },
    {
      cargo: "Jovem aprendiz",
      empresa: "Horus Tech Informatica",
      periodo: "fevereiro de 2012 - abril de 2012",
      localizacao: "São Paulo, Brasil",
      habilidades: ['Windows', 'Redes', 'MacOS', 'Linux', 'Hardware'],
      atividades: [
        "Suporte e manutenção de computadores"
      ]
    }
  ];

  // Calcular tempo total de todas as experiências
  const calcularTempoTotalCarreira = (experiences: Experiencia[]): string => {
    const duracaoTotal = calcularDuracaoTotal(experiences);
    if (duracaoTotal.anos > 0) {
      return `${duracaoTotal.anos} ${duracaoTotal.anos === 1 ? 'ano' : 'anos'}`;
    }
    return `${duracaoTotal.meses} ${duracaoTotal.meses === 1 ? 'mês' : 'meses'}`;
  };

  // Agrupar experiências por empresa
  const experienciasPorEmpresa: Record<string, Experiencia[]> = experiences.reduce((acc: Record<string, Experiencia[]>, exp: Experiencia) => {
    if (!acc[exp.empresa]) {
      acc[exp.empresa] = [];
    }
    acc[exp.empresa].push(exp);
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
          }${exps[0].actualJob ? ' (Emprego Atual)' : ''}`;

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
                    <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2">{exp.cargo}</h3>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                      <span className="flex items-center">
                        <span className="mr-2">🗓️</span>
                        {exp.periodo}
                      </span>
                      <span className="flex items-center">
                        <span className="mr-2">📍</span>
                        {exp.localizacao}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 md:space-y-2 text-gray-700 text-sm md:text-base">
                      {exp.atividades.map((atividade, idx) => (
                        <li key={idx}>{atividade}</li>
                      ))}
                    </ul>
                    {exp.habilidades && exp.habilidades.length > 0 && (
                      <div className="mt-3 md:mt-4">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-600 mb-2">Habilidades Técnicas:</h4>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {exp.habilidades.map((skill, idx) => (
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