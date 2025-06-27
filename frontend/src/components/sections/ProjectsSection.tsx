'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { Project } from '@/interfaces/Project';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleProjects = isExpanded ? projects : projects.slice(0, 3);

  return (
    <div className="space-y-8 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-blue-600">Projetos Open Source</h2>
        <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
          Uma seleção dos meus projetos mais recentes e relevantes em engenharia de dados e desenvolvimento.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleProjects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="bg-blue-600 p-4 text-white">
              <h3 className="text-xl font-bold">{project.title}</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                  <span>Ver Código</span>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length > 3 && (
        <div className="text-center mt-8">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? 'Mostrar Menos' : 'Mostrar Mais'}
          </motion.button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center mt-12"
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