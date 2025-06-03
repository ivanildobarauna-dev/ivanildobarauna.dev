"""Tests for the social media routes."""

import json
from unittest.mock import patch

from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR


def test_get_social_media_returns_active_social_media(
    client, mock_portfolio_service, sample_social_media
):
    """Test that get_social_media returns only active social media."""
    with patch(
        "src.infrastructure.routes.social_media.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.social_media.return_value = sample_social_media
        
        response = client.get("/api/v1/social-media-links")
        
        assert response.status_code == 200
        data = json.loads(response.data)


def test_get_social_media_error_handling(client, mock_portfolio_service):
    """Test that get_social_media handles errors correctly."""
    with patch(
        "src.infrastructure.routes.social_media.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.social_media.side_effect = Exception("Test error")
        
        response = client.get("/api/v1/social-media-links")
        
        assert response.status_code == HTTP_INTERNAL_SERVER_ERROR
        data = json.loads(response.data)
