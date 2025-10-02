'use client';

import { useState, useEffect, useMemo } from 'react';
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-default shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Nome - Link para o topo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2 no-underline"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IB</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Ivanildo Barauna</span>
            </a>

            {/* Menu Desktop */}
            <nav className="hidden md:flex space-x-8">
              {menuItems.map((item: MenuItem) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-text-secondary hover:text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Botão Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary-500 hover:bg-primary-50 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Mobile */}
          <div
            className="fixed top-16 right-0 w-64 h-screen bg-white shadow-xl z-50 md:hidden"
          >
            <nav className="p-6 space-y-4">
              {menuItems.map((item: MenuItem) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.href)}
                  className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-primary-500 bg-primary-50 border-l-4 border-primary-500'
                      : 'text-text-secondary hover:text-primary-500 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Espaçador para o conteúdo não ficar sob o header fixo */}
      <div className="h-16" />
    </>
  );
};

export default Navigation;
