import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <div className="min-h-screen bg-gray-100">
          <main className="flex flex-col">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function checkBackendStatus(attempt = 1) {
                fetch('/api/v1/ping')
                  .then(response => {
                    if (!response.ok) throw new Error('API not ready');
                    return response.json();
                  })
                  .then(data => {
                    if (data.message !== 'pong') throw new Error('Invalid API response');
                  })
                  .catch(error => {
                    if (attempt < 3) {
                      console.log('Backend not ready, retrying in 1s...');
                      setTimeout(() => checkBackendStatus(attempt + 1), 1000);
                    } else {
                      console.error('Backend unreachable:', error);
                    }
                  });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
