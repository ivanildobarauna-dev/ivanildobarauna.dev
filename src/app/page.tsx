'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaPython, FaDatabase, FaChartBar, FaChartLine, FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { SiFlask, SiApacheairflow, SiDocker, SiApache, SiGooglebigquery, SiGooglecloud, SiGooglepubsub, SiCoursera, SiGravatar } from 'react-icons/si';
import { useEffect, useState } from 'react';

export default function Home() {
  const [activeButton, setActiveButton] = useState<number | null>(null);

  useEffect(() => {
    const animateButtons = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(0);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(1);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(2);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(null);
    };

    animateButtons();
  }, []);

  const socialLinks = [
    { href: 'https://linkedin.com/in/ivanildobarauna', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://github.com/ivanildobarauna', icon: FaGithub, label: 'GitHub' },
    { href: 'https://stackoverflow.com/users/24289987/ivanildo-barauna', icon: FaStackOverflow, label: 'Stack Overflow' },
    { href: 'https://www.coursera.org/learner/ivanildobarauna', icon: SiCoursera, label: 'Coursera' },
    { href: 'https://gravatar.com/ivanildobarauna', icon: SiGravatar, label: 'Gravatar' },
  ];

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
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 md:p-12 text-white"
      >
        <div className="mb-4">
          <h1 className="text-2xl md:text-4xl font-bold">Ivanildo Barauna de Souza Junior</h1>
          {/* Social links - visible only on mobile */}
          <div className="flex md:hidden items-center space-x-3 mt-3">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white opacity-80 hover:opacity-100 transition-all hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
        <p className="text-base md:text-lg opacity-90">
          Engenheiro de Dados Senior com experiência em desenvolvimento de soluções de dados end-to-end. Especializado em transformar dados em insights estratégicos para diferentes áreas de negócio, com foco atual em observabilidade de microsserviços e arquiteturas distribuídas.
        </p>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm mt-6 md:mt-8 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Habilidades Técnicas</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {skills.map((skill) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 md:px-4 md:py-2 bg-blue-100/10 text-white rounded-full text-xs md:text-sm flex items-center gap-1 md:gap-2 hover:bg-blue-100/20 transition-colors"
              >
                <skill.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: skill.color }} />
                {skill.name}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <Link href="/experiencias" className="block group">
            <motion.div 
              className={`bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm transition-all duration-300 transform group-hover:bg-white/20 group-hover:scale-105 ${activeButton === 0 ? 'bg-white/20 scale-105' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">10+</div>
                  <div className="text-xs md:text-sm opacity-80">Anos de Experiência</div>
                </div>
                <FaArrowRight className="transform transition-all duration-300 group-hover:translate-x-2" />
              </div>
            </motion.div>
          </Link>
          <Link href="/projects" className="block group">
            <motion.div 
              className={`bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm transition-all duration-300 transform group-hover:bg-white/20 group-hover:scale-105 ${activeButton === 1 ? 'bg-white/20 scale-105' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">7+</div>
                  <div className="text-xs md:text-sm opacity-80">Projetos Open Source</div>
                </div>
                <FaArrowRight className="transform transition-all duration-300 group-hover:translate-x-2" />
              </div>
            </motion.div>
          </Link>
          <Link href="/skills" className="block group">
            <motion.div 
              className={`bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm transition-all duration-300 transform group-hover:bg-white/20 group-hover:scale-105 ${activeButton === 2 ? 'bg-white/20 scale-105' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">19+</div>
                  <div className="text-xs md:text-sm opacity-80">Formações e Certificações</div>
                </div>
                <FaArrowRight className="transform transition-all duration-300 group-hover:translate-x-2" />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
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
            className="bg-white p-4 md:p-6 rounded-xl shadow-lg"
          >
            <div className="text-2xl md:text-3xl mb-3 md:mb-4">{specialty.icon}</div>
            <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-1 md:mb-2">{specialty.title}</h3>
            <p className="text-sm md:text-base text-gray-600">{specialty.description}</p>
          </motion.div>
        ))}
      </motion.section>
    </div>
  );
}
