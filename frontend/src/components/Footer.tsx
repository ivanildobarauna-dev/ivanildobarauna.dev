'use client';

import { motion } from 'framer-motion';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

export default function Footer() {
  const { socialLinks, loading, error } = useSocialLinks();

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informações pessoais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-400">Ivanildo Baraúna</h3>
            <p className="text-gray-300 mb-4">
              Engenheiro de Dados Senior especializado em soluções escaláveis e arquiteturas distribuídas.
            </p>
            <p className="text-gray-400 text-sm">
              Transformando dados em insights estratégicos para diferentes áreas de negócio.
            </p>
          </motion.div>

          {/* Links de navegação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-400">Navegação</h3>
            <ul className="space-y-2">
              {[
                { href: '#home', label: 'Início' },
                { href: '#skills', label: 'Habilidades' },
                { href: '#experience', label: 'Experiência' },
                { href: '#projects', label: 'Projetos' },
                { href: '#education', label: 'Formação' }
              ].map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => {
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links sociais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-400">Conecte-se</h3>
            <div className="flex space-x-4 mb-4">
              {!loading && !error && socialLinks.map((link) => {
                const Icon = socialIconMap[link.type];
                return (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:bg-primary-500 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </motion.a>
                );
              })}
            </div>
            <p className="text-gray-400 text-sm">
              Disponível para projetos interessantes e colaborações.
            </p>
          </motion.div>
        </div>

        {/* Linha divisória */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Ivanildo Baraúna. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right mt-2 md:mt-0">
              Desenvolvido com ❤️ usando Next.js e Tailwind CSS
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
