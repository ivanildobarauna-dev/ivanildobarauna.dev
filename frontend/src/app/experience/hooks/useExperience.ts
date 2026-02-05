import { useState, useEffect } from 'react';
import { Experience } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

interface CompanyDuration {
  name: string;
  duration: string;
}

interface ExperienceData {
  experiences: Record<string, Experience[]>;
  loading: boolean;
  error: string | null;
  tempoTotalCarreira: string;
  fromCache: boolean;
}

export function useExperience(): ExperienceData {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempoTotalCarreira, setTempoTotalCarreira] = useState<string>('');
  const [companyDurations, setCompanyDurations] = useState<Record<string, string>>({});
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Cache keys
      const EXPERIENCES_CACHE_KEY = 'experiences';
      const COMPANY_DURATIONS_CACHE_KEY = 'company_durations';
      const TOTAL_DURATION_CACHE_KEY = 'total_duration';

      try {
        // Try to get from cache first
        const cachedExperiences = BrowserCache.get<Experience[]>(EXPERIENCES_CACHE_KEY);
        const cachedDurations = BrowserCache.get<CompanyDuration[]>(COMPANY_DURATIONS_CACHE_KEY);
        const cachedTotal = BrowserCache.get<{ total_duration: string }>(TOTAL_DURATION_CACHE_KEY);

        if (cachedExperiences && cachedDurations && cachedTotal) {
          // All data available in cache - use it!
          setFromCache(true);

          setExperiences(cachedExperiences);

          const durationsMap: Record<string, string> = {};
          cachedDurations.forEach((item: CompanyDuration) => {
            durationsMap[item.name] = item.duration;
          });
          setCompanyDurations(durationsMap);

          setTempoTotalCarreira(cachedTotal.total_duration);
          setLoading(false);
          return; // Exit early with cached data
        }

        // Cache miss - fetch from API
        setFromCache(false);

        // Buscar experiências
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
            throw new Error(`Falha ao carregar as experiências. Status: ${experiencesResponse.status}`);
          }

          const jsonData = await experiencesResponse.json();

          if (!Array.isArray(jsonData)) {
            throw new Error('Resposta inválida: os dados não são um array');
          }

          // Garantir que os campos opcionais tenham valores padrão
          return jsonData.map(exp => ({
            ...exp,
            skills: exp.skills || '',
            companyLogo: exp.companyLogo || exp.logo,
            website: exp.website || exp.companyUrl
          })) as Experience[];
        });

        setExperiences(experiencesData);
        BrowserCache.set(EXPERIENCES_CACHE_KEY, experiencesData); // Cache it

        // Buscar duração por empresa
        const companyDurationsEndpoint = getBackendEndpoint('/experiences?company_duration=true');
        const durationsData = await retryAsync(async () => {
          const companyDurationsResponse = await fetch(companyDurationsEndpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          });

          if (!companyDurationsResponse.ok) {
            throw new Error(`Falha ao carregar as durações por empresa. Status: ${companyDurationsResponse.status}`);
          }

          const jsonData = await companyDurationsResponse.json();

          if (!Array.isArray(jsonData)) {
            throw new Error('Resposta inválida de durações: os dados não são um array');
          }

          return jsonData as CompanyDuration[];
        });

        // Mapear durações por empresa
        const durationsMap: Record<string, string> = {};
        durationsData.forEach((item: CompanyDuration) => {
          durationsMap[item.name] = item.duration;
        });

        setCompanyDurations(durationsMap);
        BrowserCache.set(COMPANY_DURATIONS_CACHE_KEY, durationsData); // Cache it

        // Buscar tempo total de carreira
        const totalDurationEndpoint = getBackendEndpoint('/experiences?total_duration=true');
        const totalData = await retryAsync(async () => {
          const totalDurationResponse = await fetch(totalDurationEndpoint, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          });

          if (!totalDurationResponse.ok) {
            throw new Error(`Falha ao carregar o tempo total. Status: ${totalDurationResponse.status}`);
          }

          return totalDurationResponse.json();
        });

        if (typeof totalData.total_duration === 'string') {
          setTempoTotalCarreira(totalData.total_duration);
          BrowserCache.set(TOTAL_DURATION_CACHE_KEY, totalData); // Cache it
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
    tempoTotalCarreira,
    fromCache
  };
} 
