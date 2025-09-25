'use client';
import { useEffect, useState } from 'react';
import { SectionDataProvider } from '@/contexts/SectionDataContext';
import { useSocialMedia } from './hooks/useSocialMedia';
import Loading from '@/components/Loading';
import AlertMessage from '@/components/AlertMessage';
import HeroSection from '@/components/HeroSection';
import About from '@/components/About';
import LazyExperienceSection from '@/components/LazyExperienceSection';
import LazyProjectsSection from '@/components/LazyProjectsSection';
import LazyEducationSection from '@/components/LazyEducationSection';
import Footer from '@/components/Footer';

// This component wraps the app to provide section data context
function AppContent() {
  const { socialMedia, loading, error } = useSocialMedia();
  const [isClient, setIsClient] = useState(false);

  // This ensures we're in the browser before rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AlertMessage 
        message="Erro ao carregar dados iniciais"
        severity="error"
      />
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="scroll-mt-20">
        <HeroSection socialMedia={socialMedia} />
      </section>

      {/* About Section - Always loaded since it's lightweight */}
      <section id="about" className="scroll-mt-20">
        <About />
      </section>

      {/* Experience Section - Lazy loaded */}
      <LazyExperienceSection />

      {/* Projects Section - Lazy loaded */}
      <LazyProjectsSection />

      {/* Education Section - Lazy loaded */}
      <LazyEducationSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <SectionDataProvider>
      <AppContent />
    </SectionDataProvider>
  );
}
