import { useEffect, useState } from 'react';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

interface TotalProjectsData {
  totalProjects: string;
  loading: boolean;
  error: string | null;
}

export function useTotalProjects(): TotalProjectsData {
  const [totalProjects, setTotalProjects] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ projects }) => setTotalProjects(`${projects.length}+`))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar os projetos'))
      .finally(() => setLoading(false));
  }, []);

  return { totalProjects, loading, error };
}
