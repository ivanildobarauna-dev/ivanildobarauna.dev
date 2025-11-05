import { useState, useCallback } from 'react';
import type { Formation, Certification } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface EducationData {
  formations: Formation[];
  certifications: Certification[];
  loading: boolean;
  error: string | null;
  fetchEducation: () => Promise<boolean>;
}

export function useLazyEducation(): EducationData {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchEducation = useCallback(async (): Promise<boolean> => {
    if (hasFetched) return true;

    setLoading(true);
    setError(null);

    try {
      // Faz uma única chamada ao endpoint /education
      const educationEndpoint = getBackendEndpoint('/education');
      const educationData = await retryAsync(async () => {
        const response = await fetch(educationEndpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load education data. Status: ${response.status}`,
          );
        }
        return response.json();
      });

      // Separa os dados de formations e certifications
      const formations = educationData?.formations || [];
      const certifications = educationData?.certifications || [];

      console.log('📚 Dados de educação recebidos:', {
        formations: formations.length,
        certifications: certifications.length,
      });

      setFormations(Array.isArray(formations) ? formations : []);
      setCertifications(Array.isArray(certifications) ? certifications : []);
      setHasFetched(true);
      return true;
    } catch (err) {
      console.error('Error loading education data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error loading education data',
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  return {
    formations,
    certifications,
    loading,
    error,
    fetchEducation,
  };
}
