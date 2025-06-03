"""Tests for the PortfolioDataService."""

from src.infrastructure.services.portfolio_data_service import PortfolioDataService


def test_projects_calls_repository(mock_repository, sample_projects):
    """Test that projects method calls the repository."""
    mock_repository.get_all_projects.return_value = sample_projects
    service = PortfolioDataService(mock_repository)
    
    result = service.projects()
    
    mock_repository.get_all_projects.assert_called_once()
    assert result == sample_projects


def test_experiences_calls_repository(mock_repository, sample_experiences):
    """Test that experiences method calls the repository."""
    mock_repository.get_all_experiences.return_value = sample_experiences
    service = PortfolioDataService(mock_repository)
    
    result = service.experiences()
    
    mock_repository.get_all_experiences.assert_called_once()
    assert result == sample_experiences


def test_formations_calls_repository(mock_repository, sample_formations):
    """Test that formations method calls the repository."""
    mock_repository.get_all_formations.return_value = sample_formations
    service = PortfolioDataService(mock_repository)
    
    result = service.formations()
    
    mock_repository.get_all_formations.assert_called_once()
    assert result == sample_formations


def test_certifications_calls_repository(mock_repository, sample_certifications):
    """Test that certifications method calls the repository."""
    mock_repository.get_all_certifications.return_value = sample_certifications
    service = PortfolioDataService(mock_repository)
    
    result = service.certifications()
    
    mock_repository.get_all_certifications.assert_called_once()
    assert result == sample_certifications


def test_social_media_calls_repository(mock_repository, sample_social_media):
    """Test that social_media method calls the repository."""
    mock_repository.get_all_social_media.return_value = sample_social_media
    service = PortfolioDataService(mock_repository)
    
    result = service.social_media()
    
    mock_repository.get_all_social_media.assert_called_once()
    assert result == sample_social_media
