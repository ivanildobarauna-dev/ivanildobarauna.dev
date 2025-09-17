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
    <section className="py-20 px-4 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="text-left mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Formação e <span className="text-gradient">Certificações</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Educação formal e certificações que colaboram na minha expertise técnica e conhecimento especializado
          </p>
        </div>

        {/* Formações */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-left">
            Formação Acadêmica
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {formations.map((formation, index) => (
              <motion.div
                key={`${formation.institution}-${formation.course}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="professional-card p-6 slide-up"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2 underline-effect">
                      {formation.course}
                    </h4>
                    
                    <p className="text-lg font-semibold text-primary mb-2">
                      {formation.institution}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-muted-foreground text-sm mb-3">
                      {formation.period && (
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="w-4 h-4" />
                          {formation.period}
                        </span>
                      )}
                      
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        {formation.type}
                      </span>
                    </div>
                    
                    {formation.description && (
                      <p className="text-foreground leading-relaxed">
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
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-left">
            Certificações Profissionais
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationsArray.map((cert, index) => (
              <motion.div
                key={`${cert.institution}-${cert.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="professional-card p-6 text-left group slide-up"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaCertificate className="w-8 h-8" />
                </div>
                
                <h4 className="text-lg font-bold mb-2 underline-effect">
                  {cert.name}
                </h4>
                
                <p className="text-primary font-medium mb-3">
                  {cert.institution}
                </p>
                
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                  >
                    <FaExternalLinkAlt className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Ver Certificado
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
