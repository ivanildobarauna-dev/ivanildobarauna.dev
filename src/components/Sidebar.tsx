'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaStackOverflow } from 'react-icons/fa';
import { SiCoursera, SiGravatar } from 'react-icons/si';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Início', icon: '🏠' },
    { href: '/experiencias', label: 'Experiência Profissional', icon: '🧑‍💻' },
    { href: '/projects', label: 'Projetos Open Source', icon: '💻' },
    { href: '/skills', label: 'Formação', icon: '📚' },
  ];

  const socialLinks = [
    { href: 'https://linkedin.com/in/ivanildobarauna', icon: FaLinkedin, label: 'LinkedIn' },
    { href: 'https://github.com/ivanildobarauna', icon: FaGithub, label: 'GitHub' },
    { href: 'https://stackoverflow.com/users/24289987/ivanildo-barauna', icon: FaStackOverflow, label: 'Stack Overflow' },
    { href: 'https://www.coursera.org/learner/ivanildobarauna', icon: SiCoursera, label: 'Coursera' },
    { href: 'https://gravatar.com/ivanildobarauna', icon: SiGravatar, label: 'Gravatar' },

  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed h-screen w-64 bg-gray-900 text-white p-6 flex flex-col justify-between"
    >
      <div>
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
            <Image
              src="/images/profile/profile.png"
              alt="Ivanildo Barauna"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-xl font-bold">Ivanildo Barauna</h1>
          <p className="text-gray-400 mb-4 text-center">Engenheiro de Dados Senior / Programador Backend</p>
          
          <div className="flex justify-center space-x-4 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <link.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar; 