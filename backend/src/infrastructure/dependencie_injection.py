from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService

class ApplicationDependencies:
    def __init__(self) -> None:
        self.data_repository = None
        self.portfolio_data_service = None

    @classmethod
    def builder(cls):
        return cls()

    def build(self):
        self.data_repository = PostgresAdapter()
        return self

    def porfolio_data_service(self):
        self.portfolio_data_service = PortfolioDataService(self.data_repository)
        return self
    
        
    