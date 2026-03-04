import os
from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService
from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)

class ApplicationDependencies:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            logger.info("🚀 Inicializando dependências da aplicação")
            cls._instance = super().__new__(cls)

            try:
                # Inicializa o repositório de dados (PostgresAdapter)
                logger.info("📦 Configurando repositório de dados (PostgreSQL)")
                cls._instance.data_repository = PostgresAdapter()
                logger.info("✅ Repositório de dados configurado com sucesso")

                # Inicializa o serviço de portfólio
                logger.info("⚙️  Inicializando serviço de portfólio")
                cls._instance.portfolio_data_service = PortfolioDataService(
                    cls._instance.data_repository
                )
                logger.info("✅ Serviço de portfólio inicializado com sucesso")

                # Log final de sucesso com informações do ambiente
                env = os.getenv("FLASK_ENV", "development")
                logger.info(
                    f"🎉 Todas as dependências carregadas com sucesso "
                    f"(Ambiente: {env}) [PID: {os.getpid()}]"
                )

            except Exception as e:
                logger.error(
                    f"❌ Falha crítica na inicialização das dependências: {str(e)}",
                    exc_info=True
                )
                raise

        return cls._instance
