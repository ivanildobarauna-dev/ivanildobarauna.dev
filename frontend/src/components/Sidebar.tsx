'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on initial render and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  const menuItems = [
    { href: '/', label: 'Início', icon: '🏠' },
    { href: '/experience', label: 'Experiência Profissional', icon: '🧑‍💻' },
    { href: '/projects', label: 'Projetos Open Source', icon: '💻' },
    { href: '/education', label: 'Formação', icon: '📚' },
  ];

  const { socialLinks, loading, error } = useSocialLinks();

  // Mobile hamburger button
  const MobileMenuButton = () => (
    <button 
      onClick={() => setIsOpen(!isOpen)}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-blue-600 text-white md:hidden"
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
    >
      {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div>
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-blue-500">
          <Image
            src="/images/profile/profile.png"
            alt="Ivanildo Barauna"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-xl font-bold">Ivanildo Barauna</h1>
        <p className="text-gray-400 mb-4 text-center text-sm md:text-base">Engenheiro de Dados Senior / Programador Backend</p>
        
        <div className="flex justify-center space-x-4 mb-8">
          {!loading && !error && socialLinks.map((link) => {
            const Icon = socialIconMap[link.type];
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" />}
              </a>
            );
          })}
        </div>
      </div>

      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
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
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Desktop sidebar - always visible on larger screens */}
      {!isMobile && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed hidden md:flex h-screen w-64 bg-gray-900 text-white p-6 flex-col justify-between z-40"
        >
          <SidebarContent />
        </motion.aside>
      )}
      
      {/* Mobile sidebar - slides in from left when opened */}
      {isMobile && (
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Mobile sidebar menu */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed top-0 left-0 h-screen w-3/4 max-w-xs bg-gray-900 text-white p-6 flex flex-col z-40"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Sidebar; 