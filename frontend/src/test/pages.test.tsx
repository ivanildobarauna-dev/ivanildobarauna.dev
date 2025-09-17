import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import HomePage from '../app/page';

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
    education: [],
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
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <div {...domProps}>{children}</div>;
    },
    section: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <section {...domProps}>{children}</section>;
    },
    span: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <span {...domProps}>{children}</span>;
    },
    a: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <a {...domProps}>{children}</a>;
    },
    h1: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <h1 {...domProps}>{children}</h1>;
    },
    p: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, whileInView, viewport, transition, ...domProps } = props;
      return <p {...domProps}>{children}</p>;
    },
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ 
    src, 
    alt, 
    width = 100, 
    height = 100,
    ...props 
  }: { 
    src: string; 
    alt: string; 
    width?: number | string; 
    height?: number | string;
    children?: React.ReactNode; 
    [key: string]: unknown 
  }) => {
    // Usando um simples mock de imagem para testes
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={src} 
        alt={alt} 
        width={width}
        height={height}
        {...props}
      />
    );
  },
}));

describe('Pages Rendering Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Home page with all sections', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    
    // Verifica se o elemento principal está presente
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    // Verifica se as seções principais estão presentes
    const heroSection = screen.getByTestId('hero-section');
    const aboutSection = screen.getByTestId('about-section');
    const experienceSection = screen.getByTestId('experience-section');
    const projectsSection = screen.getByTestId('projects-section');
    const educationSection = screen.getByTestId('education-section');
    const contactSection = screen.getByTestId('contact-section');
    
    expect(heroSection).toBeInTheDocument();
    expect(aboutSection).toBeInTheDocument();
    expect(experienceSection).toBeInTheDocument();
    expect(projectsSection).toBeInTheDocument();
    expect(educationSection).toBeInTheDocument();
    expect(contactSection).toBeInTheDocument();
  });
}); 
