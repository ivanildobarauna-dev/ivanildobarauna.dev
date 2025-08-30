"""Experiences Routes"""

from flask import jsonify, request
from flask_restx import Namespace, Resource

from src.infrastructure.dependencie_injection import ApplicationDependencies
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

experiences_ns = Namespace("Experiences", description="Companies experiences")

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
                    company_duration.to_dict()
                    for company_duration in company_durations
                ]
                return jsonify(response)

            experiences = portfolio_data_service.experiences()

            response = [
                experience.to_dict() for experience in experiences
            ]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting experiences: {str(error)}")
            return (
                jsonify({"error_message": "An internal server error occurred"}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
