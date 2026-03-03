'use client';

import { motion } from 'framer-motion';
import { Formation, Certification } from '../app/education/interfaces';
import { FaGraduationCap, FaCertificate, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

interface EducationSectionProps {
  formations: Formation[];
  certifications: Record<string, Certification[]>;
}

export default function EducationSection({ formations, certifications }: EducationSectionProps) {
  // Converter o Record para array para facilitar o mapeamento
  const certificationsArray = Object.values(certifications).flat();

  return (
    <section className="py-20 px-4 bg-background" data-testid="education-section">
      <div className="container max-w-6xl mx-auto">
        <div className="text-left mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-slate-400">/</span> Formação & Certificações
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl font-mono text-sm">
            // Educação formal e credenciais técnicas
          </p>
        </div>

        {/* Formações */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-black mb-8 text-left text-white">
            $ Formação Acadêmica
          </h3>

          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* Vertical line connector */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-slate-500/50"></div>

            {formations.map((formation, index) => (
              <motion.div
                key={`${formation.institution}-${formation.course}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="professional-card p-6 slide-up relative border-l-4 border-blue-500/50"
              >
                {/* Timeline dot */}
                <div className="absolute -left-3.5 top-6 w-4 h-4 bg-blue-500 border-2 border-gray-900 rounded-full"></div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-none flex items-center justify-center text-blue-300">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xl font-black mb-2 text-white font-mono">
                      &gt; {formation.course}
                    </h4>

                    <p className="text-lg font-bold text-blue-300 mb-2">
                      {formation.institution}
                    </p>

                    <div className="flex flex-wrap gap-4 text-gray-400 text-xs mb-3 font-mono">
                      {formation.period && (
                        <span className="flex items-center gap-2 text-blue-300">
                          <FaCalendarAlt className="w-4 h-4" />
                          {formation.period}
                        </span>
                      )}

                      <span className="flex items-center gap-2 text-slate-300">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        {formation.type}
                      </span>
                    </div>

                    {formation.description && (
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {formation.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certificações */}
        <div>
          <h3 className="text-2xl md:text-3xl font-black mb-8 text-left text-white">
            $ Certificações Profissionais
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationsArray.map((cert, index) => (
              <motion.div
                key={`${cert.institution}-${cert.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="professional-card p-6 text-left group slide-up border-t-2 border-slate-500"
              >
                <div className="w-16 h-16 bg-slate-500/20 border border-slate-500/30 rounded-none flex items-center justify-center text-slate-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaCertificate className="w-8 h-8" />
                </div>

                <h4 className="text-lg font-black mb-2 text-white font-mono">
                  &gt; {cert.name}
                </h4>

                <p className="text-slate-300 font-bold mb-3 text-sm">
                  {cert.institution}
                </p>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-none text-xs font-mono font-bold bg-slate-500/30 text-slate-300 border border-slate-500 hover:bg-slate-500/50 transition-all"
                  >
                    <FaExternalLinkAlt className="w-3 h-3" />
                    VERIFY
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
