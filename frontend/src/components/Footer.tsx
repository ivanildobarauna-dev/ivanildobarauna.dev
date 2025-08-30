'use client';

import { motion } from 'framer-motion';
import { useSocialLinks } from '@/app/social-links/hooks/useSocialLinks';
import { socialIconMap } from '@/utils/socialIconMap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const { socialLinks, loading, error } = useSocialLinks();
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      label: "Email",
      value: "contato@ivanildobarauna.dev",
      href: "mailto:contato@ivanildobarauna.dev"
    },
    {
      icon: <FaPhone className="w-5 h-5" />,
      label: "Telefone",
      value: "+55 (11) 99999-9999",
      href: "tel:+5511999999999"
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      label: "Localização",
      value: "São Paulo, Brasil",
      href: "#"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-subtle">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vamos <span className="text-gradient">Conversar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interessado em trabalhar juntos? Entre em contato e vamos discutir 
            como posso ajudar no seu próximo projeto.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="professional-card p-8 slide-up"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Envie uma mensagem</h3>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo e retornarei o contato em breve.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <input 
                      type="text"
                      placeholder="Seu nome completo" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input 
                      type="email"
                      placeholder="seu@email.com" 
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assunto</label>
                  <input 
                    type="text"
                    placeholder="Sobre o que gostaria de conversar?" 
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem</label>
                  <textarea 
                    placeholder="Conte-me mais sobre seu projeto ou ideia..."
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  />
                </div>

                <button className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group">
                  <FaPaperPlane className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <div className="space-y-8 slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-xl font-semibold mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <a 
                      href={item.href} 
                      className="professional-card p-4 cursor-pointer group hover:border-primary/50 transition-colors block"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-muted-foreground text-sm">{item.value}</p>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="flex gap-3">
                {!loading && !error && socialLinks.map((link) => {
                  const Icon = socialIconMap[link.type];
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:border-primary/50 hover:text-primary transition-colors group"
                    >
                      <span className="group-hover:scale-110 transition-transform">
                        {Icon && <Icon className="w-5 h-5" />}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Status</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                🟢 Disponível para projetos
              </span>
              <p className="text-sm text-muted-foreground mt-2">
                Atualmente aceitando novos projetos e colaborações interessantes.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="professional-card p-6 bg-primary/5 border-primary/10"
            >
              <h4 className="font-semibold mb-2">Resposta Rápida</h4>
              <p className="text-sm text-muted-foreground">
                Geralmente respondo emails em até 24 horas. Para projetos urgentes, 
                entre em contato via WhatsApp.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-border mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} Ivanildo Barauna. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground text-sm text-center md:text-right mt-2 md:mt-0">
              Desenvolvido com ❤️ usando Next.js e Tailwind CSS
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
