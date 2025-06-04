'use client';

import { useEffect, useState } from 'react';
import { useTotalExperience } from './experience/hooks/useTotalExperience';
import { useTotalProjects } from './projects/hooks/useTotalProjects';
import { useTotalEducation } from './education/hooks/useTotalEducation';
import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import HomeRenderer from './components/HomeRenderer';

const parseNumber = (value: any): number => {
  if (typeof value === 'string') {
    // Remove o '+' do final da string, se existir
    const cleanValue = value.replace(/\+$/, '');
    const num = Number(cleanValue);
    return isNaN(num) ? 0 : num;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export default function Home() {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const { totalExperience, loading: loadingExperience, error: errorExperience } = useTotalExperience();
  const { totalProjects, loading: loadingProjects, error: errorProjects } = useTotalProjects();
  const { totalEducation, loading: loadingEducation, error: errorEducation } = useTotalEducation();

  useEffect(() => {
    const animateButtons = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(0);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(1);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(2);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(null);
    };

    animateButtons();
  }, []);

  if (loadingExperience || loadingProjects || loadingEducation) {
    return <Loading />;
  }

  if (errorExperience || errorProjects || errorEducation) {
    return (
      <AlertMessage 
        message="Erro ao carregar dados"
        severity="error"
      />
    );
  }

  return (
    <main>
      <HomeRenderer
        totalExperience={parseNumber(totalExperience)}
        totalProjects={parseNumber(totalProjects)}
        totalEducation={parseNumber(totalEducation)}
        activeButton={activeButton}
      />
    </main>
  );
}
