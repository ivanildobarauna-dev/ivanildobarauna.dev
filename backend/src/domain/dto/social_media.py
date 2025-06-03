from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class SocialMedia(Base):
    """Represent social media links stored in the database."""

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

    def to_dict(self):
        """Return a dictionary representation of this social media link."""
        return {
            "label": self.label,
            "url": self.url,
            "type": self.type,
        }
