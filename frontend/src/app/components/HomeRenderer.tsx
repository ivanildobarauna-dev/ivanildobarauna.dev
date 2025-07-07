import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaArrowRight, FaArrowDown, FaPython, FaDatabase, FaChartBar, FaChartLine, FaUser, FaCode, FaGraduationCap } from 'react-icons/fa';
import { SiFlask, SiApacheairflow, SiDocker, SiApache, SiGooglebigquery, SiGooglecloud, SiGooglepubsub } from 'react-icons/si';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

interface HomeRendererProps {
  totalExperience: number;
  totalProjects: number;
  totalEducation: number;
}

const formatNumber = (value: number): string => {
  return isNaN(value) ? '0' : `${value}+`;
};

export default function HomeRenderer({ 
  totalExperience, 
  totalProjects, 
  totalEducation 
}: HomeRendererProps) {
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

  const navigationItems = [
    { href: '#experience', label: 'Experiência', icon: FaUser },
    { href: '#projects', label: 'Projetos', icon: FaCode },
    { href: '#education', label: 'Formação', icon: FaGraduationCap },
  ];

  return (
    <div className="space-y-12">
      {/* Header com foto, nome, descrição e links sociais */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-12 text-white"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Foto de perfil */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0"
          >
            <Image
              src="/images/profile/profile.png"
              alt="Ivanildo Barauna"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Informações pessoais */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-4xl font-bold mb-2"
            >
              Ivanildo Barauna de Souza Junior
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg opacity-90 mb-4"
            >
              Engenheiro de Dados Senior com experiência em desenvolvimento de soluções de dados end-to-end. Especializado em transformar dados em insights estratégicos para diferentes áreas de negócio, com foco atual em observabilidade de microsserviços e arquiteturas distribuídas.
            </motion.p>

            {/* Links sociais */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center md:justify-start space-x-4"
            >
              {!loading && !error && socialLinks.map((link) => {
                const Icon = socialIconMap[link.type];
                return (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white opacity-80 hover:opacity-100 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Menu de navegação discreto */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
            {navigationItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </motion.a>
            ))}
          </div>
        </motion.nav>
      </motion.section>

      {/* Habilidades técnicas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 md:p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Habilidades Técnicas</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
            >
              <skill.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: skill.color }} />
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Cards de estatísticas */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        <a href="#experience" className="block group">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 md:p-8 rounded-xl text-white transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(totalExperience)}</div>
                <div className="text-sm opacity-90">Anos de Experiência</div>
              </div>
              <FaArrowDown className="transform transition-all duration-300 group-hover:translate-y-2" />
            </div>
          </motion.div>
        </a>
        
        <a href="#projects" className="block group">
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-green-600 p-6 md:p-8 rounded-xl text-white transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(totalProjects)}</div>
                <div className="text-sm opacity-90">Projetos Open Source</div>
              </div>
              <FaArrowDown className="transform transition-all duration-300 group-hover:translate-y-2" />
            </div>
          </motion.div>
        </a>
        
        <a href="#education" className="block group">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 md:p-8 rounded-xl text-white transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{formatNumber(totalEducation)}</div>
                <div className="text-sm opacity-90">Formações e Certificações</div>
              </div>
              <FaArrowDown className="transform transition-all duration-300 group-hover:translate-y-2" />
            </div>
          </motion.div>
        </a>
      </motion.section>

      {/* Especialidades */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        {[
          {
            title: 'Engenharia de Dados',
            description: 'Desenvolvimento e orquestração de pipelines distribuídos de ETL/ELT usando diversas arquiteturas de dados.',
            icon: '🔧'
          },
          {
            title: 'Cloud Computing',
            description: 'Expertise em GCP, com foco em Data Pipelines usando tecnologias como BigQuery, Dataflow, Pub/Sub e Airflow.',
            icon: '☁️'
          },
          {
            title: 'Desenvolvimento Backend',
            description: 'Desenvolvimento de microsserviços, APIs RESTful, Bibliotecas Python, Wrappers e mais.',
            icon: '💻'
          }
        ].map((specialty, index) => (
          <motion.div
            key={specialty.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-3xl md:text-4xl mb-4">{specialty.icon}</div>
            <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2">{specialty.title}</h3>
            <p className="text-sm md:text-base text-gray-600">{specialty.description}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}