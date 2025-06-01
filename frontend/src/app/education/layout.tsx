import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formação Acadêmica',
  description: 'Formação acadêmica e certificações de Ivanildo Baraúna em tecnologia, engenharia de dados e desenvolvimento de software.',
  openGraph: {
    title: 'Formação Acadêmica - Ivanildo Baraúna',
    description: 'Conheça a formação acadêmica, cursos e certificações profissionais de Ivanildo Baraúna.',
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