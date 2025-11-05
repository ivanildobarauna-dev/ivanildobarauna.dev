'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useInView } from 'framer-motion';
import { useSectionData } from '@/contexts/SectionDataContext';
import { useLazyExperience } from '@/app/experience/hooks/useLazyExperience';
import ExperienceSection from './ExperienceSection';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export default function LazyExperienceSection() {
  const { loadedSections, setSectionLoaded } = useSectionData();
  const {
    experiences,
    loading,
    error,
    tempoTotalCarreira,
    fetchExperiences,
    hasFetched,
  } = useLazyExperience();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  /**
   * Attempts to fetch the experience data if it has not been loaded yet.
   */
  const loadExperienceData = useCallback(async () => {
    if (loadedSections.experience || loading) {
      return;
    }

    const success = await fetchExperiences();
    setSectionLoaded('experience', success);
  }, [loadedSections.experience, loading, fetchExperiences, setSectionLoaded]);

  // Load data when section comes into view if not already loaded
  useEffect(() => {
    if (isInView && !loadedSections.experience && !loading) {
      void loadExperienceData();
    }
  }, [isInView, loadedSections.experience, loading, loadExperienceData]);

  /**
   * Handles manual data loading when the user clicks the button.
   */
  const handleLoadClick = useCallback(() => {
    void loadExperienceData();
  }, [loadExperienceData]);

  // If data is loading
  if (loading) {
    return (
      <section id="experience" className="py-20 px-4 bg-background min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando experiências...</p>
        </div>
      </section>
    );
  }

  // If there was an error
  if (error) {
    return (
      <section id="experience" className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experiência <span className="text-gradient">Profissional</span>
          </h2>
          <p className="text-red-500 mb-4">Erro ao carregar experiências: {error}</p>
          <Button onClick={handleLoadClick} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </section>
    );
  }

  // If data is loaded, show the actual experience section
  if (hasFetched || loadedSections.experience) {
    return (
      <section id="experience" className="scroll-mt-20">
        <ExperienceSection
          experiences={experiences} 
          tempoTotalCarreira={tempoTotalCarreira} 
        />
      </section>
    );
  }

  // Initial state - show a placeholder with a load button
  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 px-4 bg-background min-h-[300px] flex items-center justify-center border-b"
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Experiência <span className="text-gradient">Profissional</span>
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Clique no botão abaixo para visualizar minha experiência profissional
        </p>
        <Button onClick={handleLoadClick} size="lg">
          Mostrar Experiência
        </Button>
      </div>
    </section>
  );
}
