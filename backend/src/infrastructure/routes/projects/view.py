"""Projects Routes"""

from flask import Blueprint, jsonify
from flask_restx import Namespace, Resource

from src.infrastructure.dependencie_injection import ApplicationDependencies
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

projects_blueprint = Blueprint("projects_bp", __name__)
projects_ns = Namespace(
    name="Projects",
    description="My OpenSource Projects",
)

# Inicialização lazy - apenas quando necessário
def get_portfolio_data_service():
    """Get portfolio data service instance (lazy initialization)."""
    if not hasattr(get_portfolio_data_service, '_instance'):
        get_portfolio_data_service._instance = (
            ApplicationDependencies
                .builder()
                .build()
                .porfolio_data_service()
                .portfolio_data_service
        )
    return get_portfolio_data_service._instance


@projects_ns.route("/projects")
class Projects(Resource):
    def get(self):
        """Get all projects from the projects.json file."""
        try:
            portfolio_data_service = get_portfolio_data_service()
            projects = portfolio_data_service.projects()

            response = [project.to_dict() for project in projects if project.active]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting projects: {str(error)}")
            return (
                jsonify({"error_message": "An internal server error occurred"}),
                HTTP_INTERNAL_SERVER_ERROR
            )
