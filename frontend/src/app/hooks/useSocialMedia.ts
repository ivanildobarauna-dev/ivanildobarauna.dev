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
      const endpoint = getBackendEndpoint('/social-media');
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

      setSocialMedia(Array.isArray(data) ? data : []);
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
