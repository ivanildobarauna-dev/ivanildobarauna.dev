'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaPython, FaDatabase, FaChartBar, FaChartLine } from 'react-icons/fa';
import { SiFlask, SiApacheairflow, SiDocker, SiApache, SiGooglebigquery, SiGooglecloud, SiGooglepubsub } from 'react-icons/si';

export default function Home() {
  const skills = [
    { name: 'Python', icon: FaPython, color: '#3776AB' },
    { name: 'Flask', icon: SiFlask, color: '#000000' },
    { name: 'SQL', icon: FaDatabase, color: '#336791' },
    { name: 'Airflow', icon: SiApacheairflow, color: '#017CEE' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED' },
    { name: 'Apache Beam', icon: SiApache, color: '#D22128' },
    { name: 'BigQuery', icon: SiGooglebigquery, color: '#669DF6' },
    { name: 'Cloud Run', icon: SiGooglecloud, color: '#4285F4' },
    { name: 'Pub/Sub', icon: SiGooglepubsub, color: '#4285F4' },
    { name: 'Power BI', icon: FaChartBar, color: '#F2C811' },
    { name: 'Looker Studio', icon: FaChartLine, color: '#4285F4' }
  ];

  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white"
      >
        <h1 className="text-4xl font-bold mb-4">Ivanildo Barauna de Souza Junior</h1>
        <p className="text-lg opacity-90">
        Engenheiro de Dados Senior com experiência em desenvolvimento de soluções de dados end-to-end. Especializado em transformar dados em insights estratégicos para diferentes áreas de negócio, com foco atual em observabilidade de microsserviços e arquiteturas distribuídas.
        </p>

        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mt-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Habilidades Técnicas</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-blue-100/10 text-white rounded-full text-sm flex items-center gap-2 hover:bg-blue-100/20 transition-colors"
              >
                <skill.icon className="w-5 h-5" style={{ color: skill.color }} />
                {skill.name}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/experiencias" className="block group">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">10+</div>
                  <div className="text-sm opacity-80">Anos de Experiência</div>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </div>
          </Link>
          <Link href="/projects" className="block group">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">5+</div>
                  <div className="text-sm opacity-80">Projetos Open Source</div>
                </div>
                <FaArrowRight className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </div>
      </motion.section>


      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Engenharia de Dados',
            description: 'Desenvolvimento de pipelines robustos, ETL/ELT, e arquiteturas de dados escaláveis.',
            icon: '🔧'
          },
          {
            title: 'Cloud Computing',
            description: 'Expertise em GCP, com foco em BigQuery, Dataflow, e Pub/Sub.',
            icon: '☁️'
          },
          {
            title: 'Desenvolvimento',
            description: 'Criação de bibliotecas Python e aplicações data-driven.',
            icon: '💻'
          }
        ].map((specialty, index) => (
          <motion.div
            key={specialty.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="text-3xl mb-4">{specialty.icon}</div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">{specialty.title}</h3>
            <p className="text-gray-600">{specialty.description}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
