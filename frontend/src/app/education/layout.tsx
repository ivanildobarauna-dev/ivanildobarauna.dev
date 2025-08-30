import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formação Acadêmica',
  description: 'Formação acadêmica e certificações de Ivanildo Barauna em tecnologia, engenharia de dados e desenvolvimento de software.',
  openGraph: {
    title: 'Formação Acadêmica - Ivanildo Barauna',
    description: 'Conheça a formação acadêmica, cursos e certificações profissionais de Ivanildo Barauna.',
    url: 'https://ivanildobarauna.dev/education',
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
