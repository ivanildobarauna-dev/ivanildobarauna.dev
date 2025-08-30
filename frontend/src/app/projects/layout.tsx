import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Explore os projetos de Ivanildo Barauna em engenharia de dados, automações e desenvolvimento de software.',
  openGraph: {
    title: 'Projetos - Ivanildo Barauna',
    description: 'Conheça os projetos em Python, Golang e soluções de dados desenvolvidos por Ivanildo Barauna.',
    url: 'https://ivanildobarauna.dev/projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
