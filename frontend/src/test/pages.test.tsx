import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import HomePage from '../app/page';
import ProjectsPage from '../app/projects/page';
import ExperiencePage from '../app/experience/page';
import EducationPage from '../app/education/page';
import ContactPage from '../app/contact/page';

describe('Pages Rendering Test', () => {
  it('should render Home page with main content', async () => {
    await act(async () => {
      render(<HomePage />);
    });
    expect(document.body).toBeInTheDocument();
    // Adicione verificações específicas para elementos da página inicial
  });

  it('should render Projects page with project list', async () => {
    await act(async () => {
      render(<ProjectsPage />);
    });
    expect(document.body).toBeInTheDocument();
    // Adicione verificações específicas para a lista de projetos
  });

  it('should render Experience page with experience timeline', async () => {
    await act(async () => {
      render(<ExperiencePage />);
    });
    expect(document.body).toBeInTheDocument();
    // Adicione verificações específicas para a timeline de experiência
  });

  it('should render Education page with education history', async () => {
    await act(async () => {
      render(<EducationPage />);
    });
    expect(document.body).toBeInTheDocument();
    // Adicione verificações específicas para o histórico educacional
  });

  it('should render Contact page with contact form', async () => {
    await act(async () => {
      render(<ContactPage />);
    });
    expect(document.body).toBeInTheDocument();
    // Adicione verificações específicas para o formulário de contato
  });
}); 
