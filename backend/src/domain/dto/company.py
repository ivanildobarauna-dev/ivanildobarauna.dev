from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Company(Base):
    """Represent a company stored in the database."""

    __tablename__ = "companies"
    __table_args__ = {"comment": "Tabela que armazena as empresas do portfólio"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="Nome da empresa")
    location = Column(String(100), nullable=False, comment="Localização")
    website = Column(String(200), nullable=True, comment="URL do site da empresa")
    logo = Column(String(200), nullable=True, comment="Logo da empresa")
    active = Column(
        Boolean,
        default=False,
        comment="Flag para indicar se a empresa está ativa ou não",
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        comment="Data de criação da empresa",
    )
    updated_at = Column(
        DateTime(timezone=True),
        onupdate=lambda: datetime.now(timezone.utc),
        comment="Data de atualização da empresa",
    )
