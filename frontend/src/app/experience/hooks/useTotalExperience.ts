import { useState, useEffect } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

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
        
        if (typeof data.total_duration === 'string') {
          // Extrair apenas o número de anos da string (ex: "13 anos e 4 meses" -> "13")
          const anosMatch = data.total_duration.match(/(\d+)\s+ano/);
          if (anosMatch && anosMatch[1]) {
            const anos = parseInt(anosMatch[1], 10);
            setTotalExperience(`${anos}+`);
          } else {
            // Caso não encontre o padrão de anos, usar a string completa
            setTotalExperience(data.total_duration);
          }
        } else if (typeof data.total_duration === 'number') {
          // Se for número, usá-lo diretamente
          setTotalExperience(`${Math.floor(data.total_duration)}+`);
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
