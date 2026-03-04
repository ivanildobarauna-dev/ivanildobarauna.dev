import { useState, useEffect } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

interface TotalProjectsData {
  totalProjects: string;
  loading: boolean;
  error: string | null;
}

export function useTotalProjects(): TotalProjectsData {
  const [totalProjects, setTotalProjects] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalProjects = async () => {
      const TOTAL_PROJECTS_CACHE_KEY = 'total_projects';

      try {
        const cached = BrowserCache.get<string>(TOTAL_PROJECTS_CACHE_KEY);
        if (cached) {
          setTotalProjects(cached);
          setLoading(false);
          return;
        }

        const projectsEndpoint = getBackendEndpoint('/projects');

        const data = await retryAsync(async () => {
          const response = await fetch(projectsEndpoint, {
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
            throw new Error(`Falha ao carregar os projetos. Status: ${response.status}`);
          }

          const jsonData = await response.json();

          if (!Array.isArray(jsonData)) {
            throw new Error('Resposta inválida: os dados não são um array');
          }

          return jsonData as unknown[];
        });

        const total = `${data.length}+`;
        BrowserCache.set(TOTAL_PROJECTS_CACHE_KEY, total);
        setTotalProjects(total);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar os projetos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProjects();
  }, []);

  return {
    totalProjects,
    loading,
    error
  };
} 
