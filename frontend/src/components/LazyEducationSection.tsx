'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSectionData } from '@/contexts/SectionDataContext';
import { useLazyEducation } from '@/app/education/hooks/useLazyEducation';
import type { Certification } from '@/app/education/interfaces';
import EducationSection from './EducationSection';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export default function LazyEducationSection() {
  const { loadedSections, setSectionLoaded } = useSectionData();
  const {
    formations,
    certifications,
    loading,
    error,
    fetchEducation
  } = useLazyEducation();
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadEducationData = useCallback(async () => {
    if (!loadedSections.education && !loading) {
      await fetchEducation();
      setSectionLoaded('education');
      setHasLoaded(true);
    }
  }, [loadedSections.education, loading, fetchEducation, setSectionLoaded]);

  // Load data when section comes into view if not already loaded
  useEffect(() => {
    if (isInView && !loadedSections.education && !hasLoaded) {
      loadEducationData();
    }
  }, [isInView, loadedSections.education, hasLoaded, loadEducationData]);

  const handleLoadClick = useCallback(() => {
    loadEducationData();
  }, [loadEducationData]);

  // If data is loading
  if (loading) {
    return (
      <section id="education" className="py-20 px-4 bg-background min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando formação e certificações...</p>
        </div>
      </section>
    );
  }

  // If there was an error
  if (error) {
    return (
      <section id="education" className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Formação & <span className="text-gradient">Certificações</span>
          </h2>
          <p className="text-red-500 mb-4">Erro ao carregar dados acadêmicos: {error}</p>
          <Button onClick={handleLoadClick} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </section>
    );
  }

  // Format certifications as a Record<string, Certification[]>
  const formattedCertifications = useMemo(() => {
    const certsByInstitution: Record<string, Certification[]> = {};
    
    certifications.forEach(cert => {
      const institution = cert.institution || 'Outros';
      if (!certsByInstitution[institution]) {
        certsByInstitution[institution] = [];
      }
      certsByInstitution[institution].push(cert);
    });
    
    return certsByInstitution;
  }, [certifications]);

  // If data is loaded, show the actual education section
  if (hasLoaded || loadedSections.education) {
    return (
      <section id="education" className="scroll-mt-20">
        <EducationSection 
          formations={formations} 
          certifications={formattedCertifications} 
        />
      </section>
    );
  }

  // Initial state - show a placeholder with a load button
  return (
    <section 
      id="education" 
      className="py-20 px-4 bg-background min-h-[300px] flex items-center justify-center border-b"
      onMouseEnter={() => setIsInView(true)}
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Formação & <span className="text-gradient">Certificações</span>
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Clique no botão abaixo para visualizar minha formação acadêmica e certificações
        </p>
        <Button onClick={handleLoadClick} size="lg">
          Mostrar Formação
        </Button>
      </div>
    </section>
  );
}
