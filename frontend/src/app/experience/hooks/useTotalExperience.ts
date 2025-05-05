import { useState, useEffect } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';

interface TotalExperienceData {
  totalExperience: string;
  loading: boolean;
  error: string | null;
}

export function useTotalExperience(): TotalExperienceData {
  const [totalExperience, setTotalExperience] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalExperience = async () => {
      try {
        const experiencesEndpoint = getBackendEndpoint('/experiences?total_duration=true');

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
        
        const data = await response.json();
        
        // Verifica se data.total_duration existe e é um número
        if (typeof data.total_duration === 'number') {
          setTotalExperience(`${Math.floor(data.total_duration)}+`);
        } else if (typeof data.total_duration === 'string') {
          // Se for string, tenta converter para número
          const numericValue = parseFloat(data.total_duration);
          if (!isNaN(numericValue)) {
            setTotalExperience(`${Math.floor(numericValue)}+`);
          } else {
            setTotalExperience(data.total_duration);
          }
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