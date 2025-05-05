import { useState, useEffect } from 'react';
import { SocialLink } from '../interfaces';
import { getBackendEndpoint } from '@/utils/backend_endpoint';

interface SocialLinksData {
  socialLinks: SocialLink[];
  loading: boolean;
  error: string | null;
}

export function useSocialLinks(): SocialLinksData {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const socialLinksEndpoint = getBackendEndpoint('/social-media-links');

        const response = await fetch(`${socialLinksEndpoint}`, {
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
          throw new Error(`Falha ao carregar os links sociais. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Resposta inválida: os dados não são um array');
        }
        
        setSocialLinks(data);
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
    error
  };
}