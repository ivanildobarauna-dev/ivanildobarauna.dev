import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    default: 'Ivanildo Barauna - Data & Software Engineer',
    template: '%s | Ivanildo Barauna'
  },
  description: 'Portfólio de Ivanildo Barauna, com projetos em Dados & Analytics',
  openGraph: {
    title: 'Ivanildo Barauna - Data & Software Engineer',
    description: 'Portfólio com projetos, experiência profissional e soluções para backend e Dados & Analytics.',
    url: 'https://ivanildobarauna.dev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
