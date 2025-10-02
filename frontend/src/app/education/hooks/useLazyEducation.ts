import { useState, useCallback } from 'react';
import type { Formation, Certification } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface EducationData {
  formations: Formation[];
  certifications: Certification[];
  loading: boolean;
  error: string | null;
  fetchEducation: () => Promise<void>;
}

export function useLazyEducation(): EducationData {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchEducation = useCallback(async () => {
    if (hasFetched) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch formations
      const formationsEndpoint = getBackendEndpoint('/education/formations');
      const formationsData = await retryAsync(async () => {
        const response = await fetch(formationsEndpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load formations. Status: ${response.status}`,
          );
        }
        return response.json();
      });

      // Fetch certifications
      const certsEndpoint = getBackendEndpoint('/education/certifications');
      const certsData = await retryAsync(async () => {
        const response = await fetch(certsEndpoint, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load certifications. Status: ${response.status}`,
          );
        }
        return response.json();
      });

      setFormations(Array.isArray(formationsData) ? formationsData : []);
      setCertifications(Array.isArray(certsData) ? certsData : []);
      setHasFetched(true);
    } catch (err) {
      console.error('Error loading education data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error loading education data',
      );
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
