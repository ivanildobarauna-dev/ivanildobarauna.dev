from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Certification(Base):
    """Database model representing a certification."""

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

    def to_dict(self):
        """Return a dictionary representation of this certification."""
        return {
            "name": self.name,
            "institution": self.institution,
            "credential_url": self.credential_url,
            "logo": self.logo,
        }
