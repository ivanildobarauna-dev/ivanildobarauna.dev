import { useEffect, useState } from 'react';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

interface TotalExperienceData {
  totalExperience: string;
  loading: boolean;
  error: string | null;
}

function parseTotalDuration(totalDuration: string | number): string {
  if (typeof totalDuration === 'string') {
    const years = totalDuration.match(/(\d+)\s+ano/);
    return years?.[1] ? `${parseInt(years[1], 10)}+` : totalDuration;
  }
  return `${Math.floor(totalDuration)}+`;
}

export function useTotalExperience(): TotalExperienceData {
  const [totalExperience, setTotalExperience] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ totalExperience }) => setTotalExperience(parseTotalDuration(totalExperience.total_duration)))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar a experiência'))
      .finally(() => setLoading(false));
  }, []);

  return { totalExperience, loading, error };
}
