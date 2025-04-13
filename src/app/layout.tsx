import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ivanildo Barauna - Engenheiro de Dados Senior",
  description: "Portfolio profissional de Ivanildo Barauna - Desenvolvedor Full Stack especializado em Python e Engenharia de Dados",
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
      </body>
    </html>
  );
}
