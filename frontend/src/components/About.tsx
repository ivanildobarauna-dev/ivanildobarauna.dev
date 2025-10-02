'use client';

import { FaCode, FaDatabase, FaRocket, FaCloud } from 'react-icons/fa';

export default function About() {
  const skills = [
    {
      category: "Software Engineering",
      icon: <FaCode className="w-6 h-6" />,
      technologies: ["Python", "Flask", "FastAPI", "Golang", "API REST", "Unit Testing", "Software Architecture"]
    },
    {
      category: "Dados & Analytics",
      icon: <FaDatabase className="w-6 h-6" />,
      technologies: ["SQL", "Python", "BigQuery", "Clickhouse", "Power BI", "Apache Airflow", "Apache Beam"]
    },
    {
      category: "DevOps & Cloud",
      icon: <FaRocket className="w-6 h-6" />,
      technologies: ["Docker", "Kubernetes", "GCP", "CI/CD", "Git", "Linux"]
    },
    {
      category: "Arquitetura",
      icon: <FaCloud className="w-6 h-6" />,
      technologies: ["Microsserviços", "Data Pipelines", "ETL/ELT", "Observabilidade"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-subtle" data-testid="about-section">
      <div className="container max-w-6xl mx-auto">
        <div className="text-left mb-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sobre <span className="text-gradient">Mim</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Com mais de 10 anos de experiência, desenvolvo soluções de dados que combinam 
            arquitetura robusta com performance otimizada e escalabilidade.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div
            className="text-center"
          >
            <div className="text-3xl font-bold text-gradient">10+</div>
            <div className="text-muted-foreground">Anos de Experiência</div>
          </div>
          
          <div
            className="text-center"
          >
            <div className="text-3xl font-bold text-gradient">50+</div>
            <div className="text-muted-foreground">Projetos Open Source</div>
          </div>
          
          <div
            className="text-center"
          >
            <div className="text-3xl font-bold text-gradient">10+</div>
            <div className="text-muted-foreground">Formações e Certificações</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6 slide-up">
            <h3 className="text-2xl font-semibold">Minha Jornada</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Iniciei minha carreira como desenvolvedor apaixonado por automação. 
                Ao longo dos anos, desenvolvi expertise transformar dados em insights estratégicos e em tecnologias modernas de dados e metodologias ágeis.
              </p>
              <p>
                Acredito que a melhor tecnologia é aquela que serve e transforma a vida prática das pessoas e, por isso 
                sempre busco equilibrar inovação e performance técnica aliada ao impacto real.
              </p>
              <p>
                Além de desenvolvedor, adoro churrasco, dirigir, estudar novas tecnologias e compartilhar conhecimento via artigos do Medium/Linkedin.
              </p>
            </div>
          </div>

          <div className="space-y-6 slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-semibold">Valores</h3>
            <div className="grid gap-4">
              {["Transparência", "Autenticidade", "Eficiência", "Impacto"].map((value, index) => (
                <div key={value} className="flex items-center gap-3" style={{ animationDelay: `${0.1 * index}s` }}>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.category}
              className="professional-card p-6 text-center"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg text-primary">
                {skill.icon}
              </div>
              <h4 className="font-semibold mb-3">{skill.category}</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {skill.technologies.map((tech) => (
                  <span key={tech} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
