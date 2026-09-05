'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

// Tipagem para os itens do menu
type MenuItem = {
  id: string;
  label: string;
  href: string;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const menuItems: MenuItem[] = useMemo(() => [
    { id: 'home', label: 'Início', href: '#home' },
    { id: 'about', label: 'Sobre Mim', href: '#about' },
    { id: 'experience', label: 'Experiência', href: '#experience' },
    { id: 'projects', label: 'Projetos', href: '#projects' },
    { id: 'education', label: 'Formação', href: '#education' },
    { id: 'contact', label: 'Contato', href: '#contact' },
  ], []); // Array vazio como dependência, pois não depende de props ou estado

  // Detectar seção ativa durante o scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = menuItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  // Scroll suave para seção
  const scrollToSection = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Header fixo */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Nome - Link para o topo */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 no-underline"
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-sm">IB</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">Ivanildo Barauna</span>
            </motion.a>

            {/* Menu Desktop */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item: MenuItem) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Botão Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Mobile */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 w-72 h-screen bg-background shadow-xl z-50 md:hidden border-l border-border"
            >
              <nav className="p-6 space-y-4">
                {menuItems.map((item: MenuItem) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href)}
                    className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                      ? 'text-foreground bg-secondary border-l-4 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Espaçador para o conteúdo não ficar sob o header fixo */}
      <div className="h-16" />
    </>
  );
};

export default Navigation;
