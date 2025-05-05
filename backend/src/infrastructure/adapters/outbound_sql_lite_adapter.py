from typing import Type

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.domain.dto.certification import Certification
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface


class SqlLiteAdapter(RepositoryInterface):
    """
    Adapter for outbound SQL Lite database operations.
    """

    def __init__(self, database_path: str) -> None:
        self.engine = create_engine(database_path, echo=False)
        self.session = sessionmaker(bind=self.engine)

    def get_all_projects(self) -> list[Type[Project]]:
        return self.session().query(Project).all()

    def get_all_certifications(self) -> list[Type[Certification]]:
        return self.session().query(Certification).all()

    def get_all_formations(self) -> list[Type[Formation]]:
        return self.session().query(Formation).all()

    def get_all_experiences(self) -> list[Type[Experience]]:
        return self.session().query(Experience).all()

    def get_all_social_media(self) -> list[Type[SocialMedia]]:
        return self.session().query(SocialMedia).all()
