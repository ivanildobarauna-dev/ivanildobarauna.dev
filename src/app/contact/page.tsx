'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'admin@ivanildobarauna.dev',
      link: 'mailto:admin@ivanildobarauna.dev'
    },
    {
      icon: FaLinkedin,
      title: 'LinkedIn',
      content: 'linkedin.com/in/ivanildobarauna',
      link: 'https://linkedin.com/in/ivanildobarauna'
    },
    {
      icon: FaGithub,
      title: 'GitHub Organization',
      content: 'github.com/ivanildobarauna-dev',
      link: 'https://github.com/ivanildobarauna-dev'
    },
    {
      icon: FaGithub,
      title: 'GitHub Profile',
      content: 'github.com/ivanildobarauna',
      link: 'https://github.com/ivanildobarauna'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Localização',
      content: 'São Paulo, SP - Brasil',
      link: null
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6">Entre em Contato</h1>
        <p className="text-gray-600 mb-8">
          Estou sempre interessado em novos projetos e oportunidades de colaboração.
          Sinta-se à vontade para entrar em contato através de qualquer um dos canais abaixo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.map((info, index) => (
          <motion.div
            key={info.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <info.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-600">{info.content}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Vamos Trabalhar Juntos?</h2>
        <p className="mb-6">
          Estou disponível para projetos freelance, consultoria e oportunidades full-time.
        </p>
        <a
          href="mailto:ivanildo.barauna@gmail.com"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Enviar Mensagem
        </a>
      </motion.div>
    </div>
  );
} 