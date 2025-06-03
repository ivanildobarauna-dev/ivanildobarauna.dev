import os
from uuid import uuid4

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text

from src.infrastructure.adapters.outbound_postgres_adapter import PostgresAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService
from src.infrastructure.utils.logger import logger

db = SQLAlchemy()

# Configurações do PostgreSQL
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "postgres")
POSTGRES_PORT = int(os.getenv("POSTGRES_PORT", "5432"))
POSTGRES_USER = os.getenv("POSTGRES_USER", "backend")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "backend")
POSTGRES_DB = os.getenv("POSTGRES_DB", "portfolio")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

def test_database_connection():
    """Testa a conexão com o banco de dados PostgreSQL."""
    try:
        # Tenta criar uma conexão com o banco
        test_engine = db.create_engine(DATABASE_URL)
        with test_engine.connect() as connection:
            # Executa uma query simples para testar a conexão
            connection.execute(text("SELECT 1"))
        logger.info("Database connection test successful")
        return True
    except SQLAlchemyError as e:
        logger.error(f"Database connection test failed: {str(e)}")
        raise Exception(f"Failed to connect to PostgreSQL database: {str(e)}")

def setup_database(app: Flask):
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = str(uuid4())
    
    # Testa a conexão antes de inicializar o app
    test_database_connection()
    
    db.init_app(app)
    return db

def portfolio_data_service() -> PortfolioDataService:
    """Initialize the portfolio data service with the PostgreSQL adapter."""
    data_repository = PostgresAdapter(
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD
    )
    return PortfolioDataService(data_repository)

# Initialize the application service
portfolio_data_service = portfolio_data_service()
