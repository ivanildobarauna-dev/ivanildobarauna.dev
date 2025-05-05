from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Date, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Experience(Base):
    __tablename__ = "experiences"
    __table_args__ = {"comment": "Tabela que armazena as experiências profissionais"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    position = Column(String(100), nullable=False, comment="Cargo")
    period = Column(String(100), nullable=False, comment="Período")
    start_date = Column(Date, nullable=False, comment="Data de início")
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

    def to_dict(self):
        """
        Converte o objeto Experience em um dicionário.
        """
        return {
            "position": self.position,
            "period": self.period,
            "start_date": self.start_date.isoformat(),
            "company": self.company,
            "location": self.location,
            "website": self.website,
            "logo": self.logo,
            "actual_job": self.actual_job,
            "description": self.description,
            "skills": self.skills,
        }
