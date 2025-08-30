'use client';

import { motion } from 'framer-motion';
import { FaArrowRight, FaPython, FaDatabase, FaChartBar, FaChartLine } from 'react-icons/fa';
import { SiFlask, SiApacheairflow, SiDocker, SiApache, SiGooglebigquery, SiGooglecloud, SiGooglepubsub } from 'react-icons/si';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

interface HeroSectionProps {
  totalExperience: number;
  totalProjects: number;
  totalEducation: number;
  activeButton: number | null;
}

const formatNumber = (value: number): string => {
  return isNaN(value) ? '0' : `${value}+`;
};

export default function HeroSection({ 
  totalExperience, 
  totalProjects, 
  totalEducation, 
  activeButton 
}: HeroSectionProps) {
  const { socialLinks, loading, error } = useSocialLinks();

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
    <section id="home" className="section bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ivanildo Barauna de Souza Junior
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
            Engenheiro de Dados Senior com experiência em desenvolvimento de soluções de dados end-to-end. 
            Especializado em transformar dados em insights estratégicos para diferentes áreas de negócio, 
            com foco atual em observabilidade de microsserviços e arquiteturas distribuídas.
          </p>
          
          {/* Links sociais */}
          <div className="flex justify-center items-center space-x-6 mt-8">
            {!loading && !error && socialLinks.map((link) => {
              const Icon = socialIconMap[link.type];
              return (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white opacity-80 hover:opacity-100 transition-all hover:scale-110 p-3 rounded-full bg-white/10 hover:bg-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.label}
                >
                  {Icon && <Icon className="w-6 h-6" />}
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Cards de estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div 
            className={`bg-white/10 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${activeButton === 0 ? 'bg-white/20 scale-105' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{formatNumber(totalExperience)}</div>
              <div className="text-lg opacity-90">Anos de Experiência</div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white/10 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${activeButton === 1 ? 'bg-white/20 scale-105' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{formatNumber(totalProjects)}</div>
              <div className="text-lg opacity-90">Projetos Open Source</div>
            </div>
          </motion.div>
          
          <motion.div 
            className={`bg-white/10 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 ${activeButton === 2 ? 'bg-white/20 scale-105' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">{formatNumber(totalEducation)}</div>
              <div className="text-lg opacity-90">Formações e Certificações</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Habilidades técnicas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Habilidades Técnicas</h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {skills.map((skill, index) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 md:px-5 md:py-3 bg-white/10 text-white rounded-full text-sm md:text-base flex items-center gap-2 hover:bg-white/20 transition-colors"
              >
                <skill.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: skill.color }} />
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
