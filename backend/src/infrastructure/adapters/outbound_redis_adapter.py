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
    REDIS_HOST = os.getenv("REDIS_HOST", "redis")
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
    
    def _get_from_cache_or_fallback(self, key: str, fetch_func, ttl: int = None) -> Any:
        """
        Obtém dados do cache ou do repositório de fallback.
        
        Args:
            key: Chave do cache
            fetch_func: Função para buscar dados do repositório de fallback
            ttl: Tempo de vida em segundos (opcional, usa o padrão se não fornecido)
            
        Returns:
            Dados do cache ou do repositório de fallback
        """
        try:
            # Tenta obter do cache
            cached_data = self.redis.get(key)
            if cached_data:
                return json.loads(cached_data)
                
            # Se não estiver em cache e houver um repositório de fallback
            if self.fallback_repository:
                data = fetch_func()
                if data is not None:
                    # Armazena no cache
                    self.redis.setex(
                        key, 
                        ttl or self.REDIS_TTL, 
                        json.dumps(data, default=str)
                    )
                return data
                
            return None
            
        except RedisError as e:
            logger.error(f"Erro ao acessar o Redis: {e}")
            if self.fallback_repository:
                return fetch_func()
            raise
    
    def get_all_projects(self) -> List[Project]:
        """Obtém todos os projetos do cache ou do repositório de fallback."""
        def _fetch_projects():
            return self.fallback_repository.get_all_projects() if self.fallback_repository else []
            
        projects_data = self._get_from_cache_or_fallback(
            self.PROJECTS_KEY, 
            _fetch_projects
        )
        return [Project(**project) if isinstance(project, dict) else project 
                for project in (projects_data or [])]
    
    def get_all_formations(self) -> List[Formation]:
        """Obtém todas as formações do cache ou do repositório de fallback."""
        def _fetch_formations():
            return self.fallback_repository.get_all_formations() if self.fallback_repository else []
            
        formations_data = self._get_from_cache_or_fallback(
            self.FORMATIONS_KEY,
            _fetch_formations
        )
        return [Formation(**formation) if isinstance(formation, dict) else formation 
                for formation in (formations_data or [])]
    
    def get_all_certifications(self) -> List[Certification]:
        """Obtém todas as certificações do cache ou do repositório de fallback."""
        def _fetch_certifications():
            return self.fallback_repository.get_all_certifications() if self.fallback_repository else []
            
        certs_data = self._get_from_cache_or_fallback(
            self.CERTIFICATIONS_KEY,
            _fetch_certifications
        )
        return [Certification(**cert) if isinstance(cert, dict) else cert 
                for cert in (certs_data or [])]
    
    def get_all_experiences(self) -> List[Experience]:
        """Obtém todas as experiências do cache ou do repositório de fallback."""
        def _fetch_experiences():
            return self.fallback_repository.get_all_experiences() if self.fallback_repository else []
            
        exp_data = self._get_from_cache_or_fallback(
            self.EXPERIENCES_KEY,
            _fetch_experiences
        )
        return [Experience(**exp) if isinstance(exp, dict) else exp 
                for exp in (exp_data or [])]
    
    def get_all_social_media(self) -> List[SocialMedia]:
        """Obtém todas as redes sociais do cache ou do repositório de fallback."""
        def _fetch_social_media():
            return self.fallback_repository.get_all_social_media() if self.fallback_repository else []
            
        sm_data = self._get_from_cache_or_fallback(
            self.SOCIAL_MEDIA_KEY,
            _fetch_social_media
        )
        return [SocialMedia(**sm) if isinstance(sm, dict) else sm 
                for sm in (sm_data or [])]
    
    def get_company_duration(self) -> List[CompanyDuration]:
        """Obtém a duração nas empresas do cache ou do repositório de fallback."""
        def _fetch_company_duration():
            return self.fallback_repository.get_company_duration() if self.fallback_repository else []
            
        cd_data = self._get_from_cache_or_fallback(
            self.COMPANY_DURATION_KEY,
            _fetch_company_duration
        )
        return [CompanyDuration(**cd) if isinstance(cd, dict) else cd 
                for cd in (cd_data or [])]
    
    def get_total_experience(self) -> Dict[str, Any]:
        """Obtém o tempo total de experiência do cache ou do repositório de fallback."""
        def _fetch_total_experience():
            return self.fallback_repository.get_total_experience() if self.fallback_repository else {}
            
        te_data = self._get_from_cache_or_fallback(
            self.TOTAL_EXPERIENCE_KEY,
            _fetch_total_experience
        )
        return te_data or {}
    
    def clear_cache(self) -> bool:
        """Limpa todo o cache do Redis."""
        try:
            self.redis.flushdb()
            return True
        except RedisError as e:
            logger.error(f"Erro ao limpar o cache do Redis: {e}")
            return False
    
    def refresh_cache(self) -> bool:
        """Atualiza o cache com os dados mais recentes do repositório de fallback."""
        if not self.fallback_repository:
            logger.warning("Nenhum repositório de fallback configurado para atualizar o cache")
            return False
            
        try:
            # Atualiza cada chave individualmente
            self.redis.setex(
                self.PROJECTS_KEY,
                self.REDIS_TTL,
                json.dumps([p.__dict__ for p in self.fallback_repository.get_all_projects()], default=str)
            )
            
            self.redis.setex(
                self.FORMATIONS_KEY,
                self.REDIS_TTL,
                json.dumps([f.__dict__ for f in self.fallback_repository.get_all_formations()], default=str)
            )
            
            self.redis.setex(
                self.CERTIFICATIONS_KEY,
                self.REDIS_TTL,
                json.dumps([c.__dict__ for c in self.fallback_repository.get_all_certifications()], default=str)
            )
            
            self.redis.setex(
                self.EXPERIENCES_KEY,
                self.REDIS_TTL,
                json.dumps([e.__dict__ for e in self.fallback_repository.get_all_experiences()], default=str)
            )
            
            self.redis.setex(
                self.SOCIAL_MEDIA_KEY,
                self.REDIS_TTL,
                json.dumps([s.__dict__ for s in self.fallback_repository.get_all_social_media()], default=str)
            )
            
            self.redis.setex(
                self.COMPANY_DURATION_KEY,
                self.REDIS_TTL,
                json.dumps([cd.__dict__ for cd in self.fallback_repository.get_company_duration()], default=str)
            )
            
            self.redis.setex(
                self.TOTAL_EXPERIENCE_KEY,
                self.REDIS_TTL,
                json.dumps(self.fallback_repository.get_total_experience(), default=str)
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Erro ao atualizar o cache: {e}")
            return False
