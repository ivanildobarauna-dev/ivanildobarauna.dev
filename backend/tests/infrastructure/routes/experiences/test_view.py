"""Tests for the experiences routes."""

import json
from unittest.mock import patch

from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR


def test_get_experiences_returns_active_experiences(
    client, mock_portfolio_service, sample_experiences
):
    """Test that get_experiences returns only active experiences."""
    with patch(
        "src.infrastructure.routes.experiences.view.get_portfolio_data_service",
        return_value=mock_portfolio_service,
    ):
        mock_portfolio_service.experiences.return_value = sample_experiences
        
        response = client.get("/api/v1/experiences")
        
        assert response.status_code == 200


def test_get_experiences_with_total_duration(client, mock_portfolio_service):
    """Test that get_experiences with total_duration param returns total duration."""
    with patch(
        "src.infrastructure.routes.experiences.view.get_portfolio_data_service",
        return_value=mock_portfolio_service,
    ):

        mock_portfolio_service.total_experience.return_value = {"total_duration": 1}

        response = client.get("/api/v1/experiences?total_duration=true")
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert "total_duration" in data
        assert data["total_duration"] == 1


def test_get_experiences_error_handling(client, mock_portfolio_service):
    """Test that get_experiences handles errors correctly."""
    with patch(
        "src.infrastructure.routes.experiences.view.get_portfolio_data_service",
        return_value=mock_portfolio_service,
    ):
        mock_portfolio_service.experiences.side_effect = Exception("Test error")
        
        response = client.get("/api/v1/experiences")
        
        assert response.status_code == HTTP_INTERNAL_SERVER_ERROR
