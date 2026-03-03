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
    <section className="py-20 px-4 bg-gradient-subtle" data-testid="projects-section">
      <div className="container max-w-6xl mx-auto">
        <div className="text-left mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-blue-300">/</span> Projetos <span className="text-gradient">Open Source</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl font-mono text-sm">
            // Aplicações, SDKs, e ferramentas desenvolvidas para a comunidade
          </p>
        </div>

        <div className="grid gap-8">
          {/* Featured Project - Hero data block */}
          {featuredProject && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="professional-card overflow-hidden slide-up border-l-4 border-blue-500"
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8">
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-none text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/50 mb-3">
                      [FEATURED]
                    </span>
                    <h3 className="text-3xl font-black text-white mb-3">
                      $ {featuredProject.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {featuredProject.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featuredProject.tags && featuredProject.tags.length > 0 &&
                      featuredProject.tags.slice(0, 4).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-2.5 py-1 rounded-none text-xs font-mono font-bold bg-slate-500/20 text-slate-300 border border-slate-500/50">
                          #{tech}
                        </span>
                      ))
                    }
                  </div>

                  <div className="flex gap-3">
                    {(featuredProject.projectUrl || featuredProject.demoUrl) && (
                      <a
                        href={featuredProject.projectUrl || featuredProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-none text-xs font-mono font-bold bg-blue-500/30 text-blue-300 border border-blue-500 hover:bg-blue-500/50 transition-all group"
                      >
                        <FaExternalLinkAlt className="w-3 h-3 mr-2" />
                        {featuredProject.projectUrl?.includes('github') ? 'CÓDIGO' : 'DEMO'}
                      </a>
                    )}
                    {(featuredProject.githubUrl && featuredProject.githubUrl !== (featuredProject.projectUrl || featuredProject.demoUrl)) && (
                      <a
                        href={featuredProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-none text-xs font-mono font-bold border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300 transition-all"
                      >
                        <FaGithub className="w-3 h-3 mr-2" />
                        GIT
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-slate-500/10 rounded-none opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                  <div className="relative w-full h-64 lg:h-full bg-gray-800/50 border-2 border-blue-500/30 flex items-center justify-center group-hover:border-blue-500/60 transition-colors">
                    <div className="text-center">
                      <div className="data-point mx-auto mb-4"></div>
                      <p className="text-sm text-blue-300 font-mono">$ OPEN_SOURCE</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other Projects Grid - Data blocks */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={`${project.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (index + 1) * 0.1 }}
                className="professional-card overflow-hidden group slide-up border-t-4 border-slate-500"
              >
                <div className="relative h-48 bg-gray-800/30 border-b border-slate-500/20 flex items-center justify-center group-hover:bg-gray-800/50 transition-colors">
                  <div className="text-center">
                    <div className="data-point mx-auto mb-3"></div>
                    <p className="text-xs text-blue-300 font-mono">&gt; project</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-black text-white font-mono">
                    $ {project.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center px-2 py-1 rounded-none text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {tech}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-none text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    {(project.projectUrl || project.demoUrl) && (
                      <a
                        href={project.projectUrl || project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-none text-xs font-mono font-bold border border-blue-500/50 text-blue-300 hover:bg-blue-500/20 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                        {project.projectUrl?.includes('github') ? 'CÓDIGO' : 'DEMO'}
                      </a>
                    )}
                    {(project.githubUrl && project.githubUrl !== (project.projectUrl || project.demoUrl)) && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-none text-xs font-mono font-bold border border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-300 transition-colors"
                      >
                        <FaGithub className="w-3 h-3 mr-1" />
                        GIT
                      </a>
                    )}
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
