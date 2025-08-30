'use client';

import { motion } from 'framer-motion';
import { Formation, Certification } from '@/app/education/interfaces';
import { FaGraduationCap, FaCertificate, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface EducationSectionProps {
  formations: Formation[];
  certifications: Record<string, Certification[]>;
}

export default function EducationSection({ formations, certifications }: EducationSectionProps) {
  // Converter o Record para array para facilitar o mapeamento
  const certificationsArray = Object.values(certifications).flat();

  return (
    <section id="education" className="section bg-background-primary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Formação e Certificações
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Educação formal e certificações que validam expertise técnico e conhecimento especializado
          </p>
        </motion.div>

        {/* Formações */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Formação Acadêmica
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {formations.map((formation, index) => (
              <motion.div
                key={`${formation.institution}-${formation.course}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-border-default hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white text-xl">
                    <FaGraduationCap />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-text-primary mb-2">
                      {formation.course}
                    </h4>
                    
                    <p className="text-lg font-semibold text-primary-600 mb-2">
                      {formation.institution}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-text-secondary text-sm mb-3">
                      {formation.period && (
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {formation.period}
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {formation.type}
                      </span>
                    </div>
                    
                    {formation.description && (
                      <p className="text-text-primary leading-relaxed">
                        {formation.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificações */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Certificações Profissionais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationsArray.map((cert, index) => (
              <motion.div
                key={`${cert.institution}-${cert.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-border-default hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaCertificate />
                  </div>
                  
                  <h4 className="text-lg font-bold text-text-primary mb-2">
                    {cert.name}
                  </h4>
                  
                  <p className="text-primary-600 font-medium mb-3">
                    {cert.institution}
                  </p>
                  
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                    >
                      Ver Certificado
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Aprendizado Contínuo
            </h3>
            <p className="text-primary-100 text-lg mb-6 max-w-2xl mx-auto">
              Acredito que o conhecimento é a base para inovação. 
              Estou sempre buscando novas tecnologias e metodologias para aprimorar minhas habilidades.
            </p>
            <a
              href="#contact"
              className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center gap-2"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Vamos trocar experiências
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
