from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface
from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)

class PortfolioDataService:
    """Portfolio Data Service"""

    def __init__(self, data_repository: RepositoryInterface):
        self.data_repository = data_repository

    def projects(self) -> list[Project]:
        """Get projects data from the repository."""
        repository_projects = self.data_repository.get_all_projects()
        
        return repository_projects


    def experiences(self) -> list[Experience]:
        """Get experiences data from the repository."""
        repository_experiences = self.data_repository.get_all_experiences()

        return repository_experiences

    def companies_duration(self) -> list[CompanyDuration]:
        repository_companies_duration = self.data_repository.get_company_duration()

        return repository_companies_duration

    def formations(self) -> list[Formation]:
        """Get educations data from the repository."""
        repository_formations = self.data_repository.get_all_formations()

        return repository_formations

    def certifications(self) -> list[Certification]:
        """Get certifications data from the repository."""
        repository_certifications = self.data_repository.get_all_certifications()

        return repository_certifications

    def social_media(self) -> list[SocialMedia]:
        """Get social media data from the repository."""
        repository_social_media = self.data_repository.get_all_social_media()

        return repository_social_media

    def total_experience(self) -> dict:
        """Get total experience from the repository."""
        repository_total_experience = self.data_repository.get_total_experience()

        return repository_total_experience
