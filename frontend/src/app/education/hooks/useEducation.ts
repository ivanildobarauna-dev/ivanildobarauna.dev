import { useState, useEffect } from 'react';
import { Formation, Certification } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

interface EducationData {
  formations: Formation[];
  certifications: Record<string, Certification[]>;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useEducation(): EducationData {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchEducation = async () => {
      const EDUCATION_CACHE_KEY = 'education';

      try {
        // Try to get from cache first
        const cachedEducation = BrowserCache.get<{ formations: Formation[]; certifications: Certification[] }>(EDUCATION_CACHE_KEY);

        if (cachedEducation) {
          // Cache hit - use cached data
          console.log('✓ Loading education data from cache');
          setFromCache(true);
          setFormations(cachedEducation.formations);
          setCertifications(cachedEducation.certifications);
          setLoading(false);
          return; // Exit early with cached data
        }

        // Cache miss - fetch from API
        console.log('✗ Cache miss - fetching education data from API');
        setFromCache(false);

        const educationEndpoint = getBackendEndpoint('/education');

        const data = await retryAsync(async () => {
          const response = await fetch(`${educationEndpoint}`, {
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
            throw new Error(`Falha ao carregar os dados de educação. Status: ${response.status}`);
          }

          const jsonData = await response.json();

          if (!jsonData.formations || !jsonData.certifications || !Array.isArray(jsonData.formations) || !Array.isArray(jsonData.certifications)) {
            throw new Error('Resposta inválida: os dados não estão no formato esperado');
          }

          return jsonData as { formations: Formation[]; certifications: Certification[] };
        });

        // No need to map formations as the format is already compatible
        setFormations(data.formations);
        setCertifications(data.certifications);
        BrowserCache.set(EDUCATION_CACHE_KEY, data); // Cache it
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError('Failed to fetch education data from backend, see logs for more details: ' + error.message);
        } else {
          setError('Unknown error occurred while fetching education data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  // Agrupar certificações por instituição
  const certificationsByInstitution = certifications.reduce((acc, cert) => {
    if (!acc[cert.institution]) {
      acc[cert.institution] = [];
    }
    acc[cert.institution].push(cert);
    return acc;
  }, {} as Record<string, Certification[]>);

  return {
    formations,
    certifications: certificationsByInstitution,
    loading,
    error,
    fromCache
  };
} 
