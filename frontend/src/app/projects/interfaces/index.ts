export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  featured?: boolean;
  tags?: string[];
  company?: string;
  role?: string;
  responsibilities?: string[];
  results?: string[];
  challenges?: string[];
  screenshots?: {
    url: string;
    alt: string;
  }[];
  videoUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
  status?: 'active' | 'completed' | 'on-hold' | 'archived';
  teamSize?: number;
  client?: string;
  industry?: string;
}

export interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  categories: string[];
  technologies: string[];
  featured: Project[];
  recent: Project[];
  popular: Project[];
}

export interface ProjectFilters {
  search?: string;
  categories?: string[];
  technologies?: string[];
  featured?: boolean;
  archived?: boolean;
  status?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
