'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

const SidebarContent = () => {
  const { socialLinks, loading, error } = useSocialLinks();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/about', label: 'Sobre' },
    { href: '/projects', label: 'Projetos' },
    { href: '/education', label: 'Formação' },
    { href: '/contact', label: 'Contato' },
  ];

  return (
    <>
      <div className="flex flex-col space-y-8">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/images/profile/profile.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold">Ivanildo Barauna</span>
        </Link>

        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-gray-800 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Redes Sociais</h3>
        <div className="flex space-x-4">
          {!loading && !error && socialLinks.map((link) => {
            const Icon = socialIconMap[link.type];
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={link.label}
              >
                {Icon && <Icon className="w-5 h-5" />}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-gray-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {!isMobile && (
        <aside className="fixed hidden md:flex h-screen w-64 bg-gray-900 text-white p-6 flex-col justify-between z-40">
          <SidebarContent />
        </aside>
      )}
      
      {isMobile && isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-screen w-3/4 max-w-xs bg-gray-900 text-white p-6 flex flex-col z-40">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
