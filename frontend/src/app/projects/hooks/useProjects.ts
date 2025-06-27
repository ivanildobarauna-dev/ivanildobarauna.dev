import { useState, useEffect } from 'react';
import { Project } from '@/interfaces/Project';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export function useProjects(): ProjectsData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
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

          return jsonData as Project[];
        });

        setProjects(data);
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
    error
  };
} 