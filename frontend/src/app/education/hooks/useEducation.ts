import { useState, useEffect } from 'react';
import { Formation, Certification } from '@/interfaces/Education';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

interface EducationData {
  formations: Formation[];
  certifications: Record<string, Certification[]>;
  loading: boolean;
  error: string | null;
}

export function useEducation(): EducationData {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      const educationEndpoint = getBackendEndpoint('/education');

      try {
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

        setFormations(data.formations);
        setCertifications(data.certifications);
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
    error
  };
} 