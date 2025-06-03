"""Tests for the health check routes."""

import json


def test_ping_returns_pong(client):
    """Test that ping endpoint returns pong."""
    response = client.get("/api/v1/ping")
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "message" in data
    assert data["message"] == "pong"
