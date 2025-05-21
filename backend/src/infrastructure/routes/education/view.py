"""Education Routes"""

from flask import Blueprint, jsonify
from flask_restx import Resource, Namespace

from src.infrastructure.application_dependencies import portfolio_data_service
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

education_blueprint = Blueprint("education_bp", __name__)
education_ns = Namespace("Education", description="My formations and certifications")


@education_ns.route("/education")
class Education(Resource):
    def get(self):
        """Get all education and formations from the injected adapter."""
        try:
            formations = portfolio_data_service.formations()
            certifications = portfolio_data_service.certifications()

            response = {
                "formations": [
                    formation.to_dict() for formation in formations if formation.active
                ],
                "certifications": [
                    certification.to_dict()
                    for certification in certifications
                    if certification.active
                ],
            }

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting education: {str(error)}")
            return (
                jsonify({"error_message": "An internal server error occurred"}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
