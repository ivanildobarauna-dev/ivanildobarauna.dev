"""Social Links Routes"""

from flask import Blueprint, jsonify
from flask_restx import Resource, Namespace, fields

from src.infrastructure.application_dependencies import portfolio_data_service
from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR
from src.infrastructure.utils.logger import logger


social_media_blueprint = Blueprint("social_media_bp", __name__)
social_media_ns = Namespace(
    name="Social Media",
    description="Social Media related operations",
    path="/social-media",
)


@social_media_ns.route("/social-media-links")
class SocialMediaLinks(Resource):
    @social_media_ns.response(200, "Success")
    @social_media_ns.response(500, "Internal Server Error")
    def get(self):
        """Get all social media from the social_media.json file."""
        try:
            social_media_list = portfolio_data_service.social_media()

            response = [sm.to_dict() for sm in social_media_list if sm.active]

            return jsonify(response)
        except Exception as error:
            logger.error(f"Error getting social media: {str(error)}")
            return (
                jsonify({"error": "Internal server error", "message": str(error)}),
                HTTP_INTERNAL_SERVER_ERROR,
            )
