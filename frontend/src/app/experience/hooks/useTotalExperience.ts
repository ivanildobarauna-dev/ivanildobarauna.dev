import { useState, useEffect } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

interface TotalExperienceData {
  totalExperience: string;
  loading: boolean;
  error: string | null;
}

function parseTotalDuration(total_duration: string | number): string {
  if (typeof total_duration === 'string') {
    const anosMatch = total_duration.match(/(\d+)\s+ano/);
    if (anosMatch && anosMatch[1]) {
      return `${parseInt(anosMatch[1], 10)}+`;
    }
    return total_duration;
  }
  return `${Math.floor(total_duration)}+`;
}

export function useTotalExperience(): TotalExperienceData {
  const [totalExperience, setTotalExperience] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalExperience = async () => {
      const TOTAL_DURATION_CACHE_KEY = 'total_duration';

      try {
        const cached = BrowserCache.get<{ total_duration: string }>(TOTAL_DURATION_CACHE_KEY);
        if (cached) {
          setTotalExperience(parseTotalDuration(cached.total_duration));
          setLoading(false);
          return;
        }

        const experiencesEndpoint = getBackendEndpoint('/experiences?total_duration=true');

        const data = await retryAsync(async () => {
          const response = await fetch(experiencesEndpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          });

          if (!response.ok) {
            console.error(`Erro na requisição: Status ${response.status}`);
            const responseText = await response.text();
            console.error('Resposta do servidor:', responseText);
            throw new Error(`Falha ao carregar o tempo total de experiência. Status: ${response.status}`);
          }

          return response.json();
        });

        if (typeof data.total_duration === 'string' || typeof data.total_duration === 'number') {
          BrowserCache.set(TOTAL_DURATION_CACHE_KEY, data);
          setTotalExperience(parseTotalDuration(data.total_duration));
        } else {
          throw new Error('Formato inválido para total_duration');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar o tempo total de experiência');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTotalExperience();
  }, []);

  return {
    totalExperience,
    loading,
    error
  };
} 
