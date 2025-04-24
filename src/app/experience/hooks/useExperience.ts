import { useState, useEffect } from 'react';
import { Experience } from '../interfaces';

interface ExperienceData {
  experiences: Record<string, Experience[]>;
  loading: boolean;
  error: string | null;
  tempoTotalCarreira: string;
}

export function useExperience(): ExperienceData {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempoTotalCarreira, setTempoTotalCarreira] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        // Buscar experiências
        const experiencesResponse = await fetch(`${backendUrl}/experiences?total_duration=false`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!experiencesResponse.ok) {
          console.error(`Erro na requisição de experiências: Status ${experiencesResponse.status}`);
          const responseText = await experiencesResponse.text();
          console.error('Resposta do servidor:', responseText);
          throw new Error(`Falha ao carregar as experiências. Status: ${experiencesResponse.status}`);
        }
        
        const experiencesData = await experiencesResponse.json();
        
        if (!Array.isArray(experiencesData)) {
          throw new Error('Resposta inválida: os dados não são um array');
        }

        setExperiences(experiencesData);

        // Buscar tempo total
        const totalDurationResponse = await fetch(`${backendUrl}/experiences?total_duration=true`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!totalDurationResponse.ok) {
          console.error(`Erro na requisição de duração total: Status ${totalDurationResponse.status}`);
          const responseText = await totalDurationResponse.text();
          console.error('Resposta do servidor:', responseText);
          throw new Error(`Falha ao carregar a duração total. Status: ${totalDurationResponse.status}`);
        }

        const totalDurationData = await totalDurationResponse.json();
        setTempoTotalCarreira(totalDurationData.total_duration);

      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar os dados');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Agrupar experiências por empresa
  const experienciasPorEmpresa = experiences.reduce((acc: Record<string, Experience[]>, exp: Experience) => {
    if (!acc[exp.company]) {
      acc[exp.company] = [];
    }
    acc[exp.company].push(exp);
    return acc;
  }, {} as Record<string, Experience[]>);

  return {
    experiences: experienciasPorEmpresa,
    loading,
    error,
    tempoTotalCarreira
  };
} 