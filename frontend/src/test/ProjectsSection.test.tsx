'use client';

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

const mockProjects = [
  { title: 'Project A', description: '', url: '', tags: [] },
  { title: 'Project B', description: '', url: '', tags: [] },
  { title: 'Project C', description: '', url: '', tags: [] },
  { title: 'Project D', description: '', url: '', tags: [] },
];

describe('ProjectsSection', () => {
  it('should render only 3 projects initially', () => {
    render(<ProjectsSection projects={mockProjects} />);
    expect(screen.getByText(/Project A/i)).toBeInTheDocument();
    expect(screen.getByText(/Project B/i)).toBeInTheDocument();
    expect(screen.getByText(/Project C/i)).toBeInTheDocument();
    expect(screen.queryByText(/Project D/i)).not.toBeInTheDocument();
  });

  it('should show more projects when "Mostrar Mais" is clicked', () => {
    render(<ProjectsSection projects={mockProjects} />);
    const button = screen.getByText(/Mostrar Mais/i);
    fireEvent.click(button);
    expect(screen.getByText(/Project D/i)).toBeInTheDocument();
    expect(screen.getByText(/Mostrar Menos/i)).toBeInTheDocument();
  });
});
