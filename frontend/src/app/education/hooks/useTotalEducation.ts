import { useState, useEffect } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface TotalEducationData {
  totalEducation: string;
  loading: boolean;
  error: string | null;
}

export function useTotalEducation(): TotalEducationData {
  const [totalEducation, setTotalEducation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalEducation = async () => {
      try {
        const educationEndpoint = getBackendEndpoint('/education');

        const data = await retryAsync(async () => {
          const response = await fetch(educationEndpoint, {
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
            throw new Error(`Falha ao carregar os dados de educação. Status: ${response.status}`);
          }

          const jsonData = await response.json();

          if (!jsonData.formations || !jsonData.certifications || !Array.isArray(jsonData.formations) || !Array.isArray(jsonData.certifications)) {
            throw new Error('Resposta inválida: os dados não estão no formato esperado');
          }

          return jsonData as { formations: unknown[]; certifications: unknown[] };
        });

        const total = data.formations.length + data.certifications.length;
        setTotalEducation(`${total}+`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar os dados de educação');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEducation();
  }, []);

  return {
    totalEducation,
    loading,
    error
  };
} 
