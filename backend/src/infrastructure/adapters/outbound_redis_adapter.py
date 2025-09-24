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
from src.infrastructure.ports.repository_interface import RepositoryInterface
from src.infrastructure.utils.logger import logger


class RedisAdapter(RepositoryInterface):
    """
    Adaptador para o Redis que implementa a interface RepositoryInterface.
    Este adaptador fornece um cache em memória com fallback para outro repositório.
    """
    
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

    def __init__(self, fallback_repository: Optional[RepositoryInterface] = None, **redis_kwargs) -> None:
        """
        Inicializa o adaptador do Redis.
        
        Args:
            fallback_repository: Repositório de fallback opcional para buscar dados quando não estiverem em cache
            **redis_kwargs: Argumentos adicionais para a conexão com o Redis
        """
        self.fallback_repository = fallback_repository
        self.redis = redis.Redis(
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            password=self.REDIS_PASSWORD,
            db=self.REDIS_DB,
            decode_responses=True,
            **redis_kwargs
        )
        
        # Testa a conexão com o Redis
        try:
            self.redis.ping()
        except RedisError as e:
            logger.error(f"Erro ao conectar ao Redis: {e}")
            if not fallback_repository:
                raise RuntimeError("Falha ao conectar ao Redis e nenhum repositório de fallback fornecido")
    
    def get_all_projects(self) -> List[Project]:
        """Obtém todos os projetos do cache ou do repositório de fallback."""
        
        try:    
            projects_data_from_cache = self.redis.get(self.PROJECTS_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_all_projects()
            raise
        
        if projects_data_from_cache:
            project_data = json.loads(projects_data_from_cache)
            return [Project(**project) if isinstance(project, dict) else project 
                    for project in (project_data or [])]
        else:
            project_data = self.fallback_repository.get_all_projects() if self.fallback_repository else []
            self.redis.setex(
                self.PROJECTS_KEY,
                self.REDIS_TTL,
                json.dumps(project_data, default=str)
            )
            return project_data
        
    def get_all_formations(self) -> List[Formation]:
        """Obtém todas as formações do cache ou do repositório de fallback."""
        try:    
            formations_data_from_cache = self.redis.get(self.FORMATIONS_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_all_formations()
            raise
            
        if formations_data_from_cache:
            formations_data = json.loads(formations_data_from_cache)
            return [Formation(**formation) if isinstance(formation, dict) else formation 
                    for formation in (formations_data or [])]
        else:
            formations_data = self.fallback_repository.get_all_formations() if self.fallback_repository else []
            self.redis.setex(
                        self.FORMATIONS_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(formations_data, default=str)
                    )
            return [Formation(**formation) if isinstance(formation, dict) else formation 
                    for formation in (formations_data or [])]
    
    def get_all_certifications(self) -> List[Certification]:
        """Obtém todas as certificações do cache ou do repositório de fallback."""
        try:    
            certs_data_from_cache = self.redis.get(self.CERTIFICATIONS_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_all_certifications()
            raise
            
        if certs_data_from_cache:
            certs_data = json.loads(certs_data_from_cache)
            return [Certification(**cert) if isinstance(cert, dict) else cert 
                    for cert in (certs_data or [])]
        else:
            certs_data = self.fallback_repository.get_all_certifications() if self.fallback_repository else []
            self.redis.setex(
                        self.CERTIFICATIONS_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(certs_data, default=str)
                    )
            return [Certification(**cert) if isinstance(cert, dict) else cert 
                    for cert in (certs_data or [])]
    
    def get_all_experiences(self) -> List[Experience]:
        """Obtém todas as experiências do cache ou do repositório de fallback."""
        try:    
            exp_data_from_cache = self.redis.get(self.EXPERIENCES_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_all_experiences()
            raise
            
        if exp_data_from_cache:
            exp_data = json.loads(exp_data_from_cache)
            return [Experience(**exp) if isinstance(exp, dict) else exp 
                    for exp in (exp_data or [])]
        else:
            exp_data = self.fallback_repository.get_all_experiences() if self.fallback_repository else []
            self.redis.setex(
                        self.EXPERIENCES_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(exp_data, default=str)
                    )
            return [Experience(**exp) if isinstance(exp, dict) else exp 
                    for exp in (exp_data or [])]
    
    def get_all_social_media(self) -> List[SocialMedia]:
        """Obtém todas as redes sociais do cache ou do repositório de fallback."""
        try:    
            sm_data_from_cache = self.redis.get(self.SOCIAL_MEDIA_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_all_social_media()
            raise
            
        if sm_data_from_cache:
            sm_data = json.loads(sm_data_from_cache)
            return [SocialMedia(**sm) if isinstance(sm, dict) else sm 
                    for sm in (sm_data or [])]
        else:
            sm_data = self.fallback_repository.get_all_social_media() if self.fallback_repository else []
            self.redis.setex(
                        self.SOCIAL_MEDIA_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(sm_data, default=str)
                    )
            return [SocialMedia(**sm) if isinstance(sm, dict) else sm 
                    for sm in (sm_data or [])]
    
    def get_company_duration(self) -> List[CompanyDuration]:
        """Obtém a duração nas empresas do cache ou do repositório de fallback."""
        try:    
            cd_data_from_cache = self.redis.get(self.COMPANY_DURATION_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_company_duration()
            raise
            
        if cd_data_from_cache:
            cd_data = json.loads(cd_data_from_cache)
            return [CompanyDuration(**cd) if isinstance(cd, dict) else cd 
                    for cd in (cd_data or [])]
        else:
            cd_data = self.fallback_repository.get_company_duration() if self.fallback_repository else []
            self.redis.setex(
                        self.COMPANY_DURATION_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(cd_data, default=str)
                    )
            return [CompanyDuration(**cd) if isinstance(cd, dict) else cd 
                    for cd in (cd_data or [])]
    
    def get_total_experience(self) -> Dict[str, Any]:
        """Obtém o tempo total de experiência do cache ou do repositório de fallback."""
        try:    
            te_data_from_cache = self.redis.get(self.TOTAL_EXPERIENCE_KEY)
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return self.fallback_repository.get_total_experience()
            raise
            
        if te_data_from_cache:
            te_data = json.loads(te_data_from_cache)
            return te_data or {}
        else:
            te_data = self.fallback_repository.get_total_experience() if self.fallback_repository else {}
            self.redis.setex(
                        self.TOTAL_EXPERIENCE_KEY, 
                        self.REDIS_TTL, 
                        json.dumps(te_data, default=str)
                    )
            return te_data or {}