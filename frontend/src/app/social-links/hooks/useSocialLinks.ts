import { useEffect, useState } from 'react';
import { SocialLink } from '../interfaces';
import { getPortfolioSnapshot } from '@/utils/portfolioData';

interface SocialLinksData {
  socialLinks: SocialLink[];
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

export function useSocialLinks(): SocialLinksData {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPortfolioSnapshot()
      .then(({ socialMedia }) => {
        if (!Array.isArray(socialMedia)) throw new Error('Snapshot de links sociais inválido');
        setSocialLinks(socialMedia as SocialLink[]);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Erro ao carregar os links sociais'))
      .finally(() => setLoading(false));
  }, []);

  return { socialLinks, loading, error, fromCache: false };
}
