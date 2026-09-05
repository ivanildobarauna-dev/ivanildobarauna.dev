import { useEffect, useState } from 'react';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

interface TotalEducationData {
  totalEducation: string;
  loading: boolean;
  error: string | null;
}

export function useTotalEducation(): TotalEducationData {
  const [totalEducation, setTotalEducation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ education }) => setTotalEducation(`${education.formations.length + education.certifications.length}+`))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar a educação'))
      .finally(() => setLoading(false));
  }, []);

  return { totalEducation, loading, error };
}
