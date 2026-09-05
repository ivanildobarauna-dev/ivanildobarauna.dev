import { useEffect, useState } from 'react';
import { Project } from '../interfaces';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useProjects(): ProjectsData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ projects }) => {
        if (!Array.isArray(projects)) throw new Error('Snapshot de projetos inválido');
        setProjects(projects.map((project) => {
          const data = project as Record<string, unknown>;
          return { ...data, projectUrl: data.projectUrl || data.url, tags: data.tags || [] };
        }) as Project[]);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar os projetos'))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading, error, fromCache: false };
}
