from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Formation(Base):
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

    def to_dict(self):
        """
        Converte o objeto Formation em um dicionário.
        """
        return {
            "institution": self.institution,
            "type": self.type,
            "course": self.course,
            "period": self.period,
            "description": self.description,
            "logo": self.logo,
        }
