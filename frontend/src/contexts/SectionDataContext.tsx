'use client';

import { createContext, useContext, type ReactNode, useState, useCallback } from 'react';

export type SectionType = 'experience' | 'projects' | 'education';

interface SectionDataContextType {
  loadedSections: Record<SectionType, boolean>;
  setSectionLoaded: (section: SectionType, loaded?: boolean) => void;
}

const SectionDataContext = createContext<SectionDataContextType | undefined>(undefined);

export function SectionDataProvider({ children }: { children: ReactNode }) {
  const [loadedSections, setLoadedSections] = useState<Record<SectionType, boolean>>({
    experience: false,
    projects: false,
    education: false,
  });

  const setSectionLoaded = useCallback(
    (section: SectionType, loaded = true) => {
      setLoadedSections((prev) => {
        if (prev[section] === loaded) {
          return prev;
        }

        return {
          ...prev,
          [section]: loaded,
        };
      });
    },
    [],
  );

  return (
    <SectionDataContext.Provider value={{ loadedSections, setSectionLoaded }}>
      {children}
    </SectionDataContext.Provider>
  );
}

export function useSectionData() {
  const context = useContext(SectionDataContext);
  if (context === undefined) {
    throw new Error('useSectionData must be used within a SectionDataProvider');
  }
  return context;
}
