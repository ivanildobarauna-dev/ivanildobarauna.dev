import { useState, useEffect, useCallback } from 'react';
import { getBackendEndpoint } from '@/utils/backend_endpoint';
import { retryAsync } from '@/utils/retryAsync';

export interface SocialMediaLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  displayName: string;
  order: number;
}

// Interface para os dados vindos do backend
interface BackendSocialMedia {
  label: string;
  type: string;
  url: string;
}

interface SocialMediaData {
  socialMedia: SocialMediaLink[];
  loading: boolean;
  error: string | null;
}

export function useSocialMedia(): SocialMediaData {
  const [socialMedia, setSocialMedia] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialMedia = useCallback(async () => {
    try {
      const endpoint = getBackendEndpoint('/social-media-links');
      const data = await retryAsync(async () => {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load social media links. Status: ${response.status}`,
          );
        }
        return response.json();
      });

      console.log('📊 Dados recebidos do backend:', data);
      
      // Transforma os dados do backend para o formato esperado pelo frontend
      if (Array.isArray(data)) {
        const transformedData: SocialMediaLink[] = data.map((item: BackendSocialMedia, index: number) => ({
          id: item.type || `social-${index}`,
          name: item.type || '',
          url: item.url || '',
          icon: item.type || '',
          displayName: item.label || '',
          order: index,
        }));
        
        console.log('✅ Dados transformados:', transformedData);
        setSocialMedia(transformedData);
      } else {
        setSocialMedia([]);
      }
    } catch (err) {
      console.error('Error loading social media links:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unknown error loading social media links',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSocialMedia();
  }, [fetchSocialMedia]);

  return { socialMedia, loading, error };
}
