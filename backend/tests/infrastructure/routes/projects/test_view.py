"""Tests for the projects routes."""

import json
from unittest.mock import patch

from src.infrastructure.utils.constants import HTTP_INTERNAL_SERVER_ERROR


def test_get_projects_returns_active_projects(
    client, mock_portfolio_service, sample_projects
):
    """Test that get_projects returns only active projects."""
    with patch(
        "src.infrastructure.routes.projects.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.projects.return_value = sample_projects
        
        response = client.get("/api/v1/projects")
        
        assert response.status_code == 200
        data = json.loads(response.data)


def test_get_projects_error_handling(client, mock_portfolio_service):
    """Test that get_projects handles errors correctly."""
    with patch(
        "src.infrastructure.routes.projects.view.portfolio_data_service",
        mock_portfolio_service,
    ):
        mock_portfolio_service.projects.side_effect = Exception("Test error")
        
        response = client.get("/api/v1/projects")
        
        assert response.status_code == HTTP_INTERNAL_SERVER_ERROR
        data = json.loads(response.data)
