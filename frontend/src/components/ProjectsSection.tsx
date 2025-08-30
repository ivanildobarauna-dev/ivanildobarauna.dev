'use client';

import { motion } from 'framer-motion';
import { Project } from '@/app/projects/interfaces';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Separar projetos destacados (primeiro) dos demais
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meus <span className="text-gradient">Projetos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma seleção dos projetos que desenvolvi, desde aplicações web complexas 
            até sistemas de grande escala.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Featured Project */}
          {featuredProject && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="professional-card overflow-hidden slide-up"
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8">
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-3">
                      Projeto Destacado
                    </span>
                    <h3 className="text-2xl font-bold mb-3 underline-effect">
                      {featuredProject.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {featuredProject.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags && featuredProject.tags.length > 0 && 
                      featuredProject.tags.slice(0, 4).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-secondary text-secondary-foreground">
                          {tech}
                        </span>
                      ))
                    }
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={featuredProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                    >
                      <FaExternalLinkAlt className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Ver Demo
                    </a>
                    <a
                      href={featuredProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <FaGithub className="w-4 h-4 mr-2" />
                      Código
                    </a>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <div className="relative w-full h-64 lg:h-full bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors">
                    <div className="text-center text-muted-foreground">
                      <FaGithub className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Projeto Open Source</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={`${project.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (index + 1) * 0.1 }}
                className="professional-card overflow-hidden group slide-up"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b border-border group-hover:border-primary/20 transition-colors">
                    <div className="text-center text-muted-foreground">
                      <FaGithub className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Open Source</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold underline-effect">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                          {tech}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium border border-border hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <FaGithub className="w-4 h-4 mr-2" />
                      Código
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 fade-in"
        >
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-border hover:border-primary/50 hover:text-primary transition-colors group"
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Ver todos os projetos
            <FaExternalLinkAlt className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
