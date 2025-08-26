'use client';

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeRenderer from '@/app/components/HomeRenderer';
import Home from '@/app/page';

// Mock framer-motion para evitar erro de componente undefined
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  }
}));

// Mock next/image para evitar erro de componente inválido
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock socialIconMap para evitar erro de ícones undefined
vi.mock('@/utils/socialIconMap', () => ({
  socialIconMap: {
    github: () => <span>FaGithub</span>,
    linkedin: () => <span>FaLinkedin</span>,
    stackoverflow: () => <span>FaStackOverflow</span>,
    coursera: () => <span>SiCoursera</span>,
    gravatar: () => <span>SiGravatar</span>,
  }
}));

// Mock react-icons/fa para evitar undefined nos testes
vi.mock('react-icons/fa', () => ({
  FaUser: () => <span>FaUser</span>,
  FaCode: () => <span>FaCode</span>,
  FaGraduationCap: () => <span>FaGraduationCap</span>,
  FaArrowRight: () => <span>FaArrowRight</span>,
  FaArrowDown: () => <span>FaArrowDown</span>,
  FaPython: () => <span>FaPython</span>,
  FaDatabase: () => <span>FaDatabase</span>,
  FaChartBar: () => <span>FaChartBar</span>,
  FaChartLine: () => <span>FaChartLine</span>,
  FaGithub: () => <span>FaGithub</span>,
  FaLinkedin: () => <span>FaLinkedin</span>,
  FaStackOverflow: () => <span>FaStackOverflow</span>,
}));

// Mock react-icons/si para evitar undefined nos testes
vi.mock('react-icons/si', () => ({
  SiFlask: () => <span>SiFlask</span>,
  SiApacheairflow: () => <span>SiApacheairflow</span>,
  SiDocker: () => <span>SiDocker</span>,
  SiApache: () => <span>SiApache</span>,
  SiGooglebigquery: () => <span>SiGooglebigquery</span>,
  SiGooglecloud: () => <span>SiGooglecloud</span>,
  SiGooglepubsub: () => <span>SiGooglepubsub</span>,
  SiCoursera: () => <span>SiCoursera</span>,
  SiGravatar: () => <span>SiGravatar</span>,
}));

// Mock hooks
vi.mock('@/app/experience/hooks/useExperience', () => ({
  useExperience: () => ({
    experiences: {},
    loading: false,
    error: null,
    tempoTotalCarreira: '1 ano',
  }),
}));
vi.mock('@/app/projects/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    loading: false,
    error: null,
  }),
}));
vi.mock('@/app/education/hooks/useEducation', () => ({
  useEducation: () => ({
    formations: [],
    certifications: {},
    loading: false,
    error: null,
  }),
}));
vi.mock('@/app/social-links/hooks/useSocialLinks', () => ({
  useSocialLinks: () => ({
    socialLinks: [],
    loading: false,
    error: null
  })
}));

describe('HomeRenderer', () => {
  it('should render basic info', () => {
    render(
      <HomeRenderer
        totalExperience={5}
        totalProjects={10}
        totalEducation={3}
      />
    );
    expect(screen.getByText(/Ivanildo Barauna de Souza Junior/i)).toBeInTheDocument();
  });
});

describe('Home Page', () => {
  it('should render all sections in the correct order', () => {
    render(<Home />);

    // Seleciona todos os títulos das seções
    const headings = screen.getAllByRole('heading', { level: 2 });
    const headingTexts = headings.map(h => h.textContent || '');

    // Garante que Projetos Open Source vem depois de Formação Acadêmica
    const idxProjetos = headingTexts.findIndex(t => /Projetos Open Source/i.test(t));
    const idxFormacao = headingTexts.findIndex(t => /Formação Acadêmica/i.test(t));
    expect(idxProjetos).toBeGreaterThan(idxFormacao);

    // Garante que Experiência Profissional vem antes de Formação Acadêmica
    const idxExperiencia = headingTexts.findIndex(t => /Experiência Profissional/i.test(t));
    expect(idxExperiencia).toBeLessThan(idxFormacao);

    // Garante que 'Interessado em Colaborar?' aparece após 'Projetos Open Source'
    const idxColaborar = headingTexts.findIndex(t => /Interessado em Colaborar/i.test(t));
    expect(idxColaborar).toBeGreaterThan(idxProjetos);
  });
});
