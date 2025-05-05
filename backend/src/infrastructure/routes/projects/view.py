"""Projects Routes"""

from flask import Blueprint, jsonify
from flask_restx import Resource, Namespace

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

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting projects: {str(error)}")
            return (
                jsonify({"error": "Internal server error", "message": str(error)}),
                HTTP_INTERNAL_SERVER_ERROR
            )
