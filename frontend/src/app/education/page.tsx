'use client';

import AlertMessage from '@/components/AlertMessage';
import Loading from '@/components/Loading';
import { useEducation } from './hooks/useEducation';
import { EducationRenderer } from './components/EducationRenderer';

export default function Education() {
  const { formations, certifications, loading, error } = useEducation();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AlertMessage 
        message={`Não foi possível carregar os dados de formação`}
        description={`Detalhes do erro: ${error}. Por favor, tente novamente mais tarde.`}
        severity="error"
      />
    );
  }

  return <EducationRenderer formations={formations} certifications={certifications} />;
}