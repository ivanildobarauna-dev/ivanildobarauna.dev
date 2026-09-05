import { useEffect, useState } from 'react';
import { Certification, Formation } from '../interfaces';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

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

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ education }) => {
        if (!Array.isArray(education.formations) || !Array.isArray(education.certifications)) {
          throw new Error('Snapshot de educação inválido');
        }
        setFormations(education.formations as Formation[]);
        setCertifications(education.certifications as Certification[]);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar a educação'))
      .finally(() => setLoading(false));
  }, []);

  const certificationsByInstitution = certifications.reduce((acc, certification) => {
    (acc[certification.institution] ??= []).push(certification);
    return acc;
  }, {} as Record<string, Certification[]>);

  return { formations, certifications: certificationsByInstitution, loading, error, fromCache: false };
}
