export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo?: string;
  companyUrl?: string;
  website?: string;
  duration?: string;
  period?: string;
  skills?: string; // String separada por ponto e vírgula
}

export interface ExperienceData {
  experiences: Record<string, Experience[]>;
  loading: boolean;
  error: string | null;
  tempoTotalCarreira: string;
}
