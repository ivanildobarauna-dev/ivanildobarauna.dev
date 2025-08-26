'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaBook, FaCertificate } from 'react-icons/fa';
import { Formation, Certification } from '@/interfaces/Education';

interface EducationSectionProps {
  formations: Formation[];
  certifications: Record<string, Certification[]>;
}

export function EducationSection({ formations, certifications }: EducationSectionProps) {
  const [isFormationsExpanded, setIsFormationsExpanded] = useState(false);
  const [isCertificationsExpanded, setIsCertificationsExpanded] = useState(false);

  const visibleFormations = isFormationsExpanded ? formations : formations.slice(0, 3);
  const certificationEntries = Object.entries(certifications);
  const visibleCertifications = isCertificationsExpanded ? certificationEntries : certificationEntries.slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-left"
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-blue-600">Formação Acadêmica</h2>
        <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4 max-w-2xl ml-2">
          Minha jornada acadêmica e qualificações que fundamentam minha expertise profissional.
        </p>
      </motion.div>

      <div className="space-y-4 md:space-y-6">
        {visibleFormations.map((formation, index) => (
          <motion.div
            key={formation.institution}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 p-4 md:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3 md:gap-4">
                  {formation.logo && (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center">
                      <img
                        src={formation.logo}
                        alt={`Logo ${formation.institution}`}
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold">{formation.institution}</h3>
                    <div className="flex items-center gap-2 text-blue-100 text-sm md:text-base">
                      <FaGraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{formation.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <FaBook className="w-4 h-4 md:w-5 md:h-5" />
                  <h4 className="text-lg md:text-xl font-bold">{formation.course}</h4>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  <FaCalendarAlt className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{formation.period}</span>
                </div>
                <p className="text-sm md:text-base text-gray-700">{formation.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {formations.length > 3 && (
        <div className="text-center mt-8">
          <motion.button
            onClick={() => setIsFormationsExpanded(!isFormationsExpanded)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFormationsExpanded ? 'Mostrar Menos' : 'Mostrar Mais'}
          </motion.button>
        </div>
      )}

      {certificationEntries.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mt-12"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4 text-blue-600">Certificações</h2>
            <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4 max-w-2xl ml-2">
              Certificações e cursos especializados que complementam minha formação.
            </p>
          </motion.div>

          <div className="space-y-4 md:space-y-8">
            {visibleCertifications.map(([institution, certs], index) => (
              <motion.div
                key={institution}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-blue-600 p-3 md:p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      {certs[0].logo && (
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg p-1 md:p-2 flex items-center justify-center">
                          <img
                            src={certs[0].logo}
                            alt={`Logo ${institution}`}
                            className="w-6 h-6 md:w-8 md:h-8 object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg md:text-xl font-bold">{institution}</h3>
                        <p className="text-blue-100 text-xs md:text-sm">
                          {certs.length} {certs.length === 1 ? 'certificação' : 'certificações'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    {certs.map((certification, certIndex) => (
                      <motion.div
                        key={`${certification.name}-${certIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (certIndex * 0.05) }}
                        className="bg-gray-50 rounded-lg p-3 md:p-4"
                      >
                        <h4 className="text-base md:text-lg font-bold text-blue-600 mb-2">{certification.name}</h4>
                        {certification.credential_url && (
                          <a
                            href={certification.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 md:gap-2 text-blue-600 hover:text-blue-800 transition-colors text-xs md:text-sm"
                          >
                            <FaCertificate className="w-3 h-3 md:w-4 md:h-4" />
                            <span>Ver Credencial</span>
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {certificationEntries.length > 3 && (
            <div className="text-center mt-8">
              <motion.button
                onClick={() => setIsCertificationsExpanded(!isCertificationsExpanded)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCertificationsExpanded ? 'Mostrar Menos' : 'Mostrar Mais'}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
}