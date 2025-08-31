'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import CvDownloadButton from './CvDownloadButton';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';

interface HeroSectionProps {
  totalExperience: number;
  totalProjects: number;
  totalEducation: number;
  activeButton: number | null;
}

const formatNumber = (value: number): string => {
  return isNaN(value) ? '0' : `${value}+`;
};

export default function HeroSection({ 
  totalExperience, 
  totalProjects, 
  totalEducation, 
  activeButton 
}: HeroSectionProps) {
  const { socialLinks, loading, error } = useSocialLinks();

  return (
    <section className="hero-section min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
              >
                Gerando impacto real na humanidade usando tecnologia
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight"
              >
                Ivanildo
                <span className="block text-gradient-light">Barauna</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-primary-foreground/80 max-w-lg"
              >
                Senior Data Engineer & Open Source Maintainer
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-primary-foreground/60 max-w-xl leading-relaxed"
              >
                Especialização em Engenharia, Análise de Dados e mantenedor de bibliotecas e serviços Open Source.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {!loading && !error && socialLinks.map((link) => {
                const Icon = socialIconMap[link.type];
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/10 transition-colors"
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
