'use client';

import { motion } from 'framer-motion';

export default function SkillsSection() {
  const specialties = [
    {
      title: 'Engenharia de Dados',
      description: 'Desenvolvimento e orquestração de pipelines distribuídos de ETL/ELT usando diversas arquiteturas de dados.',
      icon: '🔧',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Cloud Computing',
      description: 'Expertise em GCP, com foco em Data Pipelines usando tecnologias como BigQuery, Dataflow, Pub/Sub e Airflow.',
      icon: '☁️',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Desenvolvimento Backend',
      description: 'Desenvolvimento de microsserviços, APIs RESTful, Bibliotecas Python, Wrappers e mais.',
      icon: '💻',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section id="skills" className="section bg-background-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">
            Especialidades Técnicas
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
            Domínio em tecnologias modernas para desenvolvimento de soluções escaláveis e eficientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className={`w-16 h-16 bg-gradient-to-r ${specialty.color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {specialty.icon}
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4 text-center">
                  {specialty.title}
                </h3>
                
                <p className="text-text-secondary text-center leading-relaxed">
                  {specialty.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Seção adicional de tecnologias */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-8 text-center">
            Stack Tecnológico Completo
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Python', level: 'Avançado', color: 'bg-blue-100 text-blue-800' },
              { name: 'Golang', level: 'Intermediário', color: 'bg-cyan-100 text-cyan-800' },
              { name: 'SQL', level: 'Avançado', color: 'bg-orange-100 text-orange-800' },
              { name: 'Docker', level: 'Avançado', color: 'bg-blue-100 text-blue-800' },
              { name: 'Kubernetes', level: 'Intermediário', color: 'bg-blue-100 text-blue-800' },
              { name: 'Apache Airflow', level: 'Avançado', color: 'bg-orange-100 text-orange-800' },
              { name: 'BigQuery', level: 'Avançado', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'Apache Beam', level: 'Intermediário', color: 'bg-red-100 text-red-800' }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`px-4 py-2 rounded-lg ${tech.color} font-medium mb-2`}>
                  {tech.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {tech.level}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
