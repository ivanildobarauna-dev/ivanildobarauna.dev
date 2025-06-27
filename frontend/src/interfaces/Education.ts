export interface Formation {
    institution: string;
    type: string;
    course: string;
    period: string;
    description: string;
    logo?: string;
  }
  
export interface Certification {
    name: string;
    institution: string;
    credential_url: string | null;
    logo?: string;
}
