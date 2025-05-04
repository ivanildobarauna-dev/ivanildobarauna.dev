'use client';

import { FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { SiCoursera, SiGravatar } from 'react-icons/si';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { href: 'https://linkedin.com/in/ivanildobarauna', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://github.com/ivanildobarauna', icon: FaGithub, label: 'GitHub' },
    { href: 'https://stackoverflow.com/users/24289987/ivanildo-barauna', icon: FaStackOverflow, label: 'Stack Overflow' },
    { href: 'https://www.coursera.org/learner/ivanildobarauna', icon: SiCoursera, label: 'Coursera' },
    { href: 'https://gravatar.com/ivanildobarauna', icon: SiGravatar, label: 'Gravatar' },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 mb-4 p-4 text-center text-gray-600 border-t border-gray-200"
    >
      <div className="flex justify-center space-x-4 mb-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 transition-colors"
            aria-label={link.label}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <p className="text-sm">
        © {new Date().getFullYear()} - Desenvolvido por Ivanildo Barauna
      </p>
    </motion.footer>
  );
};

export default Footer;