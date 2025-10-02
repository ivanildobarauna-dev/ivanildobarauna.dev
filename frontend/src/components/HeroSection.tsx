'use client';

import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';
import CvDownloadButton from './CvDownloadButton';
import { socialIconMap } from '@/utils/socialIconMap';

export interface SocialMediaLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  displayName: string;
  order: number;
}

interface HeroSectionProps {
  socialMedia: SocialMediaLink[];
}

export default function HeroSection({ socialMedia }: HeroSectionProps) {
  // Sort social media links by order
  const sortedSocialMedia = [...socialMedia].sort((a, b) => a.order - b.order);

  return (
    <section className="hero-section min-h-screen flex items-center justify-center px-4 py-20" data-testid="hero-section">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="space-y-4">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
              >
                Gerando impacto real na humanidade usando tecnologia
              </div>
              
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight"
              >
                Ivanildo
                <span className="block text-gradient-light">Barauna</span>
              </h1>
              
              <p
                className="text-xl md:text-2xl text-primary-foreground/80 max-w-lg"
              >
                Senior Data Engineer & Open Source Maintainer
              </p>
              
              <p
                className="text-lg text-primary-foreground/60 max-w-xl leading-relaxed"
              >
                Especialização em Engenharia, Análise de Dados e mantenedor de bibliotecas e serviços Open Source.
              </p>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 items-center lg:items-start"
            >
              <a
                href="#contact"
                className="btn-hero group inline-flex items-center px-6 py-3 rounded-lg font-semibold"
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <FaEnvelope className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Entre em contato
              </a>
              
              <CvDownloadButton />
            </div>

            {/* Social Links */}
            <div
              className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4"
            >
              {sortedSocialMedia.map((link) => {
                const Icon = socialIconMap[link.name?.toLowerCase()] || socialIconMap.default;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary-foreground/80 hover:text-primary-foreground"
                    aria-label={link.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Profile Image */}
          <div
            className="relative slide-up"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <Image
                  src="/images/profile/profile.png"
                  alt="Ivanildo Barauna"
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-hero animate-float"
                />
              </div>
            </div>
            
            {/* Floating badges */}
            <div
              className="absolute -top-4 -right-4 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-primary-foreground border border-white/20">
                Python
              </div>
            </div>
            
            <div
              className="absolute -bottom-4 -left-4 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-primary-foreground border border-white/20">
                Airflow
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
