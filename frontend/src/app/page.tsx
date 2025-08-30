'use client';

import { useEffect, useState } from 'react';
import { useTotalExperience } from './experience/hooks/useTotalExperience';
import { useTotalProjects } from './projects/hooks/useTotalProjects';
import { useTotalEducation } from './education/hooks/useTotalEducation';
import { useExperience } from './experience/hooks/useExperience';
import { useProjects } from './projects/hooks/useProjects';
import { useEducation } from './education/hooks/useEducation';
import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import HeroSection from '@/components/HeroSection';
import About from '@/components/About';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import EducationSection from '@/components/EducationSection';
import Footer from '@/components/Footer';

const parseNumber = (value: any): number => {
  if (typeof value === 'string') {
    const cleanValue = value.replace(/\+$/, '');
    const num = Number(cleanValue);
    return isNaN(num) ? 0 : num;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export default function Home() {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  
  // Hooks para dados totais (usados no Hero e About)
  const { totalExperience, loading: loadingExperience, error: errorExperience } = useTotalExperience();
  const { totalProjects, loading: loadingProjects, error: errorProjects } = useTotalProjects();
  const { totalEducation, loading: loadingEducation, error: errorEducation } = useTotalEducation();
  
  // Hooks para dados completos (usados nas seções)
  const { experiences, loading: loadingExpData, error: errorExpData, tempoTotalCarreira } = useExperience();
  const { projects, loading: loadingProjData, error: errorProjData } = useProjects();
  const { formations, certifications, loading: loadingEduData, error: errorEduData } = useEducation();

  // Verificar se todos os dados estão carregando
  const isLoading = loadingExperience || loadingProjects || loadingEducation || 
                   loadingExpData || loadingProjData || loadingEduData;

  // Verificar se há algum erro
  const hasError = errorExperience || errorProjects || errorEducation || 
                  errorExpData || errorProjData || errorEduData;

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return (
      <AlertMessage 
        message="Erro ao carregar dados"
        severity="error"
      />
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        totalExperience={parseNumber(totalExperience)}
        totalProjects={parseNumber(totalProjects)}
        totalEducation={parseNumber(totalEducation)}
        activeButton={activeButton}
      />

      {/* About Section */}
      <About 
        totalExperience={parseNumber(totalExperience)}
        totalProjects={parseNumber(totalProjects)}
        totalEducation={parseNumber(totalEducation)}
      />

      {/* Experience Section */}
      <ExperienceSection 
        experiences={experiences} 
        tempoTotalCarreira={tempoTotalCarreira} 
      />

      {/* Projects Section */}
      <ProjectsSection projects={projects} />

      {/* Education Section */}
      <EducationSection 
        formations={formations} 
        certifications={certifications} 
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
