'use client';

import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const items = [
  { id: 'home', label: 'Sobre mim' },
  { id: 'projects', label: 'Projetos' },
  { id: 'experience', label: 'Experiência' },
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
    const onHashChange = () => {
      const target = window.location.hash.slice(1);
      if (items.some(item => item.id === target)) setActive(target);
    };
    window.addEventListener('hashchange', onHashChange);
    onScroll();
    onHashChange();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return (
    <header className="atlas-nav">
      <a className="atlas-brand" href="#home" aria-label="Ivanildo Barauna — início"><span />IB</a>
      <nav className={open ? 'is-open' : ''} aria-label="Navegação principal">
        {items.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? 'active' : ''} onClick={() => { setActive(item.id); setOpen(false); }}>{item.label}</a>)}
      </nav>
      <button className="atlas-menu" onClick={() => setOpen(value => !value)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
        {open ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}
