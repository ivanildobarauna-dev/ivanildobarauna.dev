'use client';

import { motion } from 'framer-motion';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

const Footer = () => {
  const { socialLinks, loading, error } = useSocialLinks();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 mb-4 p-4 text-center text-gray-600 border-t border-gray-200"
    >
      <div className="flex justify-center space-x-4 mb-3">
        {!loading && !error && socialLinks.map((link) => {
          const Icon = socialIconMap[link.type];
          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label={link.label}
            >
              {Icon && <Icon className="w-5 h-5" />}
            </a>
          );
        })}
      </div>
      <p className="text-sm">
        © {new Date().getFullYear()} - Desenvolvido por Ivanildo Barauna
      </p>
    </motion.footer>
  );
};

export default Footer;