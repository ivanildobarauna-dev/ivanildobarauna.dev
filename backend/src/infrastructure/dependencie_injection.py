from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService

class ApplicationDependencies:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)

            cls._instance.data_repository = PostgresAdapter()
            cls._instance.portfolio_data_service = PortfolioDataService(
                cls._instance.data_repository
            )

        return cls._instance
