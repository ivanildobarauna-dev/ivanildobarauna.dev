import { useState, useEffect } from 'react';
import { Formation, Certification } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';

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
        
        const data = await response.json();
        
        if (!data.formations || !data.certifications || !Array.isArray(data.formations) || !Array.isArray(data.certifications)) {
          throw new Error('Resposta inválida: os dados não estão no formato esperado');
        }
        
        const formationsMapped = data.formations.map((formation: any) => ({
          institution: formation.institution,
          type: formation.type,
          course: formation.course,
          period: formation.period,
          activities: formation.activities,
          subjects: formation.subjects,
          logo: formation.logo,
          website: formation.website
        }));
        
        setFormations(formationsMapped);
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