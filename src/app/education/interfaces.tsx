export interface Formation {
    institution: string;
    type: string;
    course: string;
    period: string;
    activities: string;
    subjects: string[];
    logo?: string;
    website?: string;
  }
  
export interface Certification {
    name: string;
    institution: string;
    credential_url?: string;
    logo?: string;
}