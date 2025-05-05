from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Project(Base):
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

    def to_dict(self):
        """
        Converte o objeto Project em um dicionário.
        """
        return {
            "title": self.title,
            "description": self.description,
            "url": self.url,
            "tags": self.tags,
        }
