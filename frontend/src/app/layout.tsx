import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Ivanildo Baraúna - Engenheiro de Dados e Open Source Maintainer',
    template: '%s | Ivanildo Baraúna'
  },
  description: 'Portfólio de Ivanildo Baraúna, com projetos em Python, Golang, automações e dados.',
  openGraph: {
    title: 'Ivanildo Baraúna - Engenheiro de Dados',
    description: 'Portfólio com projetos reais, automações e soluções para backend e dados.',
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
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (async function checkBackendStatus() {
                try {
                  const response = await fetch('/api/v1/ping');
                  if (!response.ok) throw new Error('API not ready');
                  
                  const data = await response.json();
                  if (data.message !== 'pong') throw new Error('Invalid API response');
                } catch (error) {
                  console.log('Backend not ready, retrying in 1s...');
                  setTimeout(checkBackendStatus, 1000);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
