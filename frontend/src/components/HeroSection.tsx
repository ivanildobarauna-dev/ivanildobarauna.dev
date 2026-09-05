'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';
import CvDownloadButton from './CvDownloadButton';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

export default function HeroSection() {
  const { socialLinks, loading, error } = useSocialLinks();

  return (
    <section className="hero-section min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 md:py-24" data-testid="hero-section">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-white/10 text-primary-foreground border border-white/15"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.14)]" aria-hidden="true" />
                Gerando impacto real na humanidade usando tecnologia
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.98] tracking-tight"
              >
                Ivanildo
                <span className="block text-gradient-light">Barauna</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-3xl font-semibold tracking-tight text-primary-foreground/90 max-w-xl"
              >
                Data & Software Engineer
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg text-primary-foreground/65 max-w-xl leading-relaxed"
              >
                Especialização em Engenharia, Análise de Dados e mantenedor de bibliotecas e serviços Open Source.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 items-center lg:items-start"
            >
              <a
                href="#contact"
                className="btn-hero group inline-flex items-center px-6 py-3.5 rounded-xl font-semibold"
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
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-2 justify-center lg:justify-start"
            >
              {!loading && !error && socialLinks.map((link) => {
                const Icon = socialIconMap[link.type];
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative slide-up"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/[0.06] backdrop-blur-sm rounded-[2rem] p-4 md:p-8 border border-white/15 shadow-2xl">
                <Image
                  src="/images/profile/profile.png?variant=hero"
                  alt="Ivanildo Barauna"
                  width={400}
                  height={400}
                  loading="eager"
                  className="w-full max-w-md mx-auto rounded-[1.35rem] shadow-hero animate-float"
                />
              </div>
            </div>
            
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -top-4 -right-4 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-primary-foreground border border-white/20">
                Python
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="absolute -bottom-4 -left-4 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-primary-foreground border border-white/20">
                Airflow
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
