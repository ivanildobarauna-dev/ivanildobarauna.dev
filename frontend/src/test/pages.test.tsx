'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock hooks
vi.mock('@/app/experience/hooks/useTotalExperience', () => ({
  useTotalExperience: () => ({ totalExperience: '5', loading: false, error: null }),
}));
vi.mock('@/app/projects/hooks/useTotalProjects', () => ({
  useTotalProjects: () => ({ totalProjects: '10', loading: false, error: null }),
}));
vi.mock('@/app/education/hooks/useTotalEducation', () => ({
  useTotalEducation: () => ({ totalEducation: '15', loading: false, error: null }),
}));
vi.mock('@/app/experience/hooks/useExperience', () => ({
  useExperience: () => ({
    experiences: {},
    loading: false,
    error: null,
    tempoTotalCarreira: '1 ano',
  }),
}));
vi.mock('@/app/projects/hooks/useProjects', () => ({
  useProjects: () => ({
    projects: [],
    loading: false,
    error: null,
  }),
}));
vi.mock('@/app/education/hooks/useEducation', () => ({
  useEducation: () => ({
    formations: [],
    certifications: {},
    loading: false,
    error: null,
  }),
}));
vi.mock('@/app/social-links/hooks/useSocialLinks', () => ({
    useSocialLinks: () => ({
      socialLinks: [],
      loading: false,
      error: null
    })
  }));

describe('Home Page', () => {
  it('should render all sections', () => {
    render(<Home />);

    // Check for HomeRenderer content
    expect(screen.getByText(/Ivanildo Barauna de Souza Junior/i)).toBeInTheDocument();

    // Check for section titles
    expect(screen.getByText(/Experiência Profissional/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Projetos Open Source/i })).toBeInTheDocument();
    expect(screen.getByText(/Formação Acadêmica/i)).toBeInTheDocument();
  });
});
