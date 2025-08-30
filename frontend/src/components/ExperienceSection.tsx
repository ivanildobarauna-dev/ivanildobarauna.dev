'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Experience } from '@/app/experience/interfaces';

interface ExperienceSectionProps {
  experiences: Record<string, Experience[]>;
  tempoTotalCarreira: string;
}

export default function ExperienceSection({ experiences, tempoTotalCarreira }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section bg-background-primary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Experiência Profissional
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            {tempoTotalCarreira} de carreira construindo soluções inovadoras e escaláveis
          </p>
        </motion.div>

        <div className="space-y-12">
          {Object.entries(experiences).map(([empresa, exps], empresaIndex) => (
            <motion.div
              key={empresa}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: empresaIndex * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-border-default hover:shadow-xl transition-all duration-300"
            >
              {/* Header da empresa */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 md:p-8 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {exps[0].logo && (
                      <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center">
                        <Image
                          src={exps[0].logo}
                          alt={`Logo ${empresa}`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold break-words">{empresa}</h3>
                      <p className="text-primary-100 text-lg">
                        Tempo total: {exps[0].duration}
                        {exps[0].actual_job && ' (Emprego Atual)'}
                      </p>
                    </div>
                  </div>
                  
                  {exps[0].website && (
                    <a
                      href={exps[0].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
              
              {/* Experiências */}
              <div className="p-6 md:p-8 space-y-6">
                {exps.map((exp, index) => (
                  <motion.div
                    key={`${exp.company}-${exp.position}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="border-l-4 border-primary-200 pl-6"
                  >
                    <div className="mb-4">
                      <h4 className="text-xl md:text-2xl font-bold text-primary-600 mb-2">
                        {exp.position}
                      </h4>
                      
                      <div className="flex flex-wrap gap-4 text-text-secondary mb-3">
                        {exp.period && (
                          <span className="flex items-center gap-2">
                            📅 {exp.period}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          📍 {exp.location}
                        </span>
                      </div>
                      
                      <p className="text-text-primary leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Skills */}
                    {exp.skills && (
                      <div className="flex flex-wrap gap-2 pt-3">
                        {exp.skills.split(';').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
