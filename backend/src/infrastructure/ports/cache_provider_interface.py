from abc import ABC, abstractmethod
from typing import List

from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia


class CacheProvider(ABC):
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

    @abstractmethod
    def get_total_experience(self) -> dict:
        """Get all total experience."""
        pass

    @abstractmethod
    def set_projects(self, list_projects: List[Project]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_formations(self, list_formations: List[Formation]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_certifications(self, list_certifications: List[Certification]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_experiences(self, list_experiences: List[Experience]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_social_media(self, list_social_media: List[SocialMedia]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_company_duration(self, list_company_duration: List[CompanyDuration]) -> None:
        """Set cache."""
        pass

    @abstractmethod
    def set_total_experience(self, total_experience: dict) -> None:
        """Set cache."""
        pass
