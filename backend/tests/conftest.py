"""Test fixtures for the application."""

from unittest.mock import MagicMock

import pytest
from flask import Flask
from flask_restx import Api

from src.domain.dto.certification import Certification
from src.domain.dto.experience import Experience
from src.domain.dto.formation import Formation
from src.domain.dto.project import Project
from src.domain.dto.social_media import SocialMedia
from src.infrastructure.routes.education.view import education_ns
from src.infrastructure.routes.experiences.view import experiences_ns
from src.infrastructure.routes.health_check.view import health_check_ns
from src.infrastructure.routes.projects.view import projects_ns
from src.infrastructure.routes.social_media.view import social_media_ns
from src.infrastructure.services.portfolio_data_service import PortfolioDataService


@pytest.fixture
def app():
    """Create a Flask app for testing."""
    app = Flask(__name__)
    api = Api(app)
    api.add_namespace(experiences_ns, path="/api/v1")
    api.add_namespace(projects_ns, path="/api/v1")
    api.add_namespace(education_ns, path="/api/v1")
    api.add_namespace(social_media_ns, path="/api/v1")
    api.add_namespace(health_check_ns, path="/api/v1")
    return app


@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return app.test_client()


@pytest.fixture
def mock_repository():
    """Create a mock repository."""
    mock_repo = MagicMock()
    return mock_repo


@pytest.fixture
def mock_portfolio_service():
    """Create a mock portfolio service."""
    service = MagicMock(spec=PortfolioDataService)

    return service


@pytest.fixture
def sample_projects():
    """Create sample project data."""
    projects = []

    for i in range(0, 4):
        projects.append(Project(
            id=i,
            title=f"Project {i}",
            description=f"Description {i}",
            url=f"https://example.com/{i}",
            tags=[f"tag{i}", f"tag{i+1}"],
            active=True,
        ))

    return projects

@pytest.fixture
def sample_experiences():
    """Create sample experience data."""
    experiences = []

    for i in range(0, 4):
        experiences.append(Experience(
            position=f"Position {i}",
            company=f"Company {i}",
            location=f"Location {i}",
            website=f"https://example.com/{i}",
            logo=f"https://example.com/logo{i}.jpg",
            description=f"Description {i}",
            skills=f"Skills{i}",
            duration=f"year{i}",
        ))

    return experiences


@pytest.fixture
def sample_formations():
    """Create sample formation data."""

    formations = []


    for i in range(0, 2):
        formations.append(Formation(
            id=i,
            institution=f"Institution {i}",
            type=f"Type {i}",
            course=f"Course {i}",
            period=f"Period {i}",
            description=f"Description {i}",
            logo=f"https://example.com/logo{i}.jpg",
            active=True,
        ))

    for i in range(0, 2):
        formations.append(Formation(
            id=i,
            institution=f"Institution {i}",
            type=f"Type {i}",
            course=f"Course {i}",
            period=f"Period {i}",
            description=f"Description {i}",
            logo=f"https://example.com/logo{i}.jpg",
            active=False,
        ))
    return formations


@pytest.fixture
def sample_certifications():
    """Create sample certification data."""
    certifications = []

    for i in range(0,2):
        certifications.append(Certification(
            id=i,
            name=f"Certification {i}",
            institution=f"Institution {i}",
            credential_url=f"https://example.com/cred{i}",
            logo=f"https://example.com/logo{i}.jpg",
            active=False,
        ))

    for i in range(0,2):
        certifications.append(Certification(
            id=i,
            name=f"Certification {i}",
            institution=f"Institution {i}",
            credential_url=f"https://example.com/cred{i}",
            logo=f"https://example.com/logo{i}.jpg",
            active=True,
        ))
    return certifications


@pytest.fixture
def sample_social_media():
    """Create sample social media data."""
    social_medias = []

    for i in range(0,4):
        social_medias.append(SocialMedia(
            id=i,
            label=f"Social {i}",
            url=f"https://example.com/social{i}",
            type=f"Type {i}",
            active=True,
        ))

    return social_medias