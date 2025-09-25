import json
import os
from typing import Optional, List, Dict, Any
import redis
from redis.exceptions import RedisError

from src.domain.dto.certification import Certification
from src.domain.dto.company_duration import CompanyDuration
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.ports.cache_provider_interface import CacheProvider
from src.infrastructure.utils.logger import logger


class RedisAdapter(CacheProvider):
    # Configurações padrão do Redis
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "redis")
    REDIS_DB = int(os.getenv("REDIS_DB", "0"))
    REDIS_TTL = int(os.getenv("REDIS_TTL", "3600"))  # 1 hora de TTL padrão
    
    # Prefixos para as chaves no Redis
    PROJECTS_KEY = "portfolio:projects"
    FORMATIONS_KEY = "portfolio:formations"
    CERTIFICATIONS_KEY = "portfolio:certifications"
    EXPERIENCES_KEY = "portfolio:experiences"
    SOCIAL_MEDIA_KEY = "portfolio:social_media"
    COMPANY_DURATION_KEY = "portfolio:company_duration"
    TOTAL_EXPERIENCE_KEY = "portfolio:total_experience"

    def __init__(self) -> None:
        self.redis = redis.Redis(
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            password=self.REDIS_PASSWORD,
            db=self.REDIS_DB,
            decode_responses=True
        )

        try:
            self.redis.ping()
        except RedisError as e:
            logger.error(f"Redis Connection Error: {e}")
            raise

    def get_cache_data_by_key(self, key: str):
        try:
            data = self.redis.get(key)
            if not data:
                return []
            return json.loads(data)
        except RedisError as e:
            logger.error(f"Redis GET Key Error: {e}")
            raise

    def get_all_projects(self) -> List[Project]:
        projects_data = self.get_cache_data_by_key(self.PROJECTS_KEY)

        return [Project(**project) for project in projects_data]

    def get_all_formations(self) -> List[Formation]:
        formations_data   = self.get_cache_data_by_key(self.FORMATIONS_KEY)

        return [Formation(**project) for project in formations_data]

    def get_all_certifications(self) -> List[Certification]:
        certifications_data = self.get_cache_data_by_key(self.CERTIFICATIONS_KEY)

        return [Certification(**project) for project in certifications_data]
    
    def get_all_experiences(self) -> List[Experience]:
        experiences_data = self.get_cache_data_by_key(self.EXPERIENCES_KEY)

        return [Experience(**project) for project in experiences_data]
    
    def get_all_social_media(self) -> List[SocialMedia]:
        social_media_data = self.get_cache_data_by_key(self.SOCIAL_MEDIA_KEY)

        return [SocialMedia(**project) for project in social_media_data]
    
    def get_company_duration(self) -> List[CompanyDuration]:
        company_duration_data = self.get_cache_data_by_key(self.COMPANY_DURATION_KEY)

        return [CompanyDuration(**project) for project in company_duration_data]
    
    def get_total_experience(self) -> Dict[str, Any]:
        total_experience_data = self.get_cache_data_by_key(self.TOTAL_EXPERIENCE_KEY)

        return total_experience_data

    def set_projects(self, list_projects: List[Project]):
        try:
            data = [project.to_dict() for project in list_projects]
            self.redis.set(self.PROJECTS_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.PROJECTS_KEY} Error: {e}")
            raise

    def set_formations(self, list_formations: List[Formation]):
        try:
            data = [formation.to_dict() for formation in list_formations]
            self.redis.set(self.FORMATIONS_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.FORMATIONS_KEY} Error: {e}")
            raise

    def set_certifications(self, list_certifications: List[Certification]):
        try:
            data = [certification.to_dict() for certification in list_certifications]
            self.redis.set(self.CERTIFICATIONS_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.CERTIFICATIONS_KEY} Error: {e}")
            raise

    def set_experiences(self, list_experiences: List[Experience]):
        try:
            data = [experience.to_dict() for experience in list_experiences]
            self.redis.set(self.EXPERIENCES_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.EXPERIENCES_KEY} Error: {e}")
            raise

    def set_social_media(self, list_social_media: List[SocialMedia]):
        try:
            data = [social_media.to_dict() for social_media in list_social_media]
            self.redis.set(self.SOCIAL_MEDIA_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.SOCIAL_MEDIA_KEY} Error: {e}")
            raise

    def set_company_duration(self, list_company_duration: List[CompanyDuration]):
        try:
            data = [company_duration.to_dict() for company_duration in list_company_duration]
            self.redis.set(self.COMPANY_DURATION_KEY, json.dumps(data), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.COMPANY_DURATION_KEY} Error: {e}")
            raise

    def set_total_experience(self, total_experience: Dict[str, Any]):
        try:
            self.redis.set(self.TOTAL_EXPERIENCE_KEY, json.dumps(total_experience), ex=self.REDIS_TTL)
        except RedisError as e:
            logger.error(f"Redis setting Key -> {self.TOTAL_EXPERIENCE_KEY} Error: {e}")
            raise