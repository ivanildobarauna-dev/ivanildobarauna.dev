from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface
from src.infrastructure.ports.cache_provider_interface import CacheProvider


class PortfolioDataService:
    """Portfolio Data Service"""

    def __init__(self, data_repository: RepositoryInterface, cache_provider: CacheProvider):
        self.cache_provider = cache_provider
        self.data_repository = data_repository

    def projects(self) -> list[Project]:
        """Get projects data from the repository."""
        cache_projects = self.cache_provider.get_all_projects()

        if cache_projects:
            return cache_projects

        repository_projects = self.data_repository.get_all_projects()

        self.cache_provider.set_projects(repository_projects)

        return repository_projects


    def experiences(self) -> list[Experience]:
        """Get experiences data from the repository."""
        return self.data_repository.get_all_experiences()

    def companies_duration(self) -> list[CompanyDuration]:
        return self.data_repository.get_company_duration()

    def formations(self) -> list[Formation]:
        """Get educations data from the repository."""
        return self.data_repository.get_all_formations()

    def certifications(self) -> list[Certification]:
        """Get certifications data from the repository."""
        return self.data_repository.get_all_certifications()

    def social_media(self) -> list[SocialMedia]:
        """Get social media data from the repository."""
        return self.data_repository.get_all_social_media()

    def total_experience(self) -> dict:
        """Get total experience from the repository."""
        return self.data_repository.get_total_experience()
