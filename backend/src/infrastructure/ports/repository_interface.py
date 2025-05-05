from abc import ABC, abstractmethod

from src.domain.dto.certification import Certification
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.domain.dto.company_duration import CompanyDuration


class RepositoryInterface(ABC):
    @abstractmethod
    def get_all_projects(self) -> list[Project]:
        """Get all projects from the repository."""
        pass

    @abstractmethod
    def get_all_formations(self) -> list[Formation]:
        """Get all educations from the repository."""
        pass

    @abstractmethod
    def get_all_certifications(self) -> list[Certification]:
        """Get all certifications from the repository."""
        pass

    @abstractmethod
    def get_all_experiences(self) -> list[Experience]:
        """Get all experiences from the repository."""
        pass

    @abstractmethod
    def get_all_social_media(self) -> list[SocialMedia]:
        """Get all social media from the repository."""
        pass

    @abstractmethod
    def get_company_duration(self) -> list[CompanyDuration]:
        """Get all company duration from the repository."""
        pass
