'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Experience } from '@/interfaces/Experience';

interface ExperienceSectionProps {
  experiences: Record<string, Experience[]>;
  tempoTotalCarreira: string;
}

export function ExperienceSection({ experiences, tempoTotalCarreira }: ExperienceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const experienceEntries = Object.entries(experiences);
  const visibleExperiences = isExpanded ? experienceEntries : experienceEntries.slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-blue-600 text-center"
      >
        Experiência Profissional - {tempoTotalCarreira}
      </motion.h2>

      <div className="relative space-y-8 md:space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-200">
        {visibleExperiences.map(([empresa, exps], empresaIndex) => (
          <motion.div
            key={empresa}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: empresaIndex * 0.2 }}
            className="relative pl-10"
          >
            <div className="absolute left-0 top-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white"></div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                      <h3 className="text-xl md:text-2xl font-bold break-words">{empresa}</h3>
                      <p className="text-blue-100 text-sm md:text-base">
                        Tempo total: {exps[0].duration}{exps[0].actual_job ? ' (Emprego Atual)' : ''}
                      </p>
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
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-blue-600">{exp.position}</h4>
                      {exp.period && (
                        <p className="text-gray-600 text-sm md:text-base">{exp.period}</p>
                      )}
                      <p className="text-gray-600 text-sm md:text-base">{exp.location}</p>
                      <p className="text-gray-700 text-sm md:text-base mt-2">{exp.description}</p>
                    </div>

                    {exp.skills && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.skills.split(';').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {experienceEntries.length > 3 && (
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
    </div>
  );
}