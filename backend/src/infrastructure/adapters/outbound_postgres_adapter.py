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
    POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
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
    
    def build_engine(self, retry_interval: int = 5):
        attempt = 0
        
        while True:
            attempt += 1
            try:
                engine = create_engine(self.connection_string, 
                                    echo=False,
                                    pool_size=5,          
                                    max_overflow=10,      
                                    pool_timeout=30,      
                                    pool_recycle=1800,    
                                    pool_pre_ping=True)
                
                with engine.connect() as connection:
                    connection.execute(text("SELECT 1"))
                
                logger.info(f"✅ Conexão com o banco de dados estabelecida com sucesso! [Tentativa: {attempt}] [PID: {os.getpid()}]")
                return engine
                
            except SQLAlchemyError as e:
                logger.error(
                    f"\n{'='*80}\n"
                    f"❌ Falha na tentativa de conexão #{attempt} [PID: {os.getpid()}]\n"
                    f"{'-'*80}\n"
                    f"Erro: {str(e)}\n"
                    f"String de conexão: {self._obfuscated_connection_string()}\n"
                    f"Tentando novamente em {retry_interval} segundos...\n"
                    f"{'='*80}\n"
                )
                time.sleep(retry_interval)
    
    def _obfuscated_connection_string(self) -> str:
        """Retorna a string de conexão com a senha ofuscada para logs."""
        if not hasattr(self, '_connection_string'):
            self._connection_string = self.build_connection_string()
            
        # Ofusca a senha na string de conexão para logs
        if '://' in self._connection_string:
            parts = self._connection_string.split('@', 1)
            if len(parts) == 2:
                auth_part, rest = parts
                if ':' in auth_part.split('://', 1)[1]:  # Verifica se há senha
                    user_pass = auth_part.split('://', 1)[1]
                    user = user_pass.split(':', 1)[0]
                    auth_part = f"{auth_part.split('://', 1)[0]}://{user}:***"
                return f"{auth_part}@{rest}"
        return '***'


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
