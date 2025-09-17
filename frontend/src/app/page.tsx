'use client';
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

const parseNumber = (value: string | number): number => {
  if (typeof value === 'string') {
    const cleanValue = value.replace(/\+$/, '');
    const num = Number(cleanValue);
    return isNaN(num) ? 0 : num;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export default function Home() {
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
      <section id="home" className="scroll-mt-20">
        <HeroSection />
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-20">
        <About 
          totalExperience={parseNumber(totalExperience)}
          totalProjects={parseNumber(totalProjects)}
          totalEducation={parseNumber(totalEducation)}
        />
      </section>

      {/* Experience Section */}
      <section id="experience" className="scroll-mt-20">
        <ExperienceSection 
          experiences={experiences} 
          tempoTotalCarreira={tempoTotalCarreira} 
        />
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <ProjectsSection projects={projects} />
      </section>

      {/* Education Section */}
      <section id="education" className="scroll-mt-20">
        <EducationSection 
          formations={formations} 
          certifications={certifications} 
        />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
