'use client';

import Image from 'next/image';
import {
  FaArrowUp,
  FaChartBar,
  FaCloud,
  FaCloudUploadAlt,
  FaCode,
  FaCogs,
  FaDatabase,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaRocket,
  FaWarehouse,
} from 'react-icons/fa';
import { SiApacheairflow, SiGooglebigquery } from 'react-icons/si';
import type { Experience } from '@/app/experience/interfaces';
import type { Project } from '@/app/projects/interfaces';
import type { Certification, Formation } from '@/app/education/interfaces';
import type { SocialLink } from '@/app/social-links/interfaces';
import { socialIconMap } from '@/utils/socialIconMap';
import CvDownloadButton from '@/components/CvDownloadButton';

type Props = {
  totalExperience: number;
  totalProjects: number;
  totalEducation: number;
  experiences: Record<string, Experience[]>;
  tempoTotalCarreira: string;
  projects: Project[];
  formations: Formation[];
  certifications: Record<string, Certification[]>;
  socialLinks: SocialLink[];
};

const compactTitle = (title: string) => title.split('/').pop() ?? title;
const descriptionText = (description: string | string[]) =>
  Array.isArray(description) ? description.join(' ') : description;
const roundedExperienceYears = (duration: string, fallback: number) => {
  const years = Number(duration.match(/(\d+)\s+ano/)?.[1] ?? fallback);
  const months = Number(duration.match(/(\d+)\s+mes/)?.[1] ?? 0);
  return `${Math.round(years + months / 12)} anos`;
};

const dataSkills = [
  { icon: FaCloudUploadAlt, title: 'Ingestão de dados', detail: 'Conectar diferentes fontes' },
  { icon: FaCogs, title: 'Processamento', detail: 'Transformar dados em informação' },
  { icon: FaWarehouse, title: 'Armazenamento', detail: 'Data warehouses serverless' },
  { icon: FaChartBar, title: 'Visualização de dados', detail: 'Apoiar decisões' },
];

const softwareSkills = [
  { icon: FaCode, title: 'APIs', detail: 'Integrar sistemas e produtos' },
  { icon: FaRocket, title: 'Microsserviços', detail: 'Evoluir com independência' },
  { icon: SiApacheairflow, title: 'Observabilidade', detail: 'Operar com confiança' },
];

function SkillNode({
  item,
  side,
  position,
}: {
  item: (typeof dataSkills)[number];
  side: 'data' | 'software';
  position: 'left' | 'right';
}) {
  const Icon = item.icon;
  return (
    <div className={`atlas-skill atlas-skill--${side} atlas-skill--${position}`}>
      <div className="atlas-skill-copy"><strong>{item.title}</strong><span>{item.detail}</span></div>
      <span className="atlas-icon"><Icon aria-hidden="true" /></span>
      <i aria-hidden="true" />
    </div>
  );
}

