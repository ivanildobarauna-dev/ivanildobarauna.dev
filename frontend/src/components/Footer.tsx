'use client';

import { motion } from 'framer-motion';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const { socialLinks, loading, error } = useSocialLinks();
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email",
      value: "contato@ivanildobarauna.dev",
      href: "mailto:contato@ivanildobarauna.dev"
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      label: "Localização",
      value: "São Paulo, Brasil",
      href: "#"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-black text-white">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vamos trabalhar juntos?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Entre em contato para discutir seu próximo projeto ou oportunidade de colaboração.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contato */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white">Contato</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a 
                    key={item.label}
                    href={item.href} 
                    className="flex items-center gap-3 group hover:text-primary transition-colors"
                  >
                    <span className="text-primary">
                      {item.icon}
                    </span>
                    <span>{item.value}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Redes Sociais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white">Redes Sociais</h3>
              <div className="flex flex-wrap gap-3">
                {!loading && !error && socialLinks.map((link) => {
                  const Icon = socialIconMap[link.type];
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                      aria-label={link.label}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white">Status</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-400 text-sm font-medium">Disponível para projetos</span>
              </div>
              <p className="text-sm text-gray-300">
                Aceitando novos projetos e colaborações interessantes.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-800 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Ivanildo Barauna. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm text-center md:text-right mt-2 md:mt-0">
              Desenvolvido com ❤️ usando Next.js e Tailwind CSS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
