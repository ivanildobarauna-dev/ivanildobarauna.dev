import { useState, useCallback } from 'react';
import type { Project } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<boolean>;
}

export function useLazyProjects(): ProjectsData {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (hasFetched) return true;

    setLoading(true);
    setError(null);

    try {
      const projectsEndpoint = getBackendEndpoint('/projects');
      const projectsData = await retryAsync(async () => {
        const response = await fetch(projectsEndpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          console.error(`Error fetching projects: Status ${response.status}`);
          const responseText = await response.text();
          console.error('Server response:', responseText);
          throw new Error(
            `Failed to load projects. Status: ${response.status}`,
          );
        }

        const jsonData = await response.json();

        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid response: expected an array of projects');
        }
        return jsonData;
      });

      setProjects(projectsData);
      setHasFetched(true);
      return true;
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error loading projects',
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
  };
}
