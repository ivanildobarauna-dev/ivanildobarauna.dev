from contextlib import contextmanager
from typing import Type

from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker

from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface


class PostgresAdapter(RepositoryInterface):
    """Repository implementation backed by PostgreSQL."""

    def __init__(self, host: str, port: int, user: str, password: str) -> None:
        """Initialize the adapter with the connection credentials."""
        connection_string = f"postgresql://{user}:{password}@{host}:{port}/portfolio"
        self.engine = create_engine(
            connection_string,
            echo=False,
        )
        self.session_factory = scoped_session(sessionmaker(bind=self.engine))

    @contextmanager
    def get_session(self):
        """Yield a new SQLAlchemy session."""
        session = self.session_factory()
        try:
            yield session
        finally:
            session.close()

    def get_all(self, model_class: Type) -> list:
        """Return all records from a given table."""
        with self.get_session() as session:
            return session.query(model_class).all()

    def get_all_projects(self) -> list[Project]:
        """Fetch all projects."""
        return self.get_all(Project)

    def get_all_certifications(self) -> list[Certification]:
        """Fetch all certifications."""
        return self.get_all(Certification)

    def get_all_formations(self) -> list[Formation]:
        """Fetch all formations."""
        return self.get_all(Formation)

    def get_all_experiences(self) -> list[Experience]:
        """Fetch all experiences from the view VW_EXPERIENCES."""
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
        """Return the duration worked at each company."""
        with self.get_session() as session:
            result = session.execute(text("SELECT * FROM VW_COMPANIES_DURATION"))

            companies_durations = []

            for row in result:
                experience = CompanyDuration(name=row.name, duration=row.duration)
                companies_durations.append(experience)

            return companies_durations

    def get_all_social_media(self) -> list[SocialMedia]:
        """Fetch all social media records."""
        return self.get_all(SocialMedia)

    def get_total_experience(self) -> dict:
        """Return the total professional experience duration."""
        with self.get_session() as session:
            result = session.execute(text("SELECT * FROM VW_TOTAL_EXPERIENCE"))
            row = result.fetchone()

            return {"total_duration": row[0]} if row else {"total_duration": None}
