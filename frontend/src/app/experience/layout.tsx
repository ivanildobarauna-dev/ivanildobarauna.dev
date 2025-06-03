import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experiência Profissional',
  description: 'Conheça a trajetória profissional de Ivanildo Baraúna, com mais de 10 anos de experiência em engenharia de dados e desenvolvimento de software.',
  openGraph: {
    title: 'Experiência Profissional - Ivanildo Baraúna',
    description: 'Histórico profissional detalhado com foco em engenharia de dados, automações e desenvolvimento de software.',
    url: 'https://ivanildobarauna.dev/experience',
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
