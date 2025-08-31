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

// Mock react-icons to avoid import issues
vi.mock('react-icons/fa', () => ({
  FaGithub: () => <span data-testid="github-icon" />,
  FaLinkedin: () => <span data-testid="linkedin-icon" />,
  FaEnvelope: () => <span data-testid="email-icon" />,
  FaStackOverflow: () => <span data-testid="stackoverflow-icon" />,
  FaDownload: () => <span data-testid="download-icon" />,
  FaChevronDown: () => <span data-testid="chevron-down-icon" />,
  FaMapMarkerAlt: () => <span data-testid="location-icon" />,
  FaCode: () => <span data-testid="code-icon" />,
  FaDatabase: () => <span data-testid="database-icon" />,
  FaPalette: () => <span data-testid="palette-icon" />,
  FaRocket: () => <span data-testid="rocket-icon" />,
  FaPython: () => <span data-testid="python-icon" />,
  FaDocker: () => <span data-testid="docker-icon" />,
  FaCloud: () => <span data-testid="cloud-icon" />,
  FaExternalLinkAlt: () => <span data-testid="external-link-icon" />,
}));

vi.mock('react-icons/si', () => ({
  SiCoursera: () => <span data-testid="coursera-icon" />,
  SiGravatar: () => <span data-testid="gravatar-icon" />,
  SiApacheairflow: () => <span data-testid="airflow-icon" />,
  SiGooglebigquery: () => <span data-testid="bigquery-icon" />,
  SiKubernetes: () => <span data-testid="kubernetes-icon" />,
  SiPostgresql: () => <span data-testid="postgresql-icon" />,
  SiGo: () => <span data-testid="go-icon" />,
}));

// Mock react-country-flag
vi.mock('react-country-flag', () => ({
  __esModule: true,
  default: ({ countryCode }: { countryCode: string }) => (
    <span data-testid={`flag-${countryCode}`} />
  ),
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <div {...domProps}>{children}</div>;
    },
    section: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <section {...domProps}>{children}</section>;
    },
    span: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <span {...domProps}>{children}</span>;
    },
    a: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <a {...domProps}>{children}</a>;
    },
    h1: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <h1 {...domProps}>{children}</h1>;
    },
    p: ({ children, ...props }: any) => {
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <p {...domProps}>{children}</p>;
    },
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
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
