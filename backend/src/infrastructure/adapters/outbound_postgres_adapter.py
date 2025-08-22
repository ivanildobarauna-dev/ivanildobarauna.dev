import os
import time

from contextlib import contextmanager
from typing import Type

from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface
from src.infrastructure.utils.logger import logger


class PostgresAdapter(RepositoryInterface):
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "postgres")
    POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_USER = os.getenv("POSTGRES_USER", "backend")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "backend")
    POSTGRES_DB = os.getenv("POSTGRES_DB", "portfolio")
    

    def __init__(self, conn=None) -> None:
        self.connection_string =  self.build_connection_string()
        self.engine = conn or self.build_engine()
        self.session_factory = scoped_session(sessionmaker(bind=self.engine))
        
    def build_connection_string(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    def build_engine(self, retry_time: int = 10):
        while True:
            try:
                engine = create_engine(self.connection_string, echo=False)
                with engine.connect() as connection:
                    connection.execute(text("SELECT 1"))
                logger.info(f"Connected on Database ✅ [Worker PID: {os.getpid()}]")
                break
            except SQLAlchemyError as e:
                logger.error(f"\n{'='*60}\n❌ Falha ao conectar ao banco de dados! [Worker PID: {os.getpid()}]\n{'-'*60}\nDetalhes do erro:\n{str(e)}\n{'='*60}\nTentando novamente em {retry_time} segundos...\n")
                time.sleep(retry_time)
            
        return engine


    @contextmanager
    def get_session(self):
        session = self.session_factory()
        try:
            yield session
        finally:
            session.close()

    def get_all(self, model_class: Type) -> list:
        with self.get_session() as session:
            return session.query(model_class).all()

    def get_all_projects(self) -> list[Project]:
        return self.get_all(Project)

    def get_all_certifications(self) -> list[Certification]:
        return self.get_all(Certification)

    def get_all_formations(self) -> list[Formation]:
        return self.get_all(Formation)

    def get_all_experiences(self) -> list[Experience]:
        with self.get_session() as session:
            result = session.execute(text("SELECT * FROM VW_EXPERIENCES"))
            
            experiences = []
            
            for row in result:
                experience = Experience(
                    position=row.position,
                    company=row.company,
                    location=row.location,
                    website=row.website,
                    logo=row.logo,
                    description=row.description,
                    skills=row.skills,
                    duration=row.duration,
                )
                experiences.append(experience)
            
            return experiences

    def get_company_duration(self) -> list[CompanyDuration]:
        with self.get_session() as session:
            result = session.execute(text("SELECT * FROM VW_COMPANIES_DURATION"))

            companies_durations = []

            for row in result:
                experience = CompanyDuration(
                    name=row.name,
                    duration=row.duration
                )
                companies_durations.append(experience)

            return companies_durations

    def get_all_social_media(self) -> list[SocialMedia]:
        return self.get_all(SocialMedia)

    def get_total_experience(self) -> dict:
        with self.get_session() as session:
            result = session.execute(text("SELECT * FROM VW_TOTAL_EXPERIENCE"))
            row = result.fetchone()

            return {"total_duration": row[0]} if row else {"total_duration": None} 
