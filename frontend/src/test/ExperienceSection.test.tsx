'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExperienceSection } from '@/components/sections/ExperienceSection';

const mockExperiences = {
  'Company A': [{ company: 'Company A', position: 'Developer', period: '2022-Present', description: '', skills: '', logo: '', website: '', duration: '', actual_job: true, location: '' }],
  'Company B': [{ company: 'Company B', position: 'Developer', period: '2021-2022', description: '', skills: '', logo: '', website: '', duration: '', actual_job: false, location: '' }],
  'Company C': [{ company: 'Company C', position: 'Developer', period: '2020-2021', description: '', skills: '', logo: '', website: '', duration: '', actual_job: false, location: '' }],
  'Company D': [{ company: 'Company D', position: 'Developer', period: '2019-2020', description: '', skills: '', logo: '', website: '', duration: '', actual_job: false, location: '' }],
};

describe('ExperienceSection', () => {
  it('should render only 3 experiences initially', () => {
    render(<ExperienceSection experiences={mockExperiences} tempoTotalCarreira="4 anos" />);
    expect(screen.getByText(/Company A/i)).toBeInTheDocument();
    expect(screen.getByText(/Company B/i)).toBeInTheDocument();
    expect(screen.getByText(/Company C/i)).toBeInTheDocument();
    expect(screen.queryByText(/Company D/i)).not.toBeInTheDocument();
  });

  it('should show more experiences when "Mostrar Mais" is clicked', () => {
    render(<ExperienceSection experiences={mockExperiences} tempoTotalCarreira="4 anos" />);
    const button = screen.getByText(/Mostrar Mais/i);
    fireEvent.click(button);
    expect(screen.getByText(/Company D/i)).toBeInTheDocument();
    expect(screen.getByText(/Mostrar Menos/i)).toBeInTheDocument();
  });
});
