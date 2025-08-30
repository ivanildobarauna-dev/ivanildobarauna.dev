"""Social Links Routes"""

from flask import Blueprint, jsonify
from flask_restx import Namespace, Resource

from src.infrastructure.dependencie_injection import ApplicationDependencies
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger

social_media_blueprint = Blueprint("social_media_bp", __name__)
social_media_ns = Namespace(
    name="Social Media",
    description="Social Media related operations",
    path="/social-media",
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


@social_media_ns.route("/social-media-links")
class SocialMediaLinks(Resource):
    @social_media_ns.response(200, "Success")
    @social_media_ns.response(500, "Internal Server Error")
    def get(self):
        """Get all social media from the social_media.json file."""
        try:
            portfolio_data_service = get_portfolio_data_service()
            social_media_list = portfolio_data_service.social_media()

            response = [sm.to_dict() for sm in social_media_list if sm.active]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting social media: {str(error)}")
            return (
                jsonify({"error_message": "An internal server error occurred"}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
