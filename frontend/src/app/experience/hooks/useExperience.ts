import { useState, useEffect } from 'react';
import { Experience } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';

interface CompanyDuration {
  name: string;
  duration: string;
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
  const [companyDurations, setCompanyDurations] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar experiências
        const experiencesEndpoint = getBackendEndpoint('/experiences');
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

        setExperiences(experiencesData);

        // Buscar duração por empresa
        const companyDurationsEndpoint = getBackendEndpoint('/experiences?company_duration=true');
        const companyDurationsResponse = await fetch(companyDurationsEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!companyDurationsResponse.ok) {
          console.error(`Erro na requisição de durações por empresa: Status ${companyDurationsResponse.status}`);
          const responseText = await companyDurationsResponse.text();
          console.error('Resposta do servidor:', responseText);
          throw new Error(`Falha ao carregar as durações por empresa. Status: ${companyDurationsResponse.status}`);
        }
        
        const durationsData = await companyDurationsResponse.json();
        
        if (!Array.isArray(durationsData)) {
          throw new Error('Resposta inválida de durações: os dados não são um array');
        }
        
        // Mapear durações por empresa
        const durationsMap: Record<string, string> = {};
        durationsData.forEach((item: CompanyDuration) => {
          durationsMap[item.name] = item.duration;
        });
        
        setCompanyDurations(durationsMap);

        // Buscar tempo total de carreira
        const totalDurationEndpoint = getBackendEndpoint('/experiences?total_duration=true');
        const totalDurationResponse = await fetch(totalDurationEndpoint, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!totalDurationResponse.ok) {
          console.error(`Erro na requisição de tempo total: Status ${totalDurationResponse.status}`);
          const responseText = await totalDurationResponse.text();
          console.error('Resposta do servidor:', responseText);
          throw new Error(`Falha ao carregar o tempo total. Status: ${totalDurationResponse.status}`);
        }
        
        const totalData = await totalDurationResponse.json();
        
        if (typeof totalData.total_duration === 'string') {
          setTempoTotalCarreira(totalData.total_duration);
        } else {
          throw new Error('Formato inválido para total_duration');
        }

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
    
    // Adicionar duração da empresa se disponível
    if (companyDurations[exp.company]) {
      exp.duration = companyDurations[exp.company];
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
