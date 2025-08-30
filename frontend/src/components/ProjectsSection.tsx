'use client';

import { motion } from 'framer-motion';
import { Project } from '@/app/projects/interfaces';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Projetos Open Source
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Contribuições e projetos pessoais que demonstram expertise técnico e compromisso com a comunidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-border-default hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header do projeto */}
              <div className="p-6 border-b border-border-default">
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="p-6 flex gap-3">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FaExternalLinkAlt />
                  Ver Projeto
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border-default">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Interessado em colaborar?
            </h3>
            <p className="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
              Estou sempre aberto a novos projetos interessantes e colaborações. 
              Se você tem uma ideia ou projeto que gostaria de discutir, vamos conversar!
            </p>
            <a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Vamos conversar
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
