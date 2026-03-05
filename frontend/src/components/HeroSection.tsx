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
    <section className="hero-section min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden" data-testid="hero-section">
      {/* Animated data particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{ opacity: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
            animate={{
              opacity: [0, 0.6, 0],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 fade-in">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-sm text-sm font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30"
              >
                &gt; Gerando impacto com tecnologia
              </motion.div>

              {/* Glowing name with monospace aesthetic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-2"
              >
                <div className="font-mono text-lg font-bold text-blue-400">/ dev ivanildo.dev</div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter">
                  <span className="text-gradient-light">Ivanildo</span>
                  <br />
                  <span className="text-gray-100">Barauna</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-semibold text-blue-300"
              >
                Senior Data Engineer & Open Source Maintainer
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-400 max-w-xl leading-relaxed font-mono text-sm"
              >
                // Especialização em Data Pipelines, Analytics e Engenharia de Software
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <a
                href="#contact"
                className="btn-hero group inline-flex items-center px-6 py-3 font-bold uppercase text-sm tracking-wider"
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <FaEnvelope className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                Contato
              </a>

              <CvDownloadButton />
            </motion.div>

            {/* Social Links - Terminal style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-3 justify-start"
            >
              {!loading && !error && socialLinks.map((link, idx) => {
                const Icon = socialIconMap[link.type];
                return (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                    className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-500/50 text-blue-300 hover:text-blue-200 hover:border-blue-400 hover:bg-blue-500/10 transition-all"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Profile Image with Tech Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-slate-500 opacity-15 blur-3xl"></div>

              {/* Terminal frame */}
              <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-none p-2 border-2 border-blue-500/50">
                {/* Terminal header */}
                <div className="bg-slate-800 px-4 py-2 mb-2 border-b border-blue-500/30 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-xs text-blue-400 ml-2 font-mono">profile.tsx</span>
                </div>

                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-b from-blue-500/5 to-transparent">
                  <Image
                    src="/images/profile/profile.png"
                    alt="Ivanildo Barauna"
                    width={400}
                    height={400}
                    className="w-full max-w-sm mx-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Data block badges - Terminal style */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -top-2 -right-2 text-xs font-mono text-blue-300 border border-blue-500/50 bg-slate-900/90 px-3 py-2 rounded-none"
            >
              &gt; python
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -bottom-2 -left-2 text-xs font-mono text-slate-300 border border-slate-500/50 bg-slate-900/90 px-3 py-2 rounded-none"
            >
              &gt; data_engineer
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
