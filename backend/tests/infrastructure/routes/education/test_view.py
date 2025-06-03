"""Tests for the education routes."""

import json
from unittest.mock import patch

from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR


def test_get_education_returns_active_formations_and_certifications(
    client, mock_portfolio_service, sample_formations, sample_certifications
):
    """Test that get_education returns only active formations and certifications."""
    with patch(
        "src.infrastructure.routes.education.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.formations.return_value = sample_formations
        mock_portfolio_service.certifications.return_value = sample_certifications
        
        response = client.get("/api/v1/education")
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert "formations" in data
        assert "certifications" in data
        
        # Check formations
        assert len(data["formations"]) == 2  # Only active formations

        # Check certifications
        assert len(data["certifications"]) == 2  # Only active certifications


def test_get_education_error_handling(client, mock_portfolio_service):
    """Test that get_education handles errors correctly."""
    with patch(
        "src.infrastructure.routes.education.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.formations.side_effect = Exception("Test error")
        
        response = client.get("/api/v1/education")

        assert response.status_code == HTTP_INTERNAL_SERVER_ERROR
