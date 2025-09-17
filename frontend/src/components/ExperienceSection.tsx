'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Experience } from '@/app/experience/interfaces';
import { FaExternalLinkAlt, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface ExperienceSectionProps {
  experiences: Record<string, Experience[]>;
  tempoTotalCarreira: string;
}

export default function ExperienceSection({ experiences, tempoTotalCarreira }: ExperienceSectionProps) {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="text-left mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experiência <span className="text-gradient">Profissional</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {tempoTotalCarreira} de carreira construindo soluções usando tecnologia
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(experiences).map(([empresa, exps], empresaIndex) => (
            <motion.div
              key={empresa}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: empresaIndex * 0.2 }}
              className="professional-card overflow-hidden"
            >
              {/* Header da empresa */}
              <div className="bg-gradient-hero p-6 md:p-8 text-primary-foreground">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {exps[0].companyLogo && (
                      <div className="w-16 h-16 bg-white/10 rounded-xl p-2 flex items-center justify-center backdrop-blur-sm">
                        <Image
                          src={exps[0].companyLogo}
                          alt={`Logo ${empresa}`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold break-words">{empresa}</h3>
                      <p className="text-primary-foreground/80 text-lg">
                        Tempo total: {exps[0].duration}
                        {exps[0].current && ' (Emprego Atual)'}
                      </p>
                    </div>
                  </div>
                  
                  {exps[0].website && (
                    <a
                      href={exps[0].website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Website
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
                    className="border-l-4 border-primary/20 pl-6"
                  >
                    <div className="mb-4">
                      <h4 className="text-xl md:text-2xl font-bold text-primary mb-2 underline-effect">
                        {exp.position}
                      </h4>
                      
                      <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-3">
                        {exp.period && (
                          <span className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4" />
                            {exp.period}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          {exp.location}
                        </span>
                      </div>
                      
                      <p className="text-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Skills */}
                    {exp.skills && (
                      <div className="flex flex-wrap gap-2 pt-3">
                        {exp.skills.split(';').filter(Boolean).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap"
                          >
                            {skill.trim()}
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
