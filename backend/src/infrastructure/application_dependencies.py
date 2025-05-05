import os
from uuid import uuid4

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from src.infrastructure.adapters.outbound_sql_lite_adapter import SqlLiteAdapter
from src.infrastructure.services.portfolio_data_service import PortfolioDataService

db = SQLAlchemy()
DATABASE_URL = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'api.db')}"

def setup_database(app: Flask):
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = str(uuid4())
    db.init_app(app)
    return db

def portfolio_data_service() -> PortfolioDataService:
    """Initialize the portfolio data service with the file storage adapter."""
    data_repository = SqlLiteAdapter(database_path=DATABASE_URL)
    return PortfolioDataService(data_repository)

# Initialize the application service
portfolio_data_service = portfolio_data_service()