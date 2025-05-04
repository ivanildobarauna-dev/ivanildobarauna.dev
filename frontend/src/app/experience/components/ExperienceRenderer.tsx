import { motion } from 'framer-motion';
import Image from 'next/image';
import { Experience } from '../interfaces';

interface ExperienceRendererProps {
  experiences: Record<string, Experience[]>;
  tempoTotalCarreira: string;
}

export function ExperienceRenderer({ experiences, tempoTotalCarreira }: ExperienceRendererProps) {
  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-blue-600"
      >
        Experiência Profissional - {tempoTotalCarreira}
      </motion.h1>

      <div className="space-y-8 md:space-y-12">
        {Object.entries(experiences).map(([empresa, exps], empresaIndex) => (
          <motion.section
            key={empresa}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: empresaIndex * 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
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
                    <h2 className="text-xl md:text-2xl font-bold break-words">{empresa}</h2>
                    <p className="text-blue-100 text-sm md:text-base">
                      Tempo total: {exps[0].duration}{exps[0].currentJob ? ' (Emprego Atual)' : ''}
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
                    <h3 className="text-lg md:text-xl font-semibold text-blue-600">{exp.position}</h3>
                    <p className="text-gray-600 text-sm md:text-base">{exp.period}</p>
                    <p className="text-gray-600 text-sm md:text-base">{exp.location}</p>
                  </div>

                  <ul className="space-y-2">
                    {exp.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>

                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.skills.map((skill, idx) => (
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
          </motion.section>
        ))}
      </div>
    </div>
  );
} 