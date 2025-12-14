"""Experiences Routes"""

from flask import jsonify, request
from flask_restx import Namespace, Resource

from src.infrastructure.dependencie_injection import ApplicationDependencies

def get_portfolio_data_service():
    return ApplicationDependencies().portfolio_data_service
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)

experiences_ns = Namespace("Experiences", description="Companies experiences")

@experiences_ns.route("/experiences")
class Experiences(Resource):
    def get(self):
        """Get all experiences from the injected adapter"""
        try:
            portfolio_data_service = get_portfolio_data_service()
            total_duration_param = (
                request.args.get("total_duration", "false").lower() == "true"
            )

            if total_duration_param:
                response = portfolio_data_service.total_experience()
                return jsonify(response)

            company_duration_param = (
                    request.args.get("company_duration", "false").lower() == "true"
            )

            if company_duration_param:
                company_durations = portfolio_data_service.companies_duration()
                response = [
                    company_duration.to_response()
                    for company_duration in company_durations
                ]
                return jsonify(response)

            experiences = portfolio_data_service.experiences()

            response = [
                experience.to_response() for experience in experiences
            ]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting experiences: {str(error)}")
            return (
                jsonify({"error_message": "An internal server error occurred"}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
