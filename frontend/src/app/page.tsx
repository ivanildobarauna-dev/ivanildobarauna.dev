'use client';

import { useTotalExperience } from './experience/hooks/useTotalExperience';
import { useTotalProjects } from './projects/hooks/useTotalProjects';
import { useTotalEducation } from './education/hooks/useTotalEducation';
import { useExperience } from './experience/hooks/useExperience';
import { useProjects } from './projects/hooks/useProjects';
import { useEducation } from './education/hooks/useEducation';
import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import HomeRenderer from './components/HomeRenderer';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';

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
  const { totalExperience, loading: loadingTotalExperience, error: errorTotalExperience } = useTotalExperience();
  const { totalProjects, loading: loadingTotalProjects, error: errorTotalProjects } = useTotalProjects();
  const { totalEducation, loading: loadingTotalEducation, error: errorTotalEducation } = useTotalEducation();
  const { experiences, loading: loadingExperience, error: errorExperience, tempoTotalCarreira } = useExperience();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();
  const { formations, certifications, loading: loadingEducation, error: errorEducation } = useEducation();

  const isLoading = loadingTotalExperience || loadingTotalProjects || loadingTotalEducation || loadingExperience || loadingProjects || loadingEducation;
  const isError = errorTotalExperience || errorTotalProjects || errorTotalEducation || errorExperience || errorProjects || errorEducation;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <AlertMessage 
        message="Erro ao carregar dados"
        severity="error"
      />
    );
  }

  return (
    <main className="space-y-16 md:space-y-24">
      <HomeRenderer
        totalExperience={parseNumber(totalExperience)}
        totalProjects={parseNumber(totalProjects)}
        totalEducation={parseNumber(totalEducation)}
        activeButton={null}
      />
      
      <section id="experience">
        <ExperienceSection experiences={experiences} tempoTotalCarreira={tempoTotalCarreira} />
      </section>
      
      <section id="projects">
        <ProjectsSection projects={projects} />
      </section>
      
      <section id="education">
        <EducationSection formations={formations} certifications={certifications} />
      </section>
    </main>
  );
}