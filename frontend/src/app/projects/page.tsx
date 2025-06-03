'use client';

import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import { useProjects } from './hooks/useProjects';
import { ProjectsRenderer } from './components/ProjectsRenderer';

export default function Projects() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AlertMessage 
        message={`Não foi possível carregar os projetos`}
        description={`Detalhes do erro: ${error}. Por favor, tente novamente mais tarde.`}
        severity="error"
      />
    );
  }

  return <ProjectsRenderer projects={projects} />;
} 
