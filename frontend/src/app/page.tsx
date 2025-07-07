'use client';

import { useExperience } from './experience/hooks/useExperience';
import { useProjects } from './projects/hooks/useProjects';
import { useEducation } from './education/hooks/useEducation';
import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import HomeRenderer from './components/HomeRenderer';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { EducationSection } from '@/components/sections/EducationSection';

export default function Home() {
  const { experiences, loading: loadingExperience, error: errorExperience, tempoTotalCarreira } = useExperience();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();
  const { formations, certifications, loading: loadingEducation, error: errorEducation } = useEducation();

  const isLoading = loadingExperience || loadingProjects || loadingEducation;
  const isError = errorExperience || errorProjects || errorEducation;

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
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
      <main className="space-y-16 md:space-y-24">
        <HomeRenderer
          totalExperience={Object.values(experiences).flat().length}
          totalProjects={projects.length}
          totalEducation={formations.length + Object.values(certifications).flat().length}
        />
        
        <section id="experience">
          <ExperienceSection experiences={experiences} tempoTotalCarreira={tempoTotalCarreira} />
        </section>
        
        <section id="education">
          <EducationSection formations={formations} certifications={certifications} />
        </section>
        
        <section id="projects">
          <ProjectsSection projects={projects} />
        </section>
      </main>
    </div>
  );
}