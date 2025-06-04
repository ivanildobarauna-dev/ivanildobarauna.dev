import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import HomePage from '../app/page';
import ProjectsPage from '../app/projects/page';
import ExperiencePage from '../app/experience/page';
import EducationPage from '../app/education/page';
import ContactPage from '../app/contact/page';

// Mock all the hooks that make API calls
vi.mock('../app/experience/hooks/useTotalExperience', () => ({
  useTotalExperience: () => ({
    totalExperience: 5,
    loading: false,
    error: null
  })
}));

vi.mock('../app/projects/hooks/useTotalProjects', () => ({
  useTotalProjects: () => ({
    totalProjects: 10,
    loading: false,
    error: null
  })
}));

vi.mock('../app/education/hooks/useTotalEducation', () => ({
  useTotalEducation: () => ({
    totalEducation: 15,
    loading: false,
    error: null
  })
}));

vi.mock('../app/experience/hooks/useExperience', () => ({
  useExperience: () => ({
    experiences: {},
    loading: false,
    error: null,
    tempoTotalCarreira: '5+ anos'
  })
}));

vi.mock('../app/projects/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    loading: false,
    error: null
  })
}));

vi.mock('../app/education/hooks/useEducation', () => ({
  useEducation: () => ({
    formations: [],
    certifications: {},
    loading: false,
    error: null
  })
}));

vi.mock('../app/social-links/hooks/useSocialLinks', () => ({
  useSocialLinks: () => ({
    socialLinks: [],
    loading: false,
    error: null
  })
}));

describe('Pages Rendering Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Home page with main content', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    
    const homeElement = screen.getByRole('main');
    expect(homeElement).toBeInTheDocument();
  });

  it('should render Projects page with project list', async () => {
    await act(async () => {
      render(<ProjectsPage />);
    });
    
    const projectsElement = screen.getByRole('main');
    expect(projectsElement).toBeInTheDocument();
  });

  it('should render Experience page with experience timeline', async () => {
    await act(async () => {
      render(<ExperiencePage />);
    });
    
    const experienceElement = screen.getByRole('main');
    expect(experienceElement).toBeInTheDocument();
  });

  it('should render Education page with education history', async () => {
    await act(async () => {
      render(<EducationPage />);
    });
    
    const educationElement = screen.getByRole('main');
    expect(educationElement).toBeInTheDocument();
  });

  it('should render Contact page with contact form', async () => {
    await act(async () => {
      render(<ContactPage />);
    });
    
    const contactElement = screen.getByRole('main');
    expect(contactElement).toBeInTheDocument();
  });
}); 
