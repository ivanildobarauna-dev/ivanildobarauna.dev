'use client';

import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const items = [
  { id: 'home', label: 'Início' },
  { id: 'projects', label: 'Projetos' },
  { id: 'experience', label: 'Experiência' },
  { id: 'about', label: 'Sobre' },
  { id: 'contact', label: 'Contato' },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => {
      const current = [...items].reverse().find(item => {
        const section = document.getElementById(item.id);
        return section && section.offsetTop <= window.scrollY + 160;
      });
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="atlas-nav">
      <a className="atlas-brand" href="#home" aria-label="Ivanildo Barauna — início"><span />IB</a>
      <nav className={open ? 'is-open' : ''} aria-label="Navegação principal">
        {items.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'active' : ''} onClick={() => setOpen(false)}>{item.label}</a>)}
      </nav>
      <button className="atlas-menu" onClick={() => setOpen(value => !value)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
        {open ? <FaTimes /> : <FaBars />}
      </button>
      <span className="atlas-nav-status" aria-label="Disponível para novos projetos">Disponível</span>
    </header>
  );
}
