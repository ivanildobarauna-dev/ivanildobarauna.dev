export interface Experience {
    position: string;
    company: string;
    period?: string;
    location: string;
    website?: string;
    logo?: string;
    actual_job?: boolean;
    skills: string;
    description: string;
    start_date?: string; 
    duration?: string;
  }

// Interface para os dados de duração por empresa
export interface CompanyDuration {
    name: string;
    duration: string;
  }
  
