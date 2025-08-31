'use client';

import { useState, useRef, useEffect } from 'react';
import { FaDownload, FaChevronDown } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';

export default function CvDownloadButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDownload = (lang: 'pt' | 'en') => {
    const fileName = lang === 'pt' 
      ? 'Profile-pt.pdf' 
      : 'Profile-en.pdf';
    
    const link = document.createElement('a');
    link.href = `/assets/${fileName}`;
    link.download = `Ivanildo-Barauna-CV-${lang.toUpperCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-white/10 border border-white/20 text-primary-foreground hover:bg-white/20 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaDownload className="w-5 h-5 mr-2" />
          Download CV
          <FaChevronDown className="ml-2 w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => handleDownload('pt')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
            >
              <ReactCountryFlag 
                countryCode="BR"
                svg
                style={{
                  width: '1.2em',
                  height: '1.2em',
                }}
                title="Brasil"
              />
              <span>PT-BR</span>
            </button>
            <button
              onClick={() => handleDownload('en')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
            >
              <ReactCountryFlag 
                countryCode="US"
                svg
                style={{
                  width: '1.2em',
                  height: '1.2em',
                }}
                title="United States"
              />
              <span>EN</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
