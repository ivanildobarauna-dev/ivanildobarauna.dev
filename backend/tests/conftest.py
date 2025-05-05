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
    return [
        Project(
            id=1,
            title="Project 1",
            description="Description 1",
            url="https://example.com/1",
            tags=["tag1", "tag2"],
            active=True,
        ),
        Project(
            id=2,
            title="Project 2",
            description="Description 2",
            url="https://example.com/2",
            tags=["tag2", "tag3"],
            active=True,
        ),
        Project(
            id=3,
            title="Project 3",
            description="Description 3",
            url="https://example.com/3",
            tags=["tag1", "tag3"],
            active=False,
        ),
    ]


@pytest.fixture
def sample_experiences():
    """Create sample experience data."""
    from datetime import date

    return [
        Experience(
            id=1,
            position="Position 1",
            period="2020-2021",
            start_date=date(2020, 1, 1),
            company="Company 1",
            location="Location 1",
            website="https://example.com/company1",
            logo="https://example.com/logo1.jpg",
            actual_job=False,
            description="Description 1",
            skills="Skills 1",
            active=True,
        ),
        Experience(
            id=2,
            position="Position 2",
            period="2021-Present",
            start_date=date(2021, 1, 1),
            company="Company 2",
            location="Location 2",
            website="https://example.com/company2",
            logo="https://example.com/logo2.jpg",
            actual_job=True,
            description="Description 2",
            skills="Skills 2",
            active=True,
        ),
        Experience(
            id=3,
            position="Position 3",
            period="2019-2020",
            start_date=date(2019, 1, 1),
            company="Company 3",
            location="Location 3",
            website="https://example.com/company3",
            logo="https://example.com/logo3.jpg",
            actual_job=False,
            description="Description 3",
            skills="Skills 3",
            active=False,
        ),
    ]


@pytest.fixture
def sample_formations():
    """Create sample formation data."""
    return [
        Formation(
            id=1,
            institution="Institution 1",
            type="Type 1",
            course="Course 1",
            period="2018-2022",
            description="Description 1",
            logo="https://example.com/logo1.jpg",
            active=True,
        ),
        Formation(
            id=2,
            institution="Institution 2",
            type="Type 2",
            course="Course 2",
            period="2016-2020",
            description="Description 2",
            logo="https://example.com/logo2.jpg",
            active=True,
        ),
        Formation(
            id=3,
            institution="Institution 3",
            type="Type 3",
            course="Course 3",
            period="2014-2018",
            description="Description 3",
            logo="https://example.com/logo3.jpg",
            active=False,
        ),
    ]


@pytest.fixture
def sample_certifications():
    """Create sample certification data."""
    return [
        Certification(
            id=1,
            name="Certification 1",
            institution="Institution 1",
            credential_url="https://example.com/cred1",
            logo="https://example.com/logo1.jpg",
            active=True,
        ),
        Certification(
            id=2,
            name="Certification 2",
            institution="Institution 2",
            credential_url="https://example.com/cred2",
            logo="https://example.com/logo2.jpg",
            active=True,
        ),
        Certification(
            id=3,
            name="Certification 3",
            institution="Institution 3",
            credential_url="https://example.com/cred3",
            logo="https://example.com/logo3.jpg",
            active=False,
        ),
    ]


@pytest.fixture
def sample_social_media():
    """Create sample social media data."""
    return [
        SocialMedia(
            id=1,
            label="Social 1",
            url="https://example.com/social1",
            type="Type 1",
            active=True,
        ),
        SocialMedia(
            id=2,
            label="Social 2",
            url="https://example.com/social2",
            type="Type 2",
            active=True,
        ),
        SocialMedia(
            id=3,
            label="Social 3",
            url="https://example.com/social3",
            type="Type 3",
            active=False,
        ),
    ]
