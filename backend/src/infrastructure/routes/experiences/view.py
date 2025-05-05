"""Experiences Routes"""

from flask import jsonify, request
from flask_restx import Namespace, Resource


from src.infrastructure.application_dependencies import portfolio_data_service
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

experiences_ns = Namespace("Experiences", description="Companies experiences")


@experiences_ns.route("/experiences")
class Experiences(Resource):
    def get(self):
        """Get all experiences from the injected adapter"""
        try:
            total_duration_param = (
                request.args.get("total_duration", "false").lower() == "true"
            )

            if total_duration_param:
                total_duration = 13
                return jsonify({"total_duration": total_duration})

            experiences = portfolio_data_service.experiences()

            response = [
                experience.to_dict() for experience in experiences if experience.active
            ]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting experiences: {str(error)}")
            return (
                jsonify({"error": "Internal server error", "message": str(error)}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
