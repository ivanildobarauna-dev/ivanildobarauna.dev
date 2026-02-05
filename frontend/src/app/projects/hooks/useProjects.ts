import { useState, useEffect } from 'react';
import { Project } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useProjects(): ProjectsData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const PROJECTS_CACHE_KEY = 'projects';

      try {
        // Try to get from cache first
        const cachedProjects = BrowserCache.get<Project[]>(PROJECTS_CACHE_KEY);

        if (cachedProjects) {
          // Cache hit - use cached data
          console.log('✓ Loading projects data from cache');
          setFromCache(true);
          setProjects(cachedProjects);
          setLoading(false);
          return; // Exit early with cached data
        }

        // Cache miss - fetch from API
        console.log('✗ Cache miss - fetching projects data from API');
        setFromCache(false);

        const projectsEndpoint = getBackendEndpoint('/projects');

        const data = await retryAsync(async () => {
          const response = await fetch(`${projectsEndpoint}`, {
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

          // Processar os dados para garantir que todos os campos necessários existam
          return jsonData.map(project => ({
            ...project,
            projectUrl: project.projectUrl || project.url,
            tags: project.tags || project.technologies?.slice(0, 3) || []
          })) as Project[];
        });

        setProjects(data);
        BrowserCache.set(PROJECTS_CACHE_KEY, data); // Cache it
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

    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fromCache
  };
} 
