from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.repository_interface import RepositoryInterface
from src.infrastructure.ports.cache_provider_interface import CacheProvider
from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)

class PortfolioDataService:
    """Portfolio Data Service"""

    def __init__(self, data_repository: RepositoryInterface, cache_provider: CacheProvider):
        self.cache_provider = cache_provider
        self.data_repository = data_repository

    def projects(self) -> list[Project]:
        """Get projects data from the repository."""
        cache_projects = self.cache_provider.get_all_projects()

        if cache_projects:
            logger.info(f"[CACHE HIT] {len(cache_projects)} projetos recuperados do cache")
            return cache_projects

        logger.warning("[CACHE MISS] Dados de projetos não encontrados no cache. Buscando no repositório...")
        repository_projects = self.data_repository.get_all_projects()
        
        logger.info(f"Salvando {len(repository_projects)} projetos no cache...")
        self.cache_provider.set_projects(repository_projects)

        return repository_projects


    def experiences(self) -> list[Experience]:
        """Get experiences data from the repository."""
        cache_experiences = self.cache_provider.get_all_experiences()

        if cache_experiences:
            logger.info(f"[CACHE HIT] {len(cache_experiences)} experiências recuperadas do cache")
            return cache_experiences

        logger.warning("[CACHE MISS] Dados de experiências não encontrados no cache. Buscando no repositório...")
        repository_experiences = self.data_repository.get_all_experiences()
        
        logger.info(f"Salvando {len(repository_experiences)} experiências no cache...")
        self.cache_provider.set_experiences(repository_experiences)

        return repository_experiences

    def companies_duration(self) -> list[CompanyDuration]:
        cached_companies_duration = self.cache_provider.get_company_duration()

        if cached_companies_duration:
            logger.info("[CACHE HIT] Durações de empresas recuperadas do cache")
            return cached_companies_duration

        logger.warning("[CACHE MISS] Dados de duração de empresas não encontrados no cache. Buscando no repositório...")
        repository_companies_duration = self.data_repository.get_company_duration()
        
        logger.info("Salvando durações de empresas no cache...")
        self.cache_provider.set_company_duration(repository_companies_duration)

        return repository_companies_duration

    def formations(self) -> list[Formation]:
        """Get educations data from the repository."""
        cached_formations = self.cache_provider.get_all_formations()

        if cached_formations:
            logger.info(f"[CACHE HIT] {len(cached_formations)} formações recuperadas do cache")
            return cached_formations

        logger.warning("[CACHE MISS] Dados de formações não encontrados no cache. Buscando no repositório...")
        repository_formations = self.data_repository.get_all_formations()
        
        logger.info(f"Salvando {len(repository_formations)} formações no cache...")
        self.cache_provider.set_formations(repository_formations)

        return repository_formations

    def certifications(self) -> list[Certification]:
        """Get certifications data from the repository."""
        cached_certifications = self.cache_provider.get_all_certifications()

        if cached_certifications:
            logger.info(f"[CACHE HIT] {len(cached_certifications)} certificações recuperadas do cache")
            return cached_certifications

        logger.warning("[CACHE MISS] Dados de certificações não encontrados no cache. Buscando no repositório...")
        repository_certifications = self.data_repository.get_all_certifications()
        
        logger.info(f"Salvando {len(repository_certifications)} certificações no cache...")
        self.cache_provider.set_certifications(repository_certifications)

        return repository_certifications

    def social_media(self) -> list[SocialMedia]:
        """Get social media data from the repository."""
        cached_social_media = self.cache_provider.get_all_social_media()

        if cached_social_media:
            logger.info(f"[CACHE HIT] {len(cached_social_media)} redes sociais recuperadas do cache")
            return cached_social_media

        logger.warning("[CACHE MISS] Dados de redes sociais não encontrados no cache. Buscando no repositório...")
        repository_social_media = self.data_repository.get_all_social_media()
        
        logger.info(f"Salvando {len(repository_social_media)} redes sociais no cache...")
        self.cache_provider.set_social_media(repository_social_media)

        return repository_social_media

    def total_experience(self) -> dict:
        """Get total experience from the repository."""
        cached_total_experience = self.cache_provider.get_total_experience()

        if cached_total_experience:
            logger.info("[CACHE HIT] Experiência total recuperada do cache")
            return cached_total_experience

        logger.warning("[CACHE MISS] Dados de experiência total não encontrados no cache. Buscando no repositório...")
        repository_total_experience = self.data_repository.get_total_experience()
        
        logger.info("Salvando experiência total no cache...")
        self.cache_provider.set_total_experience(repository_total_experience)

        return repository_total_experience
