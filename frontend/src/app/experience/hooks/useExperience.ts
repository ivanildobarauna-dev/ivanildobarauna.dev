import { useState, useEffect } from 'react';
import { Experience } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';

interface DuracaoTotal {
  anos: number;
  meses: number;
}

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
        const experiencesEndpoint = getBackendEndpoint('/experiences');

        // Buscar experiências
        const experiencesResponse = await fetch(experiencesEndpoint, {
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

        // Adicionar duração para cada experiência
        const experiencesWithDuration = experiencesData.map((exp: Experience) => {
          return {
            ...exp,
            duration: calcularDuracao(exp.start_date, exp.actual_job)
          };
        });

        setExperiences(experiencesWithDuration);

        // Calcular tempo total de carreira
        const primeiraDataInicio = experiencesWithDuration
          .map(exp => new Date(exp.start_date))
          .sort((a, b) => a.getTime() - b.getTime())[0];
          
        const tempoTotal = calcularTempoTotalCarreira(primeiraDataInicio);
        setTempoTotalCarreira(`${tempoTotal.anos} ano${tempoTotal.anos !== 1 ? 's' : ''} e ${tempoTotal.meses} m${tempoTotal.meses !== 1 ? 'eses' : 'ês'}`);
      

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
  
  // Função para calcular a duração de uma experiência
  const calcularDuracao = (dataInicio: string, empregoAtual: boolean | undefined): string => {
    const inicio = new Date(dataInicio);
    const fim = empregoAtual ? new Date() : new Date();
    
    const diferencaMeses = (fim.getFullYear() - inicio.getFullYear()) * 12 + 
                           fim.getMonth() - inicio.getMonth();
    
    const anos = Math.floor(diferencaMeses / 12);
    const meses = diferencaMeses % 12;
    
    if (anos > 0 && meses > 0) {
      return `${anos} ano${anos !== 1 ? 's' : ''} e ${meses} m${meses !== 1 ? 'eses' : 'ês'}`;
    } else if (anos > 0) {
      return `${anos} ano${anos !== 1 ? 's' : ''}`;
    } else {
      return `${meses} m${meses !== 1 ? 'eses' : 'ês'}`;
    }
  };
  
  // Função para calcular o tempo total de carreira
  const calcularTempoTotalCarreira = (primeiraData: Date): DuracaoTotal => {
    const hoje = new Date();
    
    const diferencaMeses = (hoje.getFullYear() - primeiraData.getFullYear()) * 12 + 
                          hoje.getMonth() - primeiraData.getMonth();
    
    return {
      anos: Math.floor(diferencaMeses / 12),
      meses: diferencaMeses % 12
    };
  };

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