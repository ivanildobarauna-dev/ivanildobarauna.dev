from typing import Type
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import StaticPool

from src.domain.dto.certification import Certification
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface


class SqlLiteAdapter(RepositoryInterface):
    def __init__(self, database_path: str) -> None:
        self.engine = create_engine(
            database_path,
            echo=False,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        self.session_factory = scoped_session(sessionmaker(bind=self.engine))

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
        return self.get_all(Experience)

    def get_all_social_media(self) -> list[SocialMedia]:
        return self.get_all(SocialMedia)
