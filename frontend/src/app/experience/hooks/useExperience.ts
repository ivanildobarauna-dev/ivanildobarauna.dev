import { useEffect, useState } from 'react';
import { Experience } from '../interfaces';
import { formatDurationFromStart, getPortfolioSnapshot } from '@/utils/portfolioData';

interface ExperienceData {
  experiences: Record<string, Experience[]>;
  loading: boolean;
  error: string | null;
  tempoTotalCarreira: string;
  fromCache: boolean;
}

export function useExperience(): ExperienceData {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempoTotalCarreira, setTempoTotalCarreira] = useState('');
  const [companyDurations, setCompanyDurations] = useState<Record<string, string>>({});

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ experiences, companyDurations, totalExperience }) => {
        if (!Array.isArray(experiences) || !Array.isArray(companyDurations)) {
          throw new Error('Snapshot de experiências inválido');
        }

        setExperiences(experiences.map((experience) => {
          const data = experience as Record<string, unknown>;
          return {
            ...data,
            skills: data.skills || '',
            companyLogo: data.companyLogo || data.logo,
            website: data.website || data.companyUrl,
            current: Boolean(data.actualJob),
          };
        }) as Experience[]);
        const durations = Object.fromEntries(companyDurations.map(({ name, duration }) => [name, duration]));
        experiences.forEach((experience) => {
          const data = experience as Record<string, unknown>;
          if (data.actualJob && typeof data.startDate === 'string') {
            durations[String(data.company)] = formatDurationFromStart(data.startDate);
          }
        });
        setCompanyDurations(durations);
        setTempoTotalCarreira(totalExperience.total_duration);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar as experiências'))
      .finally(() => setLoading(false));
  }, []);

  const experiencesByCompany = experiences.reduce((acc, experience) => {
    const duration = companyDurations[experience.company];
    const entry = duration ? { ...experience, duration } : experience;
    (acc[experience.company] ??= []).push(entry);
    return acc;
  }, {} as Record<string, Experience[]>);

  return { experiences: experiencesByCompany, loading, error, tempoTotalCarreira, fromCache: false };
}
