'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EducationSection } from '@/components/sections/EducationSection';

const mockFormations = [
  { institution: 'University A', course: '', period: '', description: '', logo: '', type: '' },
  { institution: 'University B', course: '', period: '', description: '', logo: '', type: '' },
  { institution: 'University C', course: '', period: '', description: '', logo: '', type: '' },
  { institution: 'University D', course: '', period: '', description: '', logo: '', type: '' },
];

const mockCertifications = {
  'Institution A': [{ name: 'Certificate A', credential_url: '', logo: '' }],
  'Institution B': [{ name: 'Certificate B', credential_url: '', logo: '' }],
  'Institution C': [{ name: 'Certificate C', credential_url: '', logo: '' }],
  'Institution D': [{ name: 'Certificate D', credential_url: '', logo: '' }],
};

describe('EducationSection', () => {
  it('should render only 3 formations and certifications initially', () => {
    render(<EducationSection formations={mockFormations} certifications={mockCertifications} />);
    expect(screen.getByText(/University A/i)).toBeInTheDocument();
    expect(screen.getByText(/University B/i)).toBeInTheDocument();
    expect(screen.getByText(/University C/i)).toBeInTheDocument();
    expect(screen.queryByText(/University D/i)).not.toBeInTheDocument();

    expect(screen.getByText(/Certificate A/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificate B/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificate C/i)).toBeInTheDocument();
    expect(screen.queryByText(/Certificate D/i)).not.toBeInTheDocument();
  });

  it('should show more formations and certifications when "Mostrar Mais" is clicked', () => {
    render(<EducationSection formations={mockFormations} certifications={mockCertifications} />);
    const buttons = screen.getAllByText(/Mostrar Mais/i);
    fireEvent.click(buttons[0]); // Formations
    fireEvent.click(buttons[1]); // Certifications

    expect(screen.getByText(/University D/i)).toBeInTheDocument();
    expect(screen.getByText(/Certificate D/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Mostrar Menos/i).length).toBe(2);
  });
});
