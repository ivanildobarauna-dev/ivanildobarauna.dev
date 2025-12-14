import logging
from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.adapters.outbound_redis_adapter import RedisAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService

logger = logging.getLogger(__name__)

class ApplicationDependencies:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("🚀 Criando nova instância de ApplicationDependencies")
            cls._instance = super().__new__(cls)
            
            try:
                logger.info("🔄 Inicializando PostgresAdapter...")
                cls._instance.data_repository = PostgresAdapter()
                logger.info("✅ PostgresAdapter inicializado com sucesso!")
                logger.info("🔄 Inicializando RedisAdapter...")
                cls._instance.cache_provider = RedisAdapter()
                logger.info("✅ RedisAdapter inicializado com sucesso!")
                logger.info("🔄 Inicializando PortfolioDataService...")
                cls._instance.portfolio_data_service = PortfolioDataService(
                    cls._instance.data_repository, cls._instance.cache_provider
                )
                logger.info("✅ PortfolioDataService inicializado com sucesso!")
                
            except Exception as e:
                logger.error(f"❌ Erro ao inicializar ApplicationDependencies: {str(e)}")
                raise
                
            logger.info("🎉 ApplicationDependencies inicializado com sucesso!")
        else:
            logger.info("♻️Reutilizando instância existente de ApplicationDependencies")
            
        return cls._instance
