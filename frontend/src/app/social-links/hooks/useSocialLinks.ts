import { useState, useEffect } from 'react';
import { SocialLink } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';
import { BrowserCache } from '@/utils/cacheService';

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
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const SOCIAL_LINKS_CACHE_KEY = 'social_links';

      try {
        // Try to get from cache first
        const cachedSocialLinks = BrowserCache.get<SocialLink[]>(SOCIAL_LINKS_CACHE_KEY);

        if (cachedSocialLinks) {
          setFromCache(true);
          setSocialLinks(cachedSocialLinks);
          setLoading(false);
          return; // Exit early with cached data
        }

        // Cache miss - fetch from API
        setFromCache(false);

        const socialLinksEndpoint = getBackendEndpoint('/social-media-links');

        const data = await retryAsync(async () => {
          const response = await fetch(`${socialLinksEndpoint}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
          });

          if (!response.ok) {
            throw new Error(`Falha ao carregar os links sociais. Status: ${response.status}`);
          }

          const jsonData = await response.json();

          if (!Array.isArray(jsonData)) {
            throw new Error('Resposta inválida: os dados não são um array');
          }

          return jsonData as SocialLink[];
        });

        setSocialLinks(data);
        BrowserCache.set(SOCIAL_LINKS_CACHE_KEY, data); // Cache it
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro desconhecido ao carregar os links sociais');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  return {
    socialLinks,
    loading,
    error,
    fromCache
  };
}
