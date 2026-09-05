import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  title: {
    default: 'Ivanildo Barauna - Engenheiro de Dados e Open Source Maintainer',
    template: '%s | Ivanildo Barauna'
  },
  description: 'Portfólio de Ivanildo Barauna, com projetos em Dados & Analytics',
  openGraph: {
    title: 'Ivanildo Barauna - Especialista em Dados & Analytics',
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
