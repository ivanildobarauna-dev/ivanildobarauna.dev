import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CvDownloadButton from '../CvDownloadButton';

// Mock do ReactCountryFlag para evitar problemas com SVGs
vi.mock('react-country-flag', () => ({
  __esModule: true,
  default: ({ countryCode }: { countryCode: string }) => (
    <span data-testid={`flag-${countryCode}`} />
  ),
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaDownload: () => <span data-testid="download-icon" />,
  FaChevronDown: () => <span data-testid="chevron-down-icon" />,
}));

describe('CvDownloadButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza o botão de download corretamente', () => {
    render(<CvDownloadButton />);
    
    const button = screen.getByRole('button', { name: /download cv/i });
    expect(button).toBeInTheDocument();
    
    // Clica no botão para abrir o dropdown
    fireEvent.click(button);
    
    // Verifica se as bandeiras estão visíveis no dropdown
    expect(screen.getByTestId('flag-BR')).toBeInTheDocument();
    expect(screen.getByTestId('flag-US')).toBeInTheDocument();
  });

  it('abre o menu suspenso ao clicar no botão', () => {
    render(<CvDownloadButton />);
    
    const button = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(button);
    
    expect(screen.getByText('PT-BR')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('faz download do currículo em português', () => {
    render(<CvDownloadButton />);
    
    const button = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(button);
    
    const ptButton = screen.getByText('PT-BR');
    fireEvent.click(ptButton);
    
    // Verifica que o menu foi fechado após o click
    expect(screen.queryByText('PT-BR')).not.toBeInTheDocument();
  });

  it('faz download do currículo em inglês', () => {
    render(<CvDownloadButton />);
    
    const button = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(button);
    
    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);
    
    // Verifica que o menu foi fechado após o click
    expect(screen.queryByText('EN')).not.toBeInTheDocument();
  });

  it('fecha o menu ao clicar fora', () => {
    render(
      <div>
        <div data-testid="outside">Fora</div>
        <CvDownloadButton />
      </div>
    );
    
    // Abre o menu
    const button = screen.getByRole('button', { name: /download cv/i });
    fireEvent.click(button);
    
    // Verifica se o menu está aberto
    expect(screen.getByText('PT-BR')).toBeInTheDocument();
    
    // Clica fora
    fireEvent.mouseDown(screen.getByTestId('outside'));
    
    // Verifica se o menu foi fechado
    expect(screen.queryByText('PT-BR')).not.toBeInTheDocument();
  });
});
