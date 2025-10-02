import { useState, useCallback, useMemo } from 'react';
import type { Experience } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface ExperienceData {
  experiences: Record<string, Experience[]>;
  loading: boolean;
  error: string | null;
  tempoTotalCarreira: string;
  fetchExperiences: () => Promise<void>;
}

export function useLazyExperience(): ExperienceData {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempoTotalCarreira, setTempoTotalCarreira] = useState<string>('');
  const [hasFetched, setHasFetched] = useState(false);

  const fetchExperiences = useCallback(async () => {
    if (hasFetched) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const experiencesEndpoint = getBackendEndpoint('/experiences');
      const experiencesData = await retryAsync(async () => {
        const experiencesResponse = await fetch(experiencesEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!experiencesResponse.ok) {
              const responseText = await experiencesResponse.text();
          console.error(
            `Erro na requisição de experiências: Status ${experiencesResponse.status}`,
            'Resposta do servidor:',
            responseText,
          );
          throw new Error(
            `Falha ao carregar as experiências. Status: ${experiencesResponse.status}`,
          );
        }

        const jsonData = await experiencesResponse.json();

        if (!Array.isArray(jsonData)) {
          throw new Error('Resposta inválida: os dados não são um array');
        }
        return jsonData;
      });

      setExperiences(experiencesData);
      // Calculate tempoTotalCarreira here if needed
      setTempoTotalCarreira(calculateTotalCareerTime(experiencesData));
      setHasFetched(true);
    } catch (err) {
      console.error('Erro ao carregar experiências:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro desconhecido ao carregar experiências',
      );
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  // Group experiences by company
  const groupedExperiences = useMemo(() => {
    return experiences.reduce<Record<string, Experience[]>>((acc, exp) => {
      if (!acc[exp.company]) {
        acc[exp.company] = [];
      }
      acc[exp.company].push(exp);
      return acc;
    }, {});
  }, [experiences]);

  return {
    experiences: groupedExperiences,
    loading,
    error,
    tempoTotalCarreira,
    fetchExperiences,
  };
}

// Helper function to calculate total career time
function calculateTotalCareerTime(experiences: Experience[]): string {
  if (!experiences || experiences.length === 0) return '0 anos';
  
  // Sort experiences by start date
  const sortedExps = [...experiences].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const firstJob = sortedExps[0];
  const lastJob = sortedExps[sortedExps.length - 1];
  
  const startDate = new Date(firstJob.startDate);
  const endDate = lastJob.current ? new Date() : new Date(lastJob.endDate || new Date());
  
  const diffYears = (endDate.getFullYear() - startDate.getFullYear()) + 
                   (endDate.getMonth() - startDate.getMonth()) / 12;
  
  const years = Math.floor(diffYears);
  const months = Math.round((diffYears - years) * 12);
  
  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (months === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else {
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
}
