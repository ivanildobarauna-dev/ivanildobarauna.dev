"""Projects Routes"""

from flask import Blueprint
from flask_restx import Namespace, Resource

from src.infrastructure.application_dependencies import portfolio_data_service
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

projects_blueprint = Blueprint("projects_bp", __name__)
projects_ns = Namespace(
    name="Projects",
    description="My OpenSource Projects",
)


@projects_ns.route("/projects")
class Projects(Resource):
    def get(self):
        """Get all projects from the projects.json file."""
        try:
            projects = portfolio_data_service.projects()

            response = [project.to_dict() for project in projects if project.active]

            return response
        except Exception as error:
            logger.error(f"Error getting projects: {str(error)}")
            return {
                "error_message": "An internal server error occurred"
            }, HTTP_INTERNAL_SERVER_ERROR