export default function PortfolioExperience({
  totalExperience,
  totalProjects,
  totalEducation,
  experiences,
  tempoTotalCarreira,
  projects,
  formations,
  certifications,
  socialLinks,
}: Props) {
  const companies = Object.entries(experiences);
  const otherProjects = projects.slice(1);
  const certificationList = Object.values(certifications).flat();

  return (
    <main className="portfolio-shell">
      <section id="home" data-testid="hero-section" className="portfolio-hero">
        <div className="portfolio-hero-copy">
          <h1>Ivanildo<br />Barauna</h1>
          <p className="portfolio-eyebrow"><span /> Data &amp; Software Engineer</p>
          <p className="portfolio-lead">Projeto e construo sistemas que conectam Engenharia de Software e Dados, transformando insights analíticos em sistemas de decisão prontos para produção — da ingestão à ação.</p>
          <div className="portfolio-hero-socials" aria-label="Redes sociais">
            {socialLinks.map(link => {
              const Icon = socialIconMap[link.type];
              return Icon ? (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}>
                  <Icon aria-hidden="true" />
                </a>
              ) : null;
            })}
          </div>
          <CvDownloadButton variant="portfolio" />
          <div className="portfolio-stats portfolio-hero-stats" aria-label="Resumo profissional">
            <span><strong>{roundedExperienceYears(tempoTotalCarreira, totalExperience)}</strong> de experiência</span>
            <span><strong>{totalProjects}</strong> projetos públicos</span>
            <span><strong>{totalEducation}</strong> formações e certificações</span>
          </div>
          <p className="portfolio-proof" aria-label="Áreas de especialidade">
            <span><strong>Analytics</strong><i /></span>
            <span><strong>Software Engineering</strong><i /></span>
            <span><strong>Data Pipelines</strong></span>
          </p>
        </div>
        <div className="portfolio-portrait">
          <Image src="/images/profile/profile-professional-casual.png" alt="Ivanildo Barauna com camiseta cinza e braços cruzados" fill priority sizes="(max-width: 760px) 100vw, 52vw" />
        </div>
      </section>

      <section id="about" data-testid="about-section" className="portfolio-atlas-section">
        <div className="portfolio-heading portfolio-heading--center">
          <div className="portfolio-heading-copy">
            <h2>Resolução de problemas de ponta a ponta</h2>
            <p>Software gera dados. Dados alimentam analytics, decisões e impacto.</p>
          </div>
        </div>

        <div className="portfolio-atlas" aria-label="Mapa de competências conectando dados e software">
          <div className="atlas-column">{softwareSkills.map(item => <SkillNode key={item.title} item={item} side="software" position="left" />)}</div>
          <div className="atlas-venn" aria-hidden="true">
            <div className="atlas-circle atlas-circle--software"><span>Software</span></div>
            <div className="atlas-circle atlas-circle--data"><span>Dados</span></div>
            <div className="atlas-intersection"><FaDatabase /><span>Solução de<br />ponta a ponta</span></div>
          </div>
          <div className="atlas-column atlas-column--data-flow">
            <div className="atlas-sql-connector" aria-hidden="true"><span>SQL</span><i /><i /></div>
            {dataSkills.map(item => <SkillNode key={item.title} item={item} side="data" position="right" />)}
          </div>
        </div>

        <div className="portfolio-outcomes">
          <article><span><FaMapMarkerAlt /></span><h3>Entender o problema</h3><p>Contexto antes da tecnologia.</p></article>
          <span className="outcome-arrow" aria-hidden="true">→</span>
          <article><span><FaCode /></span><h3>Construir a solução</h3><p>Dados e software, juntos.</p></article>
          <span className="outcome-arrow" aria-hidden="true">→</span>
          <article><span><FaRocket /></span><h3>Gerar impacto</h3><p>Tecnologia que entrega valor.</p></article>
        </div>
      </section>

      <section id="projects" data-testid="projects-section" className="portfolio-projects">
        <div className="portfolio-featured">
          <div className="portfolio-featured-copy">
            <p className="portfolio-eyebrow"><span /> Solução em destaque</p>
            <h2>Real-time Event<br />Processing Pipeline</h2>
            <p>Uma solução end-to-end que transforma dados recebidos por requisições de API em informações prontas para análise: a Producer API publica eventos no Pub/Sub; o pipeline assíncrono os processa no Dataflow e os armazena no BigQuery.</p>
            <ul>
              <li>Software que gera eventos de negócio</li>
              <li>Processamento assíncrono e escalável</li>
              <li>Dados disponíveis para analytics</li>
            </ul>
            <div className="portfolio-repo-links" aria-label="Repositórios da solução">
              <a className="portfolio-outline" href="https://github.com/IvanildoBarauna/data-producer-api" target="_blank" rel="noreferrer">Producer API <FaExternalLinkAlt /></a>
              <a className="portfolio-outline" href="https://github.com/IvanildoBarauna/data-pipeline-async-ingest" target="_blank" rel="noreferrer">Async Pipeline <FaExternalLinkAlt /></a>
            </div>
          </div>
          <div className="pipeline-panel" aria-label="Fluxo da solução de processamento de eventos em tempo real">
            <div className="pipeline-labels pipeline-labels--solution"><span>Produção de eventos</span><span>Processamento reativo</span><span>Armazenamento analítico</span></div>
            <div className="pipeline-architecture-note"><FaRocket /><span>Arquitetura orientada a eventos</span><small>Pub/Sub é o adaptador que desacopla a Producer API dos consumidores</small></div>
            <div className="pipeline-flow pipeline-flow--solution">
              <div className="producer-architecture">
                <div className="producer-hexagon"><div className="producer-hexagon-content"><FaCode /><strong>Producer<br />API</strong><small>Arquitetura<br />hexagonal</small></div></div>
                <div className="producer-pubsub-port"><FaRocket /><span>Pub/Sub</span></div>
                <div className="producer-event-label">Events Producer</div>
              </div>
              <span className="pipeline-connector" aria-hidden="true"><small>publica eventos</small>→</span>
              <div className="pipeline-stage">
                <div className="pipeline-box pipeline-box--active"><FaCloud /><strong>Reactive<br />Pipeline</strong><small>Consome eventos</small><em>Apache Beam · Dataflow</em></div>
                <div className="pipeline-stage-label">Ingest &amp; Process Events</div>
              </div>
              <span className="pipeline-connector" aria-hidden="true"><small>persiste</small>→</span>
              <div className="pipeline-stage">
                <div className="pipeline-box"><SiGooglebigquery /><strong>BigQuery</strong><small>Data warehouse</small><em>Pronto para analytics</em></div>
                <div className="pipeline-stage-label pipeline-stage-label--storage">Store Processed Events</div>
              </div>
            </div>
            <div className="pipeline-observability"><strong>Observabilidade end-to-end</strong><em>Datadog</em><span>Metrics</span><i /><span>Logs</span><i /><span>Traces</span></div>
          </div>
        </div>
        <div className="portfolio-project-list">
          <p className="portfolio-eyebrow"><span /> Outros projetos</p>
          {otherProjects.map(project => (
            <a key={project.id} href={project.projectUrl} target="_blank" rel="noreferrer" className="portfolio-project-row">
              <span className="project-row-icon"><FaCode /></span>
              <span><strong>{compactTitle(project.title)}</strong><small>{project.description}</small></span>
              <em>Ver no GitHub <FaExternalLinkAlt /></em>
            </a>
          ))}
        </div>
      </section>

      <section id="experience" data-testid="experience-section" className="portfolio-experience">
        <div className="portfolio-heading"><p className="portfolio-eyebrow"><span /> Experiência</p></div>
        <div className="portfolio-experience-list">
          {companies.map(([company, roles]) => (
            <article key={company}>
              <div className="experience-timeline-marker" aria-hidden="true"><span /></div>
              <div className="company-meta">
                <div className="company-identity">
                  {roles[0]?.companyLogo && <span className="company-logo"><Image src={roles[0].companyLogo} alt={`Logo ${company}`} width={30} height={30} /></span>}
                  <h3>{company.replace(' Administradora de Consórcio Ltda', '')}</h3>
                </div>
                <span>{roles[0]?.period}</span>
                <p>{roles[0]?.location}</p>
              </div>
              <div className="role-list">{roles.map(role => <div key={role.id}><strong>{role.position}</strong><p>{descriptionText(role.description)}</p><small>{role.skills?.split(';').slice(0, 5).join(' · ')}</small></div>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" data-testid="education-section" className="portfolio-education">
        <div className="portfolio-heading"><p className="portfolio-eyebrow"><span /> Formação</p><h2>Base técnica.<br />Aprendizado contínuo.</h2></div>
        <div className="portfolio-education-list">
          {formations.map(formation => <article key={formation.id}><span>{formation.period}</span><h3>{formation.course}</h3><p>{formation.institution} · {formation.type}</p></article>)}
          {certificationList.map(certification => <a key={certification.id} href={certification.credential_url} target="_blank" rel="noreferrer"><span>Certificação</span><h3>{certification.name}</h3><p>{certification.institution} <FaExternalLinkAlt /></p></a>)}
        </div>
      </section>

      <footer className="portfolio-footer">
        <p>Ivanildo Barauna</p>
        <div className="portfolio-footer-socials" aria-label="Redes sociais">
          {socialLinks.map(link => {
            const Icon = socialIconMap[link.type];
            return Icon ? (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label}>
                <Icon aria-hidden="true" />
              </a>
            ) : null;
          })}
        </div>
        <a className="portfolio-back-to-top" href="#home">Voltar ao início <FaArrowUp aria-hidden="true" /></a>
      </footer>

    </main>
  );
}
