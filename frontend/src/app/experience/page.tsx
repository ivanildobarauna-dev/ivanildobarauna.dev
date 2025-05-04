'use client';

import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import { useExperience } from './hooks/useExperience';
import { ExperienceRenderer } from './components/ExperienceRenderer';

export default function Experiences() {
  const { experiences, loading, error, tempoTotalCarreira } = useExperience();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AlertMessage 
        message={error}
        severity="error"
      />
    );
  }

  return <ExperienceRenderer experiences={experiences} tempoTotalCarreira={tempoTotalCarreira} />;
} 