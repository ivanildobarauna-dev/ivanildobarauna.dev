"""Tests for the PortfolioDataService."""

import pytest
from unittest.mock import MagicMock
from src.infrastructure.services.portfolio_data_service import PortfolioDataService
from src.infrastructure.ports.cache_provider_interface import CacheProvider


@pytest.fixture
def mock_cache_provider():
    """Create a mock cache provider."""
    mock_cache = MagicMock(spec=CacheProvider)
    # Mock all cache get methods to return None (cache miss)
    mock_cache.get_all_projects.return_value = None
    mock_cache.get_all_experiences.return_value = None
    mock_cache.get_all_formations.return_value = None
    mock_cache.get_all_certifications.return_value = None
    mock_cache.get_all_social_media.return_value = None
    return mock_cache


def test_projects_calls_repository(mock_repository, mock_cache_provider, sample_projects):
    """Test that projects method calls the repository when cache is empty."""
    mock_repository.get_all_projects.return_value = sample_projects
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.projects()
    
    mock_cache_provider.get_all_projects.assert_called_once()
    mock_repository.get_all_projects.assert_called_once()
    mock_cache_provider.set_projects.assert_called_once_with(sample_projects)
    assert result == sample_projects


def test_experiences_calls_repository(mock_repository, mock_cache_provider, sample_experiences):
    """Test that experiences method calls the repository when cache is empty."""
    mock_repository.get_all_experiences.return_value = sample_experiences
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.experiences()
    
    mock_cache_provider.get_all_experiences.assert_called_once()
    mock_repository.get_all_experiences.assert_called_once()
    mock_cache_provider.set_experiences.assert_called_once_with(sample_experiences)
    assert result == sample_experiences


def test_formations_calls_repository(mock_repository, mock_cache_provider, sample_formations):
    """Test that formations method calls the repository when cache is empty."""
    mock_repository.get_all_formations.return_value = sample_formations
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.formations()
    
    mock_cache_provider.get_all_formations.assert_called_once()
    mock_repository.get_all_formations.assert_called_once()
    mock_cache_provider.set_formations.assert_called_once_with(sample_formations)
    assert result == sample_formations


def test_certifications_calls_repository(mock_repository, mock_cache_provider, sample_certifications):
    """Test that certifications method calls the repository when cache is empty."""
    mock_repository.get_all_certifications.return_value = sample_certifications
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.certifications()
    
    mock_cache_provider.get_all_certifications.assert_called_once()
    mock_repository.get_all_certifications.assert_called_once()
    mock_cache_provider.set_certifications.assert_called_once_with(sample_certifications)
    assert result == sample_certifications


def test_social_media_calls_repository(mock_repository, mock_cache_provider, sample_social_media):
    """Test that social_media method calls the repository when cache is empty."""
    mock_repository.get_all_social_media.return_value = sample_social_media
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.social_media()
    
    mock_cache_provider.get_all_social_media.assert_called_once()
    mock_repository.get_all_social_media.assert_called_once()
    mock_cache_provider.set_social_media.assert_called_once_with(sample_social_media)
    assert result == sample_social_media


def test_projects_returns_cached_data(mock_repository, mock_cache_provider, sample_projects):
    """Test that projects method returns cached data when available."""
    mock_cache_provider.get_all_projects.return_value = sample_projects
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.projects()
    
    mock_cache_provider.get_all_projects.assert_called_once()
    mock_repository.get_all_projects.assert_not_called()
    mock_cache_provider.set_projects.assert_not_called()
    assert result == sample_projects


def test_experiences_returns_cached_data(mock_repository, mock_cache_provider, sample_experiences):
    """Test that experiences method returns cached data when available."""
    mock_cache_provider.get_all_experiences.return_value = sample_experiences
    service = PortfolioDataService(mock_repository, mock_cache_provider)
    
    result = service.experiences()
    
    mock_cache_provider.get_all_experiences.assert_called_once()
    mock_repository.get_all_experiences.assert_not_called()
    mock_cache_provider.set_experiences.assert_not_called()
    assert result == sample_experiences
