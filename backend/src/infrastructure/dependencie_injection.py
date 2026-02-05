from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService
from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)

class ApplicationDependencies:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("Criando nova instância de ApplicationDependencies")
            cls._instance = super().__new__(cls)
            
            try:
                logger.info("Inicializando PostgresAdapter...")
                cls._instance.data_repository = PostgresAdapter()
                logger.info("PostgresAdapter inicializado com sucesso")
                                
                logger.info("Inicializando PortfolioDataService...")
                cls._instance.portfolio_data_service = PortfolioDataService(cls._instance.data_repository)
                logger.info("PortfolioDataService inicializado com sucesso")
                
            except Exception as e:
                logger.error(f"Erro ao inicializar ApplicationDependencies: {str(e)}", exc_info=True)
                raise
                
            logger.info("ApplicationDependencies inicializado com sucesso")
            
        return cls._instance
