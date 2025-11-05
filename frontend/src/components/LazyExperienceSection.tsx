'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
    fetchExperiences
  } = useLazyExperience();
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadExperienceData = useCallback(async () => {
    if (!loadedSections.experience && !loading) {
      const wasSuccessful = await fetchExperiences();
      if (wasSuccessful) {
        setSectionLoaded('experience');
        setHasLoaded(true);
      }
    }
  }, [
    loadedSections.experience,
    loading,
    fetchExperiences,
    setSectionLoaded,
    setHasLoaded,
  ]);

  // Load data when section comes into view if not already loaded
  useEffect(() => {
    if (isInView && !loadedSections.experience && !hasLoaded) {
      loadExperienceData();
    }
  }, [isInView, loadedSections.experience, hasLoaded, loadExperienceData]);

  const handleLoadClick = useCallback(() => {
    loadExperienceData();
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
  if (hasLoaded || loadedSections.experience) {
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
      className="py-20 px-4 bg-background min-h-[300px] flex items-center justify-center border-b"
      onMouseEnter={() => setIsInView(true)}
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
