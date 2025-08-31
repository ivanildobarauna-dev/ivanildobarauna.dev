import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock do useSocialLinks
vi.mock('@/app/social-links/hooks/useSocialLinks', () => ({
  useSocialLinks: () => ({
    socialLinks: [
      { type: 'github', url: 'https://github.com/user', label: 'GitHub' },
      { type: 'linkedin', url: 'https://linkedin.com/in/user', label: 'LinkedIn' },
    ],
    loading: false,
    error: null,
  }),
}));

// Mock dos ícones do react-icons
vi.mock('react-icons/fa', () => ({
  FaEnvelope: () => <span data-testid="email-icon" />,
  FaMapMarkerAlt: () => <span data-testid="location-icon" />,
  FaGithub: () => <span data-testid="github-icon" />,
  FaLinkedin: () => <span data-testid="linkedin-icon" />,
  FaStackOverflow: () => <span data-testid="stackoverflow-icon" />,
}));

vi.mock('react-icons/si', () => ({
  SiCoursera: () => <span data-testid="coursera-icon" />,
  SiGravatar: () => <span data-testid="gravatar-icon" />,
}));

// Mock framer-motion to avoid prop warnings
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...domProps } = props;
      return <div {...domProps}>{children}</div>;
    },
    section: ({ children, ...props }: any) => {
      const { initial, whileInView, viewport, transition, ...domProps } = props;
      return <section {...domProps}>{children}</section>;
    },
  },
}));

describe('Footer', () => {
  const currentYear = new Date().getFullYear();

  it('renderiza o título e descrição corretamente', () => {
    render(<Footer />);
    
    expect(screen.getByText('Vamos trabalhar juntos?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Entre em contato para discutir seu próximo projeto ou oportunidade de colaboração.'
      )
    ).toBeInTheDocument();
  });

  it('exibe as informações de contato corretamente', () => {
    render(<Footer />);
    
    // Verifica o título da seção de contato
    expect(screen.getByText('Contato')).toBeInTheDocument();
    
    // Verifica os itens de contato
    expect(screen.getByText('contato@ivanildobarauna.dev')).toBeInTheDocument();
    expect(screen.getByText('São Paulo, Brasil')).toBeInTheDocument();
    
    // Verifica se os ícones estão presentes
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
    expect(screen.getByTestId('location-icon')).toBeInTheDocument();
  });

  it('exibe as redes sociais corretamente', () => {
    render(<Footer />);
    
    // Verifica o título da seção de redes sociais
    expect(screen.getByText('Redes Sociais')).toBeInTheDocument();
    
    // Verifica se os ícones das redes sociais estão presentes
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
    
    // Verifica os links das redes sociais
    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/user');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/user');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  it('exibe o status de disponibilidade', () => {
    render(<Footer />);
    
    // Verifica o título da seção de status
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Verifica o status de disponibilidade
    expect(screen.getByText('Disponível para projetos')).toBeInTheDocument();
    expect(
      screen.getByText('Aceitando novos projetos e colaborações interessantes.')
    ).toBeInTheDocument();
  });

  it('exibe o rodapé com o ano atual', () => {
    render(<Footer />);
    
    // Verifica o texto de direitos autorais
    expect(
      screen.getByText(`© ${currentYear} Ivanildo Barauna. Todos os direitos reservados.`)
    ).toBeInTheDocument();
    
    // Verifica o texto de tecnologia
    expect(
      screen.getByText('Desenvolvido com ❤️ usando Next.js e Tailwind CSS')
    ).toBeInTheDocument();
  });

  it('aplica as classes CSS corretas', () => {
    const { container } = render(<Footer />);
    
    // Verifica as classes principais
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-black', 'text-white');
    
    // Verifica as classes dos links de contato
    const contactLinks = container.querySelectorAll('a[href^="mailto:"]');
    contactLinks.forEach(link => {
      expect(link).toHaveClass('hover:text-primary');
    });
    
    // Verifica as classes dos botões de rede social
    const socialButtons = container.querySelectorAll('a[target="_blank"]');
    socialButtons.forEach(button => {
      expect(button).toHaveClass('bg-gray-900', 'hover:bg-gray-800');
    });
  });
});
