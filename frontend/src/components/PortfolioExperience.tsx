'use client';

import Image from 'next/image';
import {
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
  const featured = projects[0];
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

      <section className="portfolio-stats" aria-label="Resumo profissional">
        <span><strong>{tempoTotalCarreira || `${totalExperience}+ anos`}</strong> de experiência</span>
        <span><strong>{totalProjects}</strong> projetos públicos</span>
        <span><strong>{totalEducation}</strong> formações e certificações</span>
      </section>

      <section id="about" data-testid="about-section" className="portfolio-atlas-section">
        <div className="portfolio-heading portfolio-heading--center">
          <h2>Resolução de problemas de ponta a ponta</h2>
          <p>Software gera dados. Dados alimentam analytics, decisões e impacto.</p>
        </div>

        <div className="portfolio-atlas" aria-label="Mapa de competências conectando dados e software">
          <div className="atlas-column">{softwareSkills.map(item => <SkillNode key={item.title} item={item} side="software" position="left" />)}</div>
          <div className="atlas-venn" aria-hidden="true">
            <div className="atlas-circle atlas-circle--software"><span>Software</span></div>
            <div className="atlas-circle atlas-circle--data"><span>Dados</span></div>
            <div className="atlas-intersection"><FaDatabase /><span>Solução<br />de ponta<br />a ponta</span></div>
          </div>
          <div className="atlas-column atlas-column--data-flow">
            <div className="atlas-sql-connector" aria-hidden="true"><span>SQL</span></div>
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
        {featured && (
          <div className="portfolio-featured">
            <div className="portfolio-featured-copy">
              <p className="portfolio-eyebrow"><span /> Projeto em destaque</p>
              <h2>{compactTitle(featured.title)}</h2>
              <p>{featured.description}</p>
              <ul>
                {(featured.tags ?? []).slice(0, 3).map(tag => <li key={tag}>{tag.replaceAll('-', ' ')}</li>)}
              </ul>
              <a className="portfolio-outline" href={featured.projectUrl} target="_blank" rel="noreferrer">Ver no GitHub <FaExternalLinkAlt /></a>
            </div>
            <div className="pipeline-panel" aria-label="Fluxo do pipeline assíncrono">
              <div className="pipeline-labels"><span>Fontes</span><span>Processamento</span><span>Destino</span></div>
              <div className="pipeline-flow">
                <div className="pipeline-sources"><span><FaCode /> APIs</span><span><FaDatabase /> Arquivos</span><span><FaRocket /> Eventos</span></div>
                <span className="pipeline-arrow" aria-hidden="true">→</span>
                <div className="pipeline-box pipeline-box--active"><FaCloud /><strong>Apache Beam<br />Dataflow</strong><small>Processamento paralelo</small></div>
                <span className="pipeline-arrow" aria-hidden="true">→</span>
                <div className="pipeline-box"><SiGooglebigquery /><strong>BigQuery</strong><small>Camada analítica</small></div>
              </div>
              <div className="pipeline-observability"><SiApacheairflow /><strong>Observabilidade</strong><span>Logs</span><i /><span>Métricas</span><i /><span>Alertas</span></div>
            </div>
          </div>
        )}
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
        <div className="portfolio-heading"><p className="portfolio-eyebrow"><span /> Experiência</p><h2>Uma trajetória entre<br />dados e software.</h2></div>
        <div className="portfolio-experience-list">
          {companies.map(([company, roles]) => (
            <article key={company}>
              <div className="company-meta"><span>{roles[0]?.period}</span><h3>{company.replace(' Administradora de Consórcio Ltda', '')}</h3><p>{roles[0]?.location}</p></div>
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

    </main>
  );
}
