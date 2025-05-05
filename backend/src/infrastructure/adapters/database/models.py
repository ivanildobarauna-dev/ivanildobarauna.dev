from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, Column, Date, DateTime, Integer, String

from src.infrastructure.application_dependencies import db


class ProjectsAdmin(db.Model):
    """
    Modelo que representa um projeto no banco de dados.
    """

    __tablename__ = "projects"
    __table_args__ = {"comment": "Tabela que armazena os projetos do portfólio"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False, comment="Título do projeto")
    description = Column(String(500), nullable=False, comment="Descrição do projeto")
    url = Column(String(200), nullable=False, comment="URL do projeto")
    tags = Column(JSON, nullable=False, comment="Tags do projeto")
    active = Column(Boolean, default=False, comment="Ativo ou não do projeto")
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        comment="Data de criação do projeto",
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
        comment="Data de atualização do projeto",
    )


class SocialsMediaAdmin(db.Model):
    """ " Represent the social media data in the database"""

    __tablename__ = "social_media"
    __table_args__ = {"comment": "Tabela que armazena as redes sociais do portfólio"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    label = Column(String(100), nullable=False, comment="Nome da rede social")
    url = Column(String(200), nullable=False, comment="URL da rede social")
    type = Column(String(50), nullable=False, comment="Tipo da rede social")
    active = Column(
        Boolean,
        default=False,
        comment="Flag para indicar se a rede social está ativa ou não",
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        comment="Data de criação da rede social",
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
        comment="Data de atualização da rede social",
    )


class ExperiencesAdmin(db.Model):
    __tablename__ = "experiences"
    __table_args__ = {"comment": "Tabela que armazena as experiências profissionais"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    position = Column(String(100), nullable=False, comment="Cargo")
    period = Column(String(100), nullable=False, comment="Período")
    start_date  = Column(Date, nullable=False, comment="Data de início")
    company = Column(String(100), nullable=False, comment="Período")
    location = Column(String(100), nullable=False, comment="Localização")
    website = Column(String(200), nullable=True, comment="URL do site da empresa")
    logo = Column(String(200), nullable=True, comment="Logo da empresa")
    actual_job = Column(
        Boolean, default=False, comment="Flag para indicar se é o emprego atual"
    )
    description = Column(
        String(500), nullable=False, comment="Descrição da experiência"
    )
    skills = Column(String(500), nullable=False, comment="Habilidades adquiridas")
    active = Column(Boolean, default=False, comment="Flag para indicar se está ativa")
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc)
    )


class FormationsAdmin(db.Model):
    __tablename__ = "formations"
    __table_args__ = {"comment": "Tabela que armazena as formações acadêmicas"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    institution = Column(String(100), nullable=False, comment="Instituição de ensino")
    type = Column(String(100), nullable=False, comment="Tipo de formação")
    course = Column(String(100), nullable=False, comment="Curso")
    period = Column(String(100), nullable=False, comment="Período")
    description = Column(String(500), nullable=False, comment="Descrição da formação")
    logo = Column(String(200), nullable=True, comment="Logo da formação")
    active = Column(Boolean, default=False, comment="Flag para indicar se está ativa")


class CertificationsAdmin(db.Model):
    __tablename__ = "certifications"
    __table_args__ = {"comment": "Tabela que armazena as certificações"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="Nome da certificação")
    institution = Column(String(100), nullable=False, comment="Instituição de ensino")
    credential_url = Column(String(200), nullable=True, comment="URL da certificação")
    logo = Column(String(200), nullable=True, comment="Logo da certificação")
    active = Column(Boolean, default=False, comment="Flag para indicar se está ativa")
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc)
    )
